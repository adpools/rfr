import React, { useState, useEffect } from 'react';
import { getWebsiteSettings, updateWebsiteSettings, uploadMediaFile, WebsiteSettings } from '../../../services/cmsService';
import { Globe, Phone, Mail, MapPin, Save, Upload, Image as ImageIcon, Sparkles, Tag } from 'lucide-react';

interface BrandingModuleProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  isConfigured: boolean;
}

export const BrandingModule: React.FC<BrandingModuleProps> = ({ showToast }) => {
  const [settings, setSettings] = useState<WebsiteSettings>({
    site_title: 'RFR BY RIYAS',
    tagline: 'An international luxury fashion, lifestyle and creative ecosystem platform.',
    hero_statement: 'Pioneering luxury runway productions, creative direction, and high-impact talent ecosystems.',
    contact_email: 'management@rfrriyas.com',
    contact_phone: '+91 77365 33346',
    whatsapp_number: '+91 77365 33346',
    office_address: 'Trivandrum • Kochi • Dubai',
    copyright_text: '© 2026 RFR BY RIYAS. All rights reserved.',
    official_logo_url: '/images/final bro.png',
    loading_screen_logo_url: '/images/final bro.png',
    footer_logo_url: '/images/final bro.png',
    favicon_url: '/favicon.ico',
    meta_keywords: ['RFR', 'Riyas Fashion Runway', 'Luxury Fashion', 'Kerala', 'Dubai'],
  });

  const [keywordsStr, setKeywordsStr] = useState<string>('RFR, Riyas Fashion Runway, Luxury Fashion, Kerala, Dubai');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    getWebsiteSettings().then((data) => {
      if (data) {
        setSettings(data);
        if (data.meta_keywords && Array.isArray(data.meta_keywords)) {
          setKeywordsStr(data.meta_keywords.join(', '));
        }
      }
      setLoading(false);
    });
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'official_logo_url' | 'loading_screen_logo_url' | 'footer_logo_url' | 'favicon_url') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const res = await uploadMediaFile(file, 'branding');
    setUploadingLogo(false);
    if (res.success && res.url) {
      setSettings((prev) => ({ ...prev, [field]: res.url }));
      showToast('Brand asset uploaded successfully to Supabase Storage');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const keywordsArray = keywordsStr
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const payload: Partial<WebsiteSettings> = {
      ...settings,
      meta_keywords: keywordsArray,
    };

    const res = await updateWebsiteSettings(payload);
    setSaving(false);
    if (res.success) {
      showToast('Website identity and settings saved to Supabase');
    } else {
      showToast(res.error || 'Failed to update settings', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Website Identity & Global Settings
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Configure site-wide meta titles, executive contact desks, official logos, and architectural statements.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs">
          Loading site configuration...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Branding */}
          <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-neutral-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C7A46A] flex items-center gap-2">
              <Globe size={14} />
              <span>Core Brand Identity</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Global Site Title
                </label>
                <input
                  type="text"
                  required
                  value={settings.site_title}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Brand Tagline / Descriptor
                </label>
                <input
                  type="text"
                  value={settings.tagline || ''}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  placeholder="e.g. An international luxury fashion, lifestyle and creative ecosystem platform."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Hero Architectural Statement
                </label>
                <textarea
                  rows={3}
                  value={settings.hero_statement || ''}
                  onChange={(e) => setSettings({ ...settings, hero_statement: e.target.value })}
                  placeholder="Editorial manifesto displayed across signature placements..."
                  className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Headquarters / Hub Locations
                  </label>
                  <input
                    type="text"
                    value={settings.office_address || ''}
                    onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Footer Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={settings.copyright_text || ''}
                    onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Official Brand Assets & Logos */}
          <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-neutral-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C7A46A] flex items-center gap-2">
              <ImageIcon size={14} />
              <span>Official Brand Logos & Assets</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Official Header Logo URL / Asset
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.official_logo_url || ''}
                    onChange={(e) => setSettings({ ...settings, official_logo_url: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-mono cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload size={13} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'official_logo_url')}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                  </label>
                </div>
                {settings.official_logo_url && (
                  <div className="mt-2 p-2 bg-black rounded-lg inline-block border border-neutral-800">
                    <img src={settings.official_logo_url} alt="Header Logo" className="h-8 object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Footer Logo Asset
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.footer_logo_url || ''}
                    onChange={(e) => setSettings({ ...settings, footer_logo_url: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-mono cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload size={13} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'footer_logo_url')}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Loading Screen Emblem Asset
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.loading_screen_logo_url || ''}
                    onChange={(e) => setSettings({ ...settings, loading_screen_logo_url: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-mono cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload size={13} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'loading_screen_logo_url')}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Browser Favicon URL
                </label>
                <input
                  type="text"
                  value={settings.favicon_url || ''}
                  onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Executive Desks */}
          <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-neutral-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C7A46A] flex items-center gap-2">
              <Phone size={14} />
              <span>Executive Desks & Hotlines</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Management Email Desk
                </label>
                <input
                  type="email"
                  required
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Official Phone Hotline
                </label>
                <input
                  type="text"
                  value={settings.contact_phone || ''}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  WhatsApp Concierge Number
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Meta Keywords / SEO */}
          <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-neutral-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C7A46A] flex items-center gap-2">
              <Tag size={14} />
              <span>Search Engine Optimization & Meta Keywords</span>
            </h3>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Global Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywordsStr}
                onChange={(e) => setKeywordsStr(e.target.value)}
                placeholder="RFR, Riyas Fashion Runway, Luxury Fashion, Kerala, Dubai"
                className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C7A46A]/10 transition-all"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Global Settings'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
