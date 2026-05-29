export default function InternationalServicesPage() {
  const focusAreas = [
    {
      title: 'Child & Family Systems Strengthening',
      color: 'blue',
      description:
        'BTSLI™ supports child-serving and family-serving organizations seeking to strengthen the quality, consistency, and coordination of services for children, caregivers, families, and communities.',
      services: [
        'Child and family systems analysis',
        'Case management workflow review and design',
        'Family-centered practice models',
        'Safety, risk, and protective-factor considerations',
        'Cross-agency coordination support',
        'Service planning and documentation routines',
        'Quality assurance and practice improvement tools',
        'Trauma-responsive and culturally responsive system design',
        'Field-level implementation support for child and family service teams',
      ],
      outcome:
        'This service area helps organizations strengthen the structures that support child safety, family engagement, permanency, service coordination, accountability, and consistent practice.',
    },
    {
      title: 'Field Practice, Documentation & Accountability Support',
      color: 'cyan',
      description:
        'BTSLI™ supports child- and family-serving systems by strengthening the field-level practices that help agencies make informed, timely, and accountable decisions. Strong systems require more than written policy. They require clear field guidance, accurate documentation, supervisory review, family communication, and follow-through.',
      services: [
        'Field visit documentation protocols',
        'Family rights notification scripts and tools',
        'Caseworker-to-supervisor reporting templates',
        'Safety and risk observation guides',
        'Imminent safety versus broader risk decision-support tools',
        'Supervisory case reading and case review tools',
        'Cross-program historical case review protocols',
        'Risk staffing agendas and decision documentation forms',
        'Worker field safety and post-visit debriefing procedures',
        'Documentation quality audits and corrective-action tracking',
      ],
      outcome:
        'This service area helps agencies ensure that field observations, family contacts, safety concerns, prior case history, supervisor guidance, and next-step decisions are documented clearly and used to support child safety, family engagement, accountability, and informed decision-making.',
    },
    {
      title: 'Cross-Program Risk Staffing & Historical Case Review',
      color: 'blue',
      description:
        'BTSLI™ helps child- and family-serving organizations strengthen decision-making when families, youth, or clients have recurring system involvement, reopened cases, or major concerns during an active case.',
      services: [
        'Historical case review tools',
        'Prior service involvement summaries',
        'Cross-program staffing protocols',
        'Risk staffing meeting guides',
        'Decision documentation templates',
        'Escalation pathway tools',
        'Corrective-action and follow-up tracking',
        'Court-ready case history summaries where appropriate',
      ],
      outcome:
        'This service area supports agencies in reviewing prior case history, comparing current concerns with past patterns, identifying unresolved safety or service issues, and making more informed decisions before major case actions are taken.',
    },
    {
      title: 'Workforce Capacity Building & Professional Development',
      color: 'cyan',
      description:
        'BTSLI™ strengthens human-service, education, workforce, and community-serving teams through practical training, professional development, and implementation support.',
      services: [
        'Competency-based workforce training',
        'Frontline staff development',
        'Supervision and leadership development',
        'Professional communication and emotional intelligence training',
        'Team alignment and organizational culture support',
        'Burnout prevention and resilience-building frameworks',
        'Coaching and performance-support systems',
        'Training-to-practice implementation tools',
        'Field practice coaching and documentation support',
      ],
      outcome:
        'This service area helps organizations build confident, prepared, and aligned teams capable of carrying out their mission with clarity, consistency, professionalism, and accountability.',
    },
    {
      title: 'Program Design, Implementation & Fidelity Support',
      color: 'blue',
      description:
        'BTSLI™ helps organizations design, organize, implement, and strengthen programs so that services are not only planned but carried out with structure and consistency.',
      services: [
        'Program model development',
        'Logic models and theories of change',
        'Implementation planning and rollout support',
        'Policy-to-practice translation',
        'Fidelity standards and monitoring tools',
        'Continuous quality improvement systems',
        'Staff implementation guides and checklists',
        'Service delivery alignment tools',
        'Field-practice tools that support consistent implementation',
      ],
      outcome:
        'This service area supports organizations as they turn goals, policies, and program designs into practical systems that staff can understand, use, document, and sustain.',
    },
    {
      title: 'Monitoring, Evaluation & Systems Learning',
      color: 'cyan',
      description:
        'BTSLI™ supports organizations in building learning systems that help them understand what is working, where improvement is needed, and how outcomes can be strengthened over time.',
      services: [
        'Monitoring and evaluation frameworks',
        'Outcome and indicator development',
        'Practice audits and system reviews',
        'Data-informed decision-making structures',
        'Training evaluation tools',
        'Program improvement recommendations',
        'Family, participant, staff, or stakeholder feedback tools',
        'Learning and adaptation processes',
        'Documentation quality review and practice improvement reports',
      ],
      outcome:
        'This service area helps partners strengthen accountability, improve service quality, and use information to guide responsible decision-making.',
    },
    {
      title: 'Government & Public Sector Capacity Support',
      color: 'blue',
      description:
        'BTSLI™ supports public-sector and government-adjacent partners seeking to improve service delivery, strengthen workforce capacity, and align systems across departments, agencies, and community partners.',
      services: [
        'Technical assistance for child-protection, social-protection, workforce, education, and human-service systems',
        'Workforce readiness and competency development',
        'Systems alignment and cross-agency collaboration',
        'Strategic planning and implementation support',
        'Documentation and service-flow improvement',
        'Leadership and supervision support',
        'Quality assurance and accountability routines',
        'Field-level governance and supervisory decision-support tools',
      ],
      outcome:
        'This service area is designed for organizations that must coordinate people, policies, documentation, services, field decisions, and outcomes across complex environments.',
    },
    {
      title: 'Academic & Training Institute Partnerships',
      color: 'cyan',
      description:
        'BTSLI™ collaborates with universities, training institutes, and education partners to support professional learning, curriculum development, applied research, and workforce preparation.',
      services: [
        'Guest lectures and professional learning sessions',
        'Curriculum development',
        'Applied research partnerships',
        'Faculty and staff development',
        'Academic program evaluation',
        'Workforce-readiness training modules',
        'Student success and professional preparation support',
        'Practice-based training materials for human-service and workforce systems',
      ],
      outcome:
        'This service area supports institutions preparing future professionals and strengthening learning pathways for students, practitioners, and community leaders.',
    },
    {
      title: 'Youth Development, Workforce Readiness & Community Capacity',
      color: 'blue',
      description:
        'BTSLI™ supports programs serving youth, young adults, families, and communities through leadership development, workforce readiness, behavioral skill-building, and practical life-readiness supports.',
      services: [
        'Youth leadership development',
        'Workforce readiness and professional behavior training',
        'Communication and conflict-navigation skills',
        'Emotional regulation and decision-making support',
        'Family and community engagement frameworks',
        'Life-readiness and employability skill development',
        'Community resilience and support models',
        'Facilitator guides and training materials',
        'Behavioral skill-building tools for youth-serving programs',
      ],
      outcome:
        'This service area helps organizations prepare participants for stronger engagement in school, work, family, and community life.',
    },
    {
      title: 'Specialized International Services',
      color: 'cyan',
      description:
        'BTSLI™ offers specialized support for organizations seeking culturally responsive, systems-based consultation in complex service environments.',
      services: [
        'Behavioral systems analysis',
        'Trauma-responsive leadership',
        'Cross-cultural communication and leadership training',
        'Organizational development',
        'Social-systems design',
        'Family-strengthening frameworks',
        'Virtual international capacity-building',
        'Implementation support for multi-site or multi-partner initiatives',
        'Accountability routines for service delivery and documentation systems',
      ],
      outcome:
        'These services are designed to support organizations that need thoughtful, structured, and practical assistance in strengthening how people, programs, and systems work together.',
    },
  ];

  const supportBullets = [
    'Clarify roles, expectations, and service pathways',
    'Strengthen workforce competency and confidence',
    'Improve documentation and follow-through',
    'Align leadership, supervision, and frontline practice',
    'Build practical tools that staff can use',
    'Strengthen family, youth, and community engagement',
    'Develop implementation routines that support consistency',
    'Use data and feedback to guide improvement',
    'Strengthen accountability between field practice, supervision, and program leadership',
  ];

  const partnerReasons = [
    'Strengthening child, family, youth, workforce, and community-serving systems',
    'Building staff capacity through practical, competency-based training',
    'Translating policies, goals, and program models into daily practice',
    'Improving service delivery, documentation, communication, and follow-through',
    'Supporting leaders and teams with clearer roles, routines, and accountability structures',
    'Developing culturally responsive tools, training, and implementation supports',
    'Strengthening monitoring, evaluation, learning, and continuous improvement practices',
    'Supporting sustainable systems that reflect the dignity, strengths, and needs of the communities being served',
  ];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-2">
          International Services
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
          International Services &amp; Global Systems Support
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Behavioral Systems Consulting, Capacity-Building &amp; Implementation Support
        </p>
      </section>

      {/* Intro */}
      <section className="card bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto space-y-5 text-gray-700 text-lg leading-relaxed">
          <p>
            Beyond The Surface Leadership Institute™ (BTSLI™) provides behavioral systems consulting,
            capacity-building, workforce development, and implementation support for organizations serving
            children, families, youth, workforces, and communities across the Caribbean, global regions, and
            diaspora-serving environments.
          </p>
          <p>
            As part of BTSLI™'s expanded service offerings, our international services support government
            agencies, NGOs, universities, workforce programs, education systems, human-services organizations,
            and community-serving partners seeking to strengthen the systems behind meaningful service delivery.
          </p>
          <p>
            BTSLI™ helps organizations move beyond ideas, policies, and written plans by strengthening the
            people, practices, routines, documentation systems, and accountability structures needed for
            consistent implementation. Our work focuses on helping partners align teams, build workforce
            competency, improve service delivery, support field-level practice, strengthen documentation and
            follow-through, and translate vision into practical, measurable action.
          </p>
        </div>
      </section>

      {/* International Focus Banner */}
      <section className="card bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none text-center">
        <h2 className="text-3xl font-bold mb-4">Our International Service Focus</h2>
        <p className="text-blue-100 text-lg max-w-4xl mx-auto leading-relaxed">
          BTSLI™ supports organizations in areas where human-service systems, workforce capacity, leadership,
          documentation, accountability, and implementation intersect. Our international work is grounded in
          cultural responsiveness, professional integrity, evidence-informed practice, and respect for the
          communities and systems we serve.
        </p>
      </section>

      {/* Focus Areas Grid */}
      <section className="grid md:grid-cols-2 gap-8">
        {focusAreas.map((area) => (
          <div
            key={area.title}
            className={`card bg-gradient-to-br from-${area.color}-50 to-white border-2 border-${area.color}-200 hover:border-${area.color}-400 transition-all`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-3 h-10 bg-gradient-to-b from-${area.color}-600 to-cyan-500 rounded-full flex-shrink-0`}
              />
              <h3 className="text-xl font-bold text-gray-800">{area.title}</h3>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">{area.description}</p>

            <div className={`bg-white rounded-lg p-5 border border-${area.color}-100 mb-4`}>
              <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                Services may include:
              </h4>
              <ul className="space-y-1.5 text-gray-700">
                {area.services.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <span className={`text-${area.color}-600 mt-0.5 flex-shrink-0`}>•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-gray-600 text-sm italic leading-relaxed">{area.outcome}</p>
          </div>
        ))}
      </section>

      {/* How BTSLI Supports Partners */}
      <section className="card bg-gradient-to-br from-slate-50 to-blue-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">How BTSLI™ Supports International Partners</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          BTSLI™ works alongside partners to strengthen service delivery from the inside out. Our approach
          focuses on the human systems that determine whether programs, policies, and services are implemented
          consistently and effectively.
        </p>
        <p className="text-gray-700 leading-relaxed mb-5 font-medium">We support partners by helping them:</p>
        <ul className="grid sm:grid-cols-2 gap-3">
          {supportBullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-gray-700">
              <span className="text-blue-600 mt-1 flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Why Partners Work With BTSLI */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why International and Diaspora-Serving Partners Work With BTSLI™
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
            International and diaspora-serving organizations partner with BTSLI™ because we understand that
            strong programs require more than good intentions, written policies, or one-time training.
            Sustainable impact depends on the people, practices, routines, communication structures,
            documentation systems, and implementation supports that help organizations carry out their mission
            with consistency and care.
          </p>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
          <p className="text-gray-700 leading-relaxed mb-6">
            BTSLI™ brings a practical, systems-based, and human-centered approach to capacity-building and
            implementation support. Our work helps partners strengthen the connection between vision and daily
            practice, ensuring that teams are better equipped to serve children, families, youth, workforces,
            and communities in meaningful and measurable ways.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            BTSLI™ is especially valuable to organizations working across cultural, community, and service
            environments because we combine field-informed human-services experience with behavioral systems
            thinking, workforce development, program design, documentation support, and implementation
            practice. This allows us to help partners identify what needs to be strengthened, design practical
            tools, support workforce competency, and build systems that can be used consistently across teams
            and settings.
          </p>
          <h3 className="font-bold text-gray-800 mb-4">Organizations partner with BTSLI™ for support with:</h3>
          <ul className="space-y-3">
            {partnerReasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-gray-700">
                <span className="text-cyan-600 mt-1 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 space-y-4 text-gray-700 leading-relaxed">
          <p>
            BTSLI™ does not approach international work as an outside voice imposing generic solutions. We
            approach partnership with respect, cultural awareness, listening, collaboration, and practical
            support. Our goal is to help organizations strengthen what they are already building by adding
            structure, clarity, workforce capacity, field-practice support, and implementation tools that
            support long-term service quality and community impact.
          </p>
          <p>
            Through this approach, BTSLI™ helps international and diaspora-serving partners move from
            planning to practice, from training to implementation, and from organizational vision to
            measurable service outcomes.
          </p>
        </div>
      </section>

      {/* Commitment */}
      <section className="card bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none text-center">
        <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
        <p className="text-blue-100 text-lg max-w-4xl mx-auto leading-relaxed">
          BTSLI™ is committed to supporting organizations that serve children, families, youth, workforces,
          and communities with dignity, cultural awareness, and practical excellence. Our international
          services are grounded in the belief that strong systems help people thrive.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Connect With BTSLI™</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          To explore international consulting, capacity-building, workforce development, or systems-support
          services, contact Beyond The Surface Leadership Institute™ to discuss your organization's goals,
          needs, and service priorities.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/schedule"
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xl font-bold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Schedule Consultation
          </a>
          <a
            href="/services"
            className="px-10 py-5 bg-white text-blue-600 border-2 border-blue-600 font-bold text-xl rounded-lg hover:bg-blue-50 transition-all"
          >
            View All Services
          </a>
        </div>
      </section>
    </div>
  );
}
