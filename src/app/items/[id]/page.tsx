'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  Calendar, 
  User, 
  ArrowLeft, 
  Check, 
  Loader2, 
  Heart,
  MessageSquare,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ListingDetailPage() {
  const { id } = useParams() as { id: string };
  const { showToast } = useNotification();
  const { user } = useAuth();
  const router = useRouter();

  const [listing, setListing] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/items/${id}`, {
          credentials: 'include'
        });
        if (!res.ok) {
          showToast('Property not found', 'error');
          router.push('/explore');
          return;
        }
        const data = await res.json();
        setListing(data.listing);
        setRelated(data.related || data.relatedListings || []);
      } catch (err) {
        console.error(err);
        showToast('Error loading details', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleBook = () => {
    if (!user) {
      showToast('Please sign in to make a booking request.', 'info');
      router.push(`/login?redirect=/items/${id}`);
      return;
    }
    setBookingLoading(true);
    setTimeout(() => {
      showToast('Booking request sent to host! Check your email for verification.', 'success');
      setBookingLoading(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (!listing) return null;

  // Make sure we have multiple images (fallback to listing image if empty array)
  const gallery = listing.images && listing.images.length > 0 ? listing.images : [listing.imageUrl];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
      {/* Back button */}
      <div>
        <Link 
          href="/explore" 
          className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to directory
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {listing.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <strong className="text-slate-100 font-semibold">{listing.rating.toFixed(1)}</strong> ({listing.reviews?.length || 0} reviews)
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-teal-400" />
            {listing.location}
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-full text-xs font-bold uppercase text-teal-400 border border-teal-500/10 tracking-widest shrink-0">
            {listing.category}
          </span>
        </div>
      </div>

      {/* Image Gallery Grid (Multiple Images display) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl overflow-hidden h-[300px] sm:h-[400px]">
        <div className="md:col-span-2 h-full relative overflow-hidden bg-slate-900">
          <img 
            src={gallery[0]} 
            alt={listing.title} 
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500" 
          />
        </div>
        <div className="hidden md:flex flex-col gap-4 h-full">
          <div className="h-1/2 relative overflow-hidden bg-slate-900">
            <img 
              src={gallery[1] || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80'} 
              alt={listing.title} 
              className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500" 
            />
          </div>
          <div className="h-1/2 relative overflow-hidden bg-slate-900">
            <img 
              src={gallery[2] || 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'} 
              alt={listing.title} 
              className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500" 
            />
          </div>
        </div>
      </div>

      {/* Split Details & Booking view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Side (Col 1 & 2): Stay Info, Specs, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Overview Section */}
          <div className="space-y-4 pb-8 border-b border-slate-900">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Description & Overview
            </h2>
            <p className="text-sm leading-relaxed text-slate-400 whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Key Specs Section */}
          <div className="space-y-6 pb-8 border-b border-slate-900">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Key Specifications & Amenities
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {listing.specs?.map((spec: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/30 border border-slate-900/80">
                  <div className="h-6 w-6 rounded bg-teal-500/10 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-teal-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{spec.label}</span>
                    <span className="text-sm font-semibold text-slate-200">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Guest Reviews ({listing.reviews?.length || 0})
              </h2>
              <span className="flex items-center gap-1 text-sm font-bold text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" /> {listing.rating.toFixed(1)} Rating
              </span>
            </div>
            
            {listing.reviews?.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No reviews yet for this listing.</p>
            ) : (
              <div className="space-y-4">
                {listing.reviews?.map((rev: any, idx: number) => (
                  <div key={rev.id || idx} className="p-5 rounded-2xl bg-slate-900/20 border border-slate-900/80 flex gap-4">
                    <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-teal-400 uppercase text-xs shrink-0">
                      {rev.userName.charAt(0)}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-200">{rev.userName}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-xs text-amber-400 font-bold shrink-0 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          ★ {rev.rating}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {rev.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side (Col 3): Sticky Reservation Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-2xl border border-slate-900 bg-slate-900/40 backdrop-blur-sm space-y-6">
            <div className="flex justify-between items-end pb-4 border-b border-slate-900">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Rate Per Night</span>
                <span className="text-3xl font-extrabold text-white">
                  ${listing.price}
                </span>
              </div>
              <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                Available
              </div>
            </div>

            <div className="space-y-4.5">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Availability Start Date</span>
                <div className="flex items-center gap-2 p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-xs text-slate-300 font-semibold">
                  <Calendar className="h-4 w-4 text-teal-400" />
                  {listing.dateAvailable}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Listed By (Host)</span>
                <div className="flex items-center gap-2 p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-xs text-slate-300 font-semibold">
                  <User className="h-4 w-4 text-teal-400" />
                  {listing.ownerName || 'Premium Stay Host'}
                </div>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={bookingLoading}
              className="w-full py-4 bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-300 hover:to-indigo-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {bookingLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-slate-950" /> Instant Reservation
                </>
              )}
            </button>

            <div className="text-[10px] text-slate-500 font-semibold text-center uppercase tracking-wider flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-500 shrink-0" /> Refund Guarantee active
            </div>
          </div>
        </div>
      </div>

      {/* Related listings (Same category) */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-slate-900 space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Similar Boutique Stays
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col h-[400px] rounded-2xl border border-slate-900/80 bg-slate-900/30 hover:border-slate-850 hover:bg-slate-900/50 overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-40 w-full relative overflow-hidden bg-slate-850 shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-[9px] font-bold text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/10 uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>

                <div className="p-4.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 truncate max-w-[150px]">
                        <MapPin className="h-3 w-3 text-teal-400 shrink-0" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-400 font-semibold shrink-0">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug group-hover:text-teal-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-900/60 mt-auto flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Per Night</span>
                      <span className="text-base font-extrabold text-white">
                        ${item.price}
                      </span>
                    </div>
                    <Link
                      href={`/items/${item.id}`}
                      className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
