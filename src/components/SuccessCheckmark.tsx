import React from 'react';
import { motion } from 'framer-motion';

export default function SuccessCheckmark({ size = 64, color = '#2E9E6B' }: { size?: number; color?: string }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 64 64" initial="hidden" animate="visible">
      <motion.circle cx="32" cy="32" r="28" fill="none" stroke={color} strokeWidth="3"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
        transition={{ duration: 0.4, ease: 'easeOut' }} />
      <motion.path d="M20 32 L28 40 L44 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
        transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }} />
    </motion.svg>
  );
}
