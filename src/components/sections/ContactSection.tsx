import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Mail, MapPin } from 'lucide-react';

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
    'OOH Media',
    'Digital Performance Ads',
    'Podcast Guest / Sponsor',
    'Model Roster Opportunity',
    'Influencer Roster Opportunity',
    'Artist / DJ Booking',
    'Careers at RFR',
    'Other Executive Inquiry',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section
      id="chapter-16"
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading & Contact Dossier */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-4">
              <span>16</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>EXECUTIVE INTAKE</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif text-white uppercase tracking-tight leading-[0.95] mb-4">
              LET’S TALK.
            </h2>

            <p className="text-base sm:text-xl font-serif text-[#C7A46A] uppercase tracking-wider mb-6">
              BRANDS. CREATORS. IDEAS. OPPORTUNITIES.
            </p>

            <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed mb-8">
              Connect directly with the RFR executive desk to explore bespoke campaigns, runway staging, talent representation, or commercial partnerships.
            </p>

            <div className="p-6 rounded-2xl bg-[#111111] border border-neutral-800/80 space-y-4 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-[#C7A46A]" />
                <span>partnerships@rfrbyriyas.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={15} className="text-[#C7A46A]" />
                <span>Global Headquarters & Studio Activations</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#111111]/95 border border-[#C7A46A]/30 backdrop-blur-xl">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#C7A46A]/20 border border-[#C7A46A] text-[#C7A46A] flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase mb-2">
                    ENQUIRY TRANSMITTED
                  </h3>
                  <p className="text-neutral-300 text-xs md:text-sm font-light max-w-md mx-auto mb-6">
                    Thank you, {formData.name}. The RFR executive desk will review your inquiry regarding <span className="text-[#C7A46A] font-medium">{formData.interest}</span> and respond promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        interest: 'Brand Collaboration',
                        message: '',
                      });
                    }}
                    className="px-6 py-2 rounded-full border border-neutral-700 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-white hover:border-[#C7A46A] transition-colors"
                  >
                    SUBMIT ANOTHER INQUIRY
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Elena Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                        Company / Brand
                      </label>
                      <input
                        type="text"
                        placeholder="Maison Atelier"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="elena@maison.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                      I'm Interested In *
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-[#C7A46A] transition-colors"
                    >
                      {interests.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#141414] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                      Message / Project Brief *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share details regarding dates, scale, vision or objectives..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    data-cursor="TRANSMIT"
                    className="w-full py-3.5 rounded-xl bg-[#C7A46A] text-[#080808] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl shadow-[#C7A46A]/20 flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <span>TRANSMITTING...</span>
                    ) : (
                      <>
                        <span>SEND ENQUIRY</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>16 / 17 • SCROLL TO FINALE ↓</span>
      </div>
    </section>
  );
};
