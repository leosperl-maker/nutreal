import React from 'react';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const getColor = () => {
    if (score >= 75) return { bg: '#E8F5E9', text: '#2E7D32', ring: '#4CAF50' };
    if (score >= 50) return { bg: '#F1F8E9', text: '#558B2F', ring: '#8BC34A' };
    if (score >= 25) return { bg: '#FFF3E0', text: '#E65100', ring: '#FF9800' };
    return { bg: '#FFEBEE', text: '#C62828', ring: '#F44336' };
  };

  const getLabel = () => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Bon';
    if (score >= 25) return 'Médiocre';
    return 'Mauvais';
  };

  const colors = getColor();
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-20 h-20 text-xl',
    lg: 'w-28 h-28 text-3xl',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold border-4`}
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          borderColor: colors.ring,
        }}
      >
        {score}
      </div>
      <span
        className="text-xs font-semibold"
        style={{ color: colors.text }}
      >
        {getLabel()}
      </span>
    </div>
  );
}
