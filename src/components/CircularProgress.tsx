import React from 'react';

interface CircularProgressProps {
  consumed: number;
  budget: number;
  burned: number;
  size?: number;
}

export default function CircularProgress({ consumed, budget, burned, size = 200 }: CircularProgressProps) {
  const remaining = Math.max(0, budget - consumed + burned);
  const percentage = Math.min(100, (consumed / budget) * 100);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getColor = () => {
    if (percentage > 100) return '#F44336';
    if (percentage > 85) return '#FF9800';
    return '#4CAF50';
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8F5E9"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center">
        <span className="text-xs text-gray-400 font-medium">Restant</span>
        <span className="text-3xl font-bold text-gray-800 font-display">{remaining}</span>
        <span className="text-xs text-gray-400">kcal</span>
      </div>
      
      {/* Labels around the circle */}
      <div className="absolute -bottom-2 left-4 flex flex-col items-center">
        <span className="text-sm font-semibold text-gray-700">{consumed}</span>
        <span className="text-[10px] text-gray-400">Consommé</span>
      </div>
      <div className="absolute -bottom-2 right-4 flex flex-col items-center">
        <span className="text-sm font-semibold text-secondary-500">{burned}</span>
        <span className="text-[10px] text-gray-400">Brûlé</span>
      </div>
    </div>
  );
}
