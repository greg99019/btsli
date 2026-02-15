export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent leading-tight">
          Beyond the Surface
          <br />
          Leadership Institute
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto">
          Trauma-Aware, Coaching-Based Support for Families, Workforce, Schools, and Organizations
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We use evidence-based frameworks from across systems to guide our non-clinical, coaching-based services,
          strengthening communication, leadership, and workforce readiness.
        </p>
        <div className="flex gap-4 justify-center flex-wrap pt-4">
          <a href="/services" className="btn-primary">
            View Services
          </a>
          <a href="/schedule" className="btn-secondary">
            Schedule Now
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card group hover:border-blue-300">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Build Stability & Success</h3>
          <p className="text-gray-600">
            Develop confidence and long-term success through evidence-based coaching frameworks.
          </p>
        </div>

        <div className="card group hover:border-blue-300">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Strengthen Communication</h3>
          <p className="text-gray-600">
            Enhance communication skills and emotional regulation for better relationships.
          </p>
        </div>

        <div className="card group hover:border-blue-300">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Leadership Readiness</h3>
          <p className="text-gray-600">
            Support leadership development and workplace professionalism at all levels.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="card text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-blue-100 mb-6 text-lg">
          Explore our services or schedule a consultation today.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/services" className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Browse Services
          </a>
          <a href="/app/courses" className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-800 transition-all border-2 border-white/30">
            View Courses
          </a>
        </div>
      </section>
    </div>
  );
}
