import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-blue-100">
          <nav className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">BT</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  BTSLI
                </span>
              </div>
              <div className="flex gap-6 flex-wrap">
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
                <a href="/services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</a>
                <a href="/schedule" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Schedule</a>
                <a href="/app/courses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Courses</a>
                <a href="/coach/slots" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Coach</a>
                <a href="/login" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">Login</a>
              </div>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-12">{children}</main>
        <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">BTSLI</h3>
                <p className="text-blue-200">Beyond the Surface Leadership Institute</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <div className="space-y-2 text-blue-200">
                  <a href="/services" className="block hover:text-white transition-colors">Services</a>
                  <a href="/schedule" className="block hover:text-white transition-colors">Schedule</a>
                  <a href="/app/courses" className="block hover:text-white transition-colors">Courses</a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Contact</h3>
                <p className="text-blue-200">Trauma-aware, coaching-based support</p>
              </div>
            </div>
            <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
              <p>&copy; 2026 BTSLI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
