import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Shield } from 'lucide-react';

export default function ConsentBanner() {
  const { gdprConsent, setGdprConsent } = useStore(s => ({
    gdprConsent: s.gdprConsent,
    setGdprConsent: s.setGdprConsent,
  }));
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!gdprConsent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [gdprConsent]);

  const accept = () => { setGdprConsent(true); setShow(false); };
  const decline = () => { setGdprConsent(false); setShow(false); };

  if (gdprConsent) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 left-4 right-4 z-50 bg-white rounded-2xl shadow-float border border-surface-200 p-4 max-w-lg mx-auto"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield size={18} className="text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary mb-1">Vos données restent les vôtres</p>
              <p className="text-xs text-text-muted leading-relaxed">
                Nutreal stocke vos données localement sur votre appareil. Aucune donnée n'est partagée avec des tiers à des fins publicitaires.
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={accept}
                  className="flex-1 py-2 bg-primary-500 text-white text-xs font-semibold rounded-lg">
                  Accepter
                </button>
                <button onClick={decline}
                  className="flex-1 py-2 bg-surface-100 text-text-secondary text-xs font-medium rounded-lg">
                  Refuser
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
