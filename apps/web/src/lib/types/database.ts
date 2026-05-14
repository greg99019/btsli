export type UserRole = 'super_admin' | 'consultant' | 'org_admin' | 'manager' | 'participant'
export type AnnouncementType = 'info' | 'warning' | 'success' | 'urgent'
export type SessionType = 'live' | 'workshop' | 'check_in' | 'webinar'
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer'

export interface Organization {
  id: string
  name: string
  slug: string
  industry: string | null
  size_range: string | null
  logo_url: string | null
  primary_color: string
  subscription_tier: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  organization_id: string | null
  job_title: string | null
  department: string | null
  phone: string | null
  is_active: boolean
  onboarding_complete: boolean
  created_at: string
  updated_at: string
  organizations?: Organization
}

export interface ModuleCategory {
  id: string
  name: string
  color: string
  color_class: string
  dot_class: string
  icon: string | null
  sort_order: number
  created_at: string
}

export interface TrainingModule {
  id: string
  title: string
  description: string | null
  long_description: string | null
  content: string | null
  category_id: string | null
  duration_minutes: number
  duration_seconds: number
  thumbnail_url: string | null
  video_url: string | null
  video_embed_code: string | null
  is_required: boolean
  is_published: boolean
  sort_order: number
  organization_id: string | null
  created_by: string | null
  facilitator_name: string
  total_enrollments: number
  created_at: string
  updated_at: string
  module_categories?: ModuleCategory
  user_progress?: UserProgress[]
  module_resources?: ModuleResource[]
  quizzes?: Quiz[]
}

export interface ModuleResource {
  id: string
  module_id: string
  title: string
  description: string | null
  file_url: string
  file_type: string | null
  file_size_bytes: number | null
  sort_order: number
  created_at: string
}

export interface Quiz {
  id: string
  module_id: string
  title: string | null
  instructions: string | null
  passing_score: number
  max_attempts: number | null
  time_limit_minutes: number | null
  randomize_questions: boolean
  created_at: string
  quiz_questions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  question_type: QuestionType
  points: number
  explanation: string | null
  sort_order: number
  created_at: string
  quiz_answer_options?: QuizAnswerOption[]
}

export interface QuizAnswerOption {
  id: string
  question_id: string
  answer_text: string
  is_correct: boolean
  sort_order: number
}

export interface UserProgress {
  id: string
  user_id: string
  module_id: string
  organization_id: string | null
  status: 'in_progress' | 'completed'
  progress_percentage: number
  percentage_complete: number
  time_spent_seconds: number
  video_position_seconds: number
  started_at: string
  last_accessed_at: string
  completed_at: string | null
  quiz_score: number | null
  quiz_passed: boolean | null
  quiz_attempts: number
  training_modules?: TrainingModule
}

export interface Certificate {
  id: string
  user_id: string
  module_id: string
  organization_id: string | null
  certificate_number: string
  issued_at: string
  training_modules?: TrainingModule
  profiles?: Profile
}

export interface TrainingAssignment {
  id: string
  module_id: string
  assigned_to_user_id: string | null
  assigned_to_org_id: string | null
  assigned_by: string | null
  due_date: string | null
  is_required: boolean
  created_at: string
  training_modules?: TrainingModule
}

export interface Announcement {
  id: string
  title: string
  body: string
  announcement_type: AnnouncementType
  organization_id: string | null
  created_by: string | null
  published_at: string
  expires_at: string | null
  is_pinned: boolean
  created_at: string
}

export interface LiveSession {
  id: string
  title: string
  description: string | null
  session_type: SessionType
  scheduled_at: string
  duration_minutes: number
  meeting_url: string | null
  facilitator_id: string | null
  organization_id: string | null
  max_attendees: number | null
  is_public: boolean
  created_at: string
  session_rsvps?: SessionRSVP[]
}

export interface SessionRSVP {
  id: string
  session_id: string
  user_id: string
  created_at: string
}
