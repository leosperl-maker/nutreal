import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import AnimatedButton from '../components/AnimatedButton';

function LogoIcon() {
  const [failed, setFailed] = React.useState(false);
  if (!failed) {
    return (
      <img src="/logo-icon.png" alt="Nutreal" className="w-full h-full object-contain p-2"
        onError={() => setFailed(true)} />
    );
  }
  return <span className="text-4xl font-black text-white font-display">N</span>;
}

export default function AuthPage() {
  const { setAuth } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (supabase) {
        const { data, error: err } = isLogin
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (data.user) setAuth(true, data.user.id);
      } else {
        setAuth(true, 'demo-user');
      }
    } catch (err: any) { setError(err.message || 'Erreur de connexion'); }
    setLoading(false);
  };

  const handleDemo = () => setAuth(true, 'demo-user');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow overflow-hidden">
            <LogoIcon />
          </motion.div>
          <h1 className="text-3xl font-black text-white font-display">Nutreal</h1>
          <p className="text-white/70 text-sm mt-1">Votre coach nutrition IA</p>
        </div>

        <div className="glass rounded-3xl p-6 shadow-float">
          <div className="flex bg-surface-200 rounded-xl p-1 mb-6">
            {['Connexion', 'Inscription'].map((t, i) => (
              <button key={t} onClick={() => setIsLogin(i === 0)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${(i === 0 ? isLogin : !isLogin) ? 'bg-white text-primary-500 shadow-card' : 'text-text-secondary'}`}>
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-surface-100 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe"
                className="w-full pl-10 pr-10 py-3 bg-surface-100 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="text-error-300 text-xs text-center">{error}</p>}
            <AnimatedButton type="submit" disabled={loading} className="w-full py-3.5 text-sm">
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer un compte'}
            </AnimatedButton>
          </form>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-surface-300" />
            <span className="text-xs text-text-muted">ou</span>
            <div className="flex-1 h-px bg-surface-300" />
          </div>

          <AnimatedButton variant="secondary" onClick={handleDemo} className="w-full py-3 mt-4 text-sm flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-warning-300" /> Mode démo
          </AnimatedButton>
        </div>
      </motion.div>
    </div>
  );
}
