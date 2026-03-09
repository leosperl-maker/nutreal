import React from 'react';
import { Trash2, Clock } from 'lucide-react';
import Icon3D from './Icon3D';
import type { Meal } from '../store/useStore';

interface MealCardProps {
  meal: Meal;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

const mealTypeLabels: Record<string, { label: string; icon: string }> = {
  breakfast: { label: 'Petit-déjeuner', icon: 'sunrise' },
  lunch: { label: 'Déjeuner', icon: 'sun' },
  snack: { label: 'Goûter', icon: 'redApple' },
  dinner: { label: 'Dîner', icon: 'crescentMoon' },
};

export default function MealCard({ meal, onDelete, compact }: MealCardProps) {
  const time = new Date(meal.createdAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-xl p-3 shadow-card flex items-center gap-3 group">
      {meal.photoUrl ? (
        <img
          src={meal.photoUrl}
          alt={meal.dishName}
          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
          <Icon3D name="forkAndKnife" size={28} />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800 text-sm truncate">{meal.dishName}</h4>
        {!compact && (
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <Icon3D name={mealTypeLabels[meal.mealType]?.icon || 'forkAndKnife'} size={12} /> {mealTypeLabels[meal.mealType]?.label || meal.mealType}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <Clock size={10} className="text-gray-300" />
          <span className="text-[10px] text-gray-400">{time}</span>
          <span className="text-xs font-semibold text-secondary-500">{meal.totalCalories} kcal</span>
        </div>
      </div>
      
      {onDelete && (
        <button
          onClick={() => onDelete(meal.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-300 hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
