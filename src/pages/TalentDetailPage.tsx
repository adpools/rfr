import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { talentData } from '../data/talentData';
import { submitContactInquiry, getTalentModels } from '../services/cmsService';
import { CheckCircle2, ArrowLeft, Send, Sparkles, ExternalLink, User } from 'lucide-react';
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
  const [modelsRoster, setModelsRoster] = useState<any[]>([]);

  useEffect(() => {
    if (id === 'models') {
      getTalentModels().then((data) => {
        if (data && data.length > 0) {
          setModelsRoster(data);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const messageContent = [
      `Application Category: ${portal.title}`,
      `Social Handle: ${formData.socialHandle || 'N/A'}`,
      `Experience Level: ${formData.experienceYears}`,
      `Portfolio / Lookbook URL: ${formData.portfolioUrl || 'N/A'}`,
      formData.coverNote ? `Cover Note:\n${formData.coverNote}` : '',
    ].filter(Boolean).join('\n\n');

    await submitContactInquiry({
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service_interest: `Talent Guild Application: ${portal.title}`,
      message: messageContent,
    });

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
                    className="px-5 py-2.5 rounded-2xl border border-neutral-700 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-white hover:border-[#C7A46A] transition-colors"
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

        {/* Verified Roster Showcase (when viewing models) */}
        {id === 'models' && modelsRoster.length > 0 && (
          <div className="mt-20 pt-16 border-t border-neutral-900">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#C7A46A] uppercase block mb-2">
                  RUNWAY & EDITORIAL GUILD
                </span>
                <h3 className="text-3xl font-serif text-white uppercase">
                  Featured Model Roster
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {modelsRoster.length} Active Profiles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {modelsRoster.map((model) => (
                <div
                  key={model.id}
                  className="group rounded-2xl bg-[#111111] border border-neutral-800 overflow-hidden hover:border-[#C7A46A]/60 transition-all flex flex-col"
                >
                  <div className="aspect-[3/4] bg-neutral-900 overflow-hidden relative">
                    {model.headshot_image ? (
                      <img
                        src={model.headshot_image}
                        alt={model.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
                        <User size={36} />
                        <span className="text-[10px] font-mono tracking-widest uppercase">Model</span>
                      </div>
                    )}
                    {model.category && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono uppercase text-[#C7A46A] border border-[#C7A46A]/30">
                        {model.category}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-lg text-white group-hover:text-[#C7A46A] transition-colors">
                        {model.name}
                      </h4>
                      {model.tagline && (
                        <p className="text-xs text-neutral-400 font-light mt-1">
                          {model.tagline}
                        </p>
                      )}
                      {(model.height || model.measurements) && (
                        <div className="mt-3 pt-3 border-t border-neutral-850 flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                          {model.height && <span>Ht: {model.height}</span>}
                          {model.measurements && <span>Stats: {model.measurements}</span>}
                        </div>
                      )}
                    </div>

                    {model.instagram_url && (
                      <div className="mt-4 pt-3 border-t border-neutral-850 flex justify-end">
                        <a
                          href={model.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider"
                        >
                          <span>Instagram</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
