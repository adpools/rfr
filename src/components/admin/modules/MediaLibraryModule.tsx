import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { 
  Upload, Trash2, Copy, Check, ExternalLink, Image as ImageIcon, 
  Video, FileText, Search, RefreshCw, FolderSync, ShieldCheck, 
  X, CheckCircle2, AlertCircle, ArrowUpRight,
  Maximize2, Play
} from 'lucide-react';
import { useMediaViewer } from '../../../context/MediaViewerContext';

interface StorageFile {
  name: string;
  id?: string;
  created_at?: string;
  updated_at?: string;
  last_accessed_at?: string;
  metadata?: any;
}

interface MediaLibraryModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

// 39 Canonical assets mapped from local public/ directory to exact root paths in rfr-media
const CANONICAL_ASSETS = [
  // 1. Press (18 files)
  { local: '/news and press/WhatsApp Image 2026-11-06 at 10.53.08 AM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-06 at 10.53.08 AM (1).jpeg', mime: 'image/jpeg', label: 'Success Kerala Feature Profile' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.41.04 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.04 PM.jpeg', mime: 'image/jpeg', label: 'Asianet News Broadcast Still' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.42.10 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.10 PM (1).jpeg', mime: 'image/jpeg', label: 'Kerala Kaumudi Print Archive' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.41.05 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.05 PM (1).jpeg', mime: 'image/jpeg', label: 'Metro Vartha Daily Newsprint' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.42.11 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.11 PM.jpeg', mime: 'image/jpeg', label: 'Chandrika Daily Newsprint' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.41.06 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.06 PM (1).jpeg', mime: 'image/jpeg', label: 'Press Clipping 06 (1)' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.41.04 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.04 PM (1).jpeg', mime: 'image/jpeg', label: 'Press Clipping 04 (1)' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.42.08 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.08 PM (1).jpeg', mime: 'image/jpeg', label: 'Press Clipping 08 (1)' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.41.05 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.05 PM.jpeg', mime: 'image/jpeg', label: 'Press Clipping 05' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.41.06 PM (2).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.06 PM (2).jpeg', mime: 'image/jpeg', label: 'Press Clipping 06 (2)' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.41.07 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.07 PM (1).jpeg', mime: 'image/jpeg', label: 'Press Clipping 07 (1)' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.41.07 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.07 PM.jpeg', mime: 'image/jpeg', label: 'Press Clipping 07' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.41.08 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.08 PM.jpeg', mime: 'image/jpeg', label: 'Press Clipping 08' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.41.09 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.09 PM.jpeg', mime: 'image/jpeg', label: 'Press Clipping 09' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.42.11 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.11 PM (1).jpeg', mime: 'image/jpeg', label: 'Press Clipping 11 (1)' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.42.11 PM (2).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.11 PM (2).jpeg', mime: 'image/jpeg', label: 'Press Clipping 11 (2)' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.42.14 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.14 PM.jpeg', mime: 'image/jpeg', label: 'Press Clipping 14' },
  { local: '/news and press/WhatsApp Image 2026-11-04 at 9.46.07 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.46.07 PM.jpeg', mime: 'image/jpeg', label: 'Press Clipping 46' },

  // 2. Clients (6 files)
  { local: '/images/clients/citroen.png', remote: 'clients/citroen.png', mime: 'image/png', label: 'Citroën Logo' },
  { local: '/images/clients/jeep.png', remote: 'clients/jeep.png', mime: 'image/png', label: 'Jeep Logo' },
  { local: '/images/clients/skoda.png', remote: 'clients/skoda.png', mime: 'image/png', label: 'Škoda Logo' },
  { local: '/images/clients/rb.png', remote: 'clients/rb.png', mime: 'image/png', label: 'R&B Logo' },
  { local: '/images/clients/max.png', remote: 'clients/max.png', mime: 'image/png', label: 'Max Fashion Logo' },
  { local: '/images/clients/tic.png', remote: 'clients/tic.png', mime: 'image/png', label: 'TIC Collective Logo' },

  // 3. Influencers (7 canonical files)
  { local: '/images/influencers/deepamol.jpg', remote: 'influencers/deepamol.jpg', mime: 'image/jpeg', label: 'Deepamol Portrait' },
  { local: '/images/influencers/malavika.jpg', remote: 'influencers/malavika.jpg', mime: 'image/jpeg', label: 'Malavika Portrait' },
  { local: '/images/influencers/rhea-george.jpg', remote: 'influencers/rhea-george.jpg', mime: 'image/jpeg', label: 'Rhea George Portrait' },
  { local: '/images/influencers/rudiya.jpg', remote: 'influencers/rudiya.jpg', mime: 'image/jpeg', label: 'Rudiya Canonical (863 KB)' },
  { local: '/images/influencers/sahalini-sharma.jpg', remote: 'influencers/sahalini-sharma.jpg', mime: 'image/jpeg', label: 'Sahalini Sharma Canonical (283 KB)' },
  { local: '/images/influencers/shikha-santhosh.jpg', remote: 'influencers/shikha-santhosh.jpg', mime: 'image/jpeg', label: 'Shikha Santhosh Portrait' },
  { local: '/images/influencers/thara-anitha-mathew.jpg', remote: 'influencers/thara-anitha-mathew.jpg', mime: 'image/jpeg', label: 'Thara Anitha Mathew Portrait' },

  // 4. Portfolio (4 files)
  { local: '/images/thumbnails/17xhWbUtxJePM8igOO7VADLDfiqcG6S04.jpg', remote: 'portfolio/17xhWbUtxJePM8igOO7VADLDfiqcG6S04.jpg', mime: 'image/jpeg', label: 'Citroën Campaign Production Still' },
  { local: '/images/thumbnails/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV.jpg', remote: 'portfolio/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV.jpg', mime: 'image/jpeg', label: 'Build Hub Campaign Production Still' },
  { local: '/images/thumbnails/1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_.jpg', remote: 'portfolio/1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_.jpg', mime: 'image/jpeg', label: 'Ather Scooter Production Still' },
  { local: '/images/thumbnails/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw.jpg', remote: 'portfolio/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw.jpg', mime: 'image/jpeg', label: 'Dandya Gala Production Still' },

  // 5. Branding (4 files)
  { local: '/images/riyas.jpg', remote: 'branding/riyas.jpg', mime: 'image/jpeg', label: 'Adv. Riyas Founder Portrait' },
  { local: '/images/final bro.png', remote: 'branding/final bro.png', mime: 'image/png', label: 'Official Primary Brand Mark' },
  { local: '/images/pothys.png', remote: 'branding/pothys.png', mime: 'image/png', label: 'Pothys Swarnamahal Identity' },
  { local: '/favicon.png', remote: 'branding/favicon.png', mime: 'image/png', label: 'Website Favicon (32x32 PNG)' },
];

