import { useEffect, useRef } from 'react';

// canvas-confetti types inline (avoids esModuleInterop issues)
interface ConfettiOpts {
  particleCount?: number;
  angle?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  shapes?: string[];
  scalar?: number;
  zIndex?: number;
  disableForReducedMotion?: boolean;
}

type ConfettiFn = (opts?: ConfettiOpts) => Promise<null> | null;

// Dynamic import to handle CommonJS interop
let _confetti: ConfettiFn | null = null;
async function getConfetti(): Promise<ConfettiFn> {
  if (_confetti) return _confetti;
  const mod = await import('canvas-confetti');
  // Handle both default export and module.exports styles
  _confetti = (mod.default ?? (mod as unknown as { default: ConfettiFn }).default ?? mod) as unknown as ConfettiFn;
  return _confetti;
}

function fireOnce(opts: ConfettiOpts) {
  getConfetti().then(fn => fn({ ...opts, disableForReducedMotion: true }));
}

// ─── Component ──────────────────────────────────────────────────────────────

interface ConfettiExplosionProps {
  trigger: boolean;
  colors?: string[];
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
}

export default function ConfettiExplosion({
  trigger,
  colors = ['#2A6B8A', '#4ECDC4', '#FFE66D', '#FF6B6B', '#A8E6CF', '#FFB347'],
  particleCount = 120,
  spread = 80,
  origin = { x: 0.5, y: 0.5 },
}: ConfettiExplosionProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    firedRef.current = true;

    // First burst — center explosion
    fireOnce({ particleCount: Math.round(particleCount * 0.6), spread, origin, colors, startVelocity: 45, gravity: 0.85, scalar: 1.1, ticks: 200 });

    // Second burst — wider, delayed
    setTimeout(() => {
      fireOnce({ particleCount: Math.round(particleCount * 0.4), spread: spread + 30, origin, colors, startVelocity: 30, gravity: 0.75, scalar: 0.9, ticks: 180 });
    }, 150);

    // Side cannons for big celebrations
    if (particleCount >= 100) {
      setTimeout(() => {
        fireOnce({ particleCount: 30, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors, startVelocity: 55 });
        fireOnce({ particleCount: 30, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors, startVelocity: 55 });
      }, 250);
    }
  }, [trigger]);

  // Reset fired state when trigger goes back to false
  useEffect(() => {
    if (!trigger) firedRef.current = false;
  }, [trigger]);

  return null;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/** Convenience hook — call fireConfetti() to launch confetti anywhere */
export function useConfetti(
  colors = ['#2A6B8A', '#4ECDC4', '#FFE66D', '#FF6B6B', '#A8E6CF', '#FFB347']
) {
  const fireConfetti = (opts?: ConfettiOpts) => {
    const base: ConfettiOpts = {
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      colors,
      startVelocity: 45,
      gravity: 0.85,
      scalar: 1.1,
      ticks: 200,
      disableForReducedMotion: true,
    };

    fireOnce({ ...base, ...opts });

    setTimeout(() => {
      fireOnce({
        ...base,
        particleCount: 60,
        spread: 110,
        startVelocity: 30,
        gravity: 0.75,
        ticks: 180,
        ...opts,
      });
    }, 200);
  };

  return { fireConfetti };
}
