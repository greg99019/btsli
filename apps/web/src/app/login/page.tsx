'use client';

import { useState } from 'react';
import { apiPost } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiPost<{ token: string }>('/auth/login', { email, password });
      setToken(res.token);
      localStorage.setItem('token', res.token);
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {token ? <p>Logged in (token saved).</p> : null}
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
    </div>
  );
}
