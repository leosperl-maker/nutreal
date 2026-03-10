import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import type { AvatarConfig } from '../../store/useStore';
import { MODEL_PATHS } from './modelLoader';
import { GLB_MESH_MAP, ALL_CHARACTER_MESHES, ALWAYS_VISIBLE_MESHES, PET_GLB_MAP } from './avatarItems';

// ── Stylized low-poly character avatar ──
// Cute proportions: big head, compact body, smooth shapes

function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(2.55 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(2.55 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ── Hair Mesh ──
function HairMesh({ style, color }: { style: string; color: string }) {
  const c = useMemo(() => new THREE.Color(color), [color]);
  const dark = useMemo(() => new THREE.Color(shadeColor(color, -20)), [color]);

  const base = (extra?: React.ReactNode) => (
    <group position={[0, 0.82, 0]}>
      {/* Base cap over head */}
      <mesh>
        <sphereGeometry args={[0.53, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshToonMaterial color={c} />
      </mesh>
      {extra}
    </group>
  );

  switch (style) {
    case 'hair_short':
      return base();
    case 'hair_medium':
      return base(
        <>
          <mesh position={[-0.45, -0.18, 0]}>
            <capsuleGeometry args={[0.08, 0.25, 4, 12]} />
            <meshToonMaterial color={dark} />
          </mesh>
          <mesh position={[0.45, -0.18, 0]}>
            <capsuleGeometry args={[0.08, 0.25, 4, 12]} />
            <meshToonMaterial color={dark} />
          </mesh>
        </>
      );
    case 'hair_long':
      return base(
        <>
          <mesh position={[0, -0.45, -0.08]}>
            <capsuleGeometry args={[0.35, 0.55, 6, 12]} />
            <meshToonMaterial color={dark} />
          </mesh>
          <mesh position={[-0.4, -0.35, 0.05]}>
            <capsuleGeometry args={[0.09, 0.5, 4, 10]} />
            <meshToonMaterial color={c} />
          </mesh>
          <mesh position={[0.4, -0.35, 0.05]}>
            <capsuleGeometry args={[0.09, 0.5, 4, 10]} />
            <meshToonMaterial color={c} />
          </mesh>
        </>
      );
    case 'hair_curly':
      return (
        <group position={[0, 0.92, 0]}>
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const r = 0.42 + Math.sin(i * 3) * 0.06;
            return (
              <mesh key={i} position={[Math.cos(angle) * r * 0.75, Math.sin(i * 1.5) * 0.1, Math.sin(angle) * r * 0.75]}>
                <sphereGeometry args={[0.15, 10, 8]} />
                <meshToonMaterial color={i % 2 ? c : dark} />
              </mesh>
            );
          })}
          <mesh>
            <sphereGeometry args={[0.45, 16, 12]} />
            <meshToonMaterial color={c} />
          </mesh>
        </group>
      );
    case 'hair_afro':
      return (
        <group position={[0, 0.92, 0]}>
          <mesh>
            <sphereGeometry args={[0.65, 20, 16]} />
            <meshToonMaterial color={c} />
          </mesh>
        </group>
      );
    case 'hair_braids':
      return base(
        <>
          {/* Left braid */}
          <mesh position={[-0.4, -0.5, 0.05]}>
            <capsuleGeometry args={[0.07, 0.7, 4, 10]} />
            <meshToonMaterial color={dark} />
          </mesh>
          {/* Right braid */}
          <mesh position={[0.4, -0.5, 0.05]}>
            <capsuleGeometry args={[0.07, 0.7, 4, 10]} />
            <meshToonMaterial color={dark} />
          </mesh>
          {/* Braid beads */}
          <mesh position={[-0.4, -0.92, 0.05]}>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshToonMaterial color={new THREE.Color('#FFD700')} />
          </mesh>
          <mesh position={[0.4, -0.92, 0.05]}>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshToonMaterial color={new THREE.Color('#FFD700')} />
          </mesh>
        </>
      );
    case 'hair_mohawk':
      return (
        <group position={[0, 0.95, -0.02]}>
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={i} position={[0, i * 0.07, -i * 0.015]} scale={[1, 1.3 - i * 0.08, 1]}>
              <sphereGeometry args={[0.14 - i * 0.008, 10, 8]} />
              <meshToonMaterial color={i % 2 ? c : dark} />
            </mesh>
          ))}
        </group>
      );
    case 'hair_bun':
      return base(
        <mesh position={[0, 0.28, -0.08]}>
          <sphereGeometry args={[0.2, 14, 12]} />
          <meshToonMaterial color={dark} />
        </mesh>
      );
    case 'hair_dreads':
      return base(
        <>
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 0.35, -0.4 - (i % 3) * 0.12, Math.sin(angle) * 0.35]}
                rotation={[0.25 * Math.sin(angle), 0, 0.25 * Math.cos(angle)]}>
                <capsuleGeometry args={[0.05, 0.4 + (i % 3) * 0.1, 4, 8]} />
                <meshToonMaterial color={i % 2 ? c : dark} />
              </mesh>
            );
          })}
        </>
      );
    case 'hair_crown':
      return base(
        <>
          <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4, 0.06, 10, 20]} />
            <meshToonMaterial color={dark} />
          </mesh>
          {[0, 1.5, 3, 4.5].map((a, i) => (
            <mesh key={i} position={[Math.cos(a) * 0.4, 0.12, Math.sin(a) * 0.4]}>
              <sphereGeometry args={[0.045, 8, 6]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </>
      );
    default:
      return base();
  }
}

// ── Accessory Mesh ──
function AccessoryMesh({ accessory }: { accessory: string | null }) {
  if (!accessory || accessory === 'acc_none') return null;

  switch (accessory) {
    case 'acc_glasses':
      return (
        <group position={[0, 0.72, 0.4]}>
          <mesh position={[-0.14, 0, 0]}>
            <torusGeometry args={[0.09, 0.018, 10, 20]} />
            <meshStandardMaterial color="#333" metalness={0.3} />
          </mesh>
          <mesh position={[0.14, 0, 0]}>
            <torusGeometry args={[0.09, 0.018, 10, 20]} />
            <meshStandardMaterial color="#333" metalness={0.3} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.1, 0.018, 0.018]} />
            <meshStandardMaterial color="#333" metalness={0.3} />
          </mesh>
        </group>
      );
    case 'acc_sunglasses':
      return (
        <group position={[0, 0.72, 0.4]}>
          <mesh position={[-0.14, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.2, 0.11, 0.025]} />
            <meshStandardMaterial color="#1A1A1A" opacity={0.92} transparent />
          </mesh>
          <mesh position={[0.14, 0, 0]}>
            <boxGeometry args={[0.2, 0.11, 0.025]} />
            <meshStandardMaterial color="#1A1A1A" opacity={0.92} transparent />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.08, 0.022, 0.022]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
        </group>
      );
    case 'acc_cap':
      return (
        <group position={[0, 0.98, 0.05]}>
          <mesh>
            <sphereGeometry args={[0.5, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.32]} />
            <meshToonMaterial color={new THREE.Color('#3B82F6')} />
          </mesh>
          <mesh position={[0, -0.06, 0.35]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.4, 0.035, 0.28]} />
            <meshToonMaterial color={new THREE.Color('#2563EB')} />
          </mesh>
        </group>
      );
    case 'acc_watch':
      return (
        <group position={[-0.38, -0.1, 0]}>
          <mesh>
            <boxGeometry args={[0.08, 0.1, 0.08]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.06, 0.06, 0.02]} />
            <meshStandardMaterial color="#4ADE80" emissive="#4ADE80" emissiveIntensity={0.3} />
          </mesh>
        </group>
      );
    case 'acc_bracelet':
      return (
        <mesh position={[0.38, -0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.1, 0.025, 10, 20]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      );
    case 'acc_headband':
      return (
        <mesh position={[0, 0.9, 0]} rotation={[0.12, 0, 0]}>
          <torusGeometry args={[0.45, 0.035, 10, 28]} />
          <meshToonMaterial color={new THREE.Color('#DC2626')} />
        </mesh>
      );
    case 'acc_earbuds':
      return (
        <group>
          <mesh position={[-0.42, 0.65, 0.12]}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <meshStandardMaterial color="#F5F5F5" />
          </mesh>
          <mesh position={[0.42, 0.65, 0.12]}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <meshStandardMaterial color="#F5F5F5" />
          </mesh>
        </group>
      );
    case 'acc_necklace':
      return (
        <mesh position={[0, 0.35, 0.22]} rotation={[0.35, 0, 0]}>
          <torusGeometry args={[0.16, 0.018, 10, 20]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      );
    case 'acc_backpack':
      return (
        <group position={[0, 0.1, -0.28]}>
          <mesh>
            <boxGeometry args={[0.35, 0.38, 0.16]} />
            <meshToonMaterial color={new THREE.Color('#EA580C')} />
          </mesh>
          <mesh position={[0, 0.08, 0.01]}>
            <boxGeometry args={[0.22, 0.12, 0.17]} />
            <meshToonMaterial color={new THREE.Color(shadeColor('#EA580C', -15))} />
          </mesh>
        </group>
      );
    case 'acc_smartwatch':
      return (
        <group position={[-0.38, -0.1, 0]}>
          <mesh>
            <boxGeometry args={[0.09, 0.12, 0.09]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
          <mesh position={[0, 0, 0.028]}>
            <boxGeometry args={[0.065, 0.08, 0.02]} />
            <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.4} />
          </mesh>
        </group>
      );
    case 'acc_crown':
      return (
        <group position={[0, 1.1, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.055, 8, 20]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
          {[0, 1.25, 2.5, 3.75, 5].map((a, i) => (
            <mesh key={i} position={[Math.cos(a) * 0.3, 0.1, Math.sin(a) * 0.3]}>
              <coneGeometry args={[0.045, 0.13, 4]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
          <mesh position={[0, 0.08, 0.3]}>
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

  const basePos: [number, number, number] = [0.7, -0.5, 0.3];

  switch (pet) {
    case 'pet_cat':
      return (
        <group position={basePos}>
          <mesh><capsuleGeometry args={[0.1, 0.14, 6, 10]} /><meshToonMaterial color={new THREE.Color('#F59E0B')} /></mesh>
          <mesh position={[0, 0.18, 0.05]}><sphereGeometry args={[0.11, 12, 10]} /><meshToonMaterial color={new THREE.Color('#F59E0B')} /></mesh>
          <mesh position={[-0.06, 0.29, 0.05]}><coneGeometry args={[0.04, 0.08, 3]} /><meshToonMaterial color={new THREE.Color('#F59E0B')} /></mesh>
          <mesh position={[0.06, 0.29, 0.05]}><coneGeometry args={[0.04, 0.08, 3]} /><meshToonMaterial color={new THREE.Color('#F59E0B')} /></mesh>
          <mesh position={[-0.04, 0.2, 0.13]}><sphereGeometry args={[0.025, 8, 6]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
          <mesh position={[0.04, 0.2, 0.13]}><sphereGeometry args={[0.025, 8, 6]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
          <mesh position={[-0.05, 0.1, -0.12]} rotation={[0.8, 0.3, 0]}><capsuleGeometry args={[0.02, 0.2, 4, 8]} /><meshToonMaterial color={new THREE.Color('#D97706')} /></mesh>
        </group>
      );
    case 'pet_dog':
      return (
        <group position={basePos}>
          <mesh><capsuleGeometry args={[0.12, 0.16, 6, 10]} /><meshToonMaterial color={new THREE.Color('#8B6914')} /></mesh>
          <mesh position={[0, 0.2, 0.06]}><sphereGeometry args={[0.13, 12, 10]} /><meshToonMaterial color={new THREE.Color('#8B6914')} /></mesh>
          <mesh position={[-0.1, 0.24, 0.04]} rotation={[0, 0, 0.4]}><capsuleGeometry args={[0.045, 0.1, 4, 8]} /><meshToonMaterial color={new THREE.Color('#6B4A0A')} /></mesh>
          <mesh position={[0.1, 0.24, 0.04]} rotation={[0, 0, -0.4]}><capsuleGeometry args={[0.045, 0.1, 4, 8]} /><meshToonMaterial color={new THREE.Color('#6B4A0A')} /></mesh>
          <mesh position={[0, 0.17, 0.17]}><sphereGeometry args={[0.05, 10, 8]} /><meshToonMaterial color={new THREE.Color('#A37D20')} /></mesh>
          <mesh position={[0, 0.2, 0.22]}><sphereGeometry args={[0.028, 8, 6]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
          <mesh position={[-0.045, 0.24, 0.16]}><sphereGeometry args={[0.025, 8, 6]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
          <mesh position={[0.045, 0.24, 0.16]}><sphereGeometry args={[0.025, 8, 6]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
          <mesh position={[0, 0.12, -0.15]} rotation={[-0.6, 0, 0]}><capsuleGeometry args={[0.028, 0.12, 4, 8]} /><meshToonMaterial color={new THREE.Color('#8B6914')} /></mesh>
        </group>
      );
    case 'pet_parrot':
      return (
        <group position={[0.52, 0.35, 0.15]}>
          <mesh><capsuleGeometry args={[0.06, 0.1, 6, 10]} /><meshToonMaterial color={new THREE.Color('#22C55E')} /></mesh>
          <mesh position={[0, 0.13, 0.02]}><sphereGeometry args={[0.065, 10, 8]} /><meshToonMaterial color={new THREE.Color('#16A34A')} /></mesh>
          <mesh position={[0, 0.11, 0.08]}><coneGeometry args={[0.028, 0.05, 4]} /><meshToonMaterial color={new THREE.Color('#F59E0B')} /></mesh>
          <mesh position={[-0.03, 0.15, 0.065]}><sphereGeometry args={[0.018, 8, 6]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
          <mesh position={[0.03, 0.15, 0.065]}><sphereGeometry args={[0.018, 8, 6]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
          <mesh position={[0, -0.1, -0.04]} rotation={[0.3, 0, 0]}><capsuleGeometry args={[0.03, 0.12, 4, 8]} /><meshToonMaterial color={new THREE.Color('#15803D')} /></mesh>
        </group>
      );
    case 'pet_rabbit':
      return (
        <group position={basePos}>
          <mesh><sphereGeometry args={[0.11, 12, 10]} /><meshToonMaterial color={new THREE.Color('#F5F5F5')} /></mesh>
          <mesh position={[0, 0.15, 0.04]}><sphereGeometry args={[0.09, 10, 8]} /><meshToonMaterial color={new THREE.Color('#F5F5F5')} /></mesh>
          <mesh position={[-0.04, 0.3, 0]}><capsuleGeometry args={[0.028, 0.14, 4, 8]} /><meshToonMaterial color={new THREE.Color('#FCA5A5')} /></mesh>
          <mesh position={[0.04, 0.3, 0]}><capsuleGeometry args={[0.028, 0.14, 4, 8]} /><meshToonMaterial color={new THREE.Color('#FCA5A5')} /></mesh>
          <mesh position={[-0.035, 0.17, 0.11]}><sphereGeometry args={[0.018, 8, 6]} /><meshStandardMaterial color="#DC2626" /></mesh>
          <mesh position={[0.035, 0.17, 0.11]}><sphereGeometry args={[0.018, 8, 6]} /><meshStandardMaterial color="#DC2626" /></mesh>
          <mesh position={[0, 0.14, 0.12]}><sphereGeometry args={[0.022, 8, 6]} /><meshToonMaterial color={new THREE.Color('#FCA5A5')} /></mesh>
        </group>
      );
    case 'pet_hamster':
      return (
        <group position={basePos}>
          <mesh><sphereGeometry args={[0.11, 12, 10]} /><meshToonMaterial color={new THREE.Color('#F59E0B')} /></mesh>
          <mesh position={[-0.08, -0.02, 0.06]}><sphereGeometry args={[0.055, 8, 6]} /><meshToonMaterial color={new THREE.Color('#FBBF24')} /></mesh>
          <mesh position={[0.08, -0.02, 0.06]}><sphereGeometry args={[0.055, 8, 6]} /><meshToonMaterial color={new THREE.Color('#FBBF24')} /></mesh>
          <mesh position={[-0.08, 0.09, 0]}><sphereGeometry args={[0.038, 8, 6]} /><meshToonMaterial color={new THREE.Color('#D97706')} /></mesh>
          <mesh position={[0.08, 0.09, 0]}><sphereGeometry args={[0.038, 8, 6]} /><meshToonMaterial color={new THREE.Color('#D97706')} /></mesh>
          <mesh position={[-0.04, 0.03, 0.1]}><sphereGeometry args={[0.02, 8, 6]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
          <mesh position={[0.04, 0.03, 0.1]}><sphereGeometry args={[0.02, 8, 6]} /><meshStandardMaterial color="#1A1A1A" /></mesh>
          <mesh position={[0, 0, 0.11]}><sphereGeometry args={[0.016, 8, 6]} /><meshStandardMaterial color="#92400E" /></mesh>
        </group>
      );
    default:
      return null;
  }
}

// ── Outfit detail overlays ──
function OutfitDetail({ outfit, color }: { outfit: string; color: string }) {
  const c = useMemo(() => new THREE.Color(color), [color]);
  const bright = useMemo(() => new THREE.Color(shadeColor(color, 20)), [color]);

  switch (outfit) {
    case 'outfit_sport':
      return (
        <group>
          <mesh position={[-0.18, 0.1, 0.22]}><boxGeometry args={[0.03, 0.32, 0.01]} /><meshToonMaterial color={new THREE.Color('white')} /></mesh>
          <mesh position={[0.18, 0.1, 0.22]}><boxGeometry args={[0.03, 0.32, 0.01]} /><meshToonMaterial color={new THREE.Color('white')} /></mesh>
        </group>
      );
    case 'outfit_casual':
      return (
        <mesh position={[0, 0.32, 0.17]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.2, 0.04, 0.08]} />
          <meshToonMaterial color={bright} />
        </mesh>
      );
    case 'outfit_hoodie':
      return (
        <group>
          <mesh position={[0, 0.42, -0.14]}>
            <sphereGeometry args={[0.2, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshToonMaterial color={c} />
          </mesh>
          <mesh position={[0, -0.08, 0.24]}>
            <boxGeometry args={[0.22, 0.1, 0.02]} />
            <meshToonMaterial color={new THREE.Color(shadeColor(color, -10))} />
          </mesh>
        </group>
      );
    case 'outfit_suit':
      return (
        <group>
          <mesh position={[-0.08, 0.18, 0.24]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.1, 0.18, 0.01]} />
            <meshToonMaterial color={new THREE.Color('white')} />
          </mesh>
          <mesh position={[0.08, 0.18, 0.24]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.1, 0.18, 0.01]} />
            <meshToonMaterial color={new THREE.Color('white')} />
          </mesh>
          <mesh position={[0, 0.05, 0.26]}>
            <sphereGeometry args={[0.022, 8, 6]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
        </group>
      );
    case 'outfit_dress':
      return (
        <mesh position={[0, -0.3, 0]}>
          <coneGeometry args={[0.38, 0.35, 14, 1, true]} />
          <meshToonMaterial color={c} side={THREE.DoubleSide} />
        </mesh>
      );
    case 'outfit_royal':
      return (
        <group>
          <mesh position={[0, 0.32, 0.22]}><boxGeometry args={[0.38, 0.04, 0.02]} /><meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0, -0.05, 0.24]}><boxGeometry args={[0.38, 0.03, 0.02]} /><meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} /></mesh>
        </group>
      );
    case 'outfit_legend':
      return (
        <group>
          <mesh position={[-0.28, 0.28, 0]}><sphereGeometry args={[0.1, 10, 8]} /><meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} /></mesh>
          <mesh position={[0.28, 0.28, 0]}><sphereGeometry args={[0.1, 10, 8]} /><meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} /></mesh>
          <mesh position={[0, 0.1, 0.26]}><octahedronGeometry args={[0.06]} /><meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} /></mesh>
        </group>
      );
    default:
      return null;
  }
}

// ── Main Character ──
function CharacterModel({ config }: { config: AvatarConfig }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle idle bounce + sway
    groupRef.current.position.y = Math.sin(t * 1.8) * 0.015;
    groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.04;
  });

  const skinColor = useMemo(() => new THREE.Color(config.skinColor), [config.skinColor]);
  const skinDark = useMemo(() => new THREE.Color(shadeColor(config.skinColor, -8)), [config.skinColor]);
  const outfitColor = useMemo(() => new THREE.Color(config.topColor || '#3B82F6'), [config.topColor]);
  const outfitDark = useMemo(() => new THREE.Color(shadeColor(config.topColor || '#3B82F6', -15)), [config.topColor]);
  const eyeColor = useMemo(() => new THREE.Color(config.eyeColor), [config.eyeColor]);
  const hairBrowColor = useMemo(() => new THREE.Color(config.hairColor), [config.hairColor]);

  return (
    <group ref={groupRef}>
      {/* ── LEGS ── */}
      {/* Left leg */}
      <mesh position={[-0.1, -0.6, 0]}>
        <capsuleGeometry args={[0.07, 0.28, 6, 10]} />
        <meshToonMaterial color={outfitDark} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.1, -0.6, 0]}>
        <capsuleGeometry args={[0.07, 0.28, 6, 10]} />
        <meshToonMaterial color={outfitDark} />
      </mesh>

      {/* ── SHOES ── */}
      <group position={[-0.1, -0.82, 0.03]}>
        <mesh>
          <boxGeometry args={[0.14, 0.08, 0.2]} />
          <meshToonMaterial color={new THREE.Color('#2D2D2D')} />
        </mesh>
        <mesh position={[0, -0.01, 0.04]}>
          <boxGeometry args={[0.15, 0.05, 0.22]} />
          <meshToonMaterial color={new THREE.Color('#F5F5F5')} />
        </mesh>
      </group>
      <group position={[0.1, -0.82, 0.03]}>
        <mesh>
          <boxGeometry args={[0.14, 0.08, 0.2]} />
          <meshToonMaterial color={new THREE.Color('#2D2D2D')} />
        </mesh>
        <mesh position={[0, -0.01, 0.04]}>
          <boxGeometry args={[0.15, 0.05, 0.22]} />
          <meshToonMaterial color={new THREE.Color('#F5F5F5')} />
        </mesh>
      </group>

      {/* ── TORSO (outfit) ── */}
      <mesh position={[0, 0.05, 0]}>
        <capsuleGeometry args={[0.2, 0.38, 8, 14]} />
        <meshToonMaterial color={outfitColor} />
      </mesh>
      <OutfitDetail outfit={config.top || 'top_tshirt'} color={config.topColor || '#3B82F6'} />

      {/* ── ARMS (with sleeves + hands) ── */}
      {/* Left arm — torso radius=0.2, arm radius=0.055, X=0.38 → gap=0.125, clearly visible */}
      <mesh position={[-0.38, 0.12, 0]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.055, 0.45, 6, 10]} />
        <meshToonMaterial color={outfitColor} />
      </mesh>
      {/* Left hand */}
      <mesh position={[-0.38, -0.215, 0]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshToonMaterial color={skinColor} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.38, 0.12, 0]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.055, 0.45, 6, 10]} />
        <meshToonMaterial color={outfitColor} />
      </mesh>
      {/* Right hand */}
      <mesh position={[0.38, -0.215, 0]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshToonMaterial color={skinColor} />
      </mesh>

      {/* ── NECK ── */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.08, 10]} />
        <meshToonMaterial color={skinColor} />
      </mesh>

      {/* ── HEAD (bigger = cuter) ── */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.42, 24, 20]} />
        <meshToonMaterial color={skinColor} />
      </mesh>

      {/* ── FACE ── */}
      {/* Eyes - big & expressive */}
      {/* Eye whites */}
      <mesh position={[-0.13, 0.72, 0.36]}>
        <sphereGeometry args={[0.065, 12, 10]} />
        <meshToonMaterial color={new THREE.Color('white')} />
      </mesh>
      <mesh position={[0.13, 0.72, 0.36]}>
        <sphereGeometry args={[0.065, 12, 10]} />
        <meshToonMaterial color={new THREE.Color('white')} />
      </mesh>
      {/* Iris */}
      <mesh position={[-0.13, 0.72, 0.415]}>
        <sphereGeometry args={[0.04, 10, 8]} />
        <meshToonMaterial color={eyeColor} />
      </mesh>
      <mesh position={[0.13, 0.72, 0.415]}>
        <sphereGeometry args={[0.04, 10, 8]} />
        <meshToonMaterial color={eyeColor} />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.13, 0.72, 0.45]}>
        <sphereGeometry args={[0.02, 8, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.13, 0.72, 0.45]}>
        <sphereGeometry args={[0.02, 8, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Eye shine */}
      <mesh position={[-0.12, 0.74, 0.455]}>
        <sphereGeometry args={[0.01, 6, 4]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.14, 0.74, 0.455]}>
        <sphereGeometry args={[0.01, 6, 4]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.13, 0.81, 0.36]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.1, 0.025, 0.025]} />
        <meshToonMaterial color={hairBrowColor} />
      </mesh>
      <mesh position={[0.13, 0.81, 0.36]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.1, 0.025, 0.025]} />
        <meshToonMaterial color={hairBrowColor} />
      </mesh>

      {/* Nose - subtle bump */}
      <mesh position={[0, 0.67, 0.41]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshToonMaterial color={skinDark} />
      </mesh>

      {/* Mouth - cute smile */}
      <mesh position={[0, 0.6, 0.39]} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[0.06, 0.015, 8, 14, Math.PI]} />
        <meshToonMaterial color={new THREE.Color('#E8846B')} />
      </mesh>

      {/* Cheek blush */}
      <mesh position={[-0.22, 0.65, 0.32]}>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshToonMaterial color={new THREE.Color('#FFB7B7')} />
      </mesh>
      <mesh position={[0.22, 0.65, 0.32]}>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshToonMaterial color={new THREE.Color('#FFB7B7')} />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.4, 0.7, 0]}>
        <sphereGeometry args={[0.065, 10, 8]} />
        <meshToonMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.4, 0.7, 0]}>
        <sphereGeometry args={[0.065, 10, 8]} />
        <meshToonMaterial color={skinColor} />
      </mesh>

      {/* ── HAIR ── */}
      <HairMesh style={config.hairStyle} color={config.hairColor} />

      {/* ── ACCESSORY ── */}
      <AccessoryMesh accessory={config.accessories?.[0] || null} />

      {/* ── PET ── */}
      <PetMesh pet={config.pet} />
    </group>
  );
}

