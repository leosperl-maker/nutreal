import React from 'react';
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

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

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
              <button key={tab.path} onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[56px] flex-1">
                {isActive && (
                  <motion.div layoutId="activeTab"
                    className="absolute -top-1 w-8 h-1 bg-primary-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                )}
                <Icon size={22} className={isActive ? 'text-primary-500' : 'text-text-muted'} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-primary-500' : 'text-text-muted'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
