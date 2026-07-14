'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Lock, Mail, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      window.location.href = '/';
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await register(name, email, password, role);
    setSubmitting(false);

    if (res.success) {
      showToast('Registration successful! Welcome.', 'success');
      window.location.href = '/';
    } else {
      setError(res.error || 'Registration failed');
      showToast(res.error || 'Registration failed', 'error');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh] px-4 py-12 sm:px-6 lg:px-8 bg-slate-950">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Join StayFinder to book and list boutique stays
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-center font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'user'
                      ? 'bg-slate-900 border-teal-500/50 text-teal-400'
                      : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  Traveler (User)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'admin'
                      ? 'bg-slate-900 border-teal-500/50 text-teal-400'
                      : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Host (Admin)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="group relative flex w-full justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-lg shadow-teal-500/10 focus:outline-none transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span className="flex items-center gap-1.5">
                  Sign Up <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
