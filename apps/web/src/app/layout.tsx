import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>BTSLI - Professional Coaching for Leadership & Personal Growth</title>
        <meta name="description" content="Trauma-informed professional coaching for leaders, professionals, and families. Transform how you communicate, lead, and navigate life's challenges with compassionate support." />
      </head>
      <body>
        <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-blue-100">
          <nav className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-xl">BT</span>
                </div>
                <div>
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    BTSLI Coaching
                  </div>
                  <div className="text-xs text-gray-500 -mt-0.5">Trauma-Informed Leadership</div>
                </div>
              </a>
              <div className="flex gap-6 flex-wrap items-center">
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
                <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
                <a href="/services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Coaching</a>
                <a href="/resources" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Resources</a>
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Dashboard</a>
                <a href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Login</a>
                <a href="/schedule" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                  Book a Call
                </a>
              </div>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-12">{children}</main>
        <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-3">BTSLI Coaching</h3>
                <p className="text-blue-200 text-sm mb-3">
                  Professional, trauma-informed coaching for meaningful change.
                </p>
                <p className="text-blue-300 text-sm italic">
                  "Beyond the surface lies your true potential."
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Coaching</h3>
                <div className="space-y-2 text-blue-200 text-sm">
                  <a href="/services" className="block hover:text-white transition-colors">1-on-1 Coaching</a>
                  <a href="/services" className="block hover:text-white transition-colors">Team Coaching</a>
                  <a href="/services" className="block hover:text-white transition-colors">Family Coaching</a>
                  <a href="/services" className="block hover:text-white transition-colors">Organizational Training</a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Resources</h3>
                <div className="space-y-2 text-blue-200 text-sm">
                  <a href="/resources" className="block hover:text-white transition-colors">Articles & Guides</a>
                  <a href="/about" className="block hover:text-white transition-colors">Meet Your Coach</a>
                  <a href="/about" className="block hover:text-white transition-colors">Coaching Approach</a>
                  <a href="/login" className="block hover:text-white transition-colors">Client Portal</a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Get Started</h3>
                <p className="text-blue-200 mb-3 text-sm">
                  Ready to begin your coaching journey?
                </p>
                <a href="/schedule" className="inline-block px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-lg transition-all text-sm">
                  Schedule Free Discovery Call
                </a>
                <p className="text-blue-300 text-xs mt-3">
                  💬 Virtual & in-person sessions available
                </p>
              </div>
            </div>
            <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
              <p className="text-sm">&copy; 2026 BTSLI - Beyond the Surface Leadership Institute. All rights reserved.</p>
              <p className="text-xs mt-2">Professional coaching • Trauma-informed approach • ICF-aligned practices</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
