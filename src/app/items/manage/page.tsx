'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { 
  Eye, 
  Trash2, 
  Loader2, 
  MapPin, 
  Calendar, 
  Building,
  Plus,
  ArrowRight,
  Shield,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ManageListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Protect client route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/items/manage');
    }
  }, [user, authLoading, router]);

  // Fetch only listings created by user (unless user is admin, show all listings)
  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/items?limit=100`, {
        credentials: 'include'
      }); // Fetch all
      if (res.ok) {
        const data = await res.json();
        let list = data.listings || [];
        if (user && user.role !== 'admin') {
          list = list.filter((item: any) => item.ownerId === user.id);
        }
        setListings(list);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to retrieve your listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyListings();
    }
  }, [user]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      // Auto-reset confirmation state after 3 seconds
      setTimeout(() => {
        setConfirmDeleteId(prev => prev === id ? null : prev);
      }, 3000);
      return;
    }

    setConfirmDeleteId(null);
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/items/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await res.json();
      setDeletingId(null);

      if (!res.ok) {
        showToast(data.error || 'Failed to delete listing', 'error');
      } else {
        showToast('Property deleted successfully!', 'success');
        // Remove from UI
        setListings(prev => prev.filter(item => item.id !== id));
        router.refresh();
      }
    } catch (err) {
      setDeletingId(null);
      showToast('Network error occurred during deletion', 'error');
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-900">
        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-widest">
            {user.role === 'admin' ? (
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Site-wide Dashboard</span>
            ) : 'Host Control Center'}
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Manage Listings
          </h1>
          <p className="text-sm text-slate-400">
            {user.role === 'admin' 
              ? 'Administrator view: Manage and delete any listed accommodations on the site.' 
              : 'Add, view, and delete accommodations you have registered on the platform.'
            }
          </p>
        </div>
        <div>
          <Link
            href="/items/add"
            className="inline-flex items-center gap-1.5 px-4.5 py-3 text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-md shadow-teal-500/10 cursor-pointer shrink-0"
          >
            <Plus className="h-4.5 w-4.5" /> Add Listing
          </Link>
        </div>
      </div>

      {/* Grid or Table display */}
      {listings.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/15 border border-slate-850 border-dashed space-y-4">
          <p className="text-slate-400 text-sm font-medium">You do not have any registered stays listed.</p>
          <Link
            href="/items/add"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 uppercase tracking-widest transition-colors"
          >
            Create your first listing now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* Responsive Table */
        <div className="overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-slate-350">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-900 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-4 pl-6">Accommodation</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Date Available</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                    {/* Stay details */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3.5 max-w-[300px]">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="h-10 w-14 rounded-lg object-cover bg-slate-850 shrink-0 border border-slate-850"
                        />
                        <div className="flex flex-col gap-0.5 truncate">
                          <span className="font-bold text-white text-sm truncate">{item.title}</span>
                          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">{item.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        {item.location}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <span className="font-bold text-white">${item.price}/night</span>
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-slate-350">
                        <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        {item.dateAvailable}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link
                          href={`/items/${item.id}`}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-850 transition-colors cursor-pointer"
                          title="View Details Page"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </Link>
                        <button
                          disabled={deletingId === item.id}
                          onClick={(e) => handleDelete(e, item.id)}
                          className={`rounded-lg transition-all border cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5 w-24 h-9 shrink-0 ${
                            confirmDeleteId === item.id
                              ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 font-semibold scale-105'
                              : 'bg-rose-950/20 hover:bg-rose-950 text-rose-400 hover:text-white border-rose-900/30'
                          }`}
                          title={confirmDeleteId === item.id ? "Click again to confirm delete" : "Delete Listing"}
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          ) : confirmDeleteId === item.id ? (
                            <span className="text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <AlertCircle className="h-3.5 w-3.5 animate-pulse" /> Confirm?
                            </span>
                          ) : (
                            <Trash2 className="h-4.5 w-4.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
