import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Quote } from 'lucide-react';
import { getDailyMotivation, type MotivationContext } from '../lib/motivation';
import Icon3D from './Icon3D';

interface DailyMotivationProps {
  context: MotivationContext;
}

export default function DailyMotivation({ context }: DailyMotivationProps) {
  const quote = getDailyMotivation(context);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="relative overflow-hidden rounded-2xl p-4 shadow-card"
      style={{
        background: quote.type === 'progress'
          ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)'
          : 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 50%, #FFE082 100%)',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <Sparkles size={80} className={quote.type === 'progress' ? 'text-green-800' : 'text-amber-800'} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          {quote.type === 'progress' ? (
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Sparkles size={12} className="text-green-700" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Quote size={12} className="text-amber-700" />
            </div>
          )}
          <span className={`text-[10px] font-bold uppercase tracking-wider ${
            quote.type === 'progress' ? 'text-green-700' : 'text-amber-700'
          }`}>
            {quote.type === 'progress' ? <><Icon3D name="flexedBiceps" size={14} /> Ton progrès</> : <><Icon3D name="sparkles" size={14} /> Citation du jour</>}
          </span>
        </div>

        <p className={`text-sm font-medium leading-relaxed ${
          quote.type === 'progress' ? 'text-green-900' : 'text-amber-900'
        }`}>
          "{quote.text}"
        </p>

        {quote.author && (
          <p className={`text-xs mt-2 font-semibold ${
            quote.type === 'progress' ? 'text-green-600' : 'text-amber-600'
          }`}>
            — {quote.author}
          </p>
        )}
      </div>
    </motion.div>
  );
}
