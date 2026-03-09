import React from 'react';

/**
 * SVG-based item previews for the game inventory.
 * Each item gets a unique visual — not generic emoji.
 */

// ── Hairstyle silhouettes ──
const HAIR_SVGS: Record<string, React.ReactNode> = {
  hair_short: (
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="28" r="12" fill="#E8B89D" /><path d="M12 26c0-8 5-16 12-16s12 8 12 16" fill="#4A2912" /><circle cx="20" cy="29" r="1.5" fill="#333" /><circle cx="28" cy="29" r="1.5" fill="#333" /><path d="M22 33c1 1 3 1 4 0" stroke="#333" strokeWidth="1.2" strokeLinecap="round" /></svg>
  ),
  hair_medium: (
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="28" r="12" fill="#E8B89D" /><path d="M10 26c0-9 6-16 14-16s14 7 14 16" fill="#6B3A2A" /><path d="M10 26c-1 6 0 12 2 14" stroke="#6B3A2A" strokeWidth="3" strokeLinecap="round" /><path d="M38 26c1 6 0 12-2 14" stroke="#6B3A2A" strokeWidth="3" strokeLinecap="round" /><circle cx="20" cy="29" r="1.5" fill="#333" /><circle cx="28" cy="29" r="1.5" fill="#333" /></svg>
  ),
  hair_long: (
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="26" r="12" fill="#E8B89D" /><path d="M10 24c0-9 6-15 14-15s14 6 14 15" fill="#1A1A1A" /><path d="M10 24c-2 10 0 18 3 20" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" /><path d="M38 24c2 10 0 18-3 20" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" /><circle cx="20" cy="27" r="1.5" fill="#333" /><circle cx="28" cy="27" r="1.5" fill="#333" /></svg>
  ),
  hair_curly: (
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="28" r="12" fill="#E8B89D" /><circle cx="14" cy="18" r="4" fill="#922B05" /><circle cx="20" cy="13" r="4" fill="#922B05" /><circle cx="28" cy="13" r="4" fill="#922B05" /><circle cx="34" cy="18" r="4" fill="#922B05" /><circle cx="11" cy="25" r="3" fill="#922B05" /><circle cx="37" cy="25" r="3" fill="#922B05" /><circle cx="20" cy="29" r="1.5" fill="#333" /><circle cx="28" cy="29" r="1.5" fill="#333" /></svg>
  ),
  hair_afro: (
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" fill="#1A1A1A" /><circle cx="24" cy="28" r="11" fill="#8D5524" /><circle cx="20" cy="29" r="1.5" fill="#333" /><circle cx="28" cy="29" r="1.5" fill="#333" /><path d="M22 33c1 1 3 1 4 0" stroke="#333" strokeWidth="1.2" strokeLinecap="round" /></svg>
  ),
  hair_braids: (
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="26" r="12" fill="#E8B89D" /><path d="M12 22c0-8 5-14 12-14s12 6 12 14" fill="#4A2912" /><path d="M14 22v14M16 24l-2 4 2 4-2 4" stroke="#4A2912" strokeWidth="2.5" /><path d="M34 22v14M32 24l2 4-2 4 2 4" stroke="#4A2912" strokeWidth="2.5" /><circle cx="20" cy="27" r="1.5" fill="#333" /><circle cx="28" cy="27" r="1.5" fill="#333" /></svg>
  ),
  hair_mohawk: (
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="30" r="11" fill="#E8B89D" /><path d="M20 10c2-4 6-4 8 0v20h-8z" fill="#DC2626" /><rect x="21" y="8" width="6" height="16" rx="2" fill="#DC2626" /><circle cx="20" cy="31" r="1.5" fill="#333" /><circle cx="28" cy="31" r="1.5" fill="#333" /></svg>
  ),
  hair_bun: (
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="30" r="12" fill="#E8B89D" /><path d="M12 28c0-8 5-14 12-14s12 6 12 14" fill="#6B3A20" /><circle cx="24" cy="14" r="6" fill="#6B3A20" /><circle cx="20" cy="31" r="1.5" fill="#333" /><circle cx="28" cy="31" r="1.5" fill="#333" /></svg>
  ),
  hair_dreads: (
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="28" r="12" fill="#8D5524" /><path d="M14 18c0-6 4-10 10-10s10 4 10 10" fill="#1A1A1A" /><path d="M14 18v20M18 16v22M22 15v24M26 15v24M30 16v22M34 18v20" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" /><circle cx="20" cy="29" r="1.5" fill="#FFF" /><circle cx="28" cy="29" r="1.5" fill="#FFF" /></svg>
  ),
  hair_crown: (
    <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="30" r="12" fill="#E8B89D" /><path d="M12 28c0-8 5-14 12-14s12 6 12 14" fill="#D4A937" /><path d="M10 14l6 6 4-4 4 6 4-6 4 4 6-6v10H10z" fill="#F59E0B" /><circle cx="18" cy="14" r="2" fill="#EF4444" /><circle cx="30" cy="14" r="2" fill="#3B82F6" /><circle cx="24" cy="12" r="2" fill="#22C55E" /><circle cx="20" cy="31" r="1.5" fill="#333" /><circle cx="28" cy="31" r="1.5" fill="#333" /></svg>
  ),
};

