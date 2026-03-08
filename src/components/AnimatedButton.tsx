import React from 'react';
import { motion } from 'framer-motion';

const variants: Record<string, string> = {
  primary: 'bg-primary-500 text-white shadow-float',
  secondary: 'bg-white text-text-primary shadow-card border border-surface-300',
  ghost: 'bg-transparent text-primary-500',
  danger: 'bg-error-300 text-white shadow-float',
  success: 'bg-success-400 text-white shadow-float',
};

interface Props { children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean; type?: 'button' | 'submit'; variant?: string; }

export default function AnimatedButton({ children, onClick, className = '', disabled = false, type = 'button', variant = 'primary' }: Props) {
  return (
    <motion.button type={type} onClick={onClick} disabled={disabled}
      whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`font-semibold rounded-2xl transition-colors disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
      style={{ willChange: 'transform' }}
    >{children}</motion.button>
  );
}
