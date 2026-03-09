import React from 'react';
import type { AvatarConfig } from '../../store/useStore';
import { HAIRSTYLES, OUTFITS, ACCESSORIES, PETS } from './avatarItems';

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
  onClick?: () => void;
}

// SVG paths for different hairstyles
function renderHair(style: string, color: string, size: number) {
  const s = size / 120; // scale factor (base size 120)
  switch (style) {
    case 'hair_short':
      return <path d={`M${30*s} ${38*s} Q${30*s} ${18*s} ${60*s} ${15*s} Q${90*s} ${18*s} ${90*s} ${38*s} L${85*s} ${35*s} Q${85*s} ${22*s} ${60*s} ${20*s} Q${35*s} ${22*s} ${35*s} ${35*s} Z`} fill={color} />;
    case 'hair_medium':
      return <>
        <path d={`M${28*s} ${38*s} Q${28*s} ${15*s} ${60*s} ${12*s} Q${92*s} ${15*s} ${92*s} ${38*s} L${90*s} ${50*s} Q${88*s} ${25*s} ${60*s} ${18*s} Q${32*s} ${25*s} ${30*s} ${50*s} Z`} fill={color} />
        <path d={`M${28*s} ${42*s} Q${26*s} ${55*s} ${30*s} ${62*s}`} stroke={color} strokeWidth={4*s} fill="none" strokeLinecap="round" />
        <path d={`M${92*s} ${42*s} Q${94*s} ${55*s} ${90*s} ${62*s}`} stroke={color} strokeWidth={4*s} fill="none" strokeLinecap="round" />
      </>;
    case 'hair_long':
      return <>
        <path d={`M${26*s} ${38*s} Q${26*s} ${12*s} ${60*s} ${10*s} Q${94*s} ${12*s} ${94*s} ${38*s} L${92*s} ${70*s} Q${90*s} ${25*s} ${60*s} ${16*s} Q${30*s} ${25*s} ${28*s} ${70*s} Z`} fill={color} />
        <path d={`M${26*s} ${45*s} Q${22*s} ${65*s} ${28*s} ${82*s}`} stroke={color} strokeWidth={5*s} fill="none" strokeLinecap="round" />
        <path d={`M${94*s} ${45*s} Q${98*s} ${65*s} ${92*s} ${82*s}`} stroke={color} strokeWidth={5*s} fill="none" strokeLinecap="round" />
      </>;
    case 'hair_curly':
      return <>
        <path d={`M${28*s} ${36*s} Q${28*s} ${12*s} ${60*s} ${10*s} Q${92*s} ${12*s} ${92*s} ${36*s}`} fill={color} />
        {[32, 42, 52, 62, 72, 82].map(x => <circle key={x} cx={x*s} cy={20*s} r={7*s} fill={color} />)}
        <circle cx={28*s} cy={45*s} r={6*s} fill={color} />
        <circle cx={92*s} cy={45*s} r={6*s} fill={color} />
      </>;
    case 'hair_afro':
      return <ellipse cx={60*s} cy={35*s} rx={38*s} ry={32*s} fill={color} />;
    case 'hair_braids':
      return <>
        <path d={`M${28*s} ${36*s} Q${28*s} ${12*s} ${60*s} ${10*s} Q${92*s} ${12*s} ${92*s} ${36*s} L${88*s} ${30*s} Q${88*s} ${18*s} ${60*s} ${16*s} Q${32*s} ${18*s} ${32*s} ${30*s} Z`} fill={color} />
        <path d={`M${32*s} ${38*s} L${28*s} ${75*s}`} stroke={color} strokeWidth={6*s} strokeLinecap="round" />
        <path d={`M${88*s} ${38*s} L${92*s} ${75*s}`} stroke={color} strokeWidth={6*s} strokeLinecap="round" />
        <circle cx={28*s} cy={78*s} r={4*s} fill={color} opacity={0.7} />
        <circle cx={92*s} cy={78*s} r={4*s} fill={color} opacity={0.7} />
      </>;
    case 'hair_mohawk':
      return <path d={`M${48*s} ${35*s} Q${48*s} ${5*s} ${60*s} ${2*s} Q${72*s} ${5*s} ${72*s} ${35*s} Q${68*s} ${20*s} ${60*s} ${8*s} Q${52*s} ${20*s} ${48*s} ${35*s}`} fill={color} />;
    case 'hair_bun':
      return <>
        <path d={`M${30*s} ${38*s} Q${30*s} ${15*s} ${60*s} ${12*s} Q${90*s} ${15*s} ${90*s} ${38*s} L${86*s} ${32*s} Q${86*s} ${20*s} ${60*s} ${18*s} Q${34*s} ${20*s} ${34*s} ${32*s} Z`} fill={color} />
        <circle cx={60*s} cy={12*s} r={10*s} fill={color} />
      </>;
    case 'hair_dreads':
      return <>
        <path d={`M${26*s} ${36*s} Q${26*s} ${12*s} ${60*s} ${10*s} Q${94*s} ${12*s} ${94*s} ${36*s}`} fill={color} />
        {[30, 40, 50, 60, 70, 80, 90].map((x, i) => (
          <path key={x} d={`M${x*s} ${(32+i%3*4)*s} L${(x+(i%2?3:-3))*s} ${(72+i%4*5)*s}`} stroke={color} strokeWidth={4*s} strokeLinecap="round" />
        ))}
      </>;
    case 'hair_crown':
      return <>
        <path d={`M${28*s} ${36*s} Q${28*s} ${12*s} ${60*s} ${10*s} Q${92*s} ${12*s} ${92*s} ${36*s} L${88*s} ${30*s} Q${88*s} ${18*s} ${60*s} ${16*s} Q${32*s} ${18*s} ${32*s} ${30*s} Z`} fill={color} />
        <path d={`M${32*s} ${22*s} Q${46*s} ${12*s} ${60*s} ${18*s} Q${74*s} ${12*s} ${88*s} ${22*s}`} stroke={color} strokeWidth={6*s} fill="none" strokeLinecap="round" />
        <circle cx={32*s} cy={20*s} r={3*s} fill="#FFD700" />
        <circle cx={60*s} cy={16*s} r={3*s} fill="#FFD700" />
        <circle cx={88*s} cy={20*s} r={3*s} fill="#FFD700" />
      </>;
    default:
      return null;
  }
}

