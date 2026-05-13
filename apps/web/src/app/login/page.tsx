'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiPost<{ token: string }>('/auth/login', { email, password });
      setToken(res.token);
      localStorage.setItem('token', res.token);
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
      setLoading(false);
    }
  }

  function useDemoAccount(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Demo Credentials Card */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h2 className="text-xl font-bold">Demo Access</h2>
          </div>
          <p className="text-blue-100 mb-4">Try the platform with these demo accounts:</p>
          
          <div className="space-y-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">Client Account</p>
                <button
                  onClick={() => useDemoAccount('demo@btsli.com', 'Demo123!')}
                  className="text-xs bg-white/30 hover:bg-white/40 px-3 py-1 rounded-full transition-all"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-sm font-mono text-blue-50">demo@btsli.com</p>
              <p className="text-sm font-mono text-blue-50">Demo123!</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">Specialist Account</p>
                <button
                  onClick={() => useDemoAccount('coach@btsli.com', 'Demo123!')}
                  className="text-xs bg-white/30 hover:bg-white/40 px-3 py-1 rounded-full transition-all"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-sm font-mono text-blue-50">coach@btsli.com</p>
              <p className="text-sm font-mono text-blue-50">Demo123!</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h1>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          {token && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Successfully logged in! Redirecting to dashboard...
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">❌ {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
