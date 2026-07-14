'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  ArrowUpDown,
  RefreshCw,
  Map
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CATEGORIES = ['All', 'Beachfront', 'Cabins', 'Mansions', 'Treehouses', 'Apartments'];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useNotification();

  // Search parameters from URL (if any)
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || 'All';

  // Filters State
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(600);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);

  // Listings state
  const [listings, setListings] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 1, currentPage: 1, limit: 4 });
  const [loading, setLoading] = useState(true);

  // Trigger data fetch on filter change
  const fetchListings = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        search,
        location,
        category,
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
        minRating: minRating.toString(),
        sortBy,
        page: page.toString(),
        limit: '4' // Display 4 cards per row
      });

      const res = await fetch(`${API_BASE}/api/items?${query.toString()}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings);
        // Correct pagination parsing (Express returns pages, currentPage)
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.pages,
          totalItems: data.total,
          limit: 4
        });
      }
    } catch (err) {
      console.error('Failed to load listings', err);
      showToast('Error loading accommodations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category, minPrice, maxPrice, minRating, sortBy, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchListings();
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setCategory('All');
    setMinPrice(0);
    setMaxPrice(600);
    setMinRating(0);
    setSortBy('createdAt');
    setPage(1);
    showToast('Filters cleared', 'info');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col gap-4 text-center sm:text-left mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Explore Premium Stays
        </h1>
        <p className="text-sm text-slate-400">
          Find your dream getaway by applying filters, sorting parameters, and keywords.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Interactive Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 bg-slate-900/30 p-6 rounded-2xl border border-slate-900/80 backdrop-blur-sm self-start">
          <div className="flex items-center justify-between pb-4 border-b border-slate-900">
            <span className="flex items-center gap-2 font-bold text-sm text-white uppercase tracking-wider">
              <SlidersHorizontal className="h-4.5 w-4.5 text-teal-400" /> Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Location filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              placeholder="e.g. Dhaka, Sajek"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-850 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Stay Type
            </label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-850 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-teal-400"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Max Nightly Rate</span>
              <span className="text-teal-400">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="600"
              step="10"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(parseInt(e.target.value, 10)); setPage(1); }}
              className="w-full accent-teal-400 cursor-pointer bg-slate-800 rounded-lg appearance-none h-1.5"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>$0</span>
              <span>$600+</span>
            </div>
          </div>

          {/* Rating filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => { setMinRating(parseFloat(e.target.value)); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-850 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-teal-400"
            >
              <option value="0">Any rating</option>
              <option value="4.5">★ 4.5 & up</option>
              <option value="4.8">★ 4.8 & up</option>
              <option value="4.9">★ 4.9 & up</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-850 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-teal-400"
            >
              <option value="createdAt">Date listed (newest)</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratingDesc">Guest Rating</option>
            </select>
          </div>
        </div>

        {/* Right Side: Search and Results Card Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Custom Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stays matching titles, tags, summaries..."
                className="w-full pl-10 pr-4 py-3 bg-slate-900/40 border border-slate-800 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-teal-500/10 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Results count info */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <span className="text-slate-200 font-semibold">{listings.length}</span> of{' '}
              <span className="text-slate-200 font-semibold">{pagination.totalItems}</span> matching stays
            </span>
          </div>

          {/* Core Card Section (4 cards per row in desktop grid) */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col h-[420px] rounded-2xl border border-slate-900 bg-slate-900/20 overflow-hidden">
                  <div className="h-44 bg-slate-850 w-full" />
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="h-4 w-1/3 bg-slate-850 rounded" />
                    <div className="h-6 w-full bg-slate-850 rounded" />
                    <div className="h-10 w-full bg-slate-850 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-slate-900/20 border border-slate-850 border-dashed">
              <p className="text-slate-400 text-sm font-medium">
                No accommodations match the selected filters. Try broadening your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col h-[420px] rounded-2xl border border-slate-900/80 bg-slate-900/30 hover:border-slate-850 hover:bg-slate-900/50 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
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
                        <span className="flex items-center gap-1 truncate max-w-[130px]">
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
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="pt-6 border-t border-slate-900 flex items-center justify-between">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-850 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/20 hover:bg-slate-900/60 transition-all cursor-pointer disabled:opacity-40 disabled:hover:text-slate-300 disabled:hover:bg-slate-900/20"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <span className="text-xs font-semibold text-slate-400">
                Page <span className="text-slate-200 font-bold">{page}</span> of{' '}
                <span className="text-slate-200 font-bold">{pagination.totalPages}</span>
              </span>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-850 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/20 hover:bg-slate-900/60 transition-all cursor-pointer disabled:opacity-40 disabled:hover:text-slate-300 disabled:hover:bg-slate-900/20"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[50vh] text-slate-400 text-sm font-semibold">
        Loading explore directory...
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
