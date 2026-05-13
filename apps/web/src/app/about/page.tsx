export default function AboutPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-2">
          About the Organization
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
          Beyond The Surface Leadership Institute™
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          A Behavioral Systems Consulting Firm dedicated to strengthening organizational performance through 
          system-centered clarity, stability, and aligned purpose.
        </p>
      </section>

      {/* Organization Overview */}
      <section className="card bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed text-lg">
          <p>
            <strong className="text-2xl text-gray-800">Beyond The Surface Leadership Institute™, LLC (BTSLI™)</strong> is a Behavioral Systems 
            Consulting firm founded by Dr. Audrea Knight-Nwosu, a behavioral science practitioner and systems architect 
            with doctoral-level training in psychology, organizational behavior, and applied performance systems.
          </p>
          
          <p>
            She serves as Founder and Chief Executive Officer of the Institute, bringing more than a decade of experience 
            working within complex service and educational systems.
          </p>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="card">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-3xl">AK</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dr. Audrea Knight-Nwosu</h2>
            <p className="text-lg text-gray-600">Founder & Chief Executive Officer</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Academic Credentials
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">🎓</span>
                  <span><strong>Ph.D. in Psychology</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">🎓</span>
                  <span><strong>Master's degree</strong> in Marriage and Family Therapy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">🎓</span>
                  <span><strong>Bachelor's degree</strong> in Behavioral Science</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">🎓</span>
                  <span><strong>Post-Baccalaureate Certificate</strong> in Applied Behavior Analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">🎓</span>
                  <span><strong>Professional Consulting Certification</strong></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-lg border border-cyan-200">
              <h3 className="text-xl font-bold text-cyan-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Proprietary Platform
              </h3>
              <p className="text-gray-700 mb-3">
                Developer of the <strong className="text-cyan-900">BTSLI Behavioral Systems Platform™</strong>
              </p>
              <p className="text-gray-600 text-sm">
                A proprietary internal system used to guide service delivery, staff training, and performance 
                consistency across all BTSLI programs and engagements.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Experience
              </h3>
              <p className="text-gray-700">
                <strong>More than a decade</strong> of experience working within complex service and 
                educational systems
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Core Expertise</h2>
        
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-600">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Systems Design & Implementation</h3>
            <p className="text-gray-700 leading-relaxed">
              Designed, developed, and implemented structured programs and individualized plans across children, 
              youth, families, and organizational environments. Work focuses on translating real-world needs into 
              clear, actionable strategies that support stability, accountability, and measurable outcomes.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-cyan-600">
            <h3 className="text-xl font-bold text-cyan-900 mb-3">Performance Systems Analysis</h3>
            <p className="text-gray-700 leading-relaxed">
              Identifying breakdowns in communication, task completion, role clarity, and follow-through—and 
              designing structured systems that support consistent, repeatable improvements in performance 
              across individuals, teams, and organizations.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-700">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Instructional Design & Program Development</h3>
            <p className="text-gray-700 leading-relaxed">
              Extensive experience in instructional design, curriculum development, and program facilitation, 
              having developed and delivered structured learning experiences that strengthen communication, 
              leadership capacity, and workforce readiness.
            </p>
          </div>
        </div>
      </section>

      {/* Approach & Methodology */}
      <section className="card">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Institute Approach</h2>
        <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto text-lg">
          This combined expertise informs the Institute's approach to consulting and program design, ensuring 
          that all services are:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg border-2 border-blue-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">Structured</h3>
            <p className="text-gray-700">
              Built on evidence-informed frameworks and systematic approaches
            </p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-white rounded-lg border-2 border-cyan-200">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-cyan-900 mb-3">Scalable</h3>
            <p className="text-gray-700">
              Designed to grow and adapt across different organizational contexts
            </p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg border-2 border-blue-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">Performance-Driven</h3>
            <p className="text-gray-700">
              Aligned with sustainable, measurable outcomes across all environments
            </p>
          </div>
        </div>
      </section>

      {/* Service Environments */}
      <section className="card bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none">
        <h2 className="text-3xl font-bold mb-6 text-center">Service Environments</h2>
        <p className="text-center text-blue-100 mb-8 max-w-3xl mx-auto text-lg">
          BTSLI™ services support consistent, sustainable performance across:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Organizational', 'Educational', 'Community-Based', 'High-Accountability Systems'].map((env, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5 text-center">
              <p className="font-semibold text-lg">{env}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800">Partner With BTSLI™</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          If your organization is ready to improve performance, strengthen communication, and increase consistency 
          through structured, evidence-informed systems:
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/schedule" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-bold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
            Schedule a Consultation
          </a>
          <a href="/services" className="px-10 py-4 bg-white text-blue-600 border-2 border-blue-600 font-bold text-lg rounded-lg hover:bg-blue-50 transition-all">
            Explore Our Services
          </a>
        </div>
      </section>
    </div>
  );
}
