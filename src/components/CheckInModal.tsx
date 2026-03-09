import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import Icon3D from './Icon3D';

interface CheckInModalProps {
  open: boolean;
  onClose: () => void;
}

const MOODS = [
  { emoji: 'slightlySmiling', label: 'Bien' },
  { emoji: 'neutralFace', label: 'Neutre' },
  { emoji: 'pensiveFace', label: 'Pas top' },
  { emoji: 'cryingFace', label: 'Mal' },
  { emoji: 'starStruck', label: 'Super !' },
];

export default function CheckInModal({ open, onClose }: CheckInModalProps) {
  const { addCheckIn, addXP, showToast, profile } = useStore();
  const [mood, setMood] = useState('');
  const [painLevel, setPainLevel] = useState(0);
  const [notes, setNotes] = useState('');
  const [conditions, setConditions] = useState<{ condition: string; status: 'better' | 'same' | 'worse' }[]>([]);

  if (!open) return null;

  // Build condition list from profile medical conditions
  const userConditions = profile?.medicalConditions?.filter(c => c !== 'Aucune') || [];

  const toggleConditionStatus = (condition: string, status: 'better' | 'same' | 'worse') => {
    setConditions(prev => {
      const existing = prev.find(c => c.condition === condition);
      if (existing) {
        return prev.map(c => c.condition === condition ? { ...c, status } : c);
      }
      return [...prev, { condition, status }];
    });
  };

  const submit = () => {
    if (!mood) return;
    addCheckIn({
      date: new Date().toISOString().split('T')[0],
      mood,
      painLevel,
      notes,
      conditionEvolution: conditions,
    });
    addXP(20);
    showToast('Check-in enregistré ! +20 XP');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-5"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary font-display">Check-in hebdomadaire</h2>
            <button onClick={onClose} className="w-8 h-8 bg-surface-100 rounded-full flex items-center justify-center">
              <X size={18} className="text-text-muted" />
            </button>
          </div>

          {/* Mood */}
          <div className="mb-5">
            <p className="text-sm font-medium text-text-secondary mb-2">Comment vous sentez-vous ?</p>
            <div className="flex gap-3 justify-center">
              {MOODS.map(m => (
                <button key={m.emoji} onClick={() => setMood(m.emoji)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${mood === m.emoji ? 'bg-primary-50 scale-110' : 'bg-surface-50'}`}>
                  <Icon3D name={m.emoji} size={28} />
                  <span className="text-[10px] text-text-muted">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pain level */}
          <div className="mb-5">
            <p className="text-sm font-medium text-text-secondary mb-2">Niveau de douleur : <span className="text-primary-500 font-bold">{painLevel}/10</span></p>
            <input type="range" min={0} max={10} value={painLevel}
              onChange={e => setPainLevel(+e.target.value)}
              className="w-full accent-primary-500" />
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>Aucune</span>
              <span>Intense</span>
            </div>
          </div>

          {/* Condition evolution */}
          {userConditions.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-text-secondary mb-2">Évolution de vos conditions</p>
              <div className="space-y-2">
                {userConditions.map(condition => {
                  const current = conditions.find(c => c.condition === condition);
                  return (
                    <div key={condition} className="bg-surface-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-text-primary mb-2">{condition}</p>
                      <div className="flex gap-2">
                        {(['better', 'same', 'worse'] as const).map(s => (
                          <button key={s} onClick={() => toggleConditionStatus(condition, s)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${current?.status === s ? (s === 'better' ? 'bg-green-500 text-white' : s === 'same' ? 'bg-yellow-400 text-yellow-900' : 'bg-red-500 text-white') : 'bg-white border border-surface-200 text-text-muted'}`}>
                            {s === 'better' ? <><Icon3D name="chartIncreasing" size={14} /> Mieux</> : s === 'same' ? <><Icon3D name="rightArrow" size={14} /> Pareil</> : <><Icon3D name="chartDecreasing" size={14} /> Pire</>}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-5">
            <p className="text-sm font-medium text-text-secondary mb-2">Notes (optionnel)</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Comment s'est passée votre semaine ?"
              rows={3}
              className="w-full px-3 py-2 bg-surface-50 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none resize-none" />
          </div>

          {/* Submit */}
          <button onClick={submit} disabled={!mood}
            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${mood ? 'bg-primary-500 text-white shadow-float active:scale-95' : 'bg-surface-200 text-text-muted'}`}>
            Enregistrer le check-in
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
