'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

export default function ContactPage() {
  const { showToast } = useNotification();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      showToast('Message sent successfully! Our team will contact you shortly.', 'success');
      setName('');
      setEmail('');
      setMessage('');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
      
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-widest">
          Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact StayFinder
        </h1>
        <p className="text-sm text-slate-400">
          Have queries about accommodations, host listing rules, or booking cancellations? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info blocks */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900/80 flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-teal-400" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Office Address</span>
              <p className="text-sm font-semibold text-slate-200">
                Road 11, Banani, Dhaka, Bangladesh
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900/80 flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-teal-400" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Phone Helpline</span>
              <p className="text-sm font-semibold text-slate-200">
                +880 1712 345678
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900/80 flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-teal-400" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Support Email</span>
              <p className="text-sm font-semibold text-slate-200">
                support@stayfinder.com
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider mb-2">
                Message & Message Details *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry in detail..."
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-teal-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
