import React from 'react';

/* ── Star sticker for Coach card ── */
export function StarSticker({ className = '' }: { className?: string }) {
  return (
    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" className={className}>
      <path d="M29 5L35.5 20H52L38.5 29L43.5 45L29 36L14.5 45L19.5 29L6 20H22.5Z" fill="white" stroke="white" strokeWidth="7" strokeLinejoin="round" />
      <path d="M29 5L35.5 20H52L38.5 29L43.5 45L29 36L14.5 45L19.5 29L6 20H22.5Z" fill="#fbbf24" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="23" cy="25" r="2.5" fill="#1a1a1a" />
      <circle cx="35" cy="25" r="2.5" fill="#1a1a1a" />
      <path d="M22 31 Q29 36 36 31" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="20" r="2" fill="white" opacity="0.6" />
    </svg>
  );
}

/* ── Sun sticker for Petit-déjeuner ── */
export function SunSticker({ className = '' }: { className?: string }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className={className}>
      <circle cx="30" cy="30" r="20" fill="white" stroke="white" strokeWidth="8" />
      <line x1="30" y1="5" x2="30" y2="2" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <line x1="30" y1="58" x2="30" y2="55" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <line x1="5" y1="30" x2="2" y2="30" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <line x1="58" y1="30" x2="55" y2="30" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <line x1="12" y1="12" x2="10" y2="10" stroke="white" strokeWidth="7" strokeLinecap="round" />
      <line x1="50" y1="50" x2="48" y2="48" stroke="white" strokeWidth="7" strokeLinecap="round" />
      <line x1="48" y1="12" x2="50" y2="10" stroke="white" strokeWidth="7" strokeLinecap="round" />
      <line x1="12" y1="48" x2="10" y2="50" stroke="white" strokeWidth="7" strokeLinecap="round" />
      {/* rays */}
      <line x1="30" y1="6" x2="30" y2="3" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="30" y1="57" x2="30" y2="54" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="6" y1="30" x2="3" y2="30" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="57" y1="30" x2="54" y2="30" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="13" y1="13" x2="11" y2="11" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="49" y1="49" x2="47" y2="47" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="47" y1="13" x2="49" y2="11" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="13" y1="47" x2="11" y2="49" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
      {/* body */}
      <circle cx="30" cy="30" r="18" fill="#fbbf24" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle cx="30" cy="30" r="13" fill="#fde68a" />
      {/* face */}
      <circle cx="25" cy="28" r="2" fill="#1a1a1a" />
      <circle cx="35" cy="28" r="2" fill="#1a1a1a" />
      <path d="M25 33 Q30 37 35 33" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="33" rx="3" ry="2" fill="#f97316" opacity="0.4" />
      <ellipse cx="38" cy="33" rx="3" ry="2" fill="#f97316" opacity="0.4" />
    </svg>
  );
}

