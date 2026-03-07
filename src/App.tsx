import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import ProductScanner from './pages/ProductScanner';
import MealPlanPage from './pages/MealPlanPage';
import Profile from './pages/Profile';
import FoodJournal from './pages/FoodJournal';
import AuthPage from './pages/AuthPage';

export default function App() {
  const { onboardingComplete, isAuthenticated } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        ) : !onboardingComplete ? (
          <>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="scanner" element={<Scanner />} />
              <Route path="product-scanner" element={<ProductScanner />} />
              <Route path="meal-plan" element={<MealPlanPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="journal" element={<FoodJournal />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
