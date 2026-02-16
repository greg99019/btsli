import { apiGet } from '@/lib/api';

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMin: number;
  priceMax: number;
  durationMin: number;
  unitLabel: string;
  focusAreas: string[];
};

export default async function ServicesPage() {
  const services = await apiGet<Service[]>('/services');

  const serviceDetails = {
    "individual-coaching": {
      icon: "👤",
      whoItsFor: "Professionals, executives, and individuals seeking personal growth",
      outcomes: ["Enhanced leadership presence", "Improved communication skills", "Career advancement strategies", "Greater self-awareness"],
      format: "1-on-1 virtual or in-person sessions"
    },
    "team-coaching": {
      icon: "👥",
      whoItsFor: "Teams, departments, and work groups",
      outcomes: ["Stronger team dynamics", "Improved collaboration", "Conflict resolution skills", "Psychological safety"],
      format: "Group sessions and workshops"
    },
    "family-coaching": {
      icon: "🏠",
      whoItsFor: "Families navigating challenges and transitions",
      outcomes: ["Better communication patterns", "Stronger relationships", "Emotional regulation", "Family resilience"],
      format: "Family sessions (virtual or in-person)"
    },
    "organizational-training": {
      icon: "🏢",
      whoItsFor: "Schools, businesses, and organizations",
      outcomes: ["Leadership development programs", "Trauma-informed practices", "Workforce readiness", "Cultural transformation"],
      format: "On-site training and consulting"
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-2">
          Personalized Coaching Programs
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
          Coaching That Fits Your Life
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Whether you're an individual seeking personal growth or an organization building stronger teams, 
          I offer flexible coaching programs designed around your goals and schedule.
        </p>
      </section>

      {/* Coaching Philosophy */}
      <section className="card bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Coaching Philosophy</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Coaching isn't about giving advice or having all the answers. It's about creating a safe, supportive space 
            where you can explore your own wisdom, build on your strengths, and navigate challenges with clarity and confidence.
          </p>
          <p className="text-gray-600 leading-relaxed">
            I bring a <strong className="text-gray-800">trauma-informed lens</strong> to every coaching relationship, 
            meaning I understand how past experiences shape present behavior—and I meet you exactly where you are, 
            without judgment.
          </p>
        </div>
      </section>

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
