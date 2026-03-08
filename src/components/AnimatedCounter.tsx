import React, { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

interface Props { value: number; className?: string; duration?: number; suffix?: string; }

export default function AnimatedCounter({ value, className = '', duration = 1, suffix = '' }: Props) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 100, damping: 30, duration: duration * 1000 });
  const display = useTransform(spring, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => { mv.set(value); }, [value, mv]);

  return <motion.span className={className}>{display}</motion.span>;
}
