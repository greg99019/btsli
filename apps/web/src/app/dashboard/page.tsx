'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4100';

// Sample Training Videos Data with real video URLs
const TRAINING_VIDEOS = [
  {
    id: 1,
    title: 'Introduction to the Learning Management System',
    description: 'A comprehensive overview of the BTSLI Learning platform, navigation, and key features.',
    duration: '12:45',
    category: 'Getting Started',
    thumbnail: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=450&fit=crop',
    completed: true,
    progress: 100,
    instructor: 'Dr. Sarah Johnson',
    views: 1247,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedDate: 'Feb 10, 2026',
  },
  {
    id: 2,
    title: 'Navigating Your Course Dashboard',
    description: 'Learn how to access course materials, submit assignments, and track your progress.',
    duration: '8:30',
    category: 'Getting Started',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
    completed: true,
    progress: 100,
    instructor: 'Prof. Michael Chen',
    views: 982,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedDate: 'Feb 12, 2026',
  },
  {
    id: 3,
    title: 'Effective Online Study Techniques',
    description: 'Master proven strategies for time management, note-taking, and retention in online courses.',
    duration: '15:20',
    category: 'Study Skills',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop',
    completed: false,
    progress: 65,
    instructor: 'Dr. Emily Rodriguez',
    views: 1567,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedDate: 'Feb 14, 2026',
  },
  {
    id: 4,
    title: 'Academic Integrity and Citations',
    description: 'Understanding plagiarism, proper citation methods (APA, MLA), and ethical scholarship.',
    duration: '18:15',
    category: 'Academic Skills',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
    completed: false,
    progress: 30,
    instructor: 'Prof. David Williams',
    views: 894,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedDate: 'Feb 15, 2026',
  },
  {
    id: 5,
    title: 'Using the Virtual Library Resources',
    description: 'Access e-books, academic journals, research databases, and citation tools.',
    duration: '10:50',
    category: 'Resources',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop',
    completed: false,
    progress: 0,
    instructor: 'Librarian Jane Martinez',
    views: 723,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedDate: 'Feb 16, 2026',
  },
  {
    id: 6,
    title: 'Collaborative Learning & Group Projects',
    description: 'Tools and best practices for working with peers in virtual team environments.',
    duration: '14:00',
    category: 'Collaboration',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop',
    completed: false,
    progress: 0,
    instructor: 'Dr. Amanda Lee',
    views: 1129,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedDate: 'Feb 17, 2026',
  },
];

// Simple fetch since apiGet might not work client-side
async function fetchMe(token: string) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

