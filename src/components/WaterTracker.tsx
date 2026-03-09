import React from 'react';
import { Droplets, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getWaterTarget } from '../lib/nutrition';

export default function WaterTracker() {
  const { profile, addWater, getWaterForDate } = useStore();
  const today = new Date().toISOString().split('T')[0];
  const currentWater = getWaterForDate(today);
  const targetMl = profile ? getWaterTarget(profile.weightCurrentKg) : 2000;
  const targetL = (targetMl / 1000).toFixed(1);
  const currentL = (currentWater / 1000).toFixed(1);
  const percentage = Math.min(100, (currentWater / targetMl) * 100);

  const glasses = Math.ceil(targetMl / 250);
  const filledGlasses = Math.floor(currentWater / 250);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <Droplets size={18} className="text-primary-500" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary text-sm">Hydratation</h3>
            <p className="text-xs text-text-muted">{currentL}L / {targetL}L</p>
          </div>
        </div>
        <button
          onClick={() => addWater(today, 250)}
          className="flex items-center gap-1 bg-primary-50 text-primary-500 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-primary-100 transition-colors active:scale-95"
        >
          <Plus size={14} />
          250ml
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-surface-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Glass indicators */}
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: Math.min(glasses, 12) }).map((_, i) => (
          <div
            key={i}
            className={`w-5 h-6 rounded-sm transition-colors ${
              i < filledGlasses ? 'bg-primary-500' : 'bg-surface-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
