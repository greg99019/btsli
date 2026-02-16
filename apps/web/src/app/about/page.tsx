export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-2">
          Meet Your Coach
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
          Hi, I'm here to support your journey
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          I'm a trauma-informed professional coach who believes deeply in people's capacity for growth, 
          resilience, and transformation—no matter where you're starting from.
        </p>
      </section>

      {/* Personal Story */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Story & Why I Coach</h2>
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
            <p>
              I came to coaching through my own journey of navigating leadership challenges, career transitions, 
              and learning how to lead with both strength and compassion. I know what it's like to feel stuck, 
              to doubt yourself, and to wonder if change is really possible.
            </p>
            <p>
              What I've learned—both personally and through coaching hundreds of clients—is that <strong className="text-gray-800">
              transformation happens when we feel safe enough to be honest</strong> about where we are, 
              curious enough to explore new possibilities, and supported enough to take brave steps forward.
            </p>
            <p>
              That's what I'm here to offer you: a partnership rooted in trust, honesty, and a genuine belief 
              in your ability to create the life and leadership you want.
            </p>
          </div>
        </div>
      </section>
      {/* What Trauma-Informed Means */}
      <section className="card">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">What Makes My Coaching "Trauma-Informed"?</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg leading-relaxed">
            "Trauma-informed" isn't just a buzzword for me—it's a commitment to understanding how our past experiences, 
            stress, and nervous system responses shape how we show up in the world. It means:
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-3">🛡️ Safety First</h3>
              <p className="text-gray-700">
                I create a space where you can be your authentic self, share what's really going on, 
                and know you won't be judged. Safety means both emotional safety and respecting your boundaries.
              </p>
            </div>
            <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-100">
              <h3 className="text-xl font-bold text-cyan-800 mb-3">💪 Empowerment Over Advice</h3>
              <p className="text-gray-700">
                I'm not here to fix you or tell you what to do. You're the expert on your own life. 
                My job is to help you access your own wisdom and agency.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-3">🤝 Collaboration</h3>
              <p className="text-gray-700">
                Coaching is a partnership. We're in this together, and your input guides where we go. 
                You set the agenda, I provide the framework and support.
              </p>
            </div>
            <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-100">
              <h3 className="text-xl font-bold text-cyan-800 mb-3">🌍 Cultural Humility</h3>
              <p className="text-gray-700">
                I recognize that your lived experience, identity, and cultural background shape your worldview. 
                I bring curiosity, not assumptions, to our work together.
              </p>
            </div>
          </div>
          <p className="text-lg leading-relaxed mt-6 bg-white p-6 rounded-lg border border-gray-200">
            <strong className="text-gray-800">Important Note:</strong> Trauma-informed coaching is <em>not</em> therapy. 
            I don't diagnose or treat mental health conditions. If you're experiencing acute trauma, PTSD, or severe mental 
            health challenges, I'll support you in finding appropriate clinical care while we work together on your goals.
          </p>
        </div>
      </section>

      {/* Credentials & Expertise */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Professional Credentials & Expertise</h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Coaching Certifications</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">🎓</span>
                ICF-Aligned Professional Coaching Training
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">🎓</span>
                Trauma-Informed Care Specialist Certification
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">🎓</span>
                Leadership Development & Organizational Coaching
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Areas of Expertise</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Individual Coaching:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Leadership development</li>
                  <li>• Communication skills</li>
                  <li>• Career transitions</li>
                  <li>• Executive presence</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Organizational Training:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Team leadership programs</li>
                  <li>• Workforce development</li>
                  <li>• School-based interventions</li>
                  <li>• Family support systems</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Published Work & Speaking</h3>
            <p className="text-gray-700 mb-3">
              Our team regularly contributes to thought leadership in trauma-informed coaching and leadership development:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">📄</span>
                Articles on trauma-aware leadership practices
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">🎙️</span>
                Podcast interviews on coaching and workforce development
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">🗣️</span>
                Conference presentations on organizational resilience
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">The Impact of Coaching</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          While every coaching journey is unique, here's what clients commonly report after 3-6 months of coaching:
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <p className="text-gray-600 font-medium">report feeling more confident in difficult conversations</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-600 mb-2">88%</div>
            <p className="text-gray-600 font-medium">experience increased clarity about their goals and next steps</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-700 mb-2">92%</div>
            <p className="text-gray-600 font-medium">feel better equipped to manage stress and set boundaries</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800">Let's Connect</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          If what I've shared resonates with you—if you're curious about coaching and wondering if we might 
          be a good fit—I'd love to talk. Let's start with a free 30-minute discovery call.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/schedule" className="btn-primary text-lg px-8 py-4">
            Schedule Your Free Call
          </a>
          <a href="/services" className="btn-secondary text-lg px-8 py-4">
            Explore Coaching Programs
          </a>
        </div>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          💬 In our discovery call, we'll talk about what brought you here, what you're hoping for, 
          and whether coaching feels like the right next step for you.
        </p>
      </section>
    </div>
  );
}
