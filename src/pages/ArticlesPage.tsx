import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ChevronRight, Search } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import ScrollReveal from '../components/ScrollReveal';
import { ARTICLES, ARTICLE_CATEGORIES, type Article } from '../data/articles';
import { useStore } from '../store/useStore';

const ALL_CATS = ['all', ...Object.keys(ARTICLE_CATEGORIES)] as const;
const CAT_LABELS: Record<string, string> = {
  all: 'Tous',
  bases: 'Bases',
  recettes: 'Recettes',
  sport: 'Sport',
  bienetre: 'Bien-être',
  mythes: 'Mythes',
};

export default function ArticlesPage() {
  const navigate = useNavigate();
  const { readArticles } = useStore(s => ({ readArticles: s.readArticles ?? [] }));
  const [cat, setCat] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = ARTICLES.filter(a =>
    (cat === 'all' || a.category === cat) &&
    (query === '' || a.title.toLowerCase().includes(query.toLowerCase()) || a.preview.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <AnimatedPage className="px-4 pt-12 pb-6 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen size={20} className="text-primary-500" />
        <h1 className="text-2xl font-bold text-text-primary font-display">Apprendre</h1>
      </div>
      <p className="text-sm text-text-secondary mb-4">{ARTICLES.length} articles · {readArticles.length} lus</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un article..."
          className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl text-sm border border-surface-200 outline-none focus:border-primary-300 transition-colors"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {ALL_CATS.map(c => (
          <motion.button key={c} whileTap={{ scale: 0.95 }}
            onClick={() => setCat(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              cat === c ? 'bg-primary-500 text-white' : 'bg-white text-text-secondary border border-surface-200'
            }`}>
            {CAT_LABELS[c] ?? c}
          </motion.button>
        ))}
      </div>

      {/* Articles list */}
      <div className="space-y-3">
        {filtered.map((article, i) => {
          const catInfo = ARTICLE_CATEGORIES[article.category];
          const isRead = readArticles.includes(article.id);
          return (
            <ScrollReveal key={article.id} delay={i * 0.04}>
              <AnimatedCard index={i} className="p-4 cursor-pointer" onClick={() => navigate(`/articles/${article.id}`)}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {article.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                      {isRead && <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Lu</span>}
                    </div>
                    <p className="text-sm font-semibold text-text-primary leading-snug">{article.title}</p>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{article.preview}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Clock size={11} className="text-text-muted" />
                      <span className="text-[10px] text-text-muted">{article.readTime} min</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-text-muted flex-shrink-0 mt-1" />
                </div>
              </AnimatedCard>
            </ScrollReveal>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <BookOpen size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">Aucun article trouvé</p>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
