export default function ServicesPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-2">
          Our Services
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
          Structured Systems for Consistent Performance
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          BTSLI™ provides structured, systems-based consulting and program development services designed to improve 
          performance, strengthen communication, and increase consistency across organizations, workforce programs, 
          educational environments, and high-accountability systems.
        </p>
      </section>

      {/* Service Overview */}
      <section className="card bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Evidence-Informed, Real-World Solutions</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We partner with organizations to identify breakdowns, design structured systems, and implement 
            sustainable solutions that support clear, consistent, and measurable performance across all levels.
          </p>
        </div>
      </section>

      {/* Core Services */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Service 1: Behavioral Systems Consulting */}
        <div className="card bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-blue-400 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Behavioral Systems Consulting</h3>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            BTSLI™ partners with organizations to identify breakdowns in communication, role clarity, accountability, 
            follow-through, and overall systems flow.
          </p>

          <div className="bg-white rounded-lg p-5 mb-6 border border-blue-100">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              What We Address:
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Staff burnout and high turnover when expectations and systems are not clearly defined</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Inconsistent performance across teams and environments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Breakdowns in coordination and follow-through</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-5">
            <h4 className="font-bold mb-3">Our Approach:</h4>
            <p className="text-blue-50 text-sm leading-relaxed">
              Services are designed to support improved coordination, clearer expectations, and consistent execution 
              across teams and environments through evidence-informed behavioral systems analysis.
            </p>
          </div>
        </div>

        {/* Service 2: Program Development & Implementation */}
        <div className="card bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-200 hover:border-cyan-400 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Program Development & Implementation</h3>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            BTSLI™ designs and implements structured programs that support clarity, consistency, and measurable 
            outcomes across organizational, educational, and community-based environments.
          </p>

          <div className="bg-white rounded-lg p-5 mb-6 border border-cyan-100">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Program Characteristics:
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span><strong>Usable:</strong> Designed for practical application in real-world conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span><strong>Scalable:</strong> Can grow and adapt across different organizational contexts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span><strong>Aligned:</strong> Matched to organizational goals and stakeholder needs</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg p-5">
            <h4 className="font-bold mb-3">Delivery Approach:</h4>
            <p className="text-cyan-50 text-sm leading-relaxed">
              Services are tailored to ensure programs integrate seamlessly with existing operations while 
              establishing new structures for sustainable, measurable performance improvement.
            </p>
          </div>
        </div>

        {/* Service 3: Workforce Development & Performance */}
        <div className="card bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-blue-400 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Workforce Development & Performance</h3>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            BTSLI™ partners with workforce development organizations and programs to strengthen participant 
            engagement, consistency, and performance within structured environments.
          </p>

          <div className="bg-white rounded-lg p-5 mb-6 border border-blue-100">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Focus Areas:
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Improved participation in training programs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Clearer navigation of workplace expectations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>More consistent follow-through across work-based learning activities</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-lg p-5">
            <h4 className="font-bold mb-3">Service Design:</h4>
            <p className="text-blue-50 text-sm leading-relaxed">
              Structured interventions that support participants in meeting program requirements while developing 
              the behavioral repertoires needed for sustained workforce success.
            </p>
          </div>
        </div>

        {/* Service 4: Staff Development & Training */}
        <div className="card bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-200 hover:border-cyan-400 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-700 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Staff Development & Training</h3>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            BTSLI™ provides structured training and implementation support to strengthen staff performance, improve 
            communication practices, and increase consistency in how expectations are applied across teams.
          </p>

          <div className="bg-white rounded-lg p-5 mb-6 border border-cyan-100">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Training Components:
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span>Structured skill-building sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span>Implementation support and coaching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span>Performance feedback systems</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-cyan-700 to-blue-500 text-white rounded-lg p-5">
            <h4 className="font-bold mb-3">Implementation Model:</h4>
            <p className="text-cyan-50 text-sm leading-relaxed">
              Goes beyond traditional training to include real-world application support, ensuring skills 
              transfer into consistent practice across organizational settings.
            </p>
          </div>
        </div>
      </section>

      {/* Three Core Differentiators */}
      <section className="card bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none">
        <h2 className="text-3xl font-bold mb-4 text-center">Our Three Core Differentiators</h2>
        <p className="text-center text-blue-100 mb-10 max-w-3xl mx-auto text-lg">
          Our work is grounded in three core differentiators that drive measurable outcomes:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">Execution-First Performance Alignment™</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Transforms expectations into consistent practice through clarity, alignment, and structured follow-through.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">Behavioral Systems Advantage™</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Strengthens the system so performance is less dependent on individuals and more embedded within routines, 
              communication patterns, and workflows.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">Training-to-Implementation Continuum™</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Extends beyond training to support real-world application through structured implementation and follow-up support.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Ready to Strengthen Your Organization's Performance?</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          Contact BTSLI™ to schedule a consultation and learn how our structured, evidence-informed services 
          can support your organization's goals.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/schedule" className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xl font-bold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
            Schedule Consultation
          </a>
          <a href="/about" className="px-10 py-5 bg-white text-blue-600 border-2 border-blue-600 font-bold text-xl rounded-lg hover:bg-blue-50 transition-all">
            Learn About BTSLI™
          </a>
        </div>
      </section>
    </div>
  );
}
