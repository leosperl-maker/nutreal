import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import type { Milestone } from '../lib/motivation';

interface MilestoneModalProps {
  milestone: Milestone | null;
  onClose: () => void;
  onCelebrate: (kg: number) => void;
}

// Custom confetti implementation using canvas
function launchConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#4CAF50', '#FF9800', '#42A5F5', '#E91E63', '#FFD700', '#9C27B0', '#00BCD4', '#FF5722'];
  
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    shape: 'rect' | 'circle';
    opacity: number;
    gravity: number;
  }

  const particles: Particle[] = [];
  
  // Create particles in bursts
  for (let i = 0; i < 150; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const velocity = 8 + Math.random() * 12;
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 100,
      y: canvas.height / 2 - 50,
      vx: Math.cos(angle) * velocity * (0.5 + Math.random()),
      vy: Math.sin(angle) * velocity * (0.5 + Math.random()) - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      opacity: 1,
      gravity: 0.15 + Math.random() * 0.1,
    });
  }

  let animationId: number;
  let frame = 0;

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let alive = false;
    
    for (const p of particles) {
      if (p.opacity <= 0) continue;
      alive = true;
      
      p.x += p.vx;
      p.vy += p.gravity;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      
      // Fade out after a while
      if (frame > 60) {
        p.opacity -= 0.008;
      }
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    frame++;
    
    if (alive && frame < 300) {
      animationId = requestAnimationFrame(animate);
    }
  }

  animate();

  return () => {
    if (animationId) cancelAnimationFrame(animationId);
  };
}

export default function MilestoneModal({ milestone, onClose, onCelebrate }: MilestoneModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (milestone && canvasRef.current) {
      // Small delay to let the modal animate in
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          cleanupRef.current = launchConfetti(canvasRef.current) || null;
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (cleanupRef.current) cleanupRef.current();
      };
    }
  }, [milestone]);

  const handleClose = () => {
    if (milestone) {
      onCelebrate(milestone.kg);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={handleClose}
        >
          {/* Confetti canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-[101]"
          />

          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative z-[102] bg-white rounded-3xl p-8 mx-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>

            {/* Trophy animation */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-lg"
            >
              <span className="text-5xl">{milestone.emoji}</span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-800 text-center font-display mb-2"
            >
              {milestone.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <Trophy size={16} className="text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-600">Nouveau jalon atteint !</span>
              <Trophy size={16} className="text-yellow-500" />
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-gray-600 text-sm leading-relaxed mb-6"
            >
              {milestone.message}
            </motion.p>

            {/* Weight badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-primary-50 to-green-50 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">-{milestone.kg} kg</p>
                  <p className="text-[10px] text-primary-400 font-medium">de perdus</p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-semibold text-sm hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all shadow-float"
            >
              Continuer mon parcours
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
