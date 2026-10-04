import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    interest: 'Brand Collaboration',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const interests = [
    'Brand Collaboration',
    'Fashion Runway & Event',
    'Influencer Campaign',
    'UGC & Ads Studio',
    'Commercial Advertising',
    'Podcast Guest / Sponsor',
    'Model / Influencer Guild',
    'Artist / DJ Booking',
    'Careers at RFR',
    'Executive Inquiry',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section
      id="chapter-13"
      className="bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-24 md:py-32"
    >
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#C7A46A]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="editorial-container relative z-10 w-full my-auto max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start justify-between">
          
          {/* Left: Contact Info */}
          <div className="w-full lg:w-[45%] flex flex-col justify-start pt-4 sticky top-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[11px] sm:text-xs font-serif font-bold text-[#C7A46A]">13</span>
                <div className="w-16 sm:w-24 h-[1px] bg-[#C7A46A]/50" />
                <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-[#C7A46A] uppercase">
                  EXECUTIVE INQUIRY
                </span>
              </div>
              
              <h2 className="text-6xl sm:text-7xl lg:text-[110px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl">
                CONTACT
              </h2>

              <p className="text-sm sm:text-[15px] font-serif font-light text-[#A09D96] leading-relaxed max-w-md tracking-wide mb-12">
                Connect directly with the RFR executive desk to explore brand campaigns, runway staging, talent representation, or commercial partnerships.
              </p>

              <div className="space-y-6">
                <div className="group border-l border-neutral-800 pl-6 hover:border-[#C7A46A] transition-colors duration-500">
                  <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-[0.2em] block mb-2 group-hover:text-[#C7A46A] transition-colors">Direct Desk</span>
                  <a href="mailto:partnerships@rfrbyriyas.com" className="text-lg font-serif text-[#F4F1EA] hover:text-white transition-colors">
                    partnerships@rfrbyriyas.com
                  </a>
                </div>

                <div className="group border-l border-neutral-800 pl-6 hover:border-[#C7A46A] transition-colors duration-500">
                  <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-[0.2em] block mb-2 group-hover:text-[#C7A46A] transition-colors">Global Headquarters</span>
                  <span className="text-lg font-serif text-[#A09D96] group-hover:text-[#F4F1EA] transition-colors">
                    South India & Worldwide
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Luxury Form */}
          <div className="w-full lg:w-[55%]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 sm:p-12 rounded-[24px] bg-[#0a0a0a]/80 backdrop-blur-md border border-neutral-900 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#C7A46A]/5 to-transparent pointer-events-none" />

              <div className="relative z-10">
                {submitted ? (
                  <div className="text-center py-16 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#111111] border border-[#C7A46A]/30 flex items-center justify-center mb-6 text-[#C7A46A]">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-3xl font-serif text-[#F4F1EA] uppercase mb-4 tracking-wide">
                      Inquiry Received
                    </h3>
                    <p className="text-[#A09D96] font-light text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                      Thank you, {formData.name}. The RFR executive desk will review your submission and respond promptly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="group flex items-center gap-4 px-7 py-3.5 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#0a0a0a] hover:bg-[#C7A46A]/10 transition-all duration-300"
                    >
                      <span className="text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                        SUBMIT ANOTHER
                      </span>
                      <div className="w-7 h-7 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
                        <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
                      </div>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="relative group">
                        <input
                          type="text"
                          required
                          placeholder="Your Name *"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-transparent border-b border-neutral-800 text-[#F4F1EA] text-sm py-3 focus:outline-none focus:border-[#C7A46A] transition-colors placeholder-neutral-600 rounded-none"
                        />
                      </div>
                      <div className="relative group">
                        <input
                          type="text"
                          placeholder="Company / Brand"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-transparent border-b border-neutral-800 text-[#F4F1EA] text-sm py-3 focus:outline-none focus:border-[#C7A46A] transition-colors placeholder-neutral-600 rounded-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="relative group">
                        <input
                          type="email"
                          required
                          placeholder="Email Address *"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-transparent border-b border-neutral-800 text-[#F4F1EA] text-sm py-3 focus:outline-none focus:border-[#C7A46A] transition-colors placeholder-neutral-600 rounded-none"
                        />
                      </div>
                      <div className="relative group">
                        <select
                          value={formData.interest}
                          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                          className="w-full bg-transparent border-b border-neutral-800 text-[#F4F1EA] text-sm py-3 focus:outline-none focus:border-[#C7A46A] transition-colors cursor-pointer appearance-none rounded-none"
                        >
                          <option value="" disabled className="text-neutral-600 bg-[#050505]">Nature of Inquiry *</option>
                          {interests.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0a0a0a] text-[#F4F1EA]">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-600 group-hover:text-[#C7A46A] transition-colors">
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <textarea
                        required
                        rows={3}
                        placeholder="Message / Objectives *"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-transparent border-b border-neutral-800 text-[#F4F1EA] text-sm py-3 focus:outline-none focus:border-[#C7A46A] transition-colors placeholder-neutral-600 resize-none rounded-none"
                      />
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group flex items-center gap-4 px-8 py-4 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#050505] hover:bg-[#C7A46A]/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                      >
                        <span className="text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                          {loading ? 'TRANSMITTING...' : 'TRANSMIT INQUIRY'}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
                          <Send size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
                        </div>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