// ── Outfit silhouettes ──
const OUTFIT_SVGS: Record<string, React.ReactNode> = {
  outfit_tshirt: (
    <svg viewBox="0 0 48 48" fill="none"><path d="M14 14l-8 6v4l6 2v18h24V26l6-2v-4l-8-6-4 4h-12l-4-4z" fill="#3B82F6" /><path d="M18 14c0 0 2 4 6 4s6-4 6-4" stroke="#2563EB" strokeWidth="1.5" /></svg>
  ),
  outfit_sport: (
    <svg viewBox="0 0 48 48" fill="none"><path d="M14 14l-8 6v4l6 2v18h24V26l6-2v-4l-8-6-4 4h-12l-4-4z" fill="#10B981" /><path d="M24 20v20M16 26h16" stroke="#059669" strokeWidth="2" /><circle cx="24" cy="20" r="3" fill="#FFF" fillOpacity="0.3" /></svg>
  ),
  outfit_casual: (
    <svg viewBox="0 0 48 48" fill="none"><path d="M14 14l-6 4v6l4 2v18h24V26l4-2v-6l-6-4-4 4h-12z" fill="#F5F5F5" stroke="#D4D4D4" strokeWidth="1" /><rect x="22" y="14" width="4" height="28" fill="#1E3A5F" /><circle cx="24" cy="18" r="1.5" fill="#1E3A5F" /><circle cx="24" cy="24" r="1.5" fill="#1E3A5F" /></svg>
  ),
  outfit_hoodie: (
    <svg viewBox="0 0 48 48" fill="none"><path d="M12 14l-6 6v4l6 2v18h24V26l6-2v-4l-6-6-6 2h-6l-6-2z" fill="#6B7280" /><path d="M18 14c2 6 10 6 12 0" stroke="#4B5563" strokeWidth="2" fill="#4B5563" /><ellipse cx="24" cy="14" rx="6" ry="3" fill="#4B5563" /><path d="M20 28h8v6a4 4 0 01-8 0z" fill="#4B5563" /></svg>
  ),
  outfit_jacket: (
    <svg viewBox="0 0 48 48" fill="none"><path d="M14 14l-8 6v4l6 2v18h24V26l6-2v-4l-8-6-4 4h-12l-4-4z" fill="#1E40AF" /><rect x="22" y="14" width="4" height="28" fill="#93C5FD" /><rect x="10" y="22" width="10" height="12" rx="2" fill="#1E3A8A" fillOpacity="0.3" /><rect x="28" y="22" width="10" height="12" rx="2" fill="#1E3A8A" fillOpacity="0.3" /></svg>
  ),
  outfit_dress: (
    <svg viewBox="0 0 48 48" fill="none"><path d="M18 12h12l2 14 6 16H10l6-16z" fill="#EC4899" /><path d="M18 12c2 4 10 4 12 0" stroke="#DB2777" strokeWidth="1.5" /><path d="M10 42l6-16M38 42l-6-16" stroke="#DB2777" strokeWidth="1" /><circle cx="24" cy="20" r="1" fill="#FFF" /><circle cx="24" cy="24" r="1" fill="#FFF" /></svg>
  ),
  outfit_suit: (
    <svg viewBox="0 0 48 48" fill="none"><path d="M14 14l-8 6v4l6 2v18h24V26l6-2v-4l-8-6-4 4h-12l-4-4z" fill="#1F2937" /><path d="M20 14l4 8 4-8" fill="#F5F5F5" /><rect x="22.5" y="22" width="3" height="20" fill="#F5F5F5" opacity="0.8" /><path d="M24 22l-2-2h4z" fill="#DC2626" /><rect x="22" y="22" width="4" height="5" fill="#DC2626" /></svg>
  ),
  outfit_gym: (
    <svg viewBox="0 0 48 48" fill="none"><path d="M16 16l-6 4v4l4 2v16h20V26l4-2v-4l-6-4-3 3h-10z" fill="#111827" /><path d="M18 22l4 2 4-2 4 2" stroke="#F59E0B" strokeWidth="1.5" /><text x="24" y="34" textAnchor="middle" fill="#F59E0B" fontSize="7" fontWeight="bold">PRO</text></svg>
  ),
  outfit_royal: (
    <svg viewBox="0 0 48 48" fill="none"><path d="M14 14l-8 6v4l6 2v18h24V26l6-2v-4l-8-6-4 4h-12l-4-4z" fill="#7C3AED" /><path d="M12 26h24" stroke="#F59E0B" strokeWidth="2" /><path d="M12 30h24" stroke="#F59E0B" strokeWidth="1" /><path d="M18 14c2 4 10 4 12 0" stroke="#F59E0B" strokeWidth="1.5" /><circle cx="24" cy="34" r="3" fill="#F59E0B" /></svg>
  ),
  outfit_legend: (
    <svg viewBox="0 0 48 48" fill="none"><path d="M14 12l-8 8v4l6 2v18h24V26l6-2v-4l-8-8-4 4h-12z" fill="#6B7280" /><path d="M14 12l-8 8" stroke="#9CA3AF" strokeWidth="2" /><path d="M34 12l8 8" stroke="#9CA3AF" strokeWidth="2" /><rect x="20" y="18" width="8" height="12" rx="1" fill="#F59E0B" /><path d="M24 18v-4M20 22h8" stroke="#F59E0B" strokeWidth="1.5" /><path d="M22 34l2 6 2-6" fill="#F59E0B" /></svg>
  ),
};

