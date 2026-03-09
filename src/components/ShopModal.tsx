import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Check, ShoppingBag, Coins } from 'lucide-react';
import { useStore } from '../store/useStore';
import ItemPreview from './avatar/ItemPreview';
import Icon3D from './Icon3D';
import {
  HAIRSTYLES, OUTFITS, ACCESSORIES, PETS,
  ALL_ITEMS, getItemRarity, RARITY_MAP, isItemUnlocked,
} from './avatar/avatarItems';
import type { AvatarItem, Rarity } from './avatar/avatarItems';

interface ShopModalProps {
  onClose: () => void;
}

type ShopTab = 'hairstyle' | 'outfit' | 'accessory' | 'pet';

const TABS: { id: ShopTab; label: string; emoji: string }[] = [
  { id: 'hairstyle', label: 'Coiffures', emoji: 'personGettingHaircut' },
  { id: 'outfit', label: 'Tenues', emoji: 'tShirt' },
  { id: 'accessory', label: 'Accessoires', emoji: 'glasses' },
  { id: 'pet', label: 'Compagnons', emoji: 'catFace' },
];

function getItemsForTab(tab: ShopTab): AvatarItem[] {
  switch (tab) {
    case 'hairstyle': return HAIRSTYLES;
    case 'outfit': return OUTFITS;
    case 'accessory': return ACCESSORIES;
    case 'pet': return PETS;
  }
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  const info = RARITY_MAP[rarity];
  return (
    <span
      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
      style={{ background: `linear-gradient(135deg, ${info.bgFrom}, ${info.bgTo})`, color: 'white' }}
    >
      {info.name}
    </span>
  );
}

function ShopItem({ item, owned, unlocked, level, coins, onBuy }: {
  item: AvatarItem;
  owned: boolean;
  unlocked: boolean;
  level: number;
  coins: number;
  onBuy: (item: AvatarItem) => void;
}) {
  const rarity = getItemRarity(item);
  const rarityInfo = RARITY_MAP[rarity];
  const canAfford = coins >= item.price;
  const freeAtLevel = !item.isPremium && level >= item.requiredLevel;
  const [justBought, setJustBought] = useState(false);

  const handleBuy = () => {
    if (owned || (!freeAtLevel && !canAfford)) return;
    onBuy(item);
    setJustBought(true);
    setTimeout(() => setJustBought(false), 1500);
  };

  return (
    <motion.div
      layout
      className="relative rounded-2xl border overflow-hidden"
      style={{
        borderColor: owned ? rarityInfo.border : 'rgba(0,0,0,0.08)',
        boxShadow: owned && rarityInfo.glow ? `0 0 12px ${rarityInfo.glow}` : undefined,
        background: owned ? `linear-gradient(135deg, ${rarityInfo.bgFrom}10, ${rarityInfo.bgTo}15)` : 'white',
      }}
    >
      {/* Preview */}
      <div className="flex items-center justify-center pt-3 pb-1 px-2">
        <div className={`${!owned && !freeAtLevel ? 'opacity-50 grayscale' : ''}`}>
          <ItemPreview itemId={item.id} emoji={item.emoji} type={item.type} size={56} />
        </div>
      </div>

      {/* Info */}
      <div className="px-2 pb-2 text-center space-y-1">
        <p className="text-[11px] font-semibold text-text-primary truncate">{item.name}</p>
        <RarityBadge rarity={rarity} />

        {/* Status / action */}
        <div className="pt-1">
          {owned || freeAtLevel ? (
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-green-600">
              <Check size={12} /> Possédé
            </div>
          ) : justBought ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-1 text-[10px] font-bold text-green-600"
            >
              <Check size={14} /> Acheté !
            </motion.div>
          ) : (
            <button
              onClick={handleBuy}
              disabled={!canAfford}
              className={`w-full py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all
                ${canAfford
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-sm active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              <Coins size={12} />
              {item.price}
            </button>
          )}
        </div>
      </div>

      {/* Level lock badge */}
      {!owned && !freeAtLevel && item.requiredLevel > 0 && (
        <div className="absolute top-1.5 right-1.5 bg-black/60 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
          <Lock size={8} className="text-white" />
          <span className="text-[8px] text-white font-bold">Nv.{item.requiredLevel}</span>
        </div>
      )}

      {/* Premium badge */}
      {item.isPremium && (
        <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full px-1.5 py-0.5">
          <span className="text-[8px] text-white font-bold">PREMIUM</span>
        </div>
      )}
    </motion.div>
  );
}

export default function ShopModal({ onClose }: ShopModalProps) {
  const { coins, level, purchasedItems, purchaseItem, showToast } = useStore();
  const [tab, setTab] = useState<ShopTab>('hairstyle');

  const items = getItemsForTab(tab);

  const handleBuy = (item: AvatarItem) => {
    const success = purchaseItem(item.id, item.price);
    if (success) {
      showToast(`${item.name} acheté ! 🎉`);
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
          className="bg-surface-100 rounded-t-3xl w-full max-w-lg max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-primary-500" />
              <h2 className="text-lg font-bold text-text-primary font-display">Boutique</h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Coin balance */}
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
                <Coins size={16} className="text-amber-500" />
                <span className="text-sm font-bold text-amber-700">{coins.toLocaleString()}</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 bg-surface-200 rounded-full flex items-center justify-center">
                <X size={18} className="text-text-muted" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-4 pb-3 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5
                  ${tab === t.id ? 'bg-primary-500 text-white' : 'bg-white text-text-secondary border border-surface-200'}`}
              >
                <Icon3D name={t.emoji} size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="grid grid-cols-3 gap-2">
              {items.filter(i => i.price > 0 || i.requiredLevel > 0 || i.id.includes('none')).map(item => {
                const freeAtLevel = !item.isPremium && level >= item.requiredLevel;
                const owned = purchasedItems.includes(item.id) || freeAtLevel;
                const unlocked = isItemUnlocked(item.id, level, purchasedItems);
                return (
                  <ShopItem
                    key={item.id}
                    item={item}
                    owned={owned}
                    unlocked={unlocked}
                    level={level}
                    coins={coins}
                    onBuy={handleBuy}
                  />
                );
              })}
            </div>

            {/* Hint */}
            <p className="text-center text-[11px] text-text-muted mt-4">
              Gagnez des coins en complétant des missions, des repas et des workouts !
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
