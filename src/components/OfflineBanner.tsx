import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, X } from 'lucide-react';
import { isOfflineMode } from '../lib/supabase';

export default function OfflineBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!isOfflineMode || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 flex items-center justify-between shadow-lg"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <WifiOff size={14} />
          </div>
          <p className="text-xs font-medium truncate">
            Mode démo — connexion base de données inactive
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-white/30 active:scale-90 transition-all ml-2"
          aria-label="Fermer"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
