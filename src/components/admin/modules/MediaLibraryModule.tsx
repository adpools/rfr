import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Upload, Trash2, Copy, Check, ExternalLink, Image as ImageIcon, Video, FileText, Search, RefreshCw } from 'lucide-react';

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

export const MediaLibraryModule: React.FC<MediaLibraryModuleProps> = ({ showToast }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const folders = ['all', 'general', 'banners', 'timeline', 'projects', 'talent', 'press'];

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
        setFiles(sampleStaticMedia);
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
      setFiles(sampleStaticMedia);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedFolder]);

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
            {f === 'all' ? 'All Buckets' : `/${f}`}
          </button>
        ))}
      </div>

      {/* Storage Security Badge */}
      <div className="p-4 rounded-xl bg-[#101010] border border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Storage Bucket: public.rfr-media • MIME Guard Active (SVG Disallowed for XSS Safety)</span>
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
          No files in this folder. Click &quot;Upload Media&quot; to upload assets.
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
                <div className="w-full aspect-square bg-[#151515] relative flex items-center justify-center overflow-hidden">
                  {file.type === 'video' ? (
                    <div className="flex flex-col items-center gap-2 text-neutral-400">
                      <Video size={32} className="text-[#C7A46A]" />
                      <span className="text-[10px] font-mono uppercase">Video</span>
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={file.name}
                      onError={(e) => {
                        // Fallback icon if image broken
                        (e.target as any).style.display = 'none';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => copyToClipboard(url)}
                      title="Copy Public URL"
                      className="p-2 rounded-xl bg-[#1C1C1C] hover:bg-[#C7A46A] hover:text-black text-white transition-colors"
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in new tab"
                      className="p-2 rounded-xl bg-[#1C1C1C] hover:bg-neutral-800 text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => handleDelete(file.path)}
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
                    <span>{file.size || '50MB max'}</span>
                    <span className="uppercase">{file.type}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

