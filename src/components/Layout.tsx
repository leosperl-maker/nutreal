import React, { useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, Dumbbell, CalendarDays, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Toast from './Toast';

const tabs = [
  { path: '/', icon: Home, label: 'Accueil' },
  { path: '/scanner', icon: Camera, label: 'Scanner' },
  { path: '/sport', icon: Dumbbell, label: 'Sport' },
  { path: '/meal-plan', icon: CalendarDays, label: 'Plan repas' },
  { path: '/profile', icon: User, label: 'Profil' },
];

function haptic(pattern: number | number[] = 10) {
  try { navigator.vibrate?.(pattern); } catch { /* ignore */ }
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabPress = useCallback((path: string) => {
    if (location.pathname !== path) {
      haptic(10);
      navigate(path);
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-surface-100 pb-20">
      <Outlet />
      <Toast />
      <nav className="fixed bottom-0 left-0 right-0 glass-strong safe-bottom z-50 border-t border-white/20">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.path}
                onClick={() => handleTabPress(tab.path)}
                whileTap={{ scale: 0.82 }}
                transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[56px] flex-1 select-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 w-8 h-1 bg-primary-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={isActive ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <Icon
                    size={22}
                    className={isActive ? 'text-primary-500' : 'text-text-muted'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                </motion.div>
                <motion.span
                  animate={{ opacity: isActive ? 1 : 0.55 }}
                  className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-primary-500' : 'text-text-muted'}`}
                >
                  {tab.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
