import React, { useState } from 'react';
import { Footprints, Plus, Minus } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function StepsTracker() {
  const { dailySteps, stepsGoal, setDailySteps } = useStore();
  const percentage = Math.min(100, (dailySteps / stepsGoal) * 100);
  const [showInput, setShowInput] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <Footprints size={18} className="text-primary-500" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-text-primary text-sm">Pas</h3>
            <p className="text-xs text-text-muted">{dailySteps.toLocaleString()} / {stepsGoal.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDailySteps(Math.max(0, dailySteps - 500))}
            className="w-7 h-7 rounded-full bg-surface-200 flex items-center justify-center text-text-muted hover:bg-surface-300 active:scale-95"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => setDailySteps(dailySteps + 500)}
            className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 hover:bg-primary-200 active:scale-95"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      
      <div className="h-3 bg-primary-50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-[10px] text-text-muted mt-1.5 text-right">
        ~{Math.round(dailySteps * 0.04)} kcal brûlées
      </p>
    </div>
  );
}
