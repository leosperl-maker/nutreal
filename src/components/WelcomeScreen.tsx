import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Icon3D from './Icon3D';

const valueProps = [
  { icon: 'camera', title: 'Scannez vos repas', desc: 'IA qui analyse vos plats en photo' },
  { icon: 'forkAndKnife', title: 'Plans repas personnalisés', desc: 'Cuisine du monde entier' },
  { icon: 'chartIncreasing', title: 'Suivi intelligent', desc: 'Calories, macros, hydratation, sport' },
  { icon: 'bullseye', title: 'Atteignez vos objectifs', desc: 'Perte de poids, muscle, bien-être' },
];

interface Props {
  onContinue: () => void;
}

export default function WelcomeScreen({ onContinue }: Props) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % valueProps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 flex flex-col items-center justify-between px-6 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-8"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-5xl font-black text-white font-display">N</span>
        </motion.div>
        <h1 className="text-4xl font-bold font-display">NutReal</h1>
        <p className="text-white/80 text-sm mt-2">Votre coach nutrition intelligent</p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center">
              <Icon3D name={valueProps[activeSlide].icon} size={64} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{valueProps[activeSlide].title}</h2>
            <p className="text-white/70">{valueProps[activeSlide].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mb-8">
        {valueProps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="w-full max-w-sm bg-white text-primary-600 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-float"
      >
        Commencer <ArrowRight size={20} />
      </motion.button>

      <p className="text-white/50 text-xs mt-4">
        Rejoignez +10 000 utilisateurs qui mangent mieux
      </p>
    </div>
  );
}
