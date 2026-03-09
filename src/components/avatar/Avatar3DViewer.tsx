import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { AvatarConfig } from '../../store/useStore';

// ── Helper: darken/lighten a hex color ──
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(2.55 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(2.55 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ── Hair Mesh ──
function HairMesh({ style, color }: { style: string; color: string }) {
  const c = new THREE.Color(color);
  const dark = new THREE.Color(shadeColor(color, -15));

  switch (style) {
    case 'hair_short':
      return (
        <group position={[0, 1.62, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={c} />
          </mesh>
        </group>
      );
    case 'hair_medium':
      return (
        <group position={[0, 1.62, 0]}>
          <mesh>
            <sphereGeometry args={[0.44, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color={c} />
          </mesh>
          {/* Side strands */}
          <mesh position={[-0.38, -0.2, 0]}>
            <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
            <meshStandardMaterial color={dark} />
          </mesh>
          <mesh position={[0.38, -0.2, 0]}>
            <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
            <meshStandardMaterial color={dark} />
          </mesh>
        </group>
      );
    case 'hair_long':
      return (
        <group position={[0, 1.62, 0]}>
          <mesh>
            <sphereGeometry args={[0.44, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={c} />
          </mesh>
          {/* Long back hair */}
          <mesh position={[0, -0.45, -0.1]}>
            <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
            <meshStandardMaterial color={dark} />
          </mesh>
          {/* Side strands */}
          <mesh position={[-0.35, -0.35, 0.05]}>
            <capsuleGeometry args={[0.07, 0.5, 4, 8]} />
            <meshStandardMaterial color={c} />
          </mesh>
          <mesh position={[0.35, -0.35, 0.05]}>
            <capsuleGeometry args={[0.07, 0.5, 4, 8]} />
            <meshStandardMaterial color={c} />
          </mesh>
        </group>
      );
    case 'hair_curly':
      return (
        <group position={[0, 1.72, 0]}>
          {/* Poofy curly top */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const r = 0.35 + Math.sin(i * 2.7) * 0.08;
            return (
              <mesh key={i} position={[Math.cos(angle) * r * 0.7, Math.sin(i * 1.3) * 0.12, Math.sin(angle) * r * 0.7]}>
                <sphereGeometry args={[0.14, 8, 6]} />
                <meshStandardMaterial color={i % 2 ? c : dark} />
              </mesh>
            );
          })}
          <mesh>
            <sphereGeometry args={[0.38, 12, 10]} />
            <meshStandardMaterial color={c} />
          </mesh>
        </group>
      );
    case 'hair_afro':
      return (
        <group position={[0, 1.72, 0]}>
          <mesh>
            <sphereGeometry args={[0.55, 16, 14]} />
            <meshStandardMaterial color={c} />
          </mesh>
        </group>
      );
    case 'hair_braids':
      return (
        <group position={[0, 1.62, 0]}>
          <mesh>
            <sphereGeometry args={[0.43, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={c} />
          </mesh>
          {/* Braids */}
          <mesh position={[-0.35, -0.5, 0.05]}>
            <capsuleGeometry args={[0.06, 0.7, 4, 8]} />
            <meshStandardMaterial color={dark} />
          </mesh>
          <mesh position={[0.35, -0.5, 0.05]}>
            <capsuleGeometry args={[0.06, 0.7, 4, 8]} />
            <meshStandardMaterial color={dark} />
          </mesh>
          {/* Braid tips */}
          <mesh position={[-0.35, -0.9, 0.05]}>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshStandardMaterial color={new THREE.Color('#FFD700')} />
          </mesh>
          <mesh position={[0.35, -0.9, 0.05]}>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshStandardMaterial color={new THREE.Color('#FFD700')} />
          </mesh>
        </group>
      );
    case 'hair_mohawk':
      return (
        <group position={[0, 1.8, 0]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={i} position={[0, i * 0.06, -0.08 + i * 0.02]} scale={[1, 1.2 - i * 0.1, 1]}>
              <sphereGeometry args={[0.12 - i * 0.01, 8, 6]} />
              <meshStandardMaterial color={i % 2 ? c : dark} />
            </mesh>
          ))}
        </group>
      );
    case 'hair_bun':
      return (
        <group position={[0, 1.62, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={c} />
          </mesh>
          {/* Bun on top */}
          <mesh position={[0, 0.3, -0.05]}>
            <sphereGeometry args={[0.18, 12, 10]} />
            <meshStandardMaterial color={dark} />
          </mesh>
        </group>
      );
    case 'hair_dreads':
      return (
        <group position={[0, 1.62, 0]}>
          <mesh>
            <sphereGeometry args={[0.44, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={c} />
          </mesh>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 0.3, -0.4 - (i % 3) * 0.15, Math.sin(angle) * 0.3]}
                rotation={[0.3 * Math.sin(angle), 0, 0.3 * Math.cos(angle)]}>
                <capsuleGeometry args={[0.04, 0.4 + (i % 3) * 0.1, 4, 6]} />
                <meshStandardMaterial color={i % 2 ? c : dark} />
              </mesh>
            );
          })}
        </group>
      );
    case 'hair_crown':
      return (
        <group position={[0, 1.62, 0]}>
          <mesh>
            <sphereGeometry args={[0.43, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={c} />
          </mesh>
          {/* Braided crown */}
          <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.35, 0.06, 8, 16]} />
            <meshStandardMaterial color={dark} />
          </mesh>
          {/* Golden accents */}
          {[0, 1.5, 3, 4.5].map((a, i) => (
            <mesh key={i} position={[Math.cos(a) * 0.35, 0.15, Math.sin(a) * 0.35]}>
              <sphereGeometry args={[0.04, 6, 4]} />
              <meshStandardMaterial color={new THREE.Color('#FFD700')} metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      );
    default:
      return (
        <group position={[0, 1.62, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={c} />
          </mesh>
        </group>
      );
  }
}

// ── Accessory Mesh ──
function AccessoryMesh({ accessory }: { accessory: string | null }) {
  if (!accessory || accessory === 'acc_none') return null;

  switch (accessory) {
    case 'acc_glasses':
      return (
        <group position={[0, 1.55, 0.32]}>
          <mesh position={[-0.12, 0, 0]}>
            <torusGeometry args={[0.08, 0.015, 8, 16]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <torusGeometry args={[0.08, 0.015, 8, 16]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.015, 0.015]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      );
    case 'acc_sunglasses':
      return (
        <group position={[0, 1.55, 0.32]}>
          <mesh position={[-0.12, 0, 0]}>
            <boxGeometry args={[0.18, 0.1, 0.02]} />
            <meshStandardMaterial color="#1A1A1A" opacity={0.9} transparent />
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <boxGeometry args={[0.18, 0.1, 0.02]} />
            <meshStandardMaterial color="#1A1A1A" opacity={0.9} transparent />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.06, 0.02, 0.02]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
        </group>
      );
    case 'acc_cap':
      return (
        <group position={[0, 1.78, 0.05]}>
          <mesh>
            <sphereGeometry args={[0.42, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
            <meshStandardMaterial color="#3B82F6" />
          </mesh>
          {/* Brim */}
          <mesh position={[0, -0.05, 0.3]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.35, 0.03, 0.25]} />
            <meshStandardMaterial color="#2563EB" />
          </mesh>
        </group>
      );
    case 'acc_watch':
      return (
        <group position={[-0.45, 0.95, 0]}>
          <mesh>
            <boxGeometry args={[0.08, 0.1, 0.08]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.06, 0.06, 0.02]} />
            <meshStandardMaterial color="#4ADE80" emissive="#4ADE80" emissiveIntensity={0.3} />
          </mesh>
        </group>
      );
    case 'acc_bracelet':
      return (
        <mesh position={[0.45, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.1, 0.02, 8, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      );
    case 'acc_headband':
      return (
        <mesh position={[0, 1.72, 0]} rotation={[0.15, 0, 0]}>
          <torusGeometry args={[0.38, 0.03, 8, 24]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
      );
    case 'acc_earbuds':
      return (
        <group>
          <mesh position={[-0.35, 1.5, 0.1]}>
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshStandardMaterial color="#F5F5F5" />
          </mesh>
          <mesh position={[0.35, 1.5, 0.1]}>
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshStandardMaterial color="#F5F5F5" />
          </mesh>
        </group>
      );
    case 'acc_necklace':
      return (
        <mesh position={[0, 1.2, 0.18]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[0.15, 0.015, 8, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      );
    case 'acc_backpack':
      return (
        <group position={[0, 1.05, -0.3]}>
          <mesh>
            <boxGeometry args={[0.35, 0.4, 0.15]} />
            <meshStandardMaterial color="#EA580C" />
          </mesh>
          <mesh position={[0, 0.08, 0.01]}>
            <boxGeometry args={[0.2, 0.12, 0.16]} />
            <meshStandardMaterial color={new THREE.Color(shadeColor('#EA580C', -15))} />
          </mesh>
          {/* Straps */}
          <mesh position={[-0.12, 0.22, 0.08]}>
            <capsuleGeometry args={[0.02, 0.15, 4, 6]} />
            <meshStandardMaterial color={new THREE.Color(shadeColor('#EA580C', -20))} />
          </mesh>
          <mesh position={[0.12, 0.22, 0.08]}>
            <capsuleGeometry args={[0.02, 0.15, 4, 6]} />
            <meshStandardMaterial color={new THREE.Color(shadeColor('#EA580C', -20))} />
          </mesh>
        </group>
      );
    case 'acc_smartwatch':
      return (
        <group position={[-0.45, 0.95, 0]}>
          <mesh>
            <boxGeometry args={[0.09, 0.12, 0.09]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.065, 0.08, 0.02]} />
            <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.4} />
          </mesh>
        </group>
      );
    case 'acc_crown':
      return (
        <group position={[0, 1.9, 0]}>
          {/* Crown base */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25, 0.05, 6, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Points */}
          {[0, 1.25, 2.5, 3.75, 5].map((a, i) => (
            <mesh key={i} position={[Math.cos(a) * 0.25, 0.1, Math.sin(a) * 0.25]}>
              <coneGeometry args={[0.04, 0.12, 4]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
          {/* Center gem */}
          <mesh position={[0, 0.08, 0.25]}>
            <sphereGeometry args={[0.04, 8, 6]} />
            <meshStandardMaterial color="#DC2626" metalness={0.6} roughness={0.2} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

// ── Pet Mesh ──
function PetMesh({ pet }: { pet: string | null }) {
  if (!pet || pet === 'pet_none') return null;

  const basePos: [number, number, number] = [0.7, 0.25, 0.3];

  switch (pet) {
    case 'pet_cat':
      return (
        <group position={basePos}>
          {/* Body */}
          <mesh>
            <capsuleGeometry args={[0.1, 0.15, 4, 8]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.18, 0.05]}>
            <sphereGeometry args={[0.1, 10, 8]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          {/* Ears */}
          <mesh position={[-0.06, 0.28, 0.05]}>
            <coneGeometry args={[0.04, 0.08, 3]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          <mesh position={[0.06, 0.28, 0.05]}>
            <coneGeometry args={[0.04, 0.08, 3]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.04, 0.19, 0.12]}>
            <sphereGeometry args={[0.02, 6, 4]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          <mesh position={[0.04, 0.19, 0.12]}>
            <sphereGeometry args={[0.02, 6, 4]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          {/* Tail */}
          <mesh position={[-0.05, 0.1, -0.12]} rotation={[0.8, 0.3, 0]}>
            <capsuleGeometry args={[0.02, 0.2, 4, 6]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
        </group>
      );
    case 'pet_dog':
      return (
        <group position={basePos}>
          <mesh>
            <capsuleGeometry args={[0.12, 0.18, 4, 8]} />
            <meshStandardMaterial color="#8B6914" />
          </mesh>
          <mesh position={[0, 0.2, 0.06]}>
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshStandardMaterial color="#8B6914" />
          </mesh>
          {/* Floppy ears */}
          <mesh position={[-0.1, 0.22, 0.04]} rotation={[0, 0, 0.4]}>
            <capsuleGeometry args={[0.04, 0.1, 4, 6]} />
            <meshStandardMaterial color="#6B4A0A" />
          </mesh>
          <mesh position={[0.1, 0.22, 0.04]} rotation={[0, 0, -0.4]}>
            <capsuleGeometry args={[0.04, 0.1, 4, 6]} />
            <meshStandardMaterial color="#6B4A0A" />
          </mesh>
          {/* Snout */}
          <mesh position={[0, 0.17, 0.16]}>
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshStandardMaterial color="#A37D20" />
          </mesh>
          <mesh position={[0, 0.19, 0.2]}>
            <sphereGeometry args={[0.025, 6, 4]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.04, 0.23, 0.15]}>
            <sphereGeometry args={[0.02, 6, 4]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          <mesh position={[0.04, 0.23, 0.15]}>
            <sphereGeometry args={[0.02, 6, 4]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          {/* Tail */}
          <mesh position={[0, 0.12, -0.15]} rotation={[-0.6, 0, 0]}>
            <capsuleGeometry args={[0.025, 0.12, 4, 6]} />
            <meshStandardMaterial color="#8B6914" />
          </mesh>
        </group>
      );
    case 'pet_parrot':
      return (
        <group position={[0.55, 1.35, 0.15]}>
          {/* Body */}
          <mesh>
            <capsuleGeometry args={[0.06, 0.1, 4, 8]} />
            <meshStandardMaterial color="#22C55E" />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.12, 0.02]}>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshStandardMaterial color="#16A34A" />
          </mesh>
          {/* Beak */}
          <mesh position={[0, 0.1, 0.08]}>
            <coneGeometry args={[0.025, 0.05, 4]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.03, 0.14, 0.06]}>
            <sphereGeometry args={[0.015, 6, 4]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          <mesh position={[0.03, 0.14, 0.06]}>
            <sphereGeometry args={[0.015, 6, 4]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          {/* Tail */}
          <mesh position={[0, -0.1, -0.04]} rotation={[0.3, 0, 0]}>
            <capsuleGeometry args={[0.03, 0.12, 4, 6]} />
            <meshStandardMaterial color="#15803D" />
          </mesh>
        </group>
      );
    case 'pet_rabbit':
      return (
        <group position={basePos}>
          <mesh>
            <sphereGeometry args={[0.1, 10, 8]} />
            <meshStandardMaterial color="#F5F5F5" />
          </mesh>
          <mesh position={[0, 0.14, 0.04]}>
            <sphereGeometry args={[0.08, 8, 6]} />
            <meshStandardMaterial color="#F5F5F5" />
          </mesh>
          {/* Long ears */}
          <mesh position={[-0.04, 0.28, 0]}>
            <capsuleGeometry args={[0.025, 0.14, 4, 6]} />
            <meshStandardMaterial color="#FCA5A5" />
          </mesh>
          <mesh position={[0.04, 0.28, 0]}>
            <capsuleGeometry args={[0.025, 0.14, 4, 6]} />
            <meshStandardMaterial color="#FCA5A5" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.03, 0.16, 0.1]}>
            <sphereGeometry args={[0.015, 6, 4]} />
            <meshStandardMaterial color="#DC2626" />
          </mesh>
          <mesh position={[0.03, 0.16, 0.1]}>
            <sphereGeometry args={[0.015, 6, 4]} />
            <meshStandardMaterial color="#DC2626" />
          </mesh>
          {/* Nose */}
          <mesh position={[0, 0.13, 0.11]}>
            <sphereGeometry args={[0.02, 6, 4]} />
            <meshStandardMaterial color="#FCA5A5" />
          </mesh>
        </group>
      );
    case 'pet_hamster':
      return (
        <group position={basePos}>
          <mesh>
            <sphereGeometry args={[0.1, 10, 8]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          {/* Cheeks */}
          <mesh position={[-0.07, -0.02, 0.06]}>
            <sphereGeometry args={[0.05, 6, 4]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>
          <mesh position={[0.07, -0.02, 0.06]}>
            <sphereGeometry args={[0.05, 6, 4]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>
          {/* Ears */}
          <mesh position={[-0.07, 0.08, 0]}>
            <sphereGeometry args={[0.035, 6, 4]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
          <mesh position={[0.07, 0.08, 0]}>
            <sphereGeometry args={[0.035, 6, 4]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.035, 0.03, 0.09]}>
            <sphereGeometry args={[0.018, 6, 4]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          <mesh position={[0.035, 0.03, 0.09]}>
            <sphereGeometry args={[0.018, 6, 4]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          {/* Nose */}
          <mesh position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.015, 6, 4]} />
            <meshStandardMaterial color="#92400E" />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

// ── Outfit detail: adds visual overlays based on outfit type ──
function OutfitDetail({ outfit, color }: { outfit: string; color: string }) {
  const c = new THREE.Color(color);
  const bright = new THREE.Color(shadeColor(color, 20));

  switch (outfit) {
    case 'outfit_sport':
      return (
        <group>
          {/* Racing stripes */}
          <mesh position={[-0.2, 1.05, 0.18]}>
            <boxGeometry args={[0.03, 0.35, 0.01]} />
            <meshStandardMaterial color="white" opacity={0.4} transparent />
          </mesh>
          <mesh position={[0.2, 1.05, 0.18]}>
            <boxGeometry args={[0.03, 0.35, 0.01]} />
            <meshStandardMaterial color="white" opacity={0.4} transparent />
          </mesh>
        </group>
      );
    case 'outfit_casual':
      return (
        <group>
          {/* Collar */}
          <mesh position={[0, 1.22, 0.13]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.2, 0.04, 0.08]} />
            <meshStandardMaterial color={bright} />
          </mesh>
        </group>
      );
    case 'outfit_hoodie':
      return (
        <group>
          {/* Hood */}
          <mesh position={[0, 1.35, -0.15]}>
            <sphereGeometry args={[0.22, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={c} />
          </mesh>
          {/* Front pocket */}
          <mesh position={[0, 0.88, 0.2]}>
            <boxGeometry args={[0.25, 0.1, 0.02]} />
            <meshStandardMaterial color={new THREE.Color(shadeColor(color, -10))} />
          </mesh>
        </group>
      );
    case 'outfit_suit':
      return (
        <group>
          {/* Lapels */}
          <mesh position={[-0.08, 1.12, 0.2]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.1, 0.2, 0.01]} />
            <meshStandardMaterial color="white" opacity={0.9} transparent />
          </mesh>
          <mesh position={[0.08, 1.12, 0.2]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.1, 0.2, 0.01]} />
            <meshStandardMaterial color="white" opacity={0.9} transparent />
          </mesh>
          {/* Button */}
          <mesh position={[0, 1.0, 0.22]}>
            <sphereGeometry args={[0.02, 6, 4]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
        </group>
      );
    case 'outfit_dress':
      return (
        <group>
          {/* Flared skirt bottom */}
          <mesh position={[0, 0.6, 0]}>
            <coneGeometry args={[0.35, 0.4, 12, 1, true]} />
            <meshStandardMaterial color={c} side={THREE.DoubleSide} />
          </mesh>
        </group>
      );
    case 'outfit_royal':
      return (
        <group>
          {/* Gold trim */}
          <mesh position={[0, 1.22, 0.18]}>
            <boxGeometry args={[0.35, 0.04, 0.02]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.85, 0.2]}>
            <boxGeometry args={[0.35, 0.03, 0.02]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      );
    case 'outfit_legend':
      return (
        <group>
          {/* Shoulder pads */}
          <mesh position={[-0.3, 1.2, 0]}>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.3, 1.2, 0]}>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Chest emblem */}
          <mesh position={[0, 1.05, 0.22]}>
            <octahedronGeometry args={[0.06]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

// ── Main Character Group (animated) ──
function CharacterModel({ config }: { config: AvatarConfig }) {
  const groupRef = useRef<THREE.Group>(null);

  // Idle breathing animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.02;
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
  });

  const skinColor = useMemo(() => new THREE.Color(config.skinColor), [config.skinColor]);
  const outfitColor = useMemo(() => new THREE.Color(config.outfitColor), [config.outfitColor]);
  const eyeColor = useMemo(() => new THREE.Color(config.eyeColor), [config.eyeColor]);

  return (
    <group ref={groupRef}>
      {/* ── Legs ── */}
      <mesh position={[-0.12, 0.35, 0]}>
        <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
        <meshStandardMaterial color={new THREE.Color('#2D3748')} />
      </mesh>
      <mesh position={[0.12, 0.35, 0]}>
        <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
        <meshStandardMaterial color={new THREE.Color('#2D3748')} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.12, 0.08, 0.04]}>
        <boxGeometry args={[0.16, 0.1, 0.22]} />
        <meshStandardMaterial color={new THREE.Color('#1A1A1A')} />
      </mesh>
      <mesh position={[0.12, 0.08, 0.04]}>
        <boxGeometry args={[0.16, 0.1, 0.22]} />
        <meshStandardMaterial color={new THREE.Color('#1A1A1A')} />
      </mesh>

      {/* ── Torso (outfit) ── */}
      <mesh position={[0, 1.0, 0]}>
        <capsuleGeometry args={[0.22, 0.4, 6, 12]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      <OutfitDetail outfit={config.outfit} color={config.outfitColor} />

      {/* ── Arms ── */}
      <mesh position={[-0.35, 1.0, 0]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      <mesh position={[0.35, 1.0, 0]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      {/* Hands */}
      <mesh position={[-0.4, 0.75, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.4, 0.75, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* ── Neck ── */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.1, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* ── Head ── */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.35, 16, 14]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* ── Face ── */}
      {/* Eyes */}
      <mesh position={[-0.1, 1.56, 0.3]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.1, 1.56, 0.3]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Iris */}
      <mesh position={[-0.1, 1.56, 0.34]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color={eyeColor} />
      </mesh>
      <mesh position={[0.1, 1.56, 0.34]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color={eyeColor} />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.1, 1.56, 0.365]}>
        <sphereGeometry args={[0.015, 6, 4]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.1, 1.56, 0.365]}>
        <sphereGeometry args={[0.015, 6, 4]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.1, 1.63, 0.3]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color={new THREE.Color(config.hairColor)} />
      </mesh>
      <mesh position={[0.1, 1.63, 0.3]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color={new THREE.Color(config.hairColor)} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.52, 0.34]}>
        <sphereGeometry args={[0.03, 6, 4]} />
        <meshStandardMaterial color={new THREE.Color(shadeColor(config.skinColor, -8))} />
      </mesh>

      {/* Mouth - smile */}
      <mesh position={[0, 1.46, 0.32]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.06, 0.015, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#E8846B" />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.33, 1.55, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.33, 1.55, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* ── Hair ── */}
      <HairMesh style={config.hairStyle} color={config.hairColor} />

      {/* ── Accessory ── */}
      <AccessoryMesh accessory={config.accessory} />

      {/* ── Pet ── */}
      <PetMesh pet={config.pet} />
    </group>
  );
}

// ── Exported component ──
interface Avatar3DViewerProps {
  config: AvatarConfig;
  height?: string;
  className?: string;
  interactive?: boolean;
}

export default function Avatar3DViewer({ config, height = '280px', className = '', interactive = true }: Avatar3DViewerProps) {
  return (
    <div className={`relative w-full rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50" />
      <Canvas
        camera={{ position: [0, 1.2, 3], fov: 35 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} />
        <directionalLight position={[-2, 3, -3]} intensity={0.3} color="#B4C6FF" />
        <CharacterModel config={config} />
        {/* Floor shadow disk */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 24]} />
          <meshStandardMaterial color="#000000" opacity={0.08} transparent />
        </mesh>
        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            target={[0, 1, 0]}
          />
        )}
      </Canvas>
    </div>
  );
}
