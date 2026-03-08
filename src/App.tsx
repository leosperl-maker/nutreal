import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import OfflineBanner from './components/OfflineBanner';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import SportPage from './pages/SportPage';
import MealPlanPage from './pages/MealPlanPage';
import Profile from './pages/Profile';
import FoodJournal from './pages/FoodJournal';
import AuthPage from './pages/AuthPage';

function AnimatedRoutes() {
  const location = useLocation();
  const { onboardingComplete, isAuthenticated } = useStore();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {!isAuthenticated ? (
          <><Route path="/auth" element={<AuthPage />} /><Route path="*" element={<Navigate to="/auth" replace />} /></>
        ) : !onboardingComplete ? (
          <><Route path="/onboarding" element={<Onboarding />} /><Route path="*" element={<Navigate to="/onboarding" replace />} /></>
        ) : (
          <><Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="scanner" element={<Scanner />} />
            <Route path="sport" element={<SportPage />} />
            <Route path="meal-plan" element={<MealPlanPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="journal" element={<FoodJournal />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} /></>
        )}
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <OfflineBanner />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
