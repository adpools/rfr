import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { Link } from 'wouter';
import { User, Users, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { InstagramIcon, LinkedinIcon } from '../components/common/SocialIcons';

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  department?: string;
  bio?: string;
  image?: string;
  linkedin_url?: string;
  instagram_url?: string;
  sort_order?: number;
}

export const OurTeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (!error && data) {
          // Normalize schema columns
          const formatted: TeamMember[] = data.map((d: any) => ({
            id: d.id,
            name: d.name || d.full_name || 'Team Member',
            designation: d.designation || d.role_title || 'Executive',
            department: d.department,
            bio: d.bio,
            image: d.image || d.profile_image_url,
            linkedin_url: d.linkedin_url,
            instagram_url: d.instagram_url,
            sort_order: d.sort_order ?? d.display_order ?? 0,
          }));
          setMembers(formatted);
        }
      } catch {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <PageWrapper
      title="Our Team — Riyas Fashion Runway (RFR)"
      description="Our Team at Riyas Fashion Runway (RFR) — Curators, producers, and creative directors."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="02"
          category="FOUNDATION & LEADERSHIP"
          title="ABOUT US"
          subtitle="RFR By Riyas — Our creative team and visionaries behind the platform."
        />

        {/* Navigation Tabs: About Riyas & Our Team */}
        <div className="flex flex-wrap items-center gap-3 my-10">
          <Link
            href="/about"
            className="px-6 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 bg-[#111111] text-neutral-400 hover:text-[#C7A46A] hover:border-[#C7A46A]/50 border border-neutral-800 no-underline"
          >
            <User size={14} />
            <span>About Riyas</span>
          </Link>

          <div className="px-6 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 bg-[#C7A46A] text-black font-semibold shadow-[0_0_15px_rgba(199,164,106,0.3)]">
            <Users size={14} />
            <span>Our Team</span>
          </div>
        </div>

        {/* Team Grid */}
        <div className="min-h-[40vh]">
          {loading ? (
            <div className="py-24 text-center font-mono text-xs text-neutral-500 uppercase tracking-widest">
              Loading creative roster...
            </div>
          ) : members.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-[#0F0F0F] border border-neutral-800/80 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#181818] border border-neutral-700 mx-auto flex items-center justify-center text-[#C7A46A]">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-serif text-white uppercase tracking-wide">
                Creative Guild & Executive Council
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                The core leadership, runway choreographers, styling directors, and production crew of RFR by Riyas are currently being curated for the 2026 international showcase season.
              </p>
              <div className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222] border border-neutral-700 text-xs font-mono text-[#C7A46A] tracking-wider uppercase no-underline"
                >
                  <Mail size={13} />
                  <span>Connect With Our Production Desk</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="group p-6 rounded-3xl bg-[#0D0D0D] border border-neutral-850 hover:border-[#C7A46A]/50 transition-all duration-300 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="aspect-[4/5] rounded-2xl bg-[#161616] overflow-hidden border border-neutral-800 relative">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
                          <Users size={32} />
                          <span className="text-[10px] font-mono tracking-widest uppercase">Executive</span>
                        </div>
                      )}
                      {member.department && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] font-mono text-[#C7A46A] uppercase tracking-wider">
                          {member.department}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xl font-serif text-white tracking-wide">{member.name}</h4>
                      <p className="text-xs font-mono text-[#C7A46A] uppercase tracking-wider mt-1">{member.designation}</p>
                    </div>

                    {member.bio && (
                      <p className="text-neutral-400 text-xs font-light leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-850 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-white transition-colors"
                          aria-label="LinkedIn Profile"
                        >
                          <LinkedinIcon size={14} />
                        </a>
                      )}
                      {member.instagram_url && (
                        <a
                          href={member.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-pink-400 transition-colors"
                          aria-label="Instagram Profile"
                        >
                          <InstagramIcon size={14} />
                        </a>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck size={11} className="text-emerald-500" />
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
