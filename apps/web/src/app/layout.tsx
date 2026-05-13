import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>BTSLI™ - Behavioral Systems Consulting for Performance & Clarity</title>
        <meta name="description" content="Beyond The Surface Leadership Institute™ provides evidence-informed consulting, training, and systems development that increases operational consistency, strengthens leadership execution, and improves organizational performance." />
      </head>
      <body className="overflow-x-hidden">
        <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-blue-100">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <a href="/" className="flex items-center justify-center md:justify-start space-x-2 group text-center md:text-left">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-xl">BT</span>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    BTSLI™
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-500 -mt-0.5">Behavioral Systems Consulting</div>
                </div>
              </a>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-center md:flex md:flex-wrap md:items-center md:justify-end md:gap-6 w-full md:w-auto">
                <a href="/" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
                <a href="/about" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
                <a href="/overview" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors">Overview</a>
                <a href="/services" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</a>
                <a href="/intake" className="text-sm sm:text-base text-orange-600 hover:text-orange-700 font-semibold transition-colors">Assessment</a>
                <a href="/resources" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors">Resources</a>
                <a href="/dashboard" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors">Client Portal</a>
                <a href="/login" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors">Login</a>
                <a href="/intake" className="col-span-2 md:col-span-1 justify-self-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all w-full sm:w-auto max-w-xs md:max-w-none">
                  Get Started
                </a>
              </div>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden">{children}</main>
        <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-3">Beyond The Surface Leadership Institute™, LLC</h3>
                <p className="text-blue-200 text-sm mb-3">
                  Behavioral Systems Consulting for Performance, Clarity, and Consistent Execution
                </p>
                <p className="text-blue-300 text-sm italic">
                  "System-centered clarity. Sustainable performance."
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Services</h3>
                <div className="space-y-2 text-blue-200 text-sm">
                  <a href="/services" className="block hover:text-white transition-colors">Behavioral Systems Consulting</a>
                  <a href="/services" className="block hover:text-white transition-colors">Program Development</a>
                  <a href="/services" className="block hover:text-white transition-colors">Workforce Development</a>
                  <a href="/services" className="block hover:text-white transition-colors">Staff Training</a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Organizations</h3>
                <div className="space-y-2 text-blue-200 text-sm">
                  <a href="/" className="block hover:text-white transition-colors">Schools & Districts</a>
                  <a href="/" className="block hover:text-white transition-colors">Nonprofits</a>
                  <a href="/" className="block hover:text-white transition-colors">Government Agencies</a>
                  <a href="/" className="block hover:text-white transition-colors">Corporate Teams</a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Get Started</h3>
                <p className="text-blue-200 mb-3 text-sm">
                  Ready to improve organizational performance?
                </p>
                <a href="/intake" className="inline-block px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-lg transition-all text-sm">
                  Systems Fit Assessment
                </a>
                <div className="mt-4 space-y-1">
                  <p className="text-blue-300 text-xs">WOSB Certified</p>
                  <p className="text-blue-300 text-xs">EDWOSB Certified</p>
                </div>
              </div>
            </div>
            <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
              <p className="text-sm">&copy; 2026 Beyond The Surface Leadership Institute™, LLC. All rights reserved.</p>
              <p className="text-xs mt-2">Evidence-informed consulting • Systems development • Performance-driven outcomes</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
