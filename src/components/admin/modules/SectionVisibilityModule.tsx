import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { updateSectionVisibility } from '../../../services/cmsService';
import { Sliders, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';

interface SectionVisibilityItem {
  id?: string;
  section_key: string;
  section_name: string;
  is_visible: boolean;
  display_order: number;
}

interface SectionVisibilityModuleProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  isConfigured: boolean;
}

export const SectionVisibilityModule: React.FC<SectionVisibilityModuleProps> = ({ showToast }) => {
  const [sections, setSections] = useState<SectionVisibilityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultSections: SectionVisibilityItem[] = [
    { section_key: 'hero', section_name: 'Hero Banner Showcase (Chapter 00)', is_visible: true, display_order: 1 },
    { section_key: 'timeline', section_name: 'Timeline & Archival Chronicle (Chapter 01)', is_visible: true, display_order: 2 },
    { section_key: 'what_is_rfr', section_name: 'About & What is RFR Ecosystem (Chapter 02-03)', is_visible: true, display_order: 3 },
    { section_key: 'statement', section_name: 'Architectural Statement & Achievements (Chapter 04)', is_visible: true, display_order: 4 },
    { section_key: 'services', section_name: 'Services & Disciplines Matrix (Chapter 05-06)', is_visible: true, display_order: 5 },
    { section_key: 'clients', section_name: 'Channel Partners & Client Marquee (Chapter 07-09)', is_visible: true, display_order: 6 },
    { section_key: 'testimonials', section_name: 'Client & Partner Testimonials', is_visible: true, display_order: 7 },
    { section_key: 'talent', section_name: 'Talent Guilds (Careers, Models, Artists) (Chapter 10)', is_visible: true, display_order: 8 },
    { section_key: 'influencers', section_name: 'Influencer Network & TIC Ecosystem', is_visible: true, display_order: 9 },
    { section_key: 'campaigns', section_name: 'Commercial Campaigns & Gallery Archive (Chapter 11)', is_visible: true, display_order: 10 },
    { section_key: 'press', section_name: 'News & Press Highlights (Chapter 12)', is_visible: true, display_order: 11 },
    { section_key: 'contact', section_name: 'Contact & Executive Inquiry Desk (Chapter 13)', is_visible: true, display_order: 12 },
  ];

  const fetchSections = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setSections(defaultSections);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('section_visibility')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        setSections(defaultSections);
      } else {
        setSections(data);
      }
    } catch {
      setSections(defaultSections);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggle = async (item: SectionVisibilityItem) => {
    const newVisibility = !item.is_visible;
    setSections((prev) =>
      prev.map((s) => (s.section_key === item.section_key ? { ...s, is_visible: newVisibility } : s))
    );

    const res = await updateSectionVisibility(item.section_key, newVisibility);
    if (res.success) {
      showToast(`${item.section_name} set to ${newVisibility ? 'Visible' : 'Hidden'}`);
    } else {
      showToast(res.error || 'Failed to update visibility', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Homepage Section Visibility
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Toggle homepage chapters on or off instantly without modifying source code or redeploying.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs">
          Loading section visibility state...
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((sec) => (
            <div
              key={sec.section_key}
              className="p-4 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${sec.is_visible ? 'bg-emerald-950/40 text-emerald-400' : 'bg-neutral-800 text-neutral-500'}`}>
                  {sec.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </div>
                <div>
                  <div className="text-xs font-mono text-white font-medium">
                    {sec.section_name}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500">
                    Key: <code className="text-[#C7A46A]">{sec.section_key}</code> • Sequence: {sec.display_order}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(sec)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  sec.is_visible ? 'bg-[#C7A46A]' : 'bg-neutral-800'
                }`}
                role="switch"
                aria-checked={sec.is_visible}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                    sec.is_visible ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

