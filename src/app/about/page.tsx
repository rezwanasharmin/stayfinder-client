'use client';

import React from 'react';
import { ShieldCheck, Heart, Users, Star, Award, Compass } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      title: 'Trusted Curation',
      desc: 'Every luxury stay listed on StayFinder passes a rigorous 50-point screening process covering sanitation, security, and smart amenities.',
      icon: ShieldCheck
    },
    {
      title: 'Experience Centered',
      desc: 'We prioritize accommodations that provide immersive local atmospheres, spectacular views, and premium architectural values.',
      icon: Compass
    },
    {
      title: 'Customer Devotion',
      desc: 'Our round-the-clock concierge services ensure that your stays are seamless from check-in to check-out.',
      icon: Heart
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
      
      {/* Intro section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-widest">
            Our Story
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Redefining Boutique Rentals & Accommodations
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            StayFinder was established in 2026 to bridge the gap between discerning travelers and premium hosts. We believe accommodations shouldn't just be a place to sleep—they should be the highlight of your journey.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            By combining a high-end web experience with rigorous listing curation, we make booking unique cabins, glass domes, and lakeside mansions stress-free.
          </p>
          <div className="pt-2">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-md shadow-teal-500/10 cursor-pointer"
            >
              Browse Stays
            </Link>
          </div>
        </div>

        {/* Visual Showcase */}
        <div className="relative rounded-2xl overflow-hidden h-[300px] sm:h-[380px] bg-slate-900 border border-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80" 
            alt="Luxury cabin villa" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
            <div className="flex gap-6 text-center text-white">
              <div>
                <span className="text-2xl font-extrabold text-teal-400">12k+</span>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Guests Hosted</span>
              </div>
              <div className="h-8 w-px bg-slate-800 self-center" />
              <div>
                <span className="text-2xl font-extrabold text-indigo-400">450+</span>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Luxury Stays</span>
              </div>
              <div className="h-8 w-px bg-slate-800 self-center" />
              <div>
                <span className="text-2xl font-extrabold text-purple-400">4.92</span>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-10 border-t border-slate-900 pt-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Our Core Values
          </h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Why travelers choose StayFinder
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900/80 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <v.icon className="h-5 w-5 text-teal-400" />
              </div>
              <h3 className="text-base font-bold text-white leading-snug">
                {v.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
