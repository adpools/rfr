import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { talentData } from '../data/talentData';
import { CheckCircle2, ArrowLeft, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TalentDetailPageProps {
  customId?: 'careers' | 'models' | 'influencers' | 'artists';
}

export const TalentDetailPage: React.FC<TalentDetailPageProps> = ({ customId }) => {
  const [, params] = useRoute('/assets/:id');
  const id = customId || (params?.id as 'careers' | 'models' | 'influencers' | 'artists') || 'models';

  const portal = talentData.find((t) => t.id === id) || talentData[1];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    socialHandle: '',
    experienceYears: '1-3 Years',
    portfolioUrl: '',
    coverNote: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#C7A46A', '#FAF9F6'],
        });
      } catch {
        // safe confetti fallback
      }
    }, 700);
  };

  return (
    <PageWrapper
      title={`${portal.title} — Talent Portal Application`}
      description={portal.description}
    >
      <div className="editorial-container py-12 md:py-20">
        <Link
          href="/assets"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#C7A46A] hover:text-white transition-colors uppercase mb-8"
        >
          <ArrowLeft size={14} />
          <span>BACK TO ALL TALENT PORTALS</span>
        </Link>

        <SectionHeading
          number="TALENT INTAKE"
          category="RFR NETWORK"
          title={portal.title}
          subtitle={portal.tagline}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-12">
          {/* Left Column: Information & Opportunities */}
          <div className="lg:col-span-6 space-y-8">
            <div className="h-80 md:h-[400px] rounded-3xl overflow-hidden editorial-image-frame border border-neutral-800">
              <img
                src={portal.image}
                alt={portal.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-2xl font-serif text-white uppercase mb-4">ABOUT THIS PORTAL</h3>
              <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed mb-6">
                {portal.description}
              </p>
            </div>

            {/* Opportunities List */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-neutral-800">
              <h4 className="text-base font-serif text-white uppercase tracking-wider mb-4 pb-2 border-b border-neutral-800 flex items-center gap-2">
                <Sparkles size={15} className="text-[#C7A46A]" />
                <span>OPEN OPPORTUNITIES</span>
              </h4>
              <div className="space-y-2.5">
                {portal.opportunities.map((opp) => (
                  <div key={opp} className="flex items-start gap-2.5 text-xs md:text-sm text-neutral-300">
                    <CheckCircle2 size={15} className="text-[#C7A46A] shrink-0 mt-0.5" />
                    <span>{opp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements List */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-neutral-800">
              <h4 className="text-base font-serif text-white uppercase tracking-wider mb-4 pb-2 border-b border-neutral-800">
                APPLICATION CRITERIA
              </h4>
              <ul className="space-y-2.5 list-none text-xs md:text-sm text-neutral-400 font-light">
                {portal.requirements.map((req) => (
                  <li key={req} className="flex items-start gap-2">
                    <span className="text-[#C7A46A] font-mono">✦</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#111111] border border-[#C7A46A]/30 backdrop-blur-xl">
              <h3 className="text-2xl font-serif text-white uppercase mb-2">APPLY TO JOIN</h3>
              <p className="text-xs text-neutral-400 mb-8 font-mono">
                INTAKE PORTAL • {portal.title}
              </p>

              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#C7A46A]/20 border border-[#C7A46A] text-[#C7A46A] flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-2xl font-serif text-white uppercase mb-3">
                    APPLICATION SUBMITTED
                  </h4>
                  <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed mb-6">
                    Thank you, {formData.name}. Your profile has been queued for review by the RFR Talent Guild directors.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        socialHandle: '',
                        experienceYears: '1-3 Years',
                        portfolioUrl: '',
                        coverNote: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-full border border-neutral-700 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-white hover:border-[#C7A46A] transition-colors"
                  >
                    SUBMIT ANOTHER PROFILE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                      Full Legal / Stage Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Milan Roy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="milan@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                        Primary Social Handle (Instagram / TikTok)
                      </label>
                      <input
                        type="text"
                        placeholder="@username"
                        value={formData.socialHandle}
                        onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                        Experience Level
                      </label>
                      <select
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C7A46A] transition-colors"
                      >
                        <option value="Aspiring / Fresh Talent">Aspiring / Fresh Talent</option>
                        <option value="1-3 Years">1–3 Years Experience</option>
                        <option value="3-5 Years">3–5 Years Experience</option>
                        <option value="5+ Years Industry Pro">5+ Years Industry Pro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                      Comp Card / Portfolio / Drive Link *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/... or portfolio link"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-400 mb-1.5">
                      Brief Note & Aspirations
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your style, height/stats (for models), equipment (for photographers/editors), or creative goals..."
                      value={formData.coverNote}
                      onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                      className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-[#C7A46A] text-[#080808] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl shadow-[#C7A46A]/20 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>TRANSMITTING PROFILE...</span>
                    ) : (
                      <>
                        <span>SUBMIT PROFILE APPLICATION</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
