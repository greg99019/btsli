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


      {/* Coaching Programs */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="text-4xl mb-3">💼</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">1-on-1 Coaching</h3>
          <p className="text-gray-600 mb-4">
            Personalized coaching sessions focused entirely on you—your goals, your challenges, and your growth. 
            This is your time to think out loud, gain clarity, and build momentum.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Best for:</strong> Professionals, leaders, and individuals seeking personal transformation</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Format:</strong> Weekly or bi-weekly 60-minute sessions (virtual or in-person)</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Duration:</strong> 3-month, 6-month, or ongoing coaching partnerships</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Common Coaching Topics:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Leadership development & executive presence</li>
              <li>• Career transitions & advancement</li>
              <li>• Communication & conflict resolution</li>
              <li>• Work-life balance & burnout prevention</li>
              <li>• Confidence building & self-advocacy</li>
            </ul>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Team & Group Coaching</h3>
          <p className="text-gray-600 mb-4">
            Bring your team, department, or leadership group together for collaborative coaching that strengthens 
            relationships, builds trust, and improves how you work together.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Best for:</strong> Teams, departments, and organizations seeking collective growth</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Format:</strong> Monthly or quarterly group sessions + optional 1-on-1 coaching</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Duration:</strong> Custom programs (typically 3-6 months)</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Team Coaching Focus Areas:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Building psychological safety</li>
              <li>• Navigating change & transition</li>
              <li>• Improving communication patterns</li>
              <li>• Conflict resolution & mediation</li>
              <li>• Developing shared leadership practices</li>
            </ul>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="text-4xl mb-3">🏠</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Family Coaching</h3>
          <p className="text-gray-600 mb-4">
            Support for families navigating challenges, transitions, or simply wanting to strengthen their 
            relationships and communication. Coaching that honors each family member's experience.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Best for:</strong> Families experiencing stress, transitions, or relationship challenges</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Format:</strong> Family sessions (virtual or in-person) + individual parent coaching</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Duration:</strong> 6-session packages or ongoing support</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Family Coaching Support:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Parent-child communication</li>
              <li>• Navigating major life transitions</li>
              <li>• Setting boundaries & expectations</li>
              <li>• Emotional regulation strategies</li>
              <li>• Building family resilience</li>
            </ul>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="text-4xl mb-3">🏢</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Organizational Training</h3>
          <p className="text-gray-600 mb-4">
            Workshops and training programs for schools, businesses, and organizations that want to build 
            trauma-informed cultures, strengthen leadership, and support workforce development.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Best for:</strong> Schools, non-profits, businesses, and community organizations</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Format:</strong> Half-day or full-day workshops, multi-session series, or ongoing consultation</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>Duration:</strong> Custom programs designed for your organization's needs</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Training Topics:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Trauma-informed organizational practices</li>
              <li>• Leadership development programs</li>
              <li>• Communication & conflict skills</li>
              <li>• Building inclusive, psychologically safe cultures</li>
              <li>• Workforce readiness & professional development</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Available Services from API */}
      {services && services.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Available Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => {
              const details = serviceDetails[service.slug as keyof typeof serviceDetails];
              return (
                <div key={service.id} className="card hover:border-blue-300 group">
                  {details && <div className="text-4xl mb-3">{details.icon}</div>}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Duration:</strong> {service.durationMin} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Investment:</strong> ${service.priceMin}–${service.priceMax} {service.unitLabel}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  {details && (
                    <div className="space-y-3 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">Who it's for:</h4>
                        <p className="text-sm text-gray-600">{details.whoItsFor}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">Key Outcomes:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {details.outcomes.map((outcome, idx) => (
                            <li key={idx}>• {outcome}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">Format:</h4>
                        <p className="text-sm text-gray-600">{details.format}</p>
                      </div>
                    </div>
                  )}

                  <a 
                    href={`/services/${service.slug}`} 
                    className="inline-flex items-center text-blue-600 font-medium hover:text-cyan-600 transition-colors"
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pricing Transparency */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Transparent, Accessible Pricing</h2>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-600">
          <p className="text-center">
            I believe coaching should be accessible. I offer transparent pricing and work within your budget when possible.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">Individual Coaching</h3>
              <p className="text-sm mb-2">Starting at <strong className="text-blue-600">$150/session</strong></p>
              <p className="text-sm text-gray-600">Package discounts available for 3-month and 6-month commitments</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">Team & Organizational</h3>
              <p className="text-sm mb-2">Custom pricing based on group size and program scope</p>
              <p className="text-sm text-gray-600">Free initial consultation to discuss your needs</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm">
              <strong className="text-gray-800">Sliding scale available</strong> for individuals facing financial hardship. 
              I don't want cost to be a barrier to your growth.
            </p>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="card">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">What to Expect in Coaching</h2>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-600">
          <p className="text-lg leading-relaxed">
            Coaching is a <strong className="text-gray-800">partnership</strong>. You bring your goals, experiences, 
            and questions. I bring curiosity, tools, and a commitment to your growth. Together, we'll:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Create a safe space</h4>
                <p className="text-sm">Where you can be honest, vulnerable, and explore what's really going on</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Clarify your goals</h4>
                <p className="text-sm">What success looks like for you, and break big goals into manageable steps</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Build on your strengths</h4>
                <p className="text-sm">You already have wisdom and capability—coaching helps you access it</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Navigate obstacles</h4>
                <p className="text-sm">Identify what's getting in your way and develop strategies to move forward</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Practice new skills</h4>
                <p className="text-sm">Try out new behaviors, communication patterns, and leadership approaches</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Celebrate progress</h4>
                <p className="text-sm">Acknowledge your growth and adjust your path as you evolve</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800">Let's Start a Conversation</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Not sure which coaching program is right for you? That's completely normal! Let's talk. 
          I offer a <strong>free 30-minute discovery call</strong> where we can explore your goals, 
          answer your questions, and see if we're a good fit.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/schedule" className="btn-primary text-lg px-8 py-4">
            Schedule Your Free Discovery Call
          </a>
          <a href="/about" className="btn-secondary text-lg px-8 py-4">
            Meet Your Coach
          </a>
        </div>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          💬 No sales pitch, no pressure—just an honest conversation about whether coaching is right for you right now.
        </p>
      </section>
    </div>
  );
}