export const MediaLibraryModule: React.FC<MediaLibraryModuleProps> = ({ showToast }) => {
  const { openImage, openVideo } = useMediaViewer();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Sync Modal State
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncLogs, setSyncLogs] = useState<{ path: string; status: 'success' | 'skipped' | 'error'; msg: string }[]>([]);
  const [verificationMap, setVerificationMap] = useState<Record<string, boolean>>({});
  const [verifying, setVerifying] = useState(false);

  // Updated folders filter to directly inspect verified root paths
  const folders = ['all', 'press', 'clients', 'portfolio', 'influencers', 'branding', 'general', 'models', 'timeline'];

  const sampleStaticMedia = [
    { name: 'rfr-hero-cinematic.mp4', path: 'banners/hero.mp4', size: '12.4 MB', type: 'video' },
    { name: 'koottam-s1-cover.jpg', path: 'timeline/koottam.jpg', size: '2.1 MB', type: 'image' },
    { name: 'manyavar-editorial.jpg', path: 'timeline/manyavar.jpg', size: '1.8 MB', type: 'image' },
    { name: 'shikha-portrait.jpg', path: 'talent/shikha.jpg', size: '1.4 MB', type: 'image' },
    { name: 'skoda-logo.png', path: 'projects/skoda.png', size: '420 KB', type: 'image' },
  ];

  const fetchFiles = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setFiles(sampleStaticMedia);
      setLoading(false);
      return;
    }

    try {
      const folderPath = selectedFolder === 'all' ? '' : selectedFolder;
      const { data, error } = await supabase.storage.from('rfr-media').list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        setFiles([]);
      } else {
        const enriched = data.map((f) => {
          const fullPath = folderPath ? `${folderPath}/${f.name}` : f.name;
          const { data: { publicUrl } } = supabase.storage.from('rfr-media').getPublicUrl(fullPath);
          return {
            ...f,
            path: fullPath,
            publicUrl,
            type: f.name.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image',
          };
        });
        setFiles(enriched);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to list media files', 'error');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedFolder]);

  // Live Verification against Supabase Storage
  const runLiveVerification = async () => {
    setVerifying(true);
    const targetFolders = ['press', 'clients', 'portfolio', 'influencers', 'branding'];
    const liveMap: Record<string, boolean> = {};

    try {
      for (const f of targetFolders) {
        const { data } = await supabase.storage.from('rfr-media').list(f, { limit: 100 });
        if (data) {
          for (const item of data) {
            if (item.id) {
              liveMap[`${f}/${item.name}`] = true;
            }
          }
        }
      }
      setVerificationMap(liveMap);
    } catch (err: any) {
      showToast('Verification check failed: ' + err.message, 'error');
    } finally {
      setVerifying(false);
    }
  };

  // Safe Non-Destructive Synchronizer via Authenticated Admin Session
  const handleSyncCanonicalAssets = async () => {
    setSyncing(true);
    setSyncLogs([]);
    let successCount = 0;
    let skippedCount = 0;
    let failCount = 0;

    for (let i = 0; i < CANONICAL_ASSETS.length; i++) {
      const item = CANONICAL_ASSETS[i];
      setSyncProgress(Math.round(((i + 1) / CANONICAL_ASSETS.length) * 100));

      try {
        // Fetch local binary blob from Vite dev server
        const res = await fetch(encodeURI(item.local));
        if (!res.ok) {
          throw new Error(`Local file not reachable (${res.statusText})`);
        }
        const blob = await res.blob();

        // Upload to root folder with upsert: false (NEVER overwrite or delete)
        const { error: uploadError } = await supabase.storage
          .from('rfr-media')
          .upload(item.remote, blob, {
            contentType: item.mime,
            upsert: false,
          });

        if (uploadError) {
          if (uploadError.message?.includes('already exists') || uploadError.message?.includes('Duplicate')) {
            setSyncLogs((prev) => [
              ...prev,
              { path: item.remote, status: 'skipped', msg: 'Preserved (Already exists in storage)' },
            ]);
            skippedCount++;
          } else {
            setSyncLogs((prev) => [
              ...prev,
              { path: item.remote, status: 'error', msg: uploadError.message },
            ]);
            failCount++;
          }
        } else {
          setSyncLogs((prev) => [
            ...prev,
            { path: item.remote, status: 'success', msg: 'Uploaded directly to root' },
          ]);
          successCount++;
        }
      } catch (err: any) {
        setSyncLogs((prev) => [
          ...prev,
          { path: item.remote, status: 'error', msg: err.message || 'Transfer failed' },
        ]);
        failCount++;
      }
    }

    setSyncing(false);
    showToast(
      `Sync Complete: ${successCount} uploaded, ${skippedCount} preserved, ${failCount} failed`,
      failCount === 0 ? 'success' : 'info'
    );
    await runLiveVerification();
    fetchFiles();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    const targetFolder = selectedFolder === 'all' ? 'general' : selectedFolder;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const res = await uploadMediaFile(file, targetFolder);
      if (!res.success) {
        showToast(res.error || `Failed to upload ${file.name}`, 'error');
      }
    }

    setUploading(false);
    showToast('Media upload completed');
    fetchFiles();
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('Public asset URL copied to clipboard', 'info');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (path: string) => {
    if (!confirm(`Are you sure you want to permanently delete this media asset?`)) return;
    try {
      const { error } = await supabase.storage.from('rfr-media').remove([path]);
      if (error) throw error;
      showToast('Asset deleted from storage');
      fetchFiles();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Media Library & Storage
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Centralized Supabase Storage repository for video lookbooks, portraits, and brand assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Synchronize 39 Canonical Assets to Root */}
          <button
            onClick={() => {
              setShowSyncModal(true);
              runLiveVerification();
            }}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#C7A46A] border border-[#C7A46A]/40 font-mono text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
          >
            <FolderSync size={15} />
            <span>Sync Canonical Assets (Root)</span>
          </button>

          <label className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C7A46A]/10">
            <Upload size={15} />
            <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/webm"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Folder Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFolder(f)}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedFolder === f
                ? 'bg-[#C7A46A] text-black font-bold shadow-md'
                : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {f === 'all' ? 'All Objects' : `/${f}`}
          </button>
        ))}
      </div>

      {/* Storage Security Badge */}
      <div className="p-4 rounded-xl bg-[#101010] border border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Storage Bucket: public.rfr-media • MIME Guard Active • RLS Protected</span>
        </div>
        <button
          onClick={fetchFiles}
          className="p-1.5 rounded-lg hover:bg-[#222] text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
        >
          <RefreshCw size={12} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs">
          Scanning media storage...
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No files in this folder.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file, idx) => {
            const url = file.publicUrl || file.path;
            const isCopied = copiedUrl === url;
            return (
              <div
                key={file.path || idx}
                className="group relative rounded-2xl bg-[#0D0D0D] border border-neutral-800 overflow-hidden hover:border-[#C7A46A]/50 transition-all flex flex-col"
              >
                {/* Thumbnail Preview */}
                <div 
                  onClick={() => {
                    if (file.type === 'video') {
                      openVideo({
                        src: url,
                        title: file.name,
                        subtitle: file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : undefined,
                        badge: 'STORAGE MEDIA',
                      });
                    } else {
                      openImage({
                        src: url,
                        title: file.name,
                        subtitle: file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : undefined,
                      });
                    }
                  }}
                  className="w-full aspect-square bg-[#151515] relative flex items-center justify-center overflow-hidden cursor-pointer group/thumb"
                  title="Click to preview media in universal viewer"
                >
                  {file.type === 'video' ? (
                    <div className="flex flex-col items-center gap-2 text-neutral-400 group-hover/thumb:text-[#C7A46A] transition-colors">
                      <Video size={32} className="text-[#C7A46A]" />
                      <span className="text-[10px] font-mono uppercase">Video</span>
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={file.name}
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                      }}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (file.type === 'video') {
                          openVideo({
                            src: url,
                            title: file.name,
                            subtitle: file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : undefined,
                            badge: 'STORAGE MEDIA',
                          });
                        } else {
                          openImage({
                            src: url,
                            title: file.name,
                            subtitle: file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : undefined,
                          });
                        }
                      }}
                      title={file.type === 'video' ? 'Play Video' : 'View High-Res Image'}
                      className="p-2 rounded-xl bg-[#1C1C1C] hover:bg-[#C7A46A] hover:text-black text-white transition-colors"
                    >
                      {file.type === 'video' ? <Play size={14} className="fill-current" /> : <Maximize2 size={14} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(url);
                      }}
                      title="Copy Public URL"
                      className="p-2 rounded-xl bg-[#1C1C1C] hover:bg-[#C7A46A] hover:text-black text-white transition-colors"
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Open in new tab"
                      className="p-2 rounded-xl bg-[#1C1C1C] hover:bg-neutral-800 text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.path);
                      }}
                      title="Delete Asset"
                      className="p-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Metadata footer */}
                <div className="p-3 border-t border-neutral-850 space-y-1">
                  <div className="text-xs font-mono text-white truncate" title={file.name}>
                    {file.name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>{file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : 'file'}</span>
                    <span className="uppercase">{file.type}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SYNC CANONICAL ASSETS MODAL                                               */}
      {/* ========================================================================= */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-[#C7A46A]/40 rounded-2xl w-full max-w-4xl p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#C7A46A] text-xs font-mono font-bold uppercase tracking-wider">
                  <ShieldCheck size={16} />
                  <span>Authenticated Super-Admin Workflow</span>
                </div>
                <h2 className="text-xl font-serif text-white uppercase tracking-wide">
                  Sync 39 Canonical Assets to Root Storage
                </h2>
                <p className="text-xs text-neutral-400 font-light">
                  Transfers verified local media directly into root folders (<code className="text-neutral-300">press/</code>, <code className="text-neutral-300">clients/</code>, <code className="text-neutral-300">portfolio/</code>, <code className="text-neutral-300">influencers/</code>, <code className="text-neutral-300">branding/</code>) using your active admin session.
                </p>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Safety & Preservation Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={13} /> Strict Preservation
                </div>
                <p className="text-neutral-400 font-light text-[10px]">
                  Uses <code className="text-neutral-300">upsert: false</code>. Never overwrites or deletes existing test assets or variants.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={13} /> Missing Press File
                </div>
                <p className="text-neutral-400 font-light text-[10px]">
                  Includes Success Kerala clipping (<code className="text-neutral-300">WhatsApp Image...11-06</code>, 330 KB).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={13} /> Canonical Influencers
                </div>
                <p className="text-neutral-400 font-light text-[10px]">
                  Includes canonical <code className="text-neutral-300">deepamol.jpg</code>, <code className="text-neutral-300">rudiya.jpg</code> (863 KB), and <code className="text-neutral-300">sahalini-sharma.jpg</code> (283 KB).
                </p>
              </div>
            </div>

            {/* Sync Progress Bar */}
            {syncing && (
              <div className="space-y-2 bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
                <div className="flex justify-between text-xs font-mono text-neutral-300">
                  <span>Uploading canonical assets to root...</span>
                  <span>{syncProgress}%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#C7A46A] h-2 transition-all duration-300 rounded-full"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Assets Table with Live Status */}
            <div className="max-h-72 overflow-y-auto border border-neutral-800 rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-900 text-neutral-400 text-[10px] uppercase sticky top-0 border-b border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Canonical Remote Destination</th>
                    <th className="py-2.5 px-3">Asset Label</th>
                    <th className="py-2.5 px-3 text-right">Live Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {CANONICAL_ASSETS.map((asset, idx) => {
                    const isVerified = verificationMap[asset.remote];
                    return (
                      <tr key={asset.remote} className="hover:bg-neutral-900/50">
                        <td className="py-2 px-3 text-neutral-500 text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-3 text-white font-medium text-[11px]">
                          <span className="text-[#C7A46A]">{asset.remote.split('/')[0]}/</span>
                          {asset.remote.split('/')[1]}
                        </td>
                        <td className="py-2 px-3 text-neutral-400 text-[10px]">{asset.label}</td>
                        <td className="py-2 px-3 text-right">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
                              <CheckCircle2 size={11} /> Verified in Root
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-400 text-[10px] bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-800/30">
                              <AlertCircle size={11} /> Pending Root Upload
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={runLiveVerification}
                disabled={verifying || syncing}
                className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw size={13} className={verifying ? 'animate-spin' : ''} />
                <span>{verifying ? 'Verifying live bucket...' : 'Re-verify Root Objects'}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowSyncModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleSyncCanonicalAssets}
                  disabled={syncing}
                  className="px-6 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C7A46A]/10 disabled:opacity-50"
                >
                  <FolderSync size={14} className={syncing ? 'animate-spin' : ''} />
                  <span>{syncing ? 'Syncing to Root Storage...' : 'Start Authenticated Sync (39 Files)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
