import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, ScanBarcode, CalendarDays, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/', icon: Home, label: 'Accueil' },
  { path: '/scanner', icon: Camera, label: 'Scanner IA' },
  { path: '/product-scanner', icon: ScanBarcode, label: 'Produit' },
  { path: '/meal-plan', icon: CalendarDays, label: 'Plan repas' },
  { path: '/profile', icon: User, label: 'Profil' },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-100 pb-20">
      <Outlet />
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-surface-200 safe-bottom z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[60px] transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 w-8 h-1 bg-primary-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  size={22}
                  className={`transition-colors ${
                    isActive ? 'text-primary-500' : 'text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span
                  className={`text-[10px] mt-0.5 font-medium transition-colors ${
                    isActive ? 'text-primary-500' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
