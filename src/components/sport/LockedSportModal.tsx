import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, AlertTriangle, Clock, Target } from 'lucide-react';
import type { SportRestriction } from '../../store/useStore';

interface LockedSportModalProps {
  restriction: SportRestriction | null;
  sportName: string;
  onClose: () => void;
}

export default function LockedSportModal({ restriction, sportName, onClose }: LockedSportModalProps) {
  if (!restriction) return null;

  const isLocked = restriction.status === 'locked';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl w-full max-w-sm p-6"
          onClick={e => e.stopPropagation()}
        >
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isLocked ? 'bg-red-50' : 'bg-yellow-50'}`}>
            {isLocked ? (
              <Lock size={28} className="text-red-500" />
            ) : (
              <AlertTriangle size={28} className="text-yellow-500" />
            )}
          </div>

          <h3 className="text-lg font-bold text-text-primary text-center mb-2 font-display">
            {sportName}
          </h3>

          <p className={`text-sm text-center font-medium mb-4 ${isLocked ? 'text-red-500' : 'text-yellow-600'}`}>
            {isLocked ? 'Sport verrouillé' : 'Pratique avec prudence'}
          </p>

          {/* Reason */}
          <div className="bg-surface-50 rounded-2xl p-4 mb-4">
            <p className="text-sm text-text-secondary">{restriction.reason}</p>
          </div>

          {/* Unlock condition */}
          {restriction.unlockCondition && (
            <div className="bg-primary-50 rounded-2xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <Target size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-primary-600 mb-1">Comment débloquer</p>
                  <p className="text-sm text-primary-700">{restriction.unlockCondition}</p>
                </div>
              </div>
            </div>
          )}

          {/* Estimated time */}
          {restriction.estimatedWeeks && restriction.estimatedWeeks > 0 && (
            <div className="flex items-center gap-2 text-text-muted text-xs mb-4 justify-center">
              <Clock size={14} />
              <span>Estimation : {restriction.estimatedWeeks} semaines</span>
            </div>
          )}

          {/* Close button */}
          <button onClick={onClose}
            className="w-full py-3 bg-surface-100 rounded-xl text-sm font-medium text-text-primary active:scale-95 transition-transform">
            Compris
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