async function fetchCourses(token: string) {
  const res = await fetch(`${API_BASE}/lms/me/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

async function fetchCourseOutline(courseId: string, token: string) {
  const res = await fetch(`${API_BASE}/lms/courses/${courseId}/outline`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchCourseGrade(courseId: string, token: string) {
  const res = await fetch(`${API_BASE}/grades/courses/${courseId}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseDetails, setCourseDetails] = useState<any[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [trainingVideos, setTrainingVideos] = useState<any[]>(TRAINING_VIDEOS);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const router = useRouter();

  const scroll = (category: string, direction: 'left' | 'right') => {
    const container = scrollRefs.current[category];
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter videos based on search and category
  const filteredVideos = trainingVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get videos in progress
  const inProgressVideos = trainingVideos.filter(v => v.progress > 0 && !v.completed);
  
  // Get recently completed videos
  const completedVideos = trainingVideos.filter(v => v.completed);

  // Group filtered videos by category
  const videoCategories = filteredVideos.reduce((acc: any, video) => {
    if (!acc[video.category]) {
      acc[video.category] = [];
    }
    acc[video.category].push(video);
    return acc;
  }, {});

  // Get all unique categories
  const allCategories = ['All', ...Array.from(new Set(trainingVideos.map(v => v.category)))];

  // Category metadata with icons and colors
  const categoryInfo: any = {
    'Getting Started': {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-700',
      description: 'Begin your journey with essential platform tutorials',
    },
    'Study Skills': {
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      description: 'Master effective learning strategies and techniques',
    },
    'Academic Skills': {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      textColor: 'text-green-700',
      description: 'Build essential academic and research capabilities',
    },
    'Resources': {
      icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      textColor: 'text-orange-700',
      description: 'Discover tools and materials to support your learning',
    },
    'Collaboration': {
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      textColor: 'text-indigo-700',
      description: 'Learn to work effectively with peers and teams',
    },
  };

  // Handle video playback
  const playVideo = (video: any) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
    // Update progress if not completed
    if (!video.completed) {
      setTrainingVideos(prev => prev.map(v => 
        v.id === video.id ? { ...v, progress: Math.max(v.progress, 10) } : v
      ));
    }
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  // Get current date info
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Determine current term based on month
  let currentTerm = '';
  let termEnd = new Date();
  
  if (currentMonth >= 0 && currentMonth <= 4) {
    currentTerm = `Spring ${currentYear}`;
    termEnd = new Date(currentYear, 4, 15); // May 15
  } else if (currentMonth >= 5 && currentMonth <= 7) {
    currentTerm = `Summer ${currentYear}`;
    termEnd = new Date(currentYear, 7, 15); // August 15
  } else {
    currentTerm = `Fall ${currentYear}`;
    termEnd = new Date(currentYear, 11, 15); // December 15
  }
  
  const daysRemaining = Math.max(0, Math.ceil((termEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function loadData() {
      try {
        // Fetch user info
        const userData = await fetchMe(token!);
        setUser(userData.user);

        // Fetch courses
        const coursesData = await fetchCourses(token!);
        setCourses(coursesData);

        // Fetch detailed course info including outlines and grades
        const detailedCourses = await Promise.all(
          coursesData.map(async (course: any) => {
            const outline = await fetchCourseOutline(course.id, token!);
            const gradeData = await fetchCourseGrade(course.id, token!);
            
            // Calculate real progress based on lessons
            let progress = 0;
            if (outline?.modules) {
              const totalLessons = outline.modules.reduce((sum: number, mod: any) => 
                sum + (mod.lessons?.length || 0), 0);
              const completedLessons = outline.modules.reduce((sum: number, mod: any) => 
                sum + (mod.lessons?.filter((l: any) => l.completed)?.length || 0), 0);
              progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
            }
            
            return {
              ...course,
              outline,
              progress,
              grade: gradeData?.overallScorePct || null,
              gradeItems: gradeData?.items || [],
            };
          })
        );
        setCourseDetails(detailedCourses);
        
        // Extract upcoming assessments from all courses
        const allAssessments: any[] = [];
        detailedCourses.forEach(course => {
          if (course.outline?.modules) {
            course.outline.modules.forEach((module: any) => {
              module.lessons?.forEach((lesson: any) => {
                if (lesson.type === 'ASSESSMENT' && !lesson.completed) {
                  allAssessments.push({
                    id: lesson.id,
                    title: lesson.title,
                    course: course.title,
                    courseId: course.id,
                    moduleTitle: module.title,
                    type: 'Assessment',
                    points: 100, // Default points
                  });
                }
              });
            });
          }
        });
        
        // Sort by course and take first 5
        setUpcomingAssignments(allAssessments.slice(0, 5));
        
        // Generate announcements from recent course activity
        const recentAnnouncements = [];
        
        // Welcome announcement
        recentAnnouncements.push({
          id: 1,
          title: `Welcome to ${currentTerm}!`,
          course: 'General',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          message: `Welcome to the new term! You're enrolled in ${coursesData.length} course${coursesData.length !== 1 ? 's' : ''}. Check your course pages for materials and upcoming assignments.`,
        });
        
        // Course-specific announcements for courses with pending assessments
        const coursesWithAssessments = detailedCourses.filter(c => 
          c.outline?.modules?.some((m: any) => 
            m.lessons?.some((l: any) => l.type === 'ASSESSMENT' && !l.completed)
          )
        );
        
        if (coursesWithAssessments.length > 0) {
          const course = coursesWithAssessments[0];
          const assessmentCount = allAssessments.filter(a => a.courseId === course.id).length;
          recentAnnouncements.push({
            id: 2,
            title: 'Upcoming Assessments',
            course: course.title,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            message: `You have ${assessmentCount} pending assessment${assessmentCount !== 1 ? 's' : ''} in this course. Be sure to complete them before the term ends.`,
          });
        }
        
        // Progress announcement
        const avgProgress = detailedCourses.reduce((sum, c) => sum + c.progress, 0) / (detailedCourses.length || 1);
        if (avgProgress > 0) {
          recentAnnouncements.push({
            id: 3,
            title: 'Keep Up the Great Work!',
            course: 'General',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            message: `You're making excellent progress! Your average completion across all courses is ${Math.round(avgProgress)}%. Keep going!`,
          });
        }
        
        setAnnouncements(recentAnnouncements);
        setLoading(false);
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDueDate = (daysOut: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOut);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const completedCourseCount = courseDetails.filter((course) => (course.progress || 0) >= 100).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Video Player Modal */}
      {showVideoModal && selectedVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={closeVideoModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{selectedVideo.title}</h3>
                  <p className="text-white/80 text-sm">{selectedVideo.instructor}</p>
                </div>
              </div>
              <button 
                onClick={closeVideoModal}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Video Player */}
            <div className="aspect-video bg-black">
              <iframe
                src={selectedVideo.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Video Info */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {selectedVideo.category}
                    </span>
                    <span className="text-sm text-gray-600">{selectedVideo.duration}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{selectedVideo.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      {selectedVideo.views.toLocaleString()} views
                    </span>
                    <span>•</span>
                    <span>{selectedVideo.publishedDate}</span>
                  </div>
                </div>
                <button className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl">
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Academic Header Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-sm text-gray-600 mb-2">
            <a href="/" className="hover:text-blue-700 font-medium">BTSLI Learning</a>
            <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            <span className="text-gray-900 font-semibold">Dashboard</span>
          </nav>
          
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">{currentTerm} • {daysRemaining} days remaining in term</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                </svg>
                Calendar
              </button>
              <a href="/app/courses" className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                </svg>
                All Courses
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Welcome back, {user?.name}!</h2>
                  <p className="text-blue-100">You have {upcomingAssignments.length} upcoming assignments</p>
                </div>
                <div className="hidden md:block">
                  <svg className="w-16 h-16 text-blue-300 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Training Videos Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Training Videos</h2>
                      <p className="text-sm text-white/90">Essential skills for academic success</p>
                    </div>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                      aria-label="Search training videos"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Clear search"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Category Filter Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {allCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        selectedCategory === category
                          ? 'bg-white text-purple-700 shadow-lg scale-105'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      aria-pressed={selectedCategory === category}
                    >
                      {category}
                      {category !== 'All' && (
                        <span className="ml-2 opacity-75">({trainingVideos.filter(v => v.category === category).length})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6 space-y-8">
                {/* Continue Learning Section */}
                {inProgressVideos.length > 0 && selectedCategory === 'All' && !searchQuery && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Continue Learning</h3>
                          <p className="text-sm text-gray-600">Pick up where you left off</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">{inProgressVideos.length} in progress</span>
                    </div>
                    <div className="relative">
                      <div 
                        ref={(el) => {
                          scrollRefs.current['continue-learning'] = el;
                        }}
                        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                      {inProgressVideos.slice(0, 3).map((video: any) => {
                        const info = categoryInfo[video.category] || {};
                        return (
                          <div
                            key={video.id}
                            onClick={() => playVideo(video)}
                            className="flex-none w-[320px] snap-start group bg-white border-2 border-yellow-200 hover:border-yellow-400 rounded-xl overflow-hidden transition-all hover:shadow-2xl cursor-pointer transform hover:-translate-y-1 duration-300"
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && playVideo(video)}
                            aria-label={`Continue watching ${video.title}`}
                          >
                            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-video overflow-hidden">
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                                  </svg>
                                </div>
                              </div>
                              <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                {video.progress}%
                              </div>
                              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">{video.duration}</div>
                            </div>
                            <div className="p-4">
                              <span className={`inline-block bg-gradient-to-r ${info.bgColor || 'from-purple-100 to-blue-100'} ${info.textColor || 'text-purple-700'} text-xs font-bold px-3 py-1.5 rounded-full mb-2`}>
                                {video.category}
                              </span>
                              <h4 className="font-bold text-gray-900 group-hover:text-yellow-600 mb-1 line-clamp-2">{video.title}</h4>
                              <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all" style={{ width: `${video.progress}%` }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      </div>
                      
                      {/* Continue Learning Scroll Arrows */}
                      {inProgressVideos.length > 1 && (
                        <div className="flex justify-center gap-3 mt-4">
                          <button
                            onClick={() => scroll('continue-learning', 'left')}
                            className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                            aria-label="Scroll left"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => scroll('continue-learning', 'right')}
                            className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                            aria-label="Scroll right"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Search Results Info */}
                {searchQuery && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-800 font-semibold">
                      {filteredVideos.length === 0 ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          No videos found for "{searchQuery}"
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} for "{searchQuery}"
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Render videos by category */}
                {Object.entries(videoCategories).map(([category, videos]: [string, any]) => {
                  const info = categoryInfo[category] || {};
                  return (
                    <div key={category} className="space-y-4">
                      {/* Category Header */}
                      <div className={`bg-gradient-to-r ${info.bgColor || 'from-gray-50 to-gray-100'} rounded-xl p-5 border border-gray-200`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${info.color || 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={info.icon} />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold ${info.textColor || 'text-gray-900'} mb-1`}>{category}</h3>
                            <p className="text-sm text-gray-600">{info.description || 'Training videos in this category'}</p>
                          </div>
                          <div className="hidden md:flex items-center gap-3">
                            <div className={`px-3 py-1.5 bg-white rounded-lg border-2 ${info.textColor ? `border-${info.textColor.replace('text-', '')}` : 'border-gray-300'}`}>
                              <span className={`font-bold ${info.textColor || 'text-gray-700'}`}>{videos.length}</span>
                              <span className="text-xs text-gray-500 ml-1">video{videos.length !== 1 ? 's' : ''}</span>
                            </div>
                            {/* Scroll Navigation Arrows */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => scroll(category, 'left')}
                                className={`w-10 h-10 bg-white hover:bg-gradient-to-br ${info.color || 'from-purple-500 to-blue-500'} hover:text-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center group`}
                                aria-label="Scroll left"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => scroll(category, 'right')}
                                className={`w-10 h-10 bg-white hover:bg-gradient-to-br ${info.color || 'from-purple-500 to-blue-500'} hover:text-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center group`}
                                aria-label="Scroll right"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Category Videos Carousel */}
                      <div className="relative group/carousel">
                        <div 
                          ref={(el) => {
                            scrollRefs.current[category] = el;
                          }}
                          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                        {videos.map((video: any) => (
                          <div
                            key={video.id}
                            onClick={() => playVideo(video)}
                            onKeyPress={(e) => e.key === 'Enter' && playVideo(video)}
                            className="flex-none w-[320px] snap-start group bg-white border-2 border-gray-100 hover:border-purple-400 rounded-xl overflow-hidden transition-all hover:shadow-2xl cursor-pointer transform hover:-translate-y-1 duration-300"
                            role="button"
                            tabIndex={0}
                            aria-label={`Watch ${video.title} - ${video.duration}`}
                          >
                            {/* Video Thumbnail */}
                            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-video overflow-hidden">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                              />
                              {/* Play Button Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                <div className={`w-20 h-20 bg-gradient-to-br ${info.color || 'from-purple-500 to-blue-500'} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl`}>
                                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                                  </svg>
                                </div>
                              </div>
                              {/* Duration Badge */}
                              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                                {video.duration}
                              </div>
                              {/* Completed Badge */}
                              {video.completed && (
                                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                  </svg>
                                  Completed
                                </div>
                              )}
                            </div>
                            
                            {/* Video Info */}
                            <div className="p-5">
                              <div className="mb-3">
                                <span className={`inline-block bg-gradient-to-r ${info.bgColor || 'from-purple-100 to-blue-100'} ${info.textColor || 'text-purple-700'} text-xs font-bold px-3 py-1.5 rounded-full`}>
                                  {video.category}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900 group-hover:text-purple-600 mb-2 line-clamp-2 leading-tight text-lg transition-colors">
                                {video.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{video.description}</p>
                              
                              {/* Progress Bar */}
                              {video.progress > 0 && (
                                <div className="mb-4">
                                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                    <span className="font-medium">Progress</span>
                                    <span className="font-bold text-purple-600">{video.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                      className={`h-full transition-all duration-500 rounded-full ${
                                        video.completed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : `bg-gradient-to-r ${info.color || 'from-purple-500 to-blue-500'}`
                                      }`}
                                      style={{ width: `${video.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Instructor & Views */}
                              <div className="flex items-center justify-between text-xs text-gray-500 pb-4 mb-4 border-b border-gray-100">
                                <span className="flex items-center gap-1.5">
                                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                  </svg>
                                  <span className="font-medium">{video.instructor}</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                  </svg>
                                  <span className="font-medium">{video.views.toLocaleString()}</span>
                                </span>
                              </div>
                              
                              {/* Watch Button */}
                              <button 
                                onClick={(e) => { e.stopPropagation(); playVideo(video); }}
                                className={`w-full bg-gradient-to-r ${info.color || 'from-purple-600 to-blue-600'} hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2`}
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                                </svg>
                                {video.progress > 0 ? 'Continue Watching' : 'Start Watching'}
                              </button>
                            </div>
                          </div>
                        ))}
                        </div>
                        
                        {/* Mobile Scroll Arrows */}
                        <div className="md:hidden flex justify-center gap-3 mt-4">
                          <button
                            onClick={() => scroll(category, 'left')}
                            className={`w-12 h-12 bg-gradient-to-br ${info.color || 'from-purple-500 to-blue-500'} text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center`}
                            aria-label="Scroll left"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => scroll(category, 'right')}
                            className={`w-12 h-12 bg-gradient-to-br ${info.color || 'from-purple-500 to-blue-500'} text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center`}
                            aria-label="Scroll right"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Training Stats */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-3xl font-bold text-white mb-1">
                        {trainingVideos.length}
                      </div>
                      <div className="text-xs text-purple-100 font-medium">Total Videos</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-3xl font-bold text-white mb-1">
                        {trainingVideos.filter(v => v.completed).length}
                      </div>
                      <div className="text-xs text-green-100 font-medium">Completed</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-3xl font-bold text-white mb-1">
                        {trainingVideos.filter(v => v.progress > 0 && !v.completed).length}
                      </div>
                      <div className="text-xs text-blue-100 font-medium">In Progress</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-3xl font-bold text-white mb-1">
                        {Math.round(trainingVideos.reduce((sum, v) => sum + v.progress, 0) / trainingVideos.length)}%
                      </div>
                      <div className="text-xs text-orange-100 font-medium">Overall Progress</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* My Courses */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <nav className="flex items-center text-xs md:text-sm text-gray-600 mb-3">
                  <a href="/" className="hover:text-blue-700 font-medium">BTSLI Learning</a>
                  <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-900 font-semibold">All Courses</span>
                </nav>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
                    <p className="text-sm text-gray-600 mt-1">Browse and manage your enrolled courses</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => router.push('/')}
                      className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                      </svg>
                      Dashboard
                    </button>
                    <a
                      href="/app/courses"
                      className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                      </svg>
                      View All
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-8">
                {courseDetails.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courseDetails.map((course: any) => (
                        <a
                          key={course.id}
                          href={`/app/courses/${course.id}`}
                          className="group bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-6 transition-all hover:shadow-lg"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                              </svg>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-700 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-700 mb-2 line-clamp-2">{course.title}</h3>
                          {course.description && (
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">{course.description}</p>
                          )}
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                <span className="font-semibold">{course.progress || 0}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-blue-600 h-full transition-all duration-500"
                                  style={{ width: `${course.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                                </svg>
                                {course.outline?.modules?.length || 0} modules
                              </span>
                              {course.grade !== null && course.grade !== undefined ? (
                                <span className={`font-semibold ${course.grade >= 70 ? 'text-green-700' : 'text-yellow-600'}`}>
                                  Grade: {Math.round(course.grade)}%
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">No grades yet</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                            <span className="text-blue-700 font-medium text-sm group-hover:underline">View Course →</span>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Course Summary</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-700 mb-1">{courseDetails.length}</div>
                          <div className="text-sm text-gray-600">Total Courses</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-700 mb-1">{courseDetails.length}</div>
                          <div className="text-sm text-gray-600">Active Enrollments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-700 mb-1">{completedCourseCount}</div>
                          <div className="text-sm text-gray-600">Completed</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-12 text-center">
                    <svg className="w-20 h-20 text-blue-200 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't enrolled in any courses yet. Contact your administrator to get started.</p>
                    <button
                      onClick={() => router.push('/')}
                      className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Announcements</h2>
                <button className="text-sm text-blue-700 font-semibold hover:underline">View All</button>
              </div>
              <div className="divide-y divide-gray-200">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="font-medium text-blue-700">{announcement.course}</span>
                          <span>•</span>
                          <span>{announcement.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* To-Do List / Upcoming Assignments */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="px-4 py-3 bg-red-50 border-b border-red-100 rounded-t-lg">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  To Do
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingAssignments.length > 0 ? (
                  upcomingAssignments.map((assignment, index) => (
                    <div key={assignment.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <div className="flex-1 min-w-0">
                          <a href={`/app/lessons/${assignment.id}`} className="font-semibold text-sm text-gray-900 mb-1 hover:text-blue-700">{assignment.title}</a>
                          <p className="text-xs text-gray-600 mb-1">{assignment.course}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-600 font-medium">{assignment.moduleTitle}</span>
                            <span className="text-xs text-gray-500">{assignment.points} pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p>All caught up! No pending assignments.</p>
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <button className="text-sm text-blue-700 font-semibold hover:underline w-full text-left">+ View all assignments</button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                <a href="/app/courses" className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                  </svg>
                  All Courses
                </a>
                <a href="/schedule" className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  Schedule Consultation
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                  Grades
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  Discussions
                </a>
              </div>
            </div>

            {/* Academic Calendar */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                {currentTerm}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Term Start:</span>
                  <span className="font-semibold">
                    {currentMonth >= 0 && currentMonth <= 4 
                      ? new Date(currentYear, 0, 15).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : currentMonth >= 5 && currentMonth <= 7
                      ? new Date(currentYear, 5, 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : new Date(currentYear, 8, 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Term End:</span>
                  <span className="font-semibold">{termEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Remaining:</span>
                  <span className={`font-semibold ${daysRemaining <= 14 ? 'text-red-600' : daysRemaining <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {daysRemaining} days
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Upcoming Dates</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  {currentMonth >= 0 && currentMonth <= 4 ? (
                    <>
                      <div>• {new Date(currentYear, 1, 28).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Mid-Term Evaluations</div>
                      <div>• {new Date(currentYear, 2, 15).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(currentYear, 2, 22).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Spring Break</div>
                      <div>• {new Date(currentYear, 3, 20).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Final Projects Due</div>
                      <div>• {new Date(currentYear, 4, 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(currentYear, 4, 8).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Final Exams</div>
                    </>
                  ) : currentMonth >= 5 && currentMonth <= 7 ? (
                    <>
                      <div>• {new Date(currentYear, 6, 4).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Independence Day (No Classes)</div>
                      <div>• {new Date(currentYear, 6, 15).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Mid-Term Evaluations</div>
                      <div>• {new Date(currentYear, 7, 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Final Projects Due</div>
                      <div>• {new Date(currentYear, 7, 8).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(currentYear, 7, 12).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Final Exams</div>
                    </>
                  ) : (
                    <>
                      <div>• {new Date(currentYear, 9, 31).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Mid-Term Evaluations</div>
                      <div>• {new Date(currentYear, 10, 23).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(currentYear, 10, 27).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Thanksgiving Break</div>
                      <div>• {new Date(currentYear, 11, 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Final Projects Due</div>
                      <div>• {new Date(currentYear, 11, 8).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(currentYear, 11, 15).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: Final Exams</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Help & Resources */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100 p-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                Need Help?
              </h3>
              <p className="text-sm text-gray-700 mb-3">Access support resources and get answers to your questions.</p>
              <div className="space-y-2">
                <a href="mailto:support@btsli.com" className="block bg-blue-700 text-white text-center py-2 px-4 rounded font-semibold hover:bg-blue-800 transition-colors text-sm">
                  Contact Support
                </a>
                <button className="block w-full bg-white text-blue-700 text-center py-2 px-4 rounded font-semibold hover:bg-blue-50 transition-colors border border-blue-200 text-sm">
                  Help Center
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
