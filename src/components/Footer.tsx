'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900/60 pt-16 pb-8 mt-auto text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-600 bg-clip-text text-xl font-bold tracking-wider text-transparent">
                StayFinder
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Discover and list premium luxury rentals and boutique accommodations worldwide. Handpicked properties designed for exceptional experiences.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3.5 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-teal-400/50 text-slate-400 hover:text-teal-400 transition-all cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-teal-400/50 text-slate-400 hover:text-teal-400 transition-all cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-teal-400/50 text-slate-400 hover:text-teal-400 transition-all cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-teal-400/50 text-slate-400 hover:text-teal-400 transition-all cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">
              Quick Navigation
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  Home <ArrowUpRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  Explore Accommodations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">
              Stay Categories
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/explore?category=Beachfront" className="hover:text-teal-400 transition-colors">
                  Beachfront Domes
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Cabins" className="hover:text-teal-400 transition-colors">
                  A-Frame Cabins
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Mansions" className="hover:text-teal-400 transition-colors">
                  Glass Mansions
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Treehouses" className="hover:text-teal-400 transition-colors">
                  Eco Treehouses
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                <span>Road 11, Banani, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                <span>+880 1712 345678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                <span>contact@stayfinder.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-900/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} StayFinder Inc. All rights reserved. Made for SCIC assignment.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="/about" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <button
              onClick={handleScrollToTop}
              className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Back to Top &uarr;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
