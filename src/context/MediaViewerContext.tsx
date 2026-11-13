import React, { createContext, useContext, useState, useCallback } from 'react';
import { ImageViewerModal, ImageViewerItem } from '../components/common/ImageViewerModal';
import { VideoViewerModal, VideoViewerItem } from '../components/common/VideoViewerModal';

export interface OpenImageOptions {
  src: string;
  alt?: string | null;
  title?: string | null;
  subtitle?: string | null;
  caption?: string | null;
  category?: string | null;
  year?: string | null;
  items?: ImageViewerItem[];
  initialIndex?: number;
}

export interface OpenVideoOptions {
  src?: string | null;
  embedUrl?: string | null;
  title?: string | null;
  badge?: string | null;
  subtitle?: string | null;
  description?: string | null;
  driveFolderUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface MediaViewerContextType {
  openImage: (options: OpenImageOptions) => void;
  openVideo: (options: OpenVideoOptions) => void;
  closeViewer: () => void;
  isImageOpen: boolean;
  isVideoOpen: boolean;
}

const MediaViewerContext = createContext<MediaViewerContextType | null>(null);

export const MediaViewerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeImage, setActiveImage] = useState<ImageViewerItem | null>(null);
  const [imageItems, setImageItems] = useState<ImageViewerItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [activeVideo, setActiveVideo] = useState<VideoViewerItem | null>(null);

  const openImage = useCallback((options: OpenImageOptions) => {
    setActiveVideo(null); // Ensure video closes if image opens
    const singleItem: ImageViewerItem = {
      src: options.src,
      alt: options.alt,
      title: options.title,
      subtitle: options.subtitle,
      caption: options.caption,
      category: options.category,
      year: options.year,
    };

    if (options.items && options.items.length > 0) {
      setImageItems(options.items);
      const startIdx = options.initialIndex ?? options.items.findIndex((i) => i.src === options.src);
      setCurrentImageIndex(startIdx >= 0 ? startIdx : 0);
      setActiveImage(options.items[startIdx >= 0 ? startIdx : 0]);
    } else {
      setImageItems([singleItem]);
      setCurrentImageIndex(0);
      setActiveImage(singleItem);
    }
  }, []);

  const openVideo = useCallback((options: OpenVideoOptions) => {
    setActiveImage(null); // Ensure image closes if video opens
    setActiveVideo({
      src: options.src || undefined,
      embedUrl: options.embedUrl || undefined,
      title: options.title || undefined,
      badge: options.badge || undefined,
      subtitle: options.subtitle || undefined,
      description: options.description || undefined,
      driveFolderUrl: options.driveFolderUrl || undefined,
      youtubeUrl: options.youtubeUrl || undefined,
    });
  }, []);

  const closeViewer = useCallback(() => {
    setActiveImage(null);
    setImageItems([]);
    setActiveVideo(null);
  }, []);

  const handleNavigateImage = useCallback((newIndex: number) => {
    setCurrentImageIndex(newIndex);
    if (imageItems[newIndex]) {
      setActiveImage(imageItems[newIndex]);
    }
  }, [imageItems]);

  return (
    <MediaViewerContext.Provider
      value={{
        openImage,
        openVideo,
        closeViewer,
        isImageOpen: Boolean(activeImage),
        isVideoOpen: Boolean(activeVideo),
      }}
    >
      {children}

      {/* Global Universal Image Viewer */}
      <ImageViewerModal
        isOpen={Boolean(activeImage)}
        onClose={closeViewer}
        item={activeImage}
        items={imageItems}
        currentIndex={currentImageIndex}
        onNavigate={handleNavigateImage}
      />

      {/* Global Universal Video Viewer */}
      <VideoViewerModal
        isOpen={Boolean(activeVideo)}
        onClose={closeViewer}
        video={activeVideo}
      />
    </MediaViewerContext.Provider>
  );
};

export const useMediaViewer = (): MediaViewerContextType => {
  const context = useContext(MediaViewerContext);
  if (!context) {
    throw new Error('useMediaViewer must be used within a MediaViewerProvider');
  }
  return context;
};