// SVG for outfit/body
function renderOutfit(outfit: string, color: string, size: number) {
  const s = size / 120;
  return (
    <g>
      {/* Neck */}
      <rect x={52*s} y={68*s} width={16*s} height={10*s} rx={4*s} fill="currentColor" />
      {/* Body base */}
      <path d={`M${32*s} ${78*s} Q${32*s} ${74*s} ${40*s} ${72*s} L${52*s} ${72*s} Q${60*s} ${72*s} ${60*s} ${72*s} L${80*s} ${72*s} Q${88*s} ${74*s} ${88*s} ${78*s} L${92*s} ${110*s} Q${92*s} ${116*s} ${86*s} ${118*s} L${34*s} ${118*s} Q${28*s} ${116*s} ${28*s} ${110*s} Z`}
        fill={color} />
      {/* Collar detail based on outfit type */}
      {outfit === 'outfit_tshirt' && (
        <path d={`M${46*s} ${73*s} Q${60*s} ${79*s} ${74*s} ${73*s}`} stroke="rgba(255,255,255,0.3)" strokeWidth={2*s} fill="none" />
      )}
      {outfit === 'outfit_casual' && (
        <>
          <path d={`M${50*s} ${73*s} L${50*s} ${86*s}`} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5*s} />
          <path d={`M${70*s} ${73*s} L${70*s} ${86*s}`} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5*s} />
        </>
      )}
      {outfit === 'outfit_sport' && (
        <>
          <path d={`M${38*s} ${80*s} L${50*s} ${82*s}`} stroke="rgba(255,255,255,0.4)" strokeWidth={2*s} strokeLinecap="round" />
          <path d={`M${82*s} ${80*s} L${70*s} ${82*s}`} stroke="rgba(255,255,255,0.4)" strokeWidth={2*s} strokeLinecap="round" />
        </>
      )}
      {outfit === 'outfit_hoodie' && (
        <>
          <path d={`M${44*s} ${73*s} Q${60*s} ${82*s} ${76*s} ${73*s}`} stroke="rgba(0,0,0,0.15)" strokeWidth={2*s} fill="none" />
          <ellipse cx={60*s} cy={95*s} rx={8*s} ry={4*s} fill="rgba(0,0,0,0.1)" />
        </>
      )}
      {outfit === 'outfit_suit' && (
        <>
          <path d={`M${46*s} ${73*s} L${56*s} ${95*s} L${60*s} ${73*s}`} fill="rgba(255,255,255,0.9)" />
          <path d={`M${74*s} ${73*s} L${64*s} ${95*s} L${60*s} ${73*s}`} fill="rgba(255,255,255,0.9)" />
          <circle cx={60*s} cy={88*s} r={2*s} fill="rgba(0,0,0,0.3)" />
        </>
      )}
      {outfit === 'outfit_dress' && (
        <path d={`M${34*s} ${100*s} Q${60*s} ${95*s} ${86*s} ${100*s} L${92*s} ${118*s} L${28*s} ${118*s} Z`} fill={color} opacity={0.8} />
      )}
      {outfit === 'outfit_royal' && (
        <>
          <path d={`M${40*s} ${80*s} L${80*s} ${80*s}`} stroke="#FFD700" strokeWidth={3*s} />
          <path d={`M${46*s} ${85*s} L${74*s} ${85*s}`} stroke="#FFD700" strokeWidth={1.5*s} />
        </>
      )}
      {outfit === 'outfit_legend' && (
        <>
          <path d={`M${36*s} ${78*s} L${32*s} ${85*s} L${38*s} ${82*s}`} fill="#FFD700" opacity={0.6} />
          <path d={`M${84*s} ${78*s} L${88*s} ${85*s} L${82*s} ${82*s}`} fill="#FFD700" opacity={0.6} />
          <path d={`M${56*s} ${80*s} L${60*s} ${76*s} L${64*s} ${80*s} L${60*s} ${84*s} Z`} fill="#FFD700" opacity={0.5} />
        </>
      )}
    </g>
  );
}

