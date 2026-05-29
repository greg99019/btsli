const CAPABILITY_STATEMENT_PATH = '/btsli-capability-statement.pdf';

export default function ResourcesPage() {
  const articles = [
    {
      id: 1,
      title: "What Is Behavioral Systems Consulting?",
      excerpt: "Understanding the foundations of behavioral systems consulting and how structured systems thinking drives consistent, measurable performance across organizations.",
      category: "Foundations",
      readTime: "5 min read",
      slug: "what-is-trauma-aware-coaching"
    },
    {
      id: 2,
      title: "3 Ways Trauma Affects Leadership",
      excerpt: "Explore how unresolved trauma can impact decision-making, communication patterns, and team dynamics. Discover evidence-based strategies for building resilient leadership.",
      category: "Leadership",
      readTime: "7 min read",
      slug: "trauma-affects-leadership"
    },
    {
      id: 3,
      title: "Communication Strategies That Build Trust",
      excerpt: "Practical techniques for fostering psychological safety, active listening, and transparent communication in high-stakes environments.",
      category: "Communication",
      readTime: "6 min read",
      slug: "communication-strategies-trust"
    },
    {
      id: 4,
      title: "Building Psychological Safety in Teams",
      excerpt: "How leaders can create environments where team members feel safe to take risks, share ideas, and admit mistakes without fear of punishment.",
      category: "Team Development",
      readTime: "8 min read",
      slug: "psychological-safety-teams"
    },
    {
      id: 5,
      title: "From Burnout to Balance: A Leader's Guide",
      excerpt: "Recognize the signs of burnout and learn practical strategies for restoring balance, setting boundaries, and leading with sustainable energy.",
      category: "Wellbeing",
      readTime: "6 min read",
      slug: "burnout-to-balance"
    },
    {
      id: 6,
      title: "Emotional Regulation for High-Performance Leaders",
      excerpt: "Master the skills of emotional intelligence, self-regulation, and stress management to enhance your leadership effectiveness.",
      category: "Personal Growth",
      readTime: "7 min read",
      slug: "emotional-regulation-leaders"
    }
  ];

  const categories = ["All", "Foundations", "Leadership", "Communication", "Team Development", "Wellbeing", "Personal Growth"];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
          Resources & Insights
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Evidence-based articles on behavioral systems consulting, leadership development, and organizational performance
        </p>
      </section>

      {/* Download CTA */}
      <section className="card bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">View Our Capability Statement</h2>
            <p className="text-blue-100">
              Get the official BTSLI capability statement with service overview, certifications, and contracting-ready company information.
            </p>
          </div>
          <a
            href={CAPABILITY_STATEMENT_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
          >
            View Capability Statement
          </a>
        </div>
      </section>

      {/* Category Filter */}
      <div className="flex gap-3 flex-wrap justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            className={cat === "All" 
              ? "px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-full shadow-md"
              : "px-4 py-2 bg-white text-gray-700 font-medium rounded-full shadow-sm hover:shadow-md hover:bg-blue-50 transition-all"
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <article key={article.id} className="card group cursor-pointer hover:border-blue-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {article.category}
                </span>
                <span className="text-gray-500">{article.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {article.excerpt}
              </p>
              <a 
                href={`/resources/${article.slug}`}
                className="inline-flex items-center text-blue-600 font-medium hover:text-cyan-600 transition-colors"
              >
                Read More 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </article>
        ))}
      </section>

      {/* Newsletter Signup */}
      <section className="card text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Stay Connected</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Get monthly insights on behavioral systems, leadership performance, and organizational development delivered to your inbox.
        </p>
        <form className="max-w-md mx-auto flex gap-3">
          <input 
            type="email" 
            placeholder="Your email address"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </section>

      {/* Podcast Section */}
      <section className="card bg-gradient-to-br from-slate-50 to-blue-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Podcast Interviews</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">Leading Through Trauma: A Conversation on Resilience</h3>
              <p className="text-gray-600 text-sm">The Leadership Podcast • 42 min</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">Building Trauma-Aware Organizations</h3>
              <p className="text-gray-600 text-sm">Workforce Development Today • 35 min</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
