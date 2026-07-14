'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

function LoginContent() {
  const { login, user } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = searchParams.get('redirect') || '/';
  const safeRedirect = (redirectPath.includes('/login') || redirectPath.includes('/register')) ? '/' : redirectPath;

  // Redirect if already logged in
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath === '/login' && safeRedirect !== '/login') {
        window.location.href = safeRedirect;
      }
    }
  }, [user, safeRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      showToast('Logged in successfully!', 'success');
      window.location.href = safeRedirect;
    } else {
      setError(res.error || 'Invalid credentials');
      showToast(res.error || 'Login failed', 'error');
    }
  };

  const handleDemoLogin = async (type: 'user' | 'admin') => {
    setSubmitting(true);
    setError('');

    const demoEmail = type === 'admin' ? 'admin@stayfinder.com' : 'user@stayfinder.com';
    const demoPassword = 'password123';

    setEmail(demoEmail);
    setPassword(demoPassword);

    const res = await login(demoEmail, demoPassword);
    setSubmitting(false);

    if (res.success) {
      showToast(`Logged in as Demo ${type === 'admin' ? 'Admin' : 'User'}!`, 'success');
      window.location.href = safeRedirect;
    } else {
      setError(res.error || 'Failed to authenticate demo user');
      showToast('Demo login failed', 'error');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh] px-4 py-12 sm:px-6 lg:px-8 bg-slate-950">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to book exclusive luxury stays
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-center font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="group relative flex w-full justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-lg shadow-teal-500/10 focus:outline-none transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span className="flex items-center gap-1.5">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Demo login buttons */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-center mb-3">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Instant Demo Access
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              disabled={submitting}
              className="flex justify-center items-center py-2 px-3 border border-slate-850 rounded-xl text-xs font-semibold text-slate-300 hover:text-teal-400 bg-slate-900/30 hover:bg-slate-900/60 transition-all cursor-pointer"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={submitting}
              className="flex justify-center items-center py-2 px-3 border border-slate-850 rounded-xl text-xs font-semibold text-slate-300 hover:text-teal-400 bg-slate-900/30 hover:bg-slate-900/60 transition-all cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[50vh] text-slate-400 text-sm font-semibold">
        Loading authentication forms...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
