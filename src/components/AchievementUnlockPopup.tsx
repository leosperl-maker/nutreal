import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { useConfetti } from './ConfettiExplosion';

interface AchievementUnlockPopupProps {
  achievement: {
    label: string;
    desc: string;
    icon?: React.ElementType;
    color?: string;
    bg?: string;
  } | null;
  onClose: () => void;
}

export default function AchievementUnlockPopup({ achievement, onClose }: AchievementUnlockPopupProps) {
  const { fireConfetti } = useConfetti(['#FFD700', '#FFA500', '#FFE66D', '#FFEC8B', '#FFC200', '#2ea05a']);

  useEffect(() => {
    if (!achievement) return;
    // Fire golden confetti on open
    fireConfetti({ origin: { x: 0.5, y: 0.6 } });
    // Auto-dismiss after 4 seconds
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [achievement]);

  const Icon = achievement?.icon ?? Trophy;

  return (
    <AnimatePresence>
      {achievement && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed inset-x-4 bottom-24 z-50 max-w-sm mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Golden banner */}
              <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 px-6 pt-6 pb-4 text-center relative">
                {/* Sparkle particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-white rounded-full"
                    style={{
                      top: `${10 + (i % 3) * 30}%`,
                      left: `${10 + i * 15}%`,
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.15,
                      repeat: Infinity,
                      repeatDelay: 0.8,
                    }}
                  />
                ))}

                {/* Trophy badge */}
                <motion.div
                  initial={{ rotate: -15, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.15, stiffness: 300 }}
                  className="w-16 h-16 bg-white/30 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                >
                  <Trophy size={32} className="text-white drop-shadow" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs font-bold text-amber-900/70 uppercase tracking-widest"
                >
                  Succès débloqué !
                </motion.p>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-12 h-12 ${achievement.bg ?? 'bg-warning-50'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} className={achievement.color ?? 'text-warning-300'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-text-primary">{achievement.label}</p>
                    <p className="text-sm text-text-muted mt-0.5">{achievement.desc}</p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  onClick={onClose}
                  className="mt-5 w-full bg-primary-500 text-white font-semibold py-3 rounded-2xl text-sm"
                  whileTap={{ scale: 0.97 }}
                >
                  Super !
                </motion.button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center"
            >
              <X size={14} className="text-text-secondary" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