interface ItemPreviewProps {
  itemId: string;
  emoji: string;
  type: string;
  size?: number;
  className?: string;
}

export default function ItemPreview({ itemId, emoji, type, size = 48, className = '' }: ItemPreviewProps) {
  // Use SVG for hairstyles and outfits
  const svg = HAIR_SVGS[itemId] || OUTFIT_SVGS[itemId];
  if (svg) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        {svg}
      </div>
    );
  }

  // For accessories and pets, use Fluent 3D emoji (they're already distinct)
  const url = getFluentUrl(emoji);
  if (url) {
    return <img src={url} alt={itemId} width={size} height={size} className={`inline-block ${className}`} loading="lazy" />;
  }

  // Fallback: first letter in a styled circle
  const label = itemId.split('_').pop() || '?';
  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.35, fontWeight: 700, color: '#6B7280' }}
    >
      {label.charAt(0).toUpperCase()}
    </div>
  );
}

// Inline helper to avoid importing fluentEmoji in this file
function getFluentUrl(name: string): string {
  const CDN = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets';
  const MAP: Record<string, string> = {
    sparkles: 'Sparkles/3D/sparkles_3d.png',
    glasses: 'Glasses/3D/glasses_3d.png',
    sunglasses: 'Sunglasses/3D/sunglasses_3d.png',
    billedCap: 'Billed cap/3D/billed_cap_3d.png',
    watch: 'Watch/3D/watch_3d.png',
    prayerBeads: 'Prayer beads/3D/prayer_beads_3d.png',
    ribbon: 'Ribbon/3D/ribbon_3d.png',
    headphone: 'Headphone/3D/headphone_3d.png',
    backpack: 'Backpack/3D/backpack_3d.png',
    crown: 'Crown/3D/crown_3d.png',
    catFace: 'Cat face/3D/cat_face_3d.png',
    dogFace: 'Dog face/3D/dog_face_3d.png',
    parrot: 'Parrot/3D/parrot_3d.png',
    rabbitFace: 'Rabbit face/3D/rabbit_face_3d.png',
    hamster: 'Hamster/3D/hamster_3d.png',
  };
  return MAP[name] ? `${CDN}/${MAP[name]}` : '';
}
