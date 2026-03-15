import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { ARTICLES, ARTICLE_CATEGORIES } from '../data/articles';
import { useStore } from '../store/useStore';
import ScrollReveal from '../components/ScrollReveal';

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { readArticles, markArticleRead, addXP } = useStore(s => ({
    readArticles: s.readArticles ?? [],
    markArticleRead: s.markArticleRead,
    addXP: s.addXP,
  }));

  const article = ARTICLES.find(a => a.id === id);
  const isRead = article ? readArticles.includes(article.id) : false;

  useEffect(() => {
    if (!article || isRead) return;
    const timer = setTimeout(() => {
      markArticleRead(article.id);
      addXP(10);
    }, article.readTime * 30 * 1000); // mark after 30s * readTime (simplified)
    return () => clearTimeout(timer);
  }, [article?.id]);

  if (!article) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-muted">Article introuvable</p>
        <button onClick={() => navigate('/articles')} className="mt-4 text-primary-500 text-sm">Retour aux articles</button>
      </div>
    );
  }

  const catInfo = ARTICLE_CATEGORIES[article.category];

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-6 border-b border-surface-100">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
            className="w-9 h-9 bg-surface-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-text-secondary" />
          </motion.button>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${catInfo.color}`}>{catInfo.label}</span>
          {isRead && (
            <div className="flex items-center gap-1 ml-auto">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">+10 XP</span>
            </div>
          )}
        </div>
        <div className="text-4xl mb-3">{article.emoji}</div>
        <h1 className="font-display text-xl font-bold text-text-primary leading-snug mb-2">{article.title}</h1>
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-text-muted" />
          <span className="text-xs text-text-muted">{article.readTime} min de lecture</span>
        </div>
      </div>

      {/* Preview */}
      <div className="px-4 py-4 bg-primary-50 border-b border-primary-100">
        <p className="text-sm text-primary-700 italic leading-relaxed">{article.preview}</p>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {article.content.map((para, i) => (
          <ScrollReveal key={i} delay={i * 0.06}>
            <p className="text-sm text-text-primary leading-relaxed">{para}</p>
            {i < article.content.length - 1 && <div className="border-b border-surface-100 mt-4" />}
          </ScrollReveal>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-4 mt-2">
        <motion.button whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/articles')}
          className="w-full py-3 bg-surface-100 rounded-xl text-sm font-medium text-text-secondary">
          Voir tous les articles
        </motion.button>
      </div>
    </div>
  );
}
