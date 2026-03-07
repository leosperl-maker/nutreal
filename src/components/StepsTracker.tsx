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
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <Footprints size={18} className="text-accent-purple" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Pas</h3>
            <p className="text-xs text-gray-400">{dailySteps.toLocaleString()} / {stepsGoal.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDailySteps(Math.max(0, dailySteps - 500))}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 active:scale-95"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => setDailySteps(dailySteps + 500)}
            className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-accent-purple hover:bg-purple-200 active:scale-95"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      
      <div className="h-3 bg-purple-50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-purple to-purple-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-[10px] text-gray-400 mt-1.5 text-right">
        ~{Math.round(dailySteps * 0.04)} kcal brûlées
      </p>
    </div>
  );
}
