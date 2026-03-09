import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface RPMCreatorProps {
  open: boolean;
  onClose: () => void;
  onAvatarCreated: (url: string) => void;
}

// Ready Player Me subdomain — uses the default demo if not configured
const RPM_SUBDOMAIN = 'demo';

function getRPMUrl(): string {
  const params = new URLSearchParams({
    frameApi: '',
    clearCache: '',
  });
  return `https://${RPM_SUBDOMAIN}.readyplayer.me/avatar?${params.toString()}`;
}

export default function RPMCreator({ open, onClose, onAvatarCreated }: RPMCreatorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    // Only handle Ready Player Me messages
    const data = event.data;

    // RPM sends JSON strings
    let parsed = data;
    if (typeof data === 'string') {
      try {
        parsed = JSON.parse(data);
      } catch {
        return;
      }
    }

    // Avatar export completed
    if (parsed.source === 'readyplayerme') {
      if (parsed.eventName === 'v1.avatar.exported') {
        const glbUrl = parsed.data.url;
        if (glbUrl) {
          // Add render parameters for better quality
          const renderUrl = `${glbUrl}?quality=high&meshLod=0`;
          onAvatarCreated(renderUrl);
          onClose();
        }
      }
    }
  }, [onAvatarCreated, onClose]);

  useEffect(() => {
    if (open) {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [open, handleMessage]);

  // Subscribe to RPM events when iframe loads
  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          target: 'readyplayerme',
          type: 'subscribe',
          eventName: 'v1.**',
        }),
        '*'
      );
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-[60] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-sm">
          <h2 className="text-white font-bold text-sm">Creer mon avatar 3D</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Loading placeholder */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2 size={32} className="text-white/50 animate-spin mx-auto mb-3" />
              <p className="text-white/40 text-sm">Chargement de l'editeur...</p>
            </div>
          </div>

          {/* RPM iframe */}
          <iframe
            ref={iframeRef}
            src={getRPMUrl()}
            onLoad={handleIframeLoad}
            className="w-full h-full relative z-10"
            style={{ border: 'none' }}
            allow="camera *; microphone *; clipboard-write"
            title="Ready Player Me Avatar Creator"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
