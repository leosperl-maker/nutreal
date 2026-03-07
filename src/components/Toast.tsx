import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Toast() {
  const { toastMessage } = useStore();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-[90vw]"
        >
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
