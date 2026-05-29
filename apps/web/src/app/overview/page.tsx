export default function OverviewPage() {
  return (
    <div className="space-y-16">

      {/* Page Header */}
      <section className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-2">
          Organization Overview
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
          Beyond The Surface Leadership Institute™
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Behavioral Systems Consulting for Performance, Clarity, and Consistent Execution
        </p>
      </section>

      {/* Vision & Mission */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="card bg-gradient-to-br from-blue-600 to-cyan-700 text-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Vision</h2>
          </div>
          <p className="text-white/95 leading-relaxed text-lg">
            To strengthen organizational performance through system-centered clarity, stability, and aligned
            purpose—ensuring consistent execution across conditions of complexity and change.
          </p>
        </div>

        <div className="card bg-gradient-to-br from-slate-800 to-blue-900 text-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Mission</h2>
          </div>
          <p className="text-white/95 leading-relaxed text-lg">
            Beyond The Surface Leadership Institute™ provides evidence-informed consulting, training, and systems
            development that increases operational consistency, strengthens leadership execution, and improves
            organizational performance through clearer structures and aligned decision-making.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="space-y-8">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-3">
            Core Values
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">What Guides Our Work</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Integrity",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              description:
                "We operate with uncompromising ethical clarity. Our work is grounded in truth, transparency, and responsibility.",
              color: "from-blue-500 to-blue-700",
            },
            {
              title: "Urgency",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              description:
                "We move with disciplined speed. When systems need alignment, delay creates drift — so we act with purpose and precision.",
              color: "from-cyan-500 to-cyan-700",
            },
            {
              title: "Excellence",
              icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
              description:
                "We deliver evaluator-ready, evidence-informed solutions. Our work is rigorous, structured, and built to withstand scrutiny.",
              color: "from-indigo-500 to-indigo-700",
            },
            {
              title: "Contextual Fit",
              icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
              description:
                "We design systems that match the real operating conditions of the organization. Our work respects the environment, constraints, and stakeholder realities while maintaining high standards and operational clarity.",
              color: "from-teal-500 to-teal-700",
            },
            {
              title: "Stability",
              icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
              description:
                "We create conditions where people and systems can function without unnecessary stress, ambiguity, or disruption. Stability is the foundation of performance.",
              color: "from-slate-600 to-slate-800",
            },
          ].map((value) => (
            <div key={value.title} className="card hover:shadow-xl transition-shadow">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4`}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hero / Overview */}
      <section className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 py-16 md:py-24 overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-cyan-900/85 to-blue-800/90"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Behavioral Systems Consulting for Performance, Clarity, and Consistent Execution
          </h2>
          <p className="text-lg text-white/95 leading-relaxed">
            Beyond The Surface Leadership Institute™, LLC (BTSLI™) designs and implements structured,
            behavior-based systems that improve communication, strengthen leadership, and increase performance
            across organizations, workforce programs, educational environments, and high-accountability systems.
          </p>
          <p className="text-white/90 leading-relaxed">
            We work with organizations experiencing breakdowns in communication, inconsistency in performance,
            lack of follow-through, and unclear expectations. We do not provide temporary solutions. We design
            structured systems intended to support consistent, sustainable performance over time.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {[
              "Clear communication",
              "Defined expectations",
              "Consistent execution",
              "Measurable outcomes",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/25">
                <svg className="w-5 h-5 text-cyan-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <a
              href="/schedule"
              className="inline-block px-8 py-4 bg-white text-blue-700 font-bold rounded-lg shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all text-lg"
            >
              Contact BTSLI™ to Schedule a Consultation
            </a>
          </div>
        </div>
      </section>

      {/* About the Organization */}
      <section className="space-y-8">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-3">
            About the Organization
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Who We Are</h2>
        </div>
        <div className="card bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="space-y-5 text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto">
            <p>
              <strong className="text-gray-900">Beyond The Surface Leadership Institute™, LLC (BTSLI™)</strong> is a
              Behavioral Systems Consulting firm founded by Dr. Audrea Knight-Nwosu, a behavioral science practitioner
              and systems architect with doctoral-level training in psychology, organizational behavior, and applied
              performance systems. She serves as Founder and Chief Executive Officer of the Institute.
            </p>
            <p>
              Dr. Knight-Nwosu holds a Ph.D. in Psychology, a Master's degree in Marriage and Family Therapy, a
              Bachelor's degree in Behavioral Science, a Post-Baccalaureate Certificate in Applied Behavior Analysis,
              and Professional Consulting Certification.
            </p>
            <p>
              She is the developer of the{" "}
              <strong className="text-blue-800">BTSLI Behavioral Systems Platform™</strong>, a proprietary internal
              system used to guide service delivery, staff training, and performance consistency across all BTSLI
              programs and engagements.
            </p>
            <p>
              Dr. Knight-Nwosu brings more than a decade of experience working within complex service and educational
              systems, where she has designed, developed, and implemented structured programs and individualized plans
              across children, youth, families, and organizational environments. Her work focuses on translating
              real-world needs into clear, actionable strategies that support stability, accountability, and measurable
              outcomes.
            </p>
            <p>
              Her expertise centers on identifying breakdowns in communication, task completion, role clarity, and
              follow-through—and designing structured systems that support consistent, repeatable improvements in
              performance across individuals, teams, and organizations.
            </p>
            <p>
              In addition, she has extensive experience in instructional design, curriculum development, and program
              facilitation, having developed and delivered structured learning experiences that strengthen
              communication, leadership capacity, and workforce readiness.
            </p>
            <p>
              This combined expertise informs the Institute's approach to consulting and program design, ensuring that
              all services are structured, scalable, and aligned with sustainable, performance-driven outcomes across
              organizational, educational, and community-based environments.
            </p>
          </div>
        </div>
      </section>

      {/* Why Organizations Choose BTSLI */}
      <section className="space-y-8">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-3">
            Why BTSLI™
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Why Organizations Choose BTSLI™</h2>
          <p className="text-gray-600 mt-3 max-w-3xl mx-auto leading-relaxed">
            Organizations choose BTSLI™ because we deliver structured, evidence-informed systems that create
            clarity, consistency, and measurable performance outcomes across complex environments.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "Behavioral-Systems Approach",
              description:
                "We do not rely on personality-driven coaching. We design structured systems that improve communication, performance, and operational flow.",
            },
            {
              title: "Evidence-Informed Methodology",
              description:
                "Our frameworks are grounded in behavioral science, systems theory, applied performance systems, and instructional design rather than trends or motivational messaging.",
            },
            {
              title: "Clarity and Structure",
              description:
                "We translate complex organizational challenges into clear, repeatable processes teams can understand, implement, and sustain.",
            },
            {
              title: "Scalable Solutions",
              description:
                "Our systems are designed to work across schools, youth-serving agencies, nonprofits, workforce programs, and government environments with real-world constraints in mind.",
            },
            {
              title: "Measurable Outcomes",
              description:
                "We focus on performance indicators, implementation consistency, and operational results—not vague concepts or abstract inspiration.",
            },
            {
              title: "Professionalism and Precision",
              description:
                "Organizations trust BTSLI™ for direct, structured, research-aligned delivery that is evaluator-ready, contract-ready, and built for serious implementation.",
            },
          ].map((item) => (
            <div key={item.title} className="card hover:shadow-lg transition-shadow border-2 border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="card bg-gradient-to-br from-blue-600 to-cyan-700 text-white border-none">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold">Built on Academic Training and Applied Practice</h3>
            <p className="text-white/95 leading-relaxed text-lg">
              BTSLI™'s methodology is informed by doctoral-level training in psychology, graduate training in
              therapeutic systems, behavioral science study, applied behavior analysis, consulting practice, and
              extensive experience designing structured programs across complex service and educational environments.
            </p>
            <p className="text-white/85 leading-relaxed">
              That foundation allows BTSLI™ to operate as a systems-based consulting institute—not a coach, not a
              trainer, and not a personality-led brand.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="space-y-8">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-3">
            Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">What We Provide</h2>
          <p className="text-gray-600 mt-3 max-w-3xl mx-auto leading-relaxed">
            Structured, systems-based consulting and program development services designed to improve performance,
            strengthen communication, and increase consistency across organizations, workforce programs, educational
            environments, and high-accountability systems.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Behavioral Systems Consulting",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              description:
                "BTSLI™ partners with organizations to identify breakdowns in communication, role clarity, accountability, follow-through, and overall systems flow. These breakdowns can contribute to staff burnout, inconsistent performance, and higher turnover when expectations and systems are not clearly defined or supported. Services are designed to support improved coordination, clearer expectations, and consistent execution across teams and environments.",
            },
            {
              title: "Program Development & Implementation",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
              description:
                "BTSLI™ designs and implements structured programs that support clarity, consistency, and measurable outcomes across organizational, educational, and community-based environments. Services are tailored to ensure programs are usable, scalable, and aligned with real-world conditions.",
            },
            {
              title: "Workforce Development & Performance",
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              description:
                "BTSLI™ partners with workforce development organizations and programs to strengthen participant engagement, consistency, and performance within structured environments. Services are designed to support improved participation, clearer navigation of expectations, and more consistent follow-through across training and work-based learning activities.",
            },
            {
              title: "Staff Development & Training",
              icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              description:
                "BTSLI™ provides structured training and implementation support to strengthen staff performance, improve communication practices, and increase consistency in how expectations are applied across teams.",
            },
          ].map((service) => (
            <div key={service.title} className="card border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center pt-4">
          <a href="/schedule" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg hover:scale-105">
            Contact BTSLI™ to Schedule a Consultation
          </a>
        </div>
      </section>

      {/* Our Approach */}
      <section className="card bg-gradient-to-br from-slate-50 to-blue-50 space-y-8">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-3">
            Our Approach
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Three Core Differentiators</h2>
          <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
            Our work is grounded in three core differentiators that drive measurable outcomes.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Execution-First Performance Alignment™",
              description:
                "Transforms expectations into consistent practice through clarity, alignment, and structured follow-through.",
              color: "from-blue-600 to-blue-800",
            },
            {
              title: "Behavioral Systems Advantage™",
              description:
                "Strengthens the system so performance is less dependent on individuals and more embedded within routines, communication patterns, and workflows.",
              color: "from-cyan-600 to-cyan-800",
            },
            {
              title: "Training-to-Implementation Continuum™",
              description:
                "Extends beyond training to support real-world application through structured implementation and follow-up support.",
              color: "from-indigo-600 to-indigo-800",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg mb-4`}></div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modalities */}
      <section className="card text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm">
          Modalities
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Evidence-Informed Modalities</h2>
        <p className="text-gray-700 leading-relaxed text-lg max-w-3xl mx-auto">
          BTSLI™ uses multiple evidence-informed, systems-based modalities—including performance-based behavioral
          science and Organizational Behavior Management (OBM)—to strengthen leadership, communication, and
          consistent execution across environments.
        </p>
      </section>

      {/* Who We Collaborate With */}
      <section className="space-y-8">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-3">
            Partnerships
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Who We Collaborate With</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Schools and school districts",
            "Workforce development organizations and programs",
            "Nonprofits and community-based organizations",
            "Child welfare and family service agencies",
            "Government agencies (local, state, and federal)",
            "For-profit employers and corporate teams",
            "Implementation partners and contractors",
          ].map((org) => (
            <div key={org} className="card flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">{org}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Schools & District Systems Alignment */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <div className="inline-block px-3 py-1 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-3">
              Schools &amp; Districts
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Schools &amp; District Systems Alignment</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              BTSLI™ partners with schools and districts to strengthen how expectations are communicated, how
              routines are implemented, and how staff practices are reinforced—supporting consistent instructional
              and operational implementation across classrooms, teams, and campus environments.
            </p>
          </div>
        </div>
      </section>

      {/* Who Delivers the Work */}
      <section className="space-y-8">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-3">
            Our Team
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Who Delivers the Work</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            BTSLI™ services are delivered by trained professionals applying structured, systems-based approaches.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { role: "Behavioral Systems Consultants", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { role: "Leadership Performance Specialists", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            { role: "Workforce Readiness Specialists", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { role: "Youth & Family Support Specialists", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
          ].map((item) => (
            <div key={item.role} className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <p className="text-gray-800 font-semibold leading-snug">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contracting & Certifications */}
      <section className="card bg-gradient-to-br from-slate-800 to-blue-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-white font-medium text-sm mb-4">
              Contracting &amp; Certifications
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Certified &amp; Contract-Ready</h2>
            <p className="text-white/90 leading-relaxed">
              Beyond The Surface Leadership Institute™, LLC (BTSLI™) is eligible to contract with federal, state,
              and local agencies nationwide and is positioned to support institutional buyers seeking structured,
              evidence-informed consulting, implementation support, and staff development.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-4">
            {["Women-Owned Small Business (WOSB)", "Economically Disadvantaged Women-Owned Small Business (EDWOSB)"].map(
              (cert) => (
                <div key={cert} className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-4 rounded-xl border border-white/25">
                  <svg className="w-8 h-8 text-cyan-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{cert}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="card text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Ready to Improve Performance?</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          If your organization, district, agency, or program is ready to improve performance, strengthen
          communication, and increase consistency through structured systems, BTSLI™ is ready to help.
        </p>
        <a
          href="/schedule"
          className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all text-xl hover:scale-105"
        >
          Contact BTSLI™ to Schedule a Consultation
        </a>
        <p className="text-sm text-gray-500 pt-2">
          &copy; 2026 Beyond The Surface Leadership Institute™, LLC. All rights reserved. BTSLI™
        </p>
      </section>

    </div>
  );
}
