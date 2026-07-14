'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, Compass, PlusCircle, Settings, Home, Info, Mail } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Common routes
  const baseRoutes = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Mail },
  ];

  // Routes displayed when logged in (Add items, Manage items)
  const authRoutes = [
    { label: 'Add Property', path: '/items/add', icon: PlusCircle },
    { label: 'Manage listings', path: '/items/manage', icon: Settings },
  ];

  const currentRoutes = user ? [...baseRoutes.slice(0, 2), ...authRoutes, ...baseRoutes.slice(2)] : baseRoutes;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-600 bg-clip-text text-xl font-bold tracking-wider text-transparent group-hover:opacity-95 transition-all">
                StayFinder
              </span>
              <span className="hidden sm:inline-block rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
                Premium
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {currentRoutes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive(route.path)
                    ? 'text-teal-400 bg-slate-900/60 shadow-sm border border-slate-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <route.icon className="h-4 w-4 shrink-0" />
                  {route.label}
                </span>
                {isActive(route.path) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* User Session / Authentication Button */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3.5 pl-3 border-l border-slate-800">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-100">{user.name}</span>
                  <span className="text-[10px] text-teal-400 uppercase tracking-widest font-bold">
                    {user.role}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center text-slate-950 font-bold uppercase text-sm border border-teal-500/20 shadow-md">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={logout}
                  className="rounded-lg p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all border border-transparent hover:border-rose-500/20 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-950 bg-teal-400 rounded-lg hover:bg-teal-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-lg px-2 pt-2 pb-4 space-y-1">
          {currentRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                isActive(route.path)
                  ? 'text-teal-400 bg-slate-900 border border-slate-850'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <route.icon className="h-5 w-5 text-slate-400" />
              {route.label}
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-850 px-3">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center text-slate-950 font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-100">{user.name}</span>
                    <span className="text-[10px] text-teal-400 uppercase tracking-widest font-bold">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/20 transition-all border border-rose-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center px-4 py-2.5 text-base font-medium text-slate-950 bg-teal-400 rounded-lg hover:bg-teal-300 shadow-md shadow-teal-500/10"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
