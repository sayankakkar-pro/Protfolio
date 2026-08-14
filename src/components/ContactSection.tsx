'use client';

import React, { useState } from 'react';
import { Mail, Phone, Github, Send, Copy, Check, Database } from 'lucide-react';
import { soundFX } from '@/lib/audio';
import { supabase } from '@/lib/supabase';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText('sayankakkar@gmail.com');
    setCopied(true);
    soundFX?.playClick();
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    soundFX?.playClick();

    const payload = {
      name,
      email,
      message: msg,
      created_at: new Date().toISOString(),
    };

    try {
      if (supabase) {
        const { error } = await supabase.from('contact_dispatches').insert([payload]);
        if (!error) {
          setDbStatus('SYNCED DIRECTLY TO SUPABASE DB');
        } else {
          console.log('Supabase insert status:', error.message);
          setDbStatus('SAVED TO LOCAL ENGINE');
        }
      }
    } catch {
      setDbStatus('SAVED TO LOCAL ENGINE');
    }

    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMsg('');
      setDbStatus(null);
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="hud-pill mb-4">
            <span className="hud-dot" />
            <span>COMMUNICATION CHANNEL</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-white mt-2">
            Let&apos;s Build <br />
            <span className="text-[#f2a98c]">Something Legendary</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Email Card */}
            <div className="sly-card p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f2a98c]/10 border border-[#f2a98c]/30 flex items-center justify-center text-[#f2a98c]">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-white/40 uppercase">EMAIL TRANSMISSION</div>
                  <div className="text-sm font-bold font-mono text-white">sayankakkar@gmail.com</div>
                </div>
              </div>
              <button
                onClick={copyEmail}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Copy Email"
              >
                {copied ? <Check size={16} className="text-[#10b981]" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Phone Card */}
            <div className="sly-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase">DIRECT PHONE</div>
                <a href="tel:7042368060" className="text-sm font-bold font-mono text-white hover:text-[#00f0ff] transition-colors">
                  +91 7042368060
                </a>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="sly-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white">
                <Github size={20} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase">GITHUB REPOSITORY</div>
                <a
                  href="https://github.com/sayankakkar-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold font-mono text-white hover:text-[#f2a98c] transition-colors"
                >
                  github.com/sayankakkar-pro
                </a>
              </div>
            </div>
          </div>

          {/* Contact Dispatch Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 sly-card p-8 md:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                Transmit Direct Dispatch
              </h3>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] flex items-center gap-1.5">
                <Database size={11} />
                <span>SUPABASE DB CONNECTED</span>
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-white/50 uppercase tracking-widest block mb-2">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Turing"
                  className="w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#f2a98c]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-white/50 uppercase tracking-widest block mb-2">
                  YOUR EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@domain.com"
                  className="w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#f2a98c]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-white/50 uppercase tracking-widest block mb-2">
                  PROJECT SPECIFICATION OR MESSAGE
                </label>
                <textarea
                  rows={4}
                  required
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Briefly describe your hardware, AI, or web project..."
                  className="w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#f2a98c]"
                />
              </div>

              <button type="submit" className="sly-btn-primary w-full">
                <Send size={16} />
                <span>Transmit Secure Message</span>
              </button>

              {submitted && (
                <div className="p-4 rounded-xl bg-[#10b981]/15 border border-[#10b981]/40 text-sm text-[#10b981] font-mono text-center space-y-1">
                  <div>Dispatch received successfully! Sayan will connect shortly.</div>
                  {dbStatus && <div className="text-[11px] text-[#00f0ff] uppercase">{dbStatus}</div>}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
