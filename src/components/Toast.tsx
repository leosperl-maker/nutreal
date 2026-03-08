import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { CheckCircle } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useStore();
  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-[100] flex justify-center"
        >
          <div className="glass-strong rounded-2xl px-5 py-3 flex items-center gap-3 shadow-float max-w-sm">
            <CheckCircle size={20} className="text-success-400 flex-shrink-0" />
            <span className="text-sm font-medium text-text-primary">{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