// SVG for accessory
function renderAccessory(acc: string | null, size: number) {
  if (!acc || acc === 'acc_none') return null;
  const s = size / 120;
  switch (acc) {
    case 'acc_glasses':
      return <g>
        <circle cx={48*s} cy={46*s} r={8*s} fill="none" stroke="#333" strokeWidth={1.5*s} />
        <circle cx={72*s} cy={46*s} r={8*s} fill="none" stroke="#333" strokeWidth={1.5*s} />
        <path d={`M${56*s} ${46*s} L${64*s} ${46*s}`} stroke="#333" strokeWidth={1.5*s} />
        <path d={`M${40*s} ${44*s} L${34*s} ${42*s}`} stroke="#333" strokeWidth={1.5*s} />
        <path d={`M${80*s} ${44*s} L${86*s} ${42*s}`} stroke="#333" strokeWidth={1.5*s} />
      </g>;
    case 'acc_sunglasses':
      return <g>
        <rect x={38*s} y={40*s} width={18*s} height={12*s} rx={3*s} fill="#1A1A1A" opacity={0.85} />
        <rect x={64*s} y={40*s} width={18*s} height={12*s} rx={3*s} fill="#1A1A1A" opacity={0.85} />
        <path d={`M${56*s} ${45*s} L${64*s} ${45*s}`} stroke="#1A1A1A" strokeWidth={2*s} />
        <path d={`M${38*s} ${43*s} L${32*s} ${41*s}`} stroke="#1A1A1A" strokeWidth={2*s} />
        <path d={`M${82*s} ${43*s} L${88*s} ${41*s}`} stroke="#1A1A1A" strokeWidth={2*s} />
      </g>;
    case 'acc_cap':
      return <g>
        <path d={`M${28*s} ${34*s} Q${28*s} ${20*s} ${60*s} ${18*s} Q${92*s} ${20*s} ${92*s} ${34*s} L${28*s} ${34*s}`} fill="#3B82F6" />
        <rect x={22*s} y={32*s} width={76*s} height={4*s} rx={2*s} fill="#2563EB" />
        <path d={`M${22*s} ${34*s} L${10*s} ${36*s} Q${8*s} ${37*s} ${12*s} ${38*s} L${28*s} ${36*s}`} fill="#2563EB" />
      </g>;
    case 'acc_watch':
      return <g>
        <rect x={24*s} y={90*s} width={10*s} height={14*s} rx={3*s} fill="#333" />
        <rect x={26*s} y={92*s} width={6*s} height={10*s} rx={1*s} fill="#4ADE80" opacity={0.7} />
      </g>;
    case 'acc_bracelet':
      return <ellipse cx={88*s} cy={96*s} rx={5*s} ry={3*s} fill="none" stroke="#FFD700" strokeWidth={2*s} />;
    case 'acc_headband':
      return <path d={`M${30*s} ${30*s} Q${60*s} ${24*s} ${90*s} ${30*s}`} stroke="#DC2626" strokeWidth={4*s} fill="none" />;
    case 'acc_earbuds':
      return <g>
        <circle cx={32*s} cy={52*s} r={4*s} fill="#F5F5F5" />
        <circle cx={88*s} cy={52*s} r={4*s} fill="#F5F5F5" />
        <path d={`M${32*s} ${48*s} Q${32*s} ${38*s} ${40*s} ${34*s}`} stroke="#F5F5F5" strokeWidth={1.5*s} fill="none" />
        <path d={`M${88*s} ${48*s} Q${88*s} ${38*s} ${80*s} ${34*s}`} stroke="#F5F5F5" strokeWidth={1.5*s} fill="none" />
      </g>;
    case 'acc_necklace':
      return <path d={`M${44*s} ${72*s} Q${52*s} ${80*s} ${60*s} ${82*s} Q${68*s} ${80*s} ${76*s} ${72*s}`} stroke="#FFD700" strokeWidth={2*s} fill="none" />;
    case 'acc_backpack':
      return <g>
        <rect x={90*s} y={76*s} width={12*s} height={18*s} rx={4*s} fill="#EA580C" />
        <path d={`M${92*s} ${76*s} L${92*s} ${72*s}`} stroke="#EA580C" strokeWidth={2*s} />
        <path d={`M${100*s} ${76*s} L${100*s} ${72*s}`} stroke="#EA580C" strokeWidth={2*s} />
      </g>;
    case 'acc_smartwatch':
      return <g>
        <rect x={23*s} y={89*s} width={12*s} height={16*s} rx={4*s} fill="#1A1A1A" />
        <rect x={25*s} y={91*s} width={8*s} height={12*s} rx={2*s} fill="#3B82F6" opacity={0.8} />
        <circle cx={29*s} cy={97*s} r={1.5*s} fill="white" opacity={0.6} />
      </g>;
    case 'acc_crown':
      return <g>
        <path d={`M${38*s} ${18*s} L${42*s} ${6*s} L${50*s} ${14*s} L${60*s} ${4*s} L${70*s} ${14*s} L${78*s} ${6*s} L${82*s} ${18*s} Z`} fill="#FFD700" />
        <circle cx={60*s} cy={10*s} r={3*s} fill="#DC2626" />
        <rect x={38*s} y={16*s} width={44*s} height={4*s} fill="#FFD700" />
      </g>;
    default:
      return null;
  }
}

