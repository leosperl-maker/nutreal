import React from 'react';

interface Props {
  score: 'A' | 'B' | 'C' | 'D' | 'E';
  size?: 'sm' | 'md';
}

const COLORS = {
  A: { bg: '#16a34a', text: 'white' },
  B: { bg: '#65a30d', text: 'white' },
  C: { bg: '#eab308', text: 'black' },
  D: { bg: '#ea580c', text: 'white' },
  E: { bg: '#dc2626', text: 'white' },
};

export default function NutriScore({ score, size = 'sm' }: Props) {
  const s = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs';
  return (
    <div
      className={`${s} rounded-md flex items-center justify-center font-black`}
      style={{ backgroundColor: COLORS[score].bg, color: COLORS[score].text }}
    >
      {score}
    </div>
  );
}

export function calculateNutriScore(
  calories: number,
  sugar_g: number,
  fat_g: number,
  fiber_g: number,
  protein_g: number
): 'A' | 'B' | 'C' | 'D' | 'E' {
  const negPoints =
    Math.min(10, Math.floor(calories / 335)) +
    Math.min(10, Math.floor(sugar_g / 4.5)) +
    Math.min(10, Math.floor(fat_g / 1));
  const posPoints =
    Math.min(5, Math.floor(fiber_g / 0.9)) +
    Math.min(5, Math.floor(protein_g / 1.6));
  const total = negPoints - posPoints;
  if (total <= -1) return 'A';
  if (total <= 2) return 'B';
  if (total <= 10) return 'C';
  if (total <= 18) return 'D';
  return 'E';
}
