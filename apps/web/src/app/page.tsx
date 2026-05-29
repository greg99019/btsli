const CAPABILITY_STATEMENT_PATH = '/btsli-capability-statement.pdf';

export default function Home() {
  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20">
      {/* SECTION 1 - HERO */}
      <section className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden">
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
        <div className="relative z-10 text-center space-y-4 sm:space-y-6 max-w-5xl mx-auto">
          <div className="inline-block max-w-full px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-orange-300 font-medium text-xs sm:text-sm mb-2 sm:mb-4 border border-orange-300/50">
            ✨ Systems-Based Consulting for Meaningful Change
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg text-balance">
            Behavioral Systems Consulting for Performance, Clarity, and Consistent Execution
          </h1>
          <h2 className="text-lg sm:text-2xl md:text-3xl text-white/95 max-w-4xl mx-auto font-normal drop-shadow-md text-balance">
            Beyond The Surface Leadership Institute™, LLC designs and implements structured, evidence-informed behavioral systems that improve communication, strengthen leadership execution, and support measurable performance across organizations.
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow px-1">
            BTSLI™ helps organizations move beyond fragmented training and personality-driven problem solving by building systems that create clarity, consistency, and repeatable execution.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center flex-wrap pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto">
            <a href="/intake" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-2xl w-full sm:w-auto">
              Start Your Systems Assessment
            </a>
            <a href="/about" className="px-6 sm:px-8 py-3 sm:py-4 bg-white/95 text-blue-600 font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:bg-white transition-all text-base sm:text-lg hover:scale-105 w-full sm:w-auto">
              Learn About Our Approach
            </a>
            <a
              href={CAPABILITY_STATEMENT_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 sm:px-8 py-3 sm:py-4 border border-white/70 bg-white/10 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:bg-white/20 transition-all text-base sm:text-lg hover:scale-105 w-full sm:w-auto"
            >
              View Capability Statement
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-8 flex-wrap pt-6 sm:pt-8 text-sm text-white/90 max-w-md sm:max-w-none mx-auto">
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Evidence-Informed Methods</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>WOSB & EDWOSB Certified Vendor</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <svg className="w-5 h-5 text-orange-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span>Doctoral-Level Leadership</span>
            </div>
          </div>
        </div>
      </section>

      {/* How Our Consulting Works */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">How Our Consulting Works</h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
          Our engagement model is structured, implementation-focused, and designed for real-world performance improvement. Here's what to expect when you partner with BTSLI™:
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              1
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Initial Consultation</h3>
            <p className="text-gray-600 text-sm">
              We assess your current challenges, operating conditions, and performance goals to determine where structure and alignment are needed.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              2
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Systems Assessment</h3>
            <p className="text-gray-600 text-sm">
              Together, we'll analyze current systems, identify breakdowns, and design tailored solutions aligned with your real-world conditions.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              3
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Implementation Support</h3>
            <p className="text-gray-600 text-sm">
              We provide structured training, implementation guidance, and ongoing support to ensure sustainable, consistent performance improvements.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
              4
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Measure & Refine</h3>
            <p className="text-gray-600 text-sm">
              Track outcomes, celebrate progress, and adjust systems as needed. Our approach evolves with your organization.
            </p>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Values */}
      <section className="grid lg:grid-cols-3 gap-8">
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 group hover:border-blue-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Our Vision</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            To strengthen organizational performance through system-centered clarity, stability, and aligned purpose—ensuring consistent execution across conditions of complexity and change.
          </p>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 group hover:border-blue-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Our Mission</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Beyond The Surface Leadership Institute™ provides evidence-informed consulting, training, and systems development that increases operational consistency, strengthens leadership execution, and improves organizational performance.
          </p>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 lg:col-span-1 group hover:border-blue-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Our Values</h3>
          </div>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><span className="font-bold text-orange-600">Integrity:</span> Ethical clarity and transparency</li>
            <li><span className="font-bold text-orange-600">Urgency:</span> Disciplined speed with precision</li>
            <li><span className="font-bold text-orange-600">Excellence:</span> Evidence-informed solutions</li>
            <li><span className="font-bold text-orange-600">Contextual Fit:</span> Real-world alignment</li>
            <li><span className="font-bold text-orange-600">Stability:</span> Foundation for performance</li>
          </ul>
        </div>
      </section>

      {/* About the Organization */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">About Beyond The Surface Leadership Institute™, LLC</h2>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto text-sm sm:text-base">
          BTSLI™ is a systems-based consulting institute grounded in academic training, behavioral science, and applied implementation practice.
        </p>
        <div className="max-w-5xl mx-auto space-y-6 text-gray-700 leading-relaxed">
          <p className="text-base sm:text-lg">
            <strong>Beyond The Surface Leadership Institute™, LLC (BTSLI™)</strong> is a Behavioral Systems Consulting firm founded by Dr. Audrea Knight-Nwosu, a behavioral science practitioner and systems architect with doctoral-level training in psychology, organizational behavior, and applied performance systems. She serves as Founder and Chief Executive Officer of the Institute.
          </p>
          
          <div className="bg-white p-6 rounded-lg border-l-4 border-blue-600">
            <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3">Qualifications & Expertise</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Ph.D. in Psychology</li>
              <li>• Master's degree in Marriage and Family Therapy</li>
              <li>• Bachelor's degree in Behavioral Science</li>
              <li>• Post-Baccalaureate Certificate in Applied Behavior Analysis</li>
              <li>• Professional Consulting Certification</li>
            </ul>
          </div>

          <p className="text-base sm:text-lg">
            Dr. Knight-Nwosu is the developer of the <strong>BTSLI Behavioral Systems Platform™</strong>, a proprietary internal system used to guide service delivery, staff training, and performance consistency across all BTSLI programs and engagements.
          </p>

          <p className="text-base sm:text-lg">
            She brings more than a decade of experience working within complex service and educational systems, where she has designed, developed, and implemented structured programs and individualized plans across children, youth, families, and organizational environments. Her work focuses on translating real-world needs into clear, actionable strategies that support stability, accountability, and measurable outcomes.
          </p>

          <p className="text-base sm:text-lg">
            Her expertise centers on identifying breakdowns in communication, task completion, role clarity, and follow-through—and designing structured systems that support consistent, repeatable improvements in performance across individuals, teams, and organizations.
          </p>

          <p className="text-base sm:text-lg">
            In addition, she has extensive experience in instructional design, curriculum development, and program facilitation, having developed and delivered structured learning experiences that strengthen communication, leadership capacity, and workforce readiness.
          </p>

          <p className="text-base sm:text-lg font-medium text-blue-900">
            This combined expertise informs the Institute's approach to consulting and program design, ensuring that all services are structured, scalable, and aligned with sustainable, performance-driven outcomes across organizational, educational, and community-based environments.
          </p>
        </div>
      </section>

      {/* Performance Environments */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">Performance Environments</h2>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto text-sm sm:text-base">
          BTSLI™ strengthens consistent, sustainable performance across the following environments:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Organizational", icon: "🏢" },
            { label: "Educational", icon: "🏫" },
            { label: "Community-Based", icon: "🤝" },
            { label: "High-Accountability Systems", icon: "⚙️" },
          ].map((env) => (
            <div key={env.label} className="bg-white rounded-xl p-5 text-center border-2 border-blue-200 shadow-sm">
              <div className="text-3xl mb-2">{env.icon}</div>
              <p className="font-semibold text-gray-800">{env.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Organizations Choose Us */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">Why Organizations Choose BTSLI™</h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto text-sm sm:text-base">
          Organizations choose BTSLI™ because we deliver structured, evidence-informed systems that create clarity, consistency, and measurable performance outcomes.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800">Behavioral-Systems Approach</h3>
                <p className="text-gray-600 text-sm sm:text-base">We design structured systems that improve communication, performance, and operational flow instead of relying on personality-driven coaching.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800">Evidence-Informed Methodology</h3>
                <p className="text-gray-600 text-sm sm:text-base">Our frameworks are grounded in behavioral science, systems theory, applied performance systems, and instructional design.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800">Clarity and Structure</h3>
                <p className="text-gray-600 text-sm sm:text-base">We translate complex organizational challenges into clear, repeatable processes teams can implement and sustain.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800">Scalable Solutions</h3>
                <p className="text-gray-600 text-sm sm:text-base">Our systems are designed for schools, nonprofits, workforce programs, youth-serving agencies, and government environments.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800">Measurable Outcomes and Professional Precision</h3>
                <p className="text-gray-600 text-sm sm:text-base">We focus on implementation consistency, performance indicators, and research-aligned delivery that is contract-ready and evaluator-ready.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-6 sm:p-8 text-center">
          <p className="text-lg sm:text-xl font-semibold leading-relaxed max-w-4xl mx-auto">
            Built on academic training and applied systems practice, BTSLI™ operates as a systems-based consulting institute—not a coach, not a speaker, and not a generic training vendor.
          </p>
        </div>
      </section>

      {/* SECTION 4 - SERVICES */}
      <section>
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">Our Services</h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto text-base sm:text-lg">
          BTSLI™ provides structured, systems-based consulting and program development services designed to improve performance, strengthen communication, and increase consistency across organizations, workforce programs, educational environments, and high-accountability systems.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Behavioral Systems Consulting</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              BTSLI™ partners with organizations to identify breakdowns in communication, role clarity, accountability, follow-through, and overall systems flow.
            </p>
          </div>

          <div className="card bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Program Development & Implementation</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              BTSLI™ designs and implements structured programs that support clarity, consistency, and measurable outcomes across organizational, educational, and community-based environments.
            </p>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Workforce Development & Performance</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              BTSLI™ partners with workforce development organizations and programs to strengthen participant engagement, consistency, and performance within structured environments.
            </p>
          </div>

          <div className="card bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-700 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Staff Development & Training</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              BTSLI™ provides structured training and implementation support to strengthen staff performance, improve communication practices, and increase consistency in how expectations are applied across teams.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <a href="/schedule" className="inline-block w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-base sm:text-xl font-bold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
            Contact BTSLI™ to Schedule a Consultation
          </a>
        </div>
      </section>

      {/* SECTION 5 - OUR APPROACH */}
      <section className="card bg-gradient-to-br from-slate-50 to-blue-50">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">Our Approach</h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto text-base sm:text-lg">
          Our methodology is designed to move organizations from insight to implementation through systems that produce clear, sustainable results.
        </p>

        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-5 sm:p-8 border-l-4 border-blue-600 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3">Execution-First Performance Alignment™</h3>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Converts expectations into repeatable practice through role clarity, aligned communication, and structured follow-through.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-8 border-l-4 border-cyan-600 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-900 mb-3">Behavioral Systems Advantage™</h3>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Strengthens the system so performance is embedded within routines, workflows, accountability structures, and communication patterns—not individual personality alone.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-8 border-l-4 border-blue-700 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3">Training-to-Implementation Continuum™</h3>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Extends beyond training to support real-world application through structured implementation, reinforcement, and measurable follow-up support.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 - MODALITIES */}
      <section className="card bg-gradient-to-br from-cyan-50 via-blue-50 to-white border-2 border-cyan-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-semibold mb-4">
            Evidence-Informed Methods
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-gray-800">Our Modalities</h2>
          <p className="text-gray-700 text-base sm:text-xl leading-relaxed">
            BTSLI™ uses multiple evidence-informed, systems-based modalities—including <span className="font-semibold text-blue-900">performance-based behavioral science</span> and <span className="font-semibold text-cyan-900">Organizational Behavior Management (OBM)</span>—to strengthen leadership, communication, and consistent execution across environments.
          </p>
        </div>
      </section>

      {/* SECTION 7 - WHO WE COLLABORATE WITH */}
      <section>
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">Who We Collaborate With</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10">
          {[
            { icon: "🏫", title: "Schools and school districts" },
            { icon: "💼", title: "Workforce development organizations and programs" },
            { icon: "🤝", title: "Nonprofits and community-based organizations" },
            { icon: "👨‍👩‍👧‍👦", title: "Child welfare and family service agencies" },
            { icon: "🏛️", title: "Government agencies (local, state, and federal)" },
            { icon: "🏢", title: "For-profit employers and corporate teams" },
            { icon: "⚙️", title: "Implementation partners and contractors" }
          ].map((item, idx) => (
            <div key={idx} className="card text-center bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <div className="text-5xl mb-4">{item.icon}</div>
              <p className="text-gray-700 font-semibold">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8 - SCHOOLS & DISTRICT SYSTEMS */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 text-left">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Schools & District Systems Alignment</h2>
        </div>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-5xl mx-auto">
          BTSLI™ partners with schools and districts to strengthen how expectations are communicated, how routines are implemented, and how staff practices are reinforced—supporting consistent instructional and operational implementation across classrooms, teams, and campus environments.
        </p>
      </section>

      {/* SECTION 9 - WHO DELIVERS THE WORK */}
      <section>
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">Who Delivers the Work</h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto text-base sm:text-lg">
          BTSLI™ services are delivered by trained professionals applying structured, systems-based approaches.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center bg-gradient-to-br from-blue-50 to-white group hover:border-blue-400">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800">Behavioral Systems Consultants</h3>
          </div>

          <div className="card text-center bg-gradient-to-br from-cyan-50 to-white group hover:border-cyan-400">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800">Leadership Performance Specialists</h3>
          </div>

          <div className="card text-center bg-gradient-to-br from-blue-50 to-white group hover:border-blue-400">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800">Workforce Readiness Specialists</h3>
          </div>

          <div className="card text-center bg-gradient-to-br from-cyan-50 to-white group hover:border-cyan-400">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-700 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800">Youth & Family Support Specialists</h3>
          </div>
        </div>
      </section>

      {/* SECTION 10 - FINAL CTA */}
      <section className="card bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-none text-center">
        <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
          ✨ Let's Work Together
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6">Ready to Improve Performance and Strengthen Communication?</h2>
        <p className="text-white/90 mb-8 sm:mb-10 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
          If your organization is ready to improve performance, strengthen communication, and increase consistency through structured, evidence-informed systems, BTSLI™ is ready to support the work.
        </p>
        <a href="/schedule" className="inline-block w-full sm:w-auto px-6 sm:px-12 py-4 sm:py-6 bg-white text-blue-600 font-bold text-base sm:text-xl rounded-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all">
          Schedule a Consultation
        </a>
        <p className="mt-6 text-white/80 text-sm">
          Start with a focused conversation about your organization's systems, goals, and implementation needs.
        </p>
      </section>

      {/* SECTION 11 - CONTRACTING & CERTIFICATIONS */}
      <section className="card bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Contracting & Certifications</h2>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-base sm:text-lg text-gray-700">
            Beyond The Surface Leadership Institute™, LLC (BTSLI™) is positioned to support procurement, subcontracting,
            and institutional engagement as a certified:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border-2 border-blue-300 shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-blue-900 mb-2">Women-Owned Small Business</h3>
              <p className="text-gray-600">(WOSB)</p>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-cyan-300 shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-cyan-900 mb-2">Economically Disadvantaged Women-Owned Small Business</h3>
              <p className="text-gray-600">(EDWOSB)</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-gray-700 font-semibold pt-4">
            We are eligible to contract with federal, state, and local agencies nationwide and can support scopes of
            work involving systems analysis, staff development, implementation support, and program design.
          </p>

          <div className="pt-2">
            <a
              href={CAPABILITY_STATEMENT_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              View Capability Statement
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
