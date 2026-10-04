import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';

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
    'Model Guild Opportunity',
    'Influencer Guild Opportunity',
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
      id="chapter-13"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between">
          
          {/* Left: Contact Info */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
                <span>13</span>
                <span className="w-12 h-[1px] bg-[#C7A46A]" />
                <span>EXECUTIVE INQUIRY</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight mb-6">
                CONTACT
              </h2>

              <p className="text-sm font-sans font-light text-neutral-400 mb-8 max-w-sm leading-relaxed">
                Connect directly with the RFR executive desk to explore brand campaigns, runway staging, talent representation, or commercial partnerships.
              </p>

              <div className="space-y-4 text-xs font-mono text-[#F4F1EA]">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#C7A46A]" />
                  <span>partnerships@rfrbyriyas.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#C7A46A]" />
                  <span>VIP Inquiries & Production Desk</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#C7A46A]" />
                  <span>Creative Headquarters • South India & Global</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Luxury Form */}
          <div className="w-full lg:w-[55%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="p-8 sm:p-10 rounded-3xl bg-[#0b0b0b] border border-neutral-800"
            >
              {submitted ? (
                <div className="text-center py-10">
                  <CheckCircle2 size={44} className="text-[#C7A46A] mx-auto mb-4" />
                  <h3 className="text-2xl font-serif text-white uppercase mb-2">
                    Inquiry Received
                  </h3>
                  <p className="text-neutral-400 font-light text-xs max-w-sm mx-auto mb-6">
                    Thank you, {formData.name}. The RFR executive desk will review your inquiry and respond promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono tracking-widest text-[#C7A46A] hover:text-white uppercase transition-colors"
                  >
                    SUBMIT ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1.5">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-800 rounded-xl text-white text-xs py-3 px-4 focus:outline-none focus:border-[#C7A46A] transition-colors placeholder-neutral-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1.5">
                        COMPANY / BRAND
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Luxury Couture Ltd"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-800 rounded-xl text-white text-xs py-3 px-4 focus:outline-none focus:border-[#C7A46A] transition-colors placeholder-neutral-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1.5">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@brand.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-800 rounded-xl text-white text-xs py-3 px-4 focus:outline-none focus:border-[#C7A46A] transition-colors placeholder-neutral-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1.5">
                        NATURE OF INQUIRY
                      </label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-800 rounded-xl text-white text-xs py-3 px-4 focus:outline-none focus:border-[#C7A46A] transition-colors cursor-pointer"
                      >
                        {interests.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#050505] text-[#F4F1EA]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1.5">
                      MESSAGE / OBJECTIVES *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Briefly describe your objectives, timelines, or collaboration details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#141414] border border-neutral-800 rounded-xl text-white text-xs py-3 px-4 focus:outline-none focus:border-[#C7A46A] transition-colors placeholder-neutral-600 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-luxury btn-luxury-gold rounded-xl py-3 px-8 text-xs inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <span>{loading ? 'TRANSMITTING...' : 'TRANSMIT INQUIRY'}</span>
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
