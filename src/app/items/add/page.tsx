'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { PlusCircle, Loader2, ArrowLeft, Image as ImageIcon, MapPin, Calendar, DollarSign, Tag, ClipboardList } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CATEGORIES = ['Beachfront', 'Cabins', 'Mansions', 'Treehouses', 'Apartments'];

export default function AddListingPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();

  // Form Fields State
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Beachfront');
  const [dateAvailable, setDateAvailable] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Specs helper (let's allow custom specs or populate default ones based on form)
  const [guestLimit, setGuestLimit] = useState('4 Adults');
  const [beds, setBeds] = useState('2 Bedrooms');
  const [wifi, setWifi] = useState('Complimentary High-speed');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Protect client view if auth check finished and no user exists
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/items/add');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !shortDescription || !description || !price || !location || !category || !dateAvailable) {
      setError('Please fill in all required fields');
      return;
    }

    const cleanPrice = parseFloat(price);
    if (isNaN(cleanPrice) || cleanPrice <= 0) {
      setError('Price must be a valid positive number');
      return;
    }

    setSubmitting(true);
    setError('');

    const specs = [
      { label: 'Guest Limit', value: guestLimit },
      { label: 'Beds', value: beds },
      { label: 'Wi-Fi', value: wifi },
      { label: 'Availability', value: 'Instant Booking' }
    ];

    try {
      const res = await fetch(`${API_BASE}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          shortDescription,
          description,
          price: cleanPrice,
          location,
          category,
          dateAvailable,
          imageUrl,
          priority,
          specs
        }),
        credentials: 'include'
      });

      const data = await res.json();
      setSubmitting(false);

      if (!res.ok) {
        setError(data.error || 'Failed to list property');
        showToast(data.error || 'Failed to create listing', 'error');
      } else {
        showToast('Property listing created successfully!', 'success');
        router.push('/items/manage');
        router.refresh();
      }
    } catch (err: any) {
      setSubmitting(false);
      setError(err.message || 'An error occurred during listing creation');
      showToast('Network error', 'error');
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-2xl space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
            List Your Accommodation
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Publish your property with prices, availabilities, and user filters.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Property Title *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <ClipboardList className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aura Luxury Dome House"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm placeholder-slate-650 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Short Description Summary *
              </label>
              <input
                type="text"
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g. Experience stargazing under a luxury dome overlooking the pristine coast."
                className="block w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm placeholder-slate-650 focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Full Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Detailed Overview Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive breakdown of the stay, rooms, sights, transit and unique benefits..."
                className="block w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm placeholder-slate-650 focus:outline-none focus:border-teal-400 resize-none"
              />
            </div>

            {/* Nightly Price */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Nightly Price ($ USD) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <DollarSign className="h-4.5 w-4.5" />
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="250"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Location (City, Country) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sreemangal, Bangladesh"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm placeholder-slate-650 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Accommodation Category *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Tag className="h-4.5 w-4.5" />
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Available Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Date Available *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="h-4.5 w-4.5" />
                </span>
                <input
                  type="date"
                  required
                  value={dateAvailable}
                  onChange={(e) => setDateAvailable(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Optional Image URL
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <ImageIcon className="h-4.5 w-4.5" />
                </span>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-... (Leave empty for default high-res image)"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            {/* Priority Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Listing Priority
              </label>
              <div className="flex gap-2">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p as any)}
                    className={`flex-1 py-2 px-3 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      priority === p
                        ? 'bg-slate-900 border-teal-500/50 text-teal-400 scale-105'
                        : 'bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom specification info */}
            <div className="md:col-span-2 border-t border-slate-905 pt-4 space-y-4">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                Key Accommodations Specifications
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Guest Limit</label>
                  <input
                    type="text"
                    value={guestLimit}
                    onChange={(e) => setGuestLimit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Beds/Rooms</label>
                  <input
                    type="text"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Wi-Fi Quality</label>
                  <input
                    type="text"
                    value={wifi}
                    onChange={(e) => setWifi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <PlusCircle className="h-4.5 w-4.5" /> Submit Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