// SVG for pet
function renderPet(pet: string | null, size: number) {
  if (!pet || pet === 'pet_none') return null;
  const s = size / 120;
  const px = 98 * s;
  const py = 105 * s;
  switch (pet) {
    case 'pet_cat':
      return <g>
        <ellipse cx={px} cy={py} rx={8*s} ry={6*s} fill="#F59E0B" />
        <polygon points={`${(px-6*s)},${(py-6*s)} ${(px-2*s)},${(py-12*s)} ${(px+2*s)},${(py-6*s)}`} fill="#F59E0B" />
        <polygon points={`${(px+2*s)},${(py-6*s)} ${(px+6*s)},${(py-12*s)} ${(px+10*s)},${(py-6*s)}`} fill="#F59E0B" />
        <circle cx={px-3*s} cy={py-2*s} r={1.5*s} fill="#1A1A1A" />
        <circle cx={px+3*s} cy={py-2*s} r={1.5*s} fill="#1A1A1A" />
        <path d={`M${px+8*s} ${py+2*s} Q${px+14*s} ${py-2*s} ${px+12*s} ${py+6*s}`} stroke="#F59E0B" strokeWidth={2*s} fill="none" />
      </g>;
    case 'pet_dog':
      return <g>
        <ellipse cx={px} cy={py} rx={9*s} ry={7*s} fill="#8B6914" />
        <ellipse cx={px-6*s} cy={py-5*s} rx={4*s} ry={6*s} fill="#8B6914" />
        <ellipse cx={px+6*s} cy={py-5*s} rx={4*s} ry={6*s} fill="#8B6914" />
        <circle cx={px-3*s} cy={py-2*s} r={1.5*s} fill="#1A1A1A" />
        <circle cx={px+3*s} cy={py-2*s} r={1.5*s} fill="#1A1A1A" />
        <ellipse cx={px} cy={py+2*s} rx={3*s} ry={2*s} fill="#1A1A1A" />
      </g>;
    case 'pet_parrot':
      return <g>
        <ellipse cx={px} cy={py-2*s} rx={6*s} ry={8*s} fill="#22C55E" />
        <circle cx={px} cy={py-6*s} r={5*s} fill="#16A34A" />
        <circle cx={px-2*s} cy={py-7*s} r={1.2*s} fill="#1A1A1A" />
        <circle cx={px+2*s} cy={py-7*s} r={1.2*s} fill="#1A1A1A" />
        <path d={`M${px} ${py-4*s} L${px+3*s} ${py-5*s} L${px} ${py-3*s}`} fill="#F59E0B" />
        <path d={`M${px+4*s} ${py+4*s} L${px+8*s} ${py+10*s}`} stroke="#22C55E" strokeWidth={2*s} />
      </g>;
    case 'pet_rabbit':
      return <g>
        <ellipse cx={px} cy={py} rx={7*s} ry={6*s} fill="#F5F5F5" />
        <ellipse cx={px-3*s} cy={py-10*s} rx={2.5*s} ry={7*s} fill="#F5F5F5" />
        <ellipse cx={px+3*s} cy={py-10*s} rx={2.5*s} ry={7*s} fill="#F5F5F5" />
        <ellipse cx={px-3*s} cy={py-10*s} rx={1.5*s} ry={5*s} fill="#FCA5A5" />
        <ellipse cx={px+3*s} cy={py-10*s} rx={1.5*s} ry={5*s} fill="#FCA5A5" />
        <circle cx={px-2*s} cy={py-2*s} r={1.2*s} fill="#1A1A1A" />
        <circle cx={px+2*s} cy={py-2*s} r={1.2*s} fill="#1A1A1A" />
        <ellipse cx={px} cy={py+1*s} rx={2*s} ry={1.5*s} fill="#FCA5A5" />
      </g>;
    case 'pet_hamster':
      return <g>
        <circle cx={px} cy={py} r={7*s} fill="#F59E0B" />
        <circle cx={px-4*s} cy={py-4*s} r={3*s} fill="#FBBF24" />
        <circle cx={px+4*s} cy={py-4*s} r={3*s} fill="#FBBF24" />
        <circle cx={px-2*s} cy={py-1*s} r={1.2*s} fill="#1A1A1A" />
        <circle cx={px+2*s} cy={py-1*s} r={1.2*s} fill="#1A1A1A" />
        <ellipse cx={px} cy={py+2*s} rx={4*s} ry={3*s} fill="#FDE68A" />
        <circle cx={px} cy={py+1*s} r={1*s} fill="#F59E0B" />
      </g>;
    default:
      return null;
  }
}

