import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import AnimatedButton from '../components/AnimatedButton';
import WelcomeScreen from '../components/WelcomeScreen';

function LogoIcon() {
  const [failed, setFailed] = React.useState(false);
  if (!failed) {
    return (
      <img src="/logo-icon.png" alt="NutReal" className="w-full h-full object-contain p-2"
        onError={() => setFailed(true)} />
    );
  }
  return <span className="text-4xl font-black text-white font-display">N</span>;
}

export default function AuthPage() {
  const { setAuth } = useStore();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
  }

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

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (!supabase) { setAuth(true, 'demo-user'); return; }
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
    } catch (err: any) { setError(err.message || 'Erreur de connexion'); }
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
          <h1 className="text-3xl font-black text-white font-display">NutReal</h1>
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

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-text-muted">ou continuer avec</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialLogin('google')}
              className="w-full py-3 bg-white border border-surface-300 rounded-2xl text-sm font-semibold text-text-primary flex items-center justify-center gap-3 shadow-card"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialLogin('apple')}
              className="w-full py-3 bg-black rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-3 shadow-card"
            >
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continuer avec Apple
            </motion.button>
          </div>

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
