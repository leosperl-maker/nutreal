import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Avatar from './Avatar';
import {
  HAIRSTYLES, OUTFITS, ACCESSORIES, PETS,
  SKIN_COLORS, HAIR_COLORS, EYE_COLORS, OUTFIT_COLORS,
  isItemUnlocked,
} from './avatarItems';
import type { AvatarConfig } from '../../store/useStore';

interface AvatarEditorProps {
  onClose: () => void;
}

type TabId = 'skin' | 'hair' | 'eyes' | 'outfit' | 'accessory' | 'pet';

const TABS: { id: TabId; emoji: string; label: string }[] = [
  { id: 'skin', emoji: '🎨', label: 'Peau' },
  { id: 'hair', emoji: '💇', label: 'Cheveux' },
  { id: 'eyes', emoji: '👁️', label: 'Yeux' },
  { id: 'outfit', emoji: '👕', label: 'Tenue' },
  { id: 'accessory', emoji: '⌚', label: 'Accessoires' },
  { id: 'pet', emoji: '🐱', label: 'Animaux' },
];

export default function AvatarEditor({ onClose }: AvatarEditorProps) {
  const { avatarConfig, updateAvatarConfig, level } = useStore();
  const [tab, setTab] = useState<TabId>('skin');

  if (!avatarConfig) return null;

  const setConfig = (updates: Partial<AvatarConfig>) => updateAvatarConfig(updates);

  const renderColorGrid = (colors: { id: string; value: string; name: string; requiredLevel?: number }[], currentValue: string, onChange: (v: string) => void) => (
    <div className="flex flex-wrap gap-3 justify-center">
      {colors.map(c => {
        const locked = (c.requiredLevel || 0) > level;
        return (
          <button key={c.id} onClick={() => !locked && onChange(c.value)}
            className={`relative w-10 h-10 rounded-full transition-all border-2 ${currentValue === c.value ? 'border-primary-500 scale-110 shadow-float' : 'border-transparent'} ${locked ? 'opacity-40' : ''}`}
            style={{ backgroundColor: c.value }}
            title={locked ? `Niveau ${c.requiredLevel} requis` : c.name}
          >
            {locked && <Lock size={12} className="absolute inset-0 m-auto text-white drop-shadow" />}
          </button>
        );
      })}
    </div>
  );

  const renderItemGrid = (
    items: { id: string; name: string; emoji: string; requiredLevel: number; isPremium: boolean }[],
    currentValue: string | null,
    onChange: (v: string | null) => void,
  ) => (
    <div className="grid grid-cols-3 gap-2">
      {items.map(item => {
        const unlocked = isItemUnlocked(item.id, level);
        const isActive = currentValue === item.id;
        return (
          <button key={item.id} onClick={() => unlocked && onChange(item.id)}
            className={`relative p-3 rounded-xl text-center transition-all ${isActive ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-200'} ${!unlocked ? 'opacity-40' : ''}`}
          >
            <span className="text-xl block">{item.emoji}</span>
            <span className={`text-[10px] font-medium block mt-1 ${isActive ? 'text-white' : 'text-text-secondary'}`}>
              {item.name}
            </span>
            {!unlocked && (
              <div className="absolute top-1 right-1 bg-surface-700/80 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                <Lock size={8} className="text-white" />
                <span className="text-[8px] text-white font-bold">{item.requiredLevel}</span>
              </div>
            )}
            {item.isPremium && unlocked && (
              <div className="absolute top-1 right-1 bg-yellow-400 rounded-full px-1 py-0.5">
                <span className="text-[8px] font-bold">PRO</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderTab = () => {
    switch (tab) {
      case 'skin':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary">Couleur de peau</h3>
            {renderColorGrid(SKIN_COLORS, avatarConfig.skinColor, v => setConfig({ skinColor: v }))}
          </div>
        );
      case 'hair':
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Coiffure</h3>
              {renderItemGrid(HAIRSTYLES, avatarConfig.hairStyle, v => v && setConfig({ hairStyle: v }))}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Couleur</h3>
              {renderColorGrid(HAIR_COLORS, avatarConfig.hairColor, v => setConfig({ hairColor: v }))}
            </div>
          </div>
        );
      case 'eyes':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary">Couleur des yeux</h3>
            {renderColorGrid(EYE_COLORS, avatarConfig.eyeColor, v => setConfig({ eyeColor: v }))}
          </div>
        );
      case 'outfit':
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Tenue</h3>
              {renderItemGrid(OUTFITS, avatarConfig.outfit, v => v && setConfig({ outfit: v }))}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">Couleur</h3>
              {renderColorGrid(OUTFIT_COLORS, avatarConfig.outfitColor, v => setConfig({ outfitColor: v }))}
            </div>
          </div>
        );
      case 'accessory':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Accessoires</h3>
            {renderItemGrid(ACCESSORIES, avatarConfig.accessory, v => setConfig({ accessory: v }))}
          </div>
        );
      case 'pet':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Animaux de compagnie</h3>
            <p className="text-xs text-text-muted">Débloqués à partir du niveau 10</p>
            {renderItemGrid(PETS, avatarConfig.pet, v => setConfig({ pet: v }))}
          </div>
        );
    }
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
          className="bg-surface-100 rounded-t-3xl w-full max-w-lg max-h-[85vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header + Preview */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-lg font-bold text-text-primary font-display">Mon avatar</h2>
            <button onClick={onClose} className="w-8 h-8 bg-surface-200 rounded-full flex items-center justify-center">
              <X size={18} className="text-text-muted" />
            </button>
          </div>

          {/* Avatar preview */}
          <div className="flex justify-center py-4">
            <Avatar config={avatarConfig} size={140} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-4 overflow-x-auto pb-2">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all ${tab === t.id ? 'bg-primary-500 text-white' : 'bg-white text-text-secondary border border-surface-200'}`}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {renderTab()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
