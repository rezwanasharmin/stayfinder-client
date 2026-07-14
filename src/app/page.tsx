'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  SlidersHorizontal,
  Home as HomeIcon,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Categories mock
const CATEGORIES = [
  { name: 'All', icon: '🌍' },
  { name: 'Beachfront', icon: '🏖️' },
  { name: 'Cabins', icon: '🏡' },
  { name: 'Mansions', icon: '🏰' },
  { name: 'Treehouses', icon: '🌲' },
  { name: 'Apartments', icon: '🏢' }
];

// Hero slides mock
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    title: 'Discover Luxury Beachfront Domes',
    subtitle: 'Wake up to the gentle waves and panoramic ocean horizons.'
  },
  {
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    title: 'Secluded Forest Escape Cabins',
    subtitle: 'Warm fireplaces, wood-fired hot tubs, and deep natural quiet.'
  },
  {
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    title: 'Futuristic Glass Mansions',
    subtitle: 'Sleek architecture and smart homes at the edge of quiet lagoons.'
  }
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: 'How do I list my property on StayFinder?',
    answer: 'To list a property, create an account, log in, select the Host (Admin) role or request host permissions, and navigate to the "Add Property" page. Fill in the title, specifications, price, location, and upload your imagery.'
  },
  {
    question: 'Is my payment secure?',
    answer: 'Yes! StayFinder uses industry-standard encryption protocols. We hold booking amounts in escrow and release them to hosts only after a successful check-in validation.'
  },
  {
    question: 'Can I cancel my accommodation booking?',
    answer: 'Cancellation terms are set by individual property hosts. You can view the exact cancellation policy on the property specifications page under rules.'
  },
  {
    question: 'How does the rating and review system work?',
    answer: 'Only verified guests who have completed their stays can submit ratings and write reviews, ensuring that all comments are honest and authentic.'
  }
];

