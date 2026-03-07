import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, User, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase, isOfflineMode } from '../lib/supabase';

export default function AuthPage() {
  const { setAuth } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isOfflineMode || !supabase) {
        // Offline mode: simulate auth
        await new Promise(resolve => setTimeout(resolve, 800));
        setAuth(true, 'demo-user-' + Date.now());
        return;
      }

      if (isLogin) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        setAuth(true, data.user?.id || null);
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;
        setAuth(true, data.user?.id || null);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    setAuth(true, 'demo-user-' + Date.now());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-float">
            <span className="text-3xl">🥗</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 font-display">NutriLens</h1>
          <p className="text-gray-400 text-sm mt-1">Votre coach nutrition intelligent</p>
        </div>

        {/* Offline Mode Notice */}
        {isOfflineMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2"
          >
            <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Base de données non connectée. L'app fonctionne en mode local — vos données sont sauvegardées sur cet appareil.
            </p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white rounded-xl pl-11 pr-4 py-3.5 text-sm border border-gray-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all shadow-card"
              required={!isOfflineMode}
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white rounded-xl pl-11 pr-11 py-3.5 text-sm border border-gray-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all shadow-card"
              required={!isOfflineMode}
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs text-center bg-red-50 rounded-lg p-2"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <User size={18} />
                {isLogin ? 'Se connecter' : 'Créer un compte'}
              </>
            )}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <p className="text-center text-sm text-gray-400 mt-4">
          {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-primary-500 font-semibold hover:underline"
          >
            {isLogin ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </p>

        {/* Demo Mode Button */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={handleDemoMode}
            className="w-full bg-white text-gray-600 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-surface-50 active:scale-[0.98] transition-all shadow-card border border-gray-100"
          >
            <Sparkles size={18} className="text-secondary-500" />
            Explorer en mode démo
          </button>
          <p className="text-[11px] text-gray-300 text-center mt-2">
            Aucun compte requis — données stockées localement
          </p>
        </div>
      </motion.div>
    </div>
  );
}