/* ── Plate sticker for Déjeuner ── */
export function PlateSticker({ className = '' }: { className?: string }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className={className}>
      <circle cx="30" cy="30" r="22" fill="white" stroke="white" strokeWidth="8" />
      <circle cx="30" cy="30" r="20" fill="#4ade80" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle cx="30" cy="30" r="14" fill="#86efac" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d="M20 16v10c0 2 1.5 3 2.5 3v12" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M20 16v7M23 16v7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 16 Q42 20 40 24v17" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Moon sticker for Dîner ── */
export function MoonSticker({ className = '' }: { className?: string }) {
  return (
    <svg width="54" height="60" viewBox="0 0 54 60" fill="none" className={className}>
      <path d="M36 7C26 9 18 18 18 29C18 40 26 49 36 51C28 53 20 51 14 45C6 37 6 21 14 13C20 7 28 5 36 7Z" fill="white" stroke="white" strokeWidth="8" strokeLinejoin="round" />
      <path d="M36 7C26 9 18 18 18 29C18 40 26 49 36 51C28 53 20 51 14 45C6 37 6 21 14 13C20 7 28 5 36 7Z" fill="#818cf8" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="44" cy="16" r="4" fill="#fbbf24" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="40" cy="9" r="2.5" fill="#fbbf24" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="49" cy="27" r="3" fill="#fde68a" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>
  );
}

/* ── Apple sticker for Collation ── */
export function AppleSticker({ className = '' }: { className?: string }) {
  return (
    <svg width="52" height="62" viewBox="0 0 52 62" fill="none" className={className}>
      <path d="M26 17C26 13 29 9 33 7" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <path d="M33 7C37 7 41 11 39 15" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <path d="M26 55C12 55 5 45 5 35C5 23 11 17 20 17C22 17 24 17.5 26 18.5C28 17.5 30 17 32 17C41 17 47 23 47 35C47 45 40 55 26 55Z" fill="white" stroke="white" strokeWidth="8" strokeLinejoin="round" />
      <path d="M26 17C26 13 29 9 33 7" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
      <path d="M33 7C37 7 41 11 39 15C35 16 31 13 33 7Z" fill="#22c55e" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M26 55C12 55 5 45 5 35C5 23 11 17 20 17C22 17 24 17.5 26 18.5C28 17.5 30 17 32 17C41 17 47 23 47 35C47 45 40 55 26 55Z" fill="#f87171" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M26 18.5C24 17.5 22 17 20 17C11 17 5 23 5 35C5 45 12 55 26 55" fill="#ef4444" />
      <ellipse cx="17" cy="27" rx="5" ry="8" fill="white" opacity="0.28" transform="rotate(-25 17 27)" />
    </svg>
  );
}

/* ── Sneaker sticker for Steps ── */
export function SneakerSticker({ className = '' }: { className?: string }) {
  return (
    <svg width="80" height="50" viewBox="0 0 80 50" fill="none" className={className}>
      <path d="M6 34 Q8 20 20 18 Q30 16 40 18 L54 20 Q66 22 70 30 L70 38 Q70 42 66 42 L10 42 Q6 40 6 34Z" fill="white" stroke="white" strokeWidth="7" strokeLinejoin="round" />
      <path d="M6 36 Q38 48 70 36 L70 40 Q70 44 66 44 L10 44 Q6 42 6 36Z" fill="white" stroke="white" strokeWidth="6" strokeLinejoin="round" />
      <path d="M6 36 Q38 48 70 36 L70 40 Q70 45 66 45 L10 45 Q6 43 6 36Z" fill="#E8E8E8" stroke="#111" strokeWidth="2.5" />
      <path d="M8 34 Q38 44 68 34 L68 37 Q38 47 8 37Z" fill="white" />
      <path d="M6 34 Q8 20 20 18 Q30 16 40 18 L54 20 Q66 22 70 30 L70 36 Q38 44 8 34Z" fill="white" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18 28 Q28 18 42 20 Q52 22 56 28 Q48 22 34 26 Q24 30 18 28Z" fill="#C0C0C0" stroke="#999" strokeWidth="0.5" />
      <path d="M6 34 Q7 24 14 20" stroke="#ddd" strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="28" r="1" fill="#ddd" />
      <circle cx="12" cy="25" r="1" fill="#ddd" />
      <circle cx="14" cy="23" r="1" fill="#ddd" />
      <path d="M24 21 Q28 19 32 21 Q36 23 40 21 Q44 19 48 21" stroke="#bbb" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M24 24 Q28 22 32 24 Q36 26 40 24 Q44 22 48 24" stroke="#bbb" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M22 18 Q24 14 28 14 Q32 14 34 18" fill="#eee" stroke="#ddd" strokeWidth="1.5" />
      <path d="M58 20 Q66 22 70 30" stroke="#ddd" strokeWidth="1.5" fill="none" />
      <path d="M64 22 Q70 24 70 32" fill="#f0f0f0" stroke="#ddd" strokeWidth="1" />
    </svg>
  );
}

/* ── Weight plates sticker for Sport ── */
export function WeightSticker({ className = '' }: { className?: string }) {
  return (
    <svg width="68" height="62" viewBox="0 0 68 62" fill="none" className={className}>
      <ellipse cx="34" cy="42" rx="28" ry="10" fill="white" stroke="white" strokeWidth="7" />
      <ellipse cx="34" cy="26" rx="20" ry="7" fill="white" stroke="white" strokeWidth="7" />
      <rect x="30" y="14" width="8" height="36" rx="4" fill="white" stroke="white" strokeWidth="7" />
      {/* Large plate */}
      <ellipse cx="34" cy="40" rx="28" ry="10" fill="#2563EB" stroke="#111" strokeWidth="2.5" />
      <path d="M6 40 Q6 44 34 46 Q62 44 62 40 L62 42 Q62 46 34 48 Q6 46 6 42Z" fill="#1D4ED8" stroke="#111" strokeWidth="2" />
      <ellipse cx="34" cy="40" rx="8" ry="3" fill="#111" stroke="#111" strokeWidth="1.5" />
      <ellipse cx="34" cy="40" rx="5" ry="2" fill="#1D4ED8" />
      <ellipse cx="34" cy="40" rx="20" ry="7" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="34" cy="40" rx="14" ry="5" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
      {/* Small plate */}
      <ellipse cx="34" cy="24" rx="20" ry="7" fill="#EF4444" stroke="#111" strokeWidth="2.5" />
      <path d="M14 24 Q14 28 34 30 Q54 28 54 24 L54 26 Q54 30 34 32 Q14 30 14 26Z" fill="#DC2626" stroke="#111" strokeWidth="2" />
      <ellipse cx="34" cy="24" rx="6" ry="2.2" fill="#111" stroke="#111" strokeWidth="1.5" />
      <ellipse cx="34" cy="24" rx="4" ry="1.5" fill="#DC2626" />
      <ellipse cx="34" cy="24" rx="14" ry="5" fill="none" stroke="#F87171" strokeWidth="1.5" opacity="0.5" />
      {/* Bar */}
      <rect x="31" y="26" width="6" height="14" rx="3" fill="#9CA3AF" stroke="#111" strokeWidth="2" />
      <rect x="32" y="28" width="2" height="10" rx="1" fill="white" opacity="0.3" />
      <rect x="31" y="10" width="6" height="14" rx="3" fill="#9CA3AF" stroke="#111" strokeWidth="2" />
    </svg>
  );
}

/* ── Macro icons ── */
export function ProteinIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="10" fill="#e8f5ed" />
      <path d="M9 22 Q8 14 14 10 Q18 8 22 10 Q26 12 24 18 Q22 24 16 24 Q10 24 9 22Z" fill="#2ea05a" />
      <path d="M14 10 Q16 8 20 10" stroke="#1a6b3f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M10 20 Q9 16 12 13" stroke="#86efac" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function CarbsIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="10" fill="#fff8e1" />
      <path d="M7 20 Q7 12 16 10 Q25 12 25 20 Q25 26 16 26 Q7 26 7 20Z" fill="#f0a500" />
      <path d="M10 16 Q13 12 16 11 Q19 12 22 16" fill="#fbbf24" opacity="0.6" />
      <path d="M10 20 Q13 18 16 18 Q19 18 22 20" stroke="#d97706" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function FatIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="10" fill="#e0f4f7" />
      <path d="M16 7 Q22 10 22 18 Q22 25 16 26 Q10 25 10 18 Q10 10 16 7Z" fill="#0b4f5c" />
      <path d="M16 7 Q19 10 19 18 Q19 24 16 26" fill="#1a6b7a" opacity="0.4" />
      <ellipse cx="16" cy="19" rx="4" ry="5" fill="#d4a96a" />
      <ellipse cx="16" cy="20" rx="2.5" ry="3" fill="#b8843f" />
    </svg>
  );
}

export function FiberIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="10" fill="#f0fce8" />
      <circle cx="14" cy="14" r="6" fill="#4ade80" />
      <circle cx="19" cy="12" r="5" fill="#22c55e" />
      <circle cx="12" cy="11" r="4" fill="#16a34a" />
      <rect x="14" y="19" width="3" height="6" rx="1.5" fill="#15803d" />
      <rect x="11" y="22" width="9" height="2" rx="1" fill="#14532d" />
    </svg>
  );
}

/* ── Logo mark ── */
export function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8fd44a, #6bc437)' }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3C10 3 6 7 6 11C6 13.2 7.8 15 10 15C12.2 15 14 13.2 14 11C14 7 10 3 10 3Z" fill="#0d3d22" />
        <path d="M10 15V18" stroke="#0d3d22" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
