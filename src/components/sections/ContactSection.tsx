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
      id="chapter-contact"
      className="full-viewport-scene bg-[#050505] overflow-hidden flex flex-col justify-center"
    >
      <div className="editorial-container relative z-10 w-full h-full">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center justify-between">
          
          {/* Left: Contact Info */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="text-metadata text-[#B59A62] block mb-6">
                EXECUTIVE INQUIRY
              </span>
              
              <h2 className="text-section-title font-serif font-light text-[#F4F1EA] uppercase leading-[0.9] mb-8">
                LET'S<br />
                CREATE
              </h2>

              <p className="text-body-editorial font-sans font-light text-[#8C8A85] mb-12 max-w-sm uppercase tracking-wide">
                Connect directly with the RFR executive desk to explore bespoke campaigns, runway staging, or commercial partnerships.
              </p>

              <div className="space-y-6 text-sm font-sans tracking-widest text-[#F4F1EA] uppercase">
                <div className="flex items-center gap-4">
                  <Mail size={16} className="text-[#B59A62]" />
                  <span>partnerships@rfr.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin size={16} className="text-[#B59A62]" />
                  <span>Global Headquarters</span>
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
              transition={{ duration: 1, delay: 0.2 }}
              className="p-8 lg:p-12"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={48} className="text-[#B59A62] mx-auto mb-6" />
                  <h3 className="text-2xl font-serif text-[#F4F1EA] uppercase mb-4">
                    Inquiry Received
                  </h3>
                  <p className="text-[#8C8A85] font-light mb-8 max-w-sm mx-auto uppercase tracking-wide text-sm">
                    Thank you, {formData.name}. The RFR executive desk will review your inquiry and respond promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-sans tracking-[0.25em] text-[#B59A62] hover:text-[#F4F1EA] uppercase transition-colors"
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="NAME"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border-b border-[#333] focus:border-[#B59A62] text-[#F4F1EA] text-sm py-3 px-0 focus:outline-none transition-colors placeholder-[#666] font-sans tracking-widest uppercase"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="COMPANY"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-transparent border-b border-[#333] focus:border-[#B59A62] text-[#F4F1EA] text-sm py-3 px-0 focus:outline-none transition-colors placeholder-[#666] font-sans tracking-widest uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="EMAIL"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-transparent border-b border-[#333] focus:border-[#B59A62] text-[#F4F1EA] text-sm py-3 px-0 focus:outline-none transition-colors placeholder-[#666] font-sans tracking-widest uppercase"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full bg-transparent border-b border-[#333] focus:border-[#B59A62] text-[#F4F1EA] text-sm py-3 px-0 focus:outline-none transition-colors placeholder-[#666] font-sans tracking-widest uppercase appearance-none cursor-pointer"
                      >
                        {interests.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#050505] text-[#F4F1EA]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      required
                      rows={1}
                      placeholder="MESSAGE"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-transparent border-b border-[#333] focus:border-[#B59A62] text-[#F4F1EA] text-sm py-3 px-0 focus:outline-none transition-colors placeholder-[#666] font-sans tracking-widest uppercase resize-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-4 text-xs font-sans tracking-[0.25em] uppercase text-[#F4F1EA] hover:text-[#B59A62] transition-colors group"
                    >
                      <span>{loading ? 'SENDING...' : 'TRANSMIT'}</span>
                      <span className="w-8 h-[1px] bg-[#B59A62] group-hover:w-12 transition-all"></span>
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
