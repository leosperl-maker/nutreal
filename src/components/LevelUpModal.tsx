import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, UNLOCKABLE_TITLES } from '../store/useStore';
import { getNewItemsAtLevel } from './avatar/avatarItems';
import { useConfetti } from './ConfettiExplosion';

export default function LevelUpModal() {
  const { lastLevelUp, dismissLevelUp, selectedTitle, profile } = useStore();
  const { fireConfetti } = useConfetti();

  const isOpen = lastLevelUp !== null;
  const newLevel = lastLevelUp ?? 0;

  // Fire confetti when modal appears
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        fireConfetti({ origin: { x: 0.5, y: 0.4 }, particleCount: 200, spread: 100 });
      }, 300);
      setTimeout(() => {
        fireConfetti({ angle: 60, spread: 70, origin: { x: 0, y: 0.5 }, particleCount: 80 });
        fireConfetti({ angle: 120, spread: 70, origin: { x: 1, y: 0.5 }, particleCount: 80 });
      }, 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const newItems = getNewItemsAtLevel(newLevel);
  const newTitle = UNLOCKABLE_TITLES.find(t => t.requiredLevel === newLevel);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center px-6"
        onClick={dismissLevelUp}
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-full max-w-sm text-center"
          onClick={e => e.stopPropagation()}
        >
          {/* Glow effect */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary-400/20 rounded-[40px] blur-3xl -z-10"
          />

          {/* Level number */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center shadow-xl mb-6"
          >
            <span className="text-white text-4xl font-black">{newLevel}</span>
          </motion.div>

          {/* LEVEL UP text */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-white font-display mb-2"
          >
            LEVEL UP !
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-sm mb-6"
          >
            {profile?.name || 'Vous'} atteint le niveau {newLevel}
          </motion.p>

          {/* New unlocks */}
          {(newItems.length > 0 || newTitle) && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-6"
            >
              <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-3">Nouveaux débloqués</p>

              {newTitle && (
                <div className="flex items-center gap-3 p-2 bg-white/10 rounded-xl mb-2">
                  <span className="text-xl">🏅</span>
                  <div className="text-left">
                    <p className="text-xs text-white/60">Nouveau titre</p>
                    <p className="text-sm font-bold text-white">{newTitle.name}</p>
                  </div>
                </div>
              )}

              {newItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-white/10 rounded-xl mb-1.5 last:mb-0">
                  <span className="text-xl">{item.emoji}</span>
                  <div className="text-left">
                    <p className="text-xs text-white/60 capitalize">{item.type === 'hairstyle' ? 'Coiffure' : item.type === 'outfit' ? 'Tenue' : item.type === 'accessory' ? 'Accessoire' : 'Animal'}</p>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                  </div>
                </div>
              ))}

              {newLevel === 5 && (
                <div className="flex items-center gap-3 p-2 bg-white/10 rounded-xl mt-2">
                  <span className="text-xl">🛡️</span>
                  <div className="text-left">
                    <p className="text-xs text-white/60">Pouvoir spécial</p>
                    <p className="text-sm font-bold text-white">Protection de streak</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Continue button */}
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={dismissLevelUp}
            className="w-full py-4 bg-white rounded-2xl font-bold text-primary-600 text-sm shadow-xl active:scale-95 transition-transform"
          >
            Continuer
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