export default function HomePage() {
  const { showToast } = useNotification();
  const router = useRouter();

  // Hero Slider State
  const [heroIndex, setHeroIndex] = useState(0);

  // Search input
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Listings State
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Stats State
  const [stats, setStats] = useState<any>(null);
  const [chartMounted, setChartMounted] = useState(false);

  // FAQ state
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  // Auto transition hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch listings and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingListings(true);
        // Fetch listings
        const listingsRes = await fetch(`${API_BASE}/api/items?limit=4&category=${selectedCategory}`, {
          credentials: 'include'
        });
        if (listingsRes.ok) {
          const data = await listingsRes.json();
          setListings(data.listings);
        }

        // Fetch stats
        const statsRes = await fetch(`${API_BASE}/api/stats`, {
          credentials: 'include'
        });
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats({
            totalListings: data.totalCount || 0,
            avgPrice: data.averagePrice || 0,
            categoryStats: data.categories || []
          });
        }
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoadingListings(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  useEffect(() => {
    setChartMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = '/explore?';
    if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
    if (searchLocation) url += `location=${encodeURIComponent(searchLocation)}`;
    router.push(url);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitting(true);
    setTimeout(() => {
      showToast('Thank you! You have subscribed to the newsletter.', 'success');
      setNewsletterEmail('');
      setNewsletterSubmitting(false);
    }, 1200);
  };

  const COLORS = ['#2dd4bf', '#6366f1', '#a855f7', '#f43f5e', '#e2e8f0'];

  return (
    <div className="w-full space-y-20 bg-slate-950 text-slate-100">
      
      {/* SECTION 1: HERO SLIDER (Height: 60-70% of screen) */}
      <section className="relative w-full h-[65vh] overflow-hidden flex items-center">
        {/* Background Images */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
              idx === heroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.4), rgba(2, 6, 23, 0.85)), url(${slide.image})` }}
          />
        ))}

        {/* Content Container */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6 z-10 select-none">
          <div className="max-w-2xl animate-slide-in">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-4 uppercase tracking-widest">
              <Sparkles className="h-3 w-3" /> Curated Stays of 2026
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              {HERO_SLIDES[heroIndex].title}
            </h1>
            <p className="text-lg text-slate-300 font-medium">
              {HERO_SLIDES[heroIndex].subtitle}
            </p>
          </div>

          {/* Interactive Search Bar Form */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="w-full max-w-4xl p-2 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-1.5"
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="h-5 w-5 text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search domes, villas, cabins..."
                className="w-full bg-transparent border-0 text-sm focus:outline-none placeholder-slate-500 text-slate-100"
              />
            </div>
            <div className="hidden sm:block h-8 w-px bg-slate-800" />
            <div className="flex-1 flex items-center gap-2 px-3">
              <MapPin className="h-5 w-5 text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Where to? (e.g. Sylhet, Sajek)"
                className="w-full bg-transparent border-0 text-sm focus:outline-none placeholder-slate-500 text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/10 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Hero Slider Slider Controls */}
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <button
              onClick={() => setHeroIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-850 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-850 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center sm:text-left mb-8">
          <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest">
            Bespoke Collections
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            Filter Stays by Category
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-3 rounded-xl border font-semibold text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-teal-400 to-indigo-500 text-slate-950 border-transparent shadow-lg shadow-teal-500/10 scale-105'
                  : 'bg-slate-900/50 hover:bg-slate-900 text-slate-300 border-slate-850 hover:border-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3: CORE LISTING / CARD SECTION (Desktop: 4 per row) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
              Available Listings
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              Boutique Accommodations
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-teal-400 hover:text-teal-300 transition-colors"
          >
            Explore all listings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingListings ? (
          /* Skeleton Loader (4 Columns Desktop, same height/width, same border radius/layout) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col h-[420px] rounded-2xl border border-slate-900 bg-slate-900/20 overflow-hidden animate-pulse">
                <div className="h-48 w-full bg-slate-850" />
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="h-4 w-2/3 bg-slate-850 rounded" />
                  <div className="h-6 w-full bg-slate-850 rounded" />
                  <div className="h-12 w-full bg-slate-850 rounded" />
                  <div className="h-4 w-1/2 bg-slate-850 rounded mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-slate-900/20 border border-slate-850 border-dashed">
            <p className="text-slate-400 text-sm font-medium">No properties found in this category.</p>
          </div>
        ) : (
          /* Grid display: 4 cards per row desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {listings.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col h-[430px] rounded-2xl border border-slate-900/80 bg-slate-900/30 hover:border-slate-850 hover:bg-slate-900/50 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Image and Category badge */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-850 shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/10 uppercase tracking-widest">
                    {item.category}
                  </span>
                  {item.priority === 'high' && (
                    <span className="absolute top-3 right-3 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>

                {/* Card Content (Standardized layout, same border radius, height and width) */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Location and Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 truncate max-w-[150px]">
                        <MapPin className="h-3 w-3 text-teal-400 shrink-0" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-400 font-semibold shrink-0">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white leading-snug group-hover:text-teal-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    {/* Short description */}
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Price and Details CTA */}
                  <div className="pt-4 border-t border-slate-900/60 mt-auto flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Price per night</span>
                      <span className="text-lg font-extrabold text-white">
                        ${item.price}
                      </span>
                    </div>
                    <Link
                      href={`/items/${item.id}`}
                      className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors cursor-pointer"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: PLATFORM STATISTICS DASHBOARD (Recharts Dashboard) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl border border-slate-900/80 bg-slate-900/20 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:pr-8 flex flex-col justify-center space-y-4 lg:border-r lg:border-slate-900">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                <TrendingUp className="h-3 w-3" /> Live Analytics
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                StayFinder Market Overview
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Browse realtime property distributions, regional rates, and system priorities directly sourced from our database logs.
              </p>
              
              {stats && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-850">
                    <span className="text-xs text-slate-500 font-semibold block mb-1">Total Stays</span>
                    <span className="text-2xl font-extrabold text-teal-400">{stats.totalListings}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-850">
                    <span className="text-xs text-slate-500 font-semibold block mb-1">Average Rate</span>
                    <span className="text-2xl font-extrabold text-indigo-400">${stats.avgPrice}/n</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recharts Visualizations */}
            <div className="lg:col-span-2 flex flex-col md:flex-row gap-6 items-center justify-center min-h-[220px]">
              {chartMounted && stats ? (
                <>
                  {/* Category Average Price Chart */}
                  <div className="w-full md:w-1/2 flex flex-col items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4 block">
                      Avg Rate by Category ($)
                    </span>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.categoryStats}>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                            labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#2dd4bf', fontSize: '11px' }}
                          />
                          <Bar dataKey="avgPrice" radius={[4, 4, 0, 0]}>
                            {stats.categoryStats.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Listings Distribution Pie Chart */}
                  <div className="w-full md:w-1/2 flex flex-col items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4 block">
                      Listing Distribution Count
                    </span>
                    <div className="h-44 w-full flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff', fontSize: '11px' }}
                          />
                          <Pie
                            data={stats.categoryStats}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                          >
                            {stats.categoryStats.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-500 font-bold uppercase">Stays</span>
                        <span className="text-xl font-bold text-white">{stats.totalListings}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center w-full text-slate-500 text-xs font-bold">
                  Loading dashboard charts...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOST CTA / INFO SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500/10 via-indigo-500/5 to-slate-900 border border-slate-900 p-8 sm:p-12">
          <div className="relative max-w-xl z-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-400/10 text-teal-400 border border-teal-400/20 uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5" /> List Your Property
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Earn Revenue Booking Your Accommodation
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              List your beachfront home, cabin, wood loft, or villa and connect with thousands of travel enthusiasts searching for unforgettable stays. Our tools give you control over price, availability dates, and guest specifications.
            </p>
            <div className="pt-2">
              <Link
                href="/items/add"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-md shadow-teal-500/10 hover:-translate-y-0.5 cursor-pointer"
              >
                Become a Host <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 hidden lg:block bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500 via-indigo-600 to-transparent" />
        </div>
      </section>

      {/* SECTION 6: FAQ ACCORDION SECTION */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 text-center mb-10">
          <span className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-widest">
            <HelpCircle className="h-4.5 w-4.5" /> Support Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-900 bg-slate-900/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-100 hover:text-teal-400 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                {openFAQIndex === idx ? <ChevronUp className="h-4 w-4 text-teal-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />}
              </button>
              {openFAQIndex === idx && (
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-900/40 pt-4 animate-slide-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: PREMIUM NEWSLETTER SUBSCRIBE FORM */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-md text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Subscribe to our Luxury Travel Digest
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Get weekly updates featuring exclusive discounts, travel itineraries, and newly pre-screened boutique villas. No spam, cancel anytime.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 py-3 px-4 bg-slate-950/60 border border-slate-850 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors"
            />
            <button
              type="submit"
              disabled={newsletterSubmitting}
              className="py-3 px-6 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/10 cursor-pointer disabled:opacity-60"
            >
              {newsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