// ── GLB Character Model (ithappy Creative Characters pack) ──
// Bone cache for efficient per-frame animation
interface BoneRefs {
  leftShoulder?: THREE.Bone;
  rightShoulder?: THREE.Bone;
  leftArm?: THREE.Bone;
  rightArm?: THREE.Bone;
  leftForeArm?: THREE.Bone;
  rightForeArm?: THREE.Bone;
  spine?: THREE.Bone;
  spine1?: THREE.Bone;
  spine2?: THREE.Bone;
  head?: THREE.Bone;
  neck?: THREE.Bone;
  hips?: THREE.Bone;
  leftHand?: THREE.Bone;
  rightHand?: THREE.Bone;
  leftUpLeg?: THREE.Bone;
  rightUpLeg?: THREE.Bone;
}

// Store initial bone quaternions so we can compose rotations on top of rest pose
const initialQuatsRef = { current: new Map<string, THREE.Quaternion>() };

function GLBCharacterModel({ config }: { config: AvatarConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const bonesRef = useRef<BoneRefs>({});
  const { scene } = useGLTF(MODEL_PATHS.base);

  // Clone scene with proper skeleton rebinding (scene.clone doesn't rebind bones!)
  // Also give each character mesh its own material clone for independent color tinting
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material && ALL_CHARACTER_MESHES.includes(child.name)) {
        child.material = (child.material as THREE.MeshStandardMaterial).clone();
      }
    });
    return clone;
  }, [scene]);

  // Cache bone references and set initial pose (arms down from T-pose)
  useEffect(() => {
    const bones: BoneRefs = {};
    clonedScene.traverse((child) => {
      const n = child.name;
      if (n === 'LeftShoulder') bones.leftShoulder = child as THREE.Bone;
      else if (n === 'RightShoulder') bones.rightShoulder = child as THREE.Bone;
      else if (n === 'LeftArm') bones.leftArm = child as THREE.Bone;
      else if (n === 'RightArm') bones.rightArm = child as THREE.Bone;
      else if (n === 'LeftForeArm') bones.leftForeArm = child as THREE.Bone;
      else if (n === 'RightForeArm') bones.rightForeArm = child as THREE.Bone;
      else if (n === 'LeftHand') bones.leftHand = child as THREE.Bone;
      else if (n === 'RightHand') bones.rightHand = child as THREE.Bone;
      else if (n === 'Spine') bones.spine = child as THREE.Bone;
      else if (n === 'Spine1') bones.spine1 = child as THREE.Bone;
      else if (n === 'Head') bones.head = child as THREE.Bone;
      else if (n === 'Neck') bones.neck = child as THREE.Bone;
      else if (n === 'Hips') bones.hips = child as THREE.Bone;
      else if (n === 'Spine2') bones.spine2 = child as THREE.Bone;
      else if (n === 'LeftUpLeg') bones.leftUpLeg = child as THREE.Bone;
      else if (n === 'RightUpLeg') bones.rightUpLeg = child as THREE.Bone;
    });
    bonesRef.current = bones;

    // Save rest quaternions ONCE (first mount only), then restore on re-runs
    if (initialQuatsRef.current.size === 0) {
      Object.entries(bones).forEach(([key, bone]) => {
        if (bone) initialQuatsRef.current.set(key, bone.quaternion.clone());
      });
    } else {
      // Restore rest pose before re-applying (prevents cumulative rotations)
      Object.entries(bones).forEach(([key, bone]) => {
        const rest = initialQuatsRef.current.get(key);
        if (bone && rest) bone.quaternion.copy(rest);
        if (bone) bone.scale.set(1, 1, 1);
      });
    }

    // ── Natural standing pose: arms alongside the body ──
    // World-space targeting: compute the exact rotation needed to move each arm
    // from its T-pose direction to hanging down with slight outward spread.
    // This avoids guessing axes/signs — we use actual bone positions.
    clonedScene.updateWorldMatrix(true, true);

    const armTargets: [THREE.Bone | undefined, THREE.Bone | undefined, THREE.Vector3][] = [
      // Left arm is at world +X — target must be +X (outward) and -Y (down)
      [bones.leftArm, bones.leftForeArm, new THREE.Vector3(0.25, -0.97, 0).normalize()],
      // Right arm is at world -X — target must be -X (outward) and -Y (down)
      [bones.rightArm, bones.rightForeArm, new THREE.Vector3(-0.25, -0.97, 0).normalize()],
    ];

    for (const [armBone, forearmBone, targetDir] of armTargets) {
      if (!armBone || !forearmBone || !armBone.parent) continue;

      // Current arm direction = vector from arm bone to forearm bone (world space)
      const armPos = new THREE.Vector3();
      const forearmPos = new THREE.Vector3();
      armBone.getWorldPosition(armPos);
      forearmBone.getWorldPosition(forearmPos);
      const currentDir = forearmPos.clone().sub(armPos).normalize();

      // World-space rotation that maps currentDir → targetDir
      const worldRot = new THREE.Quaternion().setFromUnitVectors(currentDir, targetDir);

      // Convert world rotation to parent-bone-local rotation via conjugation:
      // localRot = parentInv * worldRot * parentWQ
      const parentWQ = new THREE.Quaternion();
      armBone.parent.getWorldQuaternion(parentWQ);
      const parentInv = parentWQ.clone().invert();

      const localRot = new THREE.Quaternion()
        .copy(parentInv)
        .multiply(worldRot)
        .multiply(parentWQ);

      // Apply on top of rest pose
      armBone.quaternion.premultiply(localRot);
    }

    // ── Female body proportions via bone scaling ──
    // Adjust skeleton to create a feminine silhouette:
    // narrower shoulders, wider hips, slimmer waist, slightly smaller head
    if (config.sex === 'F') {
      // Narrower shoulders
      if (bones.leftShoulder) bones.leftShoulder.scale.set(0.88, 0.95, 0.95);
      if (bones.rightShoulder) bones.rightShoulder.scale.set(0.88, 0.95, 0.95);
      // Slimmer arms
      if (bones.leftArm) bones.leftArm.scale.set(1, 0.9, 0.9);
      if (bones.rightArm) bones.rightArm.scale.set(1, 0.9, 0.9);
      // Slimmer waist (Spine1 = mid-torso)
      if (bones.spine1) bones.spine1.scale.set(1, 0.92, 0.88);
      // Wider hips
      if (bones.hips) bones.hips.scale.set(1, 1.06, 1.1);
      // Slightly wider upper legs (hip area)
      if (bones.leftUpLeg) bones.leftUpLeg.scale.set(1, 1.03, 1.05);
      if (bones.rightUpLeg) bones.rightUpLeg.scale.set(1, 1.03, 1.05);
      // Slightly smaller head for proportional look
      if (bones.head) bones.head.scale.set(0.96, 0.96, 0.96);
    }

    // Store the posed quaternions for animation reference
    Object.entries(bones).forEach(([key, bone]) => {
      if (bone) initialQuatsRef.current.set(key + '_posed', bone.quaternion.clone());
    });
  }, [clonedScene, config.sex]);

  // ── Update mesh visibility based on avatar config (multi-slot) ──
  useEffect(() => {
    const visible = new Set<string>(ALWAYS_VISIBLE_MESHES);
    const addMeshes = (itemId: string | null | undefined) => {
      if (!itemId) return;
      const meshes = GLB_MESH_MAP[itemId];
      if (meshes) meshes.forEach(m => visible.add(m));
    };

    // Hair
    addMeshes(config.hairStyle);
    // Clothing slots
    addMeshes(config.top);
    addMeshes(config.outerwear);
    addMeshes(config.bottom);
    addMeshes(config.shoes);
    // Multi-accessories
    if (config.accessories) {
      config.accessories.forEach(acc => addMeshes(acc));
    }

    // Apply visibility
    clonedScene.traverse((child) => {
      if (ALL_CHARACTER_MESHES.includes(child.name)) {
        child.visible = visible.has(child.name);
      }
    });
  }, [config.hairStyle, config.top, config.outerwear, config.bottom, config.shoes, config.accessories, clonedScene]);

  // ── Per-slot color tinting ──
  useEffect(() => {
    // Build a map: meshName → tint color
    const tintMap = new Map<string, string>();
    const mapSlot = (itemId: string | null | undefined, color: string | undefined) => {
      if (!itemId || !color || color === '#FFFFFF') return;
      const meshes = GLB_MESH_MAP[itemId];
      if (meshes) meshes.forEach(m => tintMap.set(m, color));
    };
    mapSlot(config.top, config.topColor);
    mapSlot(config.outerwear, config.outerwearColor);
    mapSlot(config.bottom, config.bottomColor);
    mapSlot(config.shoes, config.shoesColor);

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material && ALL_CHARACTER_MESHES.includes(child.name)) {
        const mat = child.material as THREE.MeshStandardMaterial;
        const tint = tintMap.get(child.name);
        if (tint) {
          mat.color.set(tint);
        } else {
          mat.color.set('#FFFFFF'); // Reset to white (no tint)
        }
        mat.needsUpdate = true;
      }
    });
  }, [config.top, config.topColor, config.outerwear, config.outerwearColor, config.bottom, config.bottomColor, config.shoes, config.shoesColor, clonedScene]);

  // Idle animation: breathing, head look-around, subtle arm sway
  useFrame(() => {
    const t = performance.now() / 1000;
    const b = bonesRef.current;

    // Whole body gentle bob
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.8) * 0.012;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.02;
    }

    // Breathing
    if (b.spine1) {
      b.spine1.rotation.x = Math.sin(t * 1.5) * 0.012;
    }

    // Head: gentle look-around
    if (b.head) {
      b.head.rotation.y = Math.sin(t * 0.7) * 0.06;
      b.head.rotation.x = Math.sin(t * 1.1) * 0.02;
    }

    // Arms: very subtle sway on top of posed quaternion
    if (b.leftArm) {
      const base = initialQuatsRef.current.get('leftArm_posed');
      if (base) {
        const sway = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 0, 1), Math.sin(t * 0.8) * 0.03
        );
        b.leftArm.quaternion.copy(base).multiply(sway);
      }
    }
    if (b.rightArm) {
      const base = initialQuatsRef.current.get('rightArm_posed');
      if (base) {
        const sway = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 0, 1), Math.sin(t * 0.8 + 0.5) * 0.03
        );
        b.rightArm.quaternion.copy(base).multiply(sway);
      }
    }

    // Hands: gentle rotation
    if (b.leftHand) {
      b.leftHand.rotation.z = Math.sin(t * 1.3) * 0.04;
    }
    if (b.rightHand) {
      b.rightHand.rotation.z = Math.sin(t * 1.3 + 0.3) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ── Pet Model (loaded from separate GLB) ──
function PetModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useFrame(() => {
    if (groupRef.current) {
      const t = performance.now() / 1000;
      groupRef.current.position.y = Math.sin(t * 2.2) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[1.2, 0, 0.5]} scale={[4, 4, 4]}>
      <primitive object={clonedScene} />
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
  const [useGLB, setUseGLB] = useState(false);

  // Check if GLB models are available by verifying magic bytes
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(MODEL_PATHS.base, { method: 'GET', headers: { Range: 'bytes=0-3' } });
        if (res.ok) {
          const buf = await res.arrayBuffer();
          const magic = new Uint8Array(buf);
          if (magic.length >= 4 && magic[0] === 0x67 && magic[1] === 0x6C && magic[2] === 0x54 && magic[3] === 0x46) {
            setUseGLB(true);
          }
        }
      } catch { /* No GLB, use procedural */ }
    })();
  }, []);

  const petPath = config.pet && config.pet !== 'pet_none' ? PET_GLB_MAP[config.pet] : null;

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height }}>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50" />
      <Canvas
        camera={{ position: [0, 0.2, 5], fov: 35 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={0.9} />
        <directionalLight position={[-2, 3, -3]} intensity={0.3} color="#B4C6FF" />
        <hemisphereLight args={['#B4C6FF', '#FDE68A', 0.3]} />

        {useGLB ? (
          /* GLB model: character is ~2.1 units tall (Y: 0 to 2.1), shift down to center */
          <Suspense fallback={null}>
            <group position={[0, -0.9, 0]}>
              <GLBCharacterModel config={config} />
              {petPath && <PetModel path={petPath} />}
              {/* Floor shadow at feet */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.8, 28]} />
                <meshStandardMaterial color="#000000" opacity={0.1} transparent />
              </mesh>
            </group>
          </Suspense>
        ) : (
          /* Procedural fallback */
          <group position={[0, -0.3, 0]}>
            <CharacterModel config={config} />
            <mesh position={[0, -0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.45, 28]} />
              <meshStandardMaterial color="#000000" opacity={0.1} transparent />
            </mesh>
          </group>
        )}

        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
            target={useGLB ? [0, 0, 0] : [0, 0, 0]}
          />
        )}
      </Canvas>
    </div>
  );
}