export default function Avatar({ config, size = 120, className = '', onClick }: AvatarProps) {
  const s = size / 120;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {/* Background circle */}
      <circle cx={size/2} cy={size/2} r={size/2 - 2} fill="#F0F4FF" stroke="#E0E7FF" strokeWidth={2} />

      {/* Hair behind (for long styles) */}
      {['hair_long', 'hair_braids', 'hair_dreads'].includes(config.hairStyle) && (
        <g opacity={0.5}>{renderHair(config.hairStyle, config.hairColor, size)}</g>
      )}

      {/* Body/outfit */}
      <g style={{ color: config.skinColor }}>
        {renderOutfit(config.outfit, config.outfitColor, size)}
      </g>

      {/* Face/head */}
      <ellipse cx={60*s} cy={45*s} rx={24*s} ry={26*s} fill={config.skinColor} />

      {/* Eyes */}
      <ellipse cx={50*s} cy={45*s} rx={3*s} ry={3.5*s} fill="white" />
      <ellipse cx={70*s} cy={45*s} rx={3*s} ry={3.5*s} fill="white" />
      <circle cx={50*s} cy={45.5*s} r={2*s} fill={config.eyeColor} />
      <circle cx={70*s} cy={45.5*s} r={2*s} fill={config.eyeColor} />
      <circle cx={50.5*s} cy={44.5*s} r={0.8*s} fill="white" />
      <circle cx={70.5*s} cy={44.5*s} r={0.8*s} fill="white" />

      {/* Eyebrows */}
      <path d={`M${44*s} ${38*s} Q${50*s} ${35*s} ${56*s} ${37*s}`} stroke={config.hairColor} strokeWidth={2*s} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d={`M${64*s} ${37*s} Q${70*s} ${35*s} ${76*s} ${38*s}`} stroke={config.hairColor} strokeWidth={2*s} fill="none" strokeLinecap="round" opacity={0.6} />

      {/* Nose */}
      <path d={`M${58*s} ${50*s} Q${60*s} ${54*s} ${62*s} ${50*s}`} stroke={config.skinColor} strokeWidth={1.5*s} fill="none" opacity={0.4}
        filter="brightness(0.85)" />

      {/* Mouth - smile */}
      <path d={`M${52*s} ${57*s} Q${60*s} ${63*s} ${68*s} ${57*s}`} stroke="#E8846B" strokeWidth={2*s} fill="none" strokeLinecap="round" />

      {/* Ears */}
      <ellipse cx={36*s} cy={46*s} rx={4*s} ry={6*s} fill={config.skinColor} />
      <ellipse cx={84*s} cy={46*s} rx={4*s} ry={6*s} fill={config.skinColor} />

      {/* Hair in front */}
      {renderHair(config.hairStyle, config.hairColor, size)}

      {/* Accessory */}
      {renderAccessory(config.accessory, size)}

      {/* Pet */}
      {renderPet(config.pet, size)}
    </svg>
  );
}
