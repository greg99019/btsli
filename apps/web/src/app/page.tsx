export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section with Background */}
      <section className="relative -mx-6 px-6 py-24 md:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-cyan-900/80 to-blue-800/85"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center space-y-6 max-w-5xl mx-auto">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-4 border border-white/30">
            ✨ Professional Coaching for Meaningful Change
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            Your Leadership Journey
            <br />
            Starts Here
          </h1>
          <h2 className="text-2xl md:text-3xl text-white/95 max-w-4xl mx-auto font-normal drop-shadow-md">
            Compassionate, trauma-aware coaching that helps you lead with confidence, 
            communicate with clarity, and create lasting impact.
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
            Whether you're navigating career transitions, building team leadership skills, or strengthening family dynamics—
            I'm here to partner with you on your growth journey.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <a href="/schedule" className="btn-primary text-lg px-8 py-4 shadow-2xl">
              Start with a Free 30-Min Call
            </a>
            <a href="/about" className="px-8 py-4 bg-white/95 text-blue-600 font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:bg-white transition-all text-lg hover:scale-105">
              Meet Your Coach
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex justify-center items-center gap-8 flex-wrap pt-8 text-sm text-white/90">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>ICF-Aligned Coaching</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Trauma-Informed Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span>500+ Clients Coached</span>
            </div>
          </div>
        </div>
      </section>

      {/* How Coaching Works */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">How Coaching Works</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          My coaching approach is collaborative, personalized, and action-oriented. Here's what to expect:
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              1
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Free Discovery Call</h3>
            <p className="text-gray-600 text-sm">
              We'll talk about your goals, challenges, and see if we're a good fit. No pressure, just conversation.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              2
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Design Your Journey</h3>
            <p className="text-gray-600 text-sm">
              Together, we'll create a coaching plan tailored to your unique needs, timeline, and what success looks like for you.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              3
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Regular Sessions</h3>
            <p className="text-gray-600 text-sm">
              We meet consistently (weekly or bi-weekly) to explore insights, overcome obstacles, and build momentum toward your goals.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              4
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Celebrate Progress</h3>
            <p className="text-gray-600 text-sm">
              Track your growth, celebrate wins, and adjust your path as needed. Coaching evolves with you.
            </p>
          </div>
        </div>
      </section>

      {/* Coaching Focus Areas */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card group hover:border-blue-300">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Leadership Coaching</h3>
          <p className="text-gray-600 mb-3">
            Step into leadership with confidence, clarity, and authenticity—whether you're leading yourself, a team, or an organization.
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Executive presence & decision-making</li>
            <li>✓ Leading through change & uncertainty</li>
            <li>✓ Building high-performing teams</li>
          </ul>
        </div>

        <div className="card group hover:border-blue-300">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Communication & Relationships</h3>
          <p className="text-gray-600 mb-3">
            Transform how you connect with others—at work, at home, and in your community. Clear communication creates strong relationships.
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Difficult conversations with ease</li>
            <li>✓ Setting healthy boundaries</li>
            <li>✓ Emotional intelligence & empathy</li>
          </ul>
        </div>

        <div className="card group hover:border-blue-300">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Career & Life Transitions</h3>
          <p className="text-gray-600 mb-3">
            Navigate career changes, promotions, pivots, or life transitions with support, strategy, and self-compassion.
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Career clarity & advancement</li>
            <li>✓ Work-life integration</li>
            <li>✓ Confidence during change</li>
          </ul>
        </div>
      </section>

      {/* Social Proof - Success Metrics */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Proven Results</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">95%</div>
            <p className="text-gray-600 font-medium">of clients report improved communication after coaching</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-cyan-600 mb-2">88%</div>
            <p className="text-gray-600 font-medium">show increased confidence in leadership roles</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-700 mb-2">92%</div>
            <p className="text-gray-600 font-medium">experience reduced workplace stress and burnout</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">Stories from My Coaching Clients</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Real people, real transformations. Here's what clients have shared about their coaching experience:
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                SM
              </div>
              <div>
                <div className="font-bold text-gray-800">Sarah M.</div>
                <div className="text-sm text-gray-600">Executive Director</div>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 italic">
              "Working with this coach completely transformed how I show up as a leader. The trauma-informed approach created 
              such a safe space for me to explore my challenges. I finally feel confident leading my team through change."
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                JK
              </div>
              <div>
                <div className="font-bold text-gray-800">James K.</div>
                <div className="text-sm text-gray-600">School Principal</div>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 italic">
              "The coaching sessions gave me tools I use every single day—not just at work, but in how I communicate with my own 
              family. I'm more present, more patient, and way more effective as both a principal and a parent."
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                RL
              </div>
              <div>
                <div className="font-bold text-gray-800">Rachel L.</div>
                <div className="text-sm text-gray-600">Marketing Manager</div>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 italic">
              "I came to coaching feeling stuck in my career. Six months later, I got promoted AND I'm actually enjoying my work again. 
              The coaching helped me see my value and speak up for what I needed. Forever grateful."
            </p>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="card text-center bg-white/50">
        <h3 className="text-xl font-bold text-gray-800 mb-6">I Work With Individuals & Organizations Across Sectors</h3>
        <div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
          <div className="text-gray-600 font-semibold text-lg">🏫 Educators</div>
          <div className="text-gray-600 font-semibold text-lg">💼 Executives</div>
          <div className="text-gray-600 font-semibold text-lg">🏥 Healthcare Leaders</div>
          <div className="text-gray-600 font-semibold text-lg">🎯 Non-Profit Directors</div>
          <div className="text-gray-600 font-semibold text-lg">👨‍👩‍👧‍👦 Families</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="card text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Begin Your Coaching Journey?</h2>
        <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
          Let's start with a free 30-minute discovery call. No commitment, no sales pitch—just a genuine conversation 
          about where you are and where you want to go. I'd love to hear your story.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/schedule" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg">
            Schedule Your Free Call
          </a>
          <a href="/about" className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-800 transition-all border-2 border-white/30 text-lg">
            Learn About My Approach
          </a>
        </div>
        <p className="text-blue-200 text-sm mt-6">
          💬 Coaching sessions available via Zoom or in-person • Flexible scheduling • Sliding scale options available
        </p>
      </section>
    </div>
  );
}
