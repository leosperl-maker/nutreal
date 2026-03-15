import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';

// Apply / remove dark class on <html> element
function DarkModeApplier() {
  const darkMode = useStore((s) => s.darkMode);
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add('dark');
    else html.classList.remove('dark');
  }, [darkMode]);
  return null;
}
import Layout from './components/Layout';
import OfflineBanner from './components/OfflineBanner';
import ConsentBanner from './components/ConsentBanner';

// Eager (auth + onboarding critiques)
import Onboarding from './pages/Onboarding';
import AIAnalysisLoading from './pages/AIAnalysisLoading';
import AuthPage from './pages/AuthPage';

// Lazy (app pages)
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Scanner = React.lazy(() => import('./pages/Scanner'));
const SportPage = React.lazy(() => import('./pages/SportPage'));
const MealPlanPage = React.lazy(() => import('./pages/MealPlanPage'));
const DishDetailPage = React.lazy(() => import('./pages/DishDetailPage'));
const FamilyPage = React.lazy(() => import('./pages/FamilyPage'));
const Profile = React.lazy(() => import('./pages/Profile'));
const FoodJournal = React.lazy(() => import('./pages/FoodJournal'));
const FeminineCycle = React.lazy(() => import('./pages/FeminineCycle'));
const ArticlesPage = React.lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = React.lazy(() => import('./pages/ArticleDetailPage'));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const { onboardingComplete, isAuthenticated } = useStore();
  const routeKey = !isAuthenticated ? 'auth' : !onboardingComplete ? 'onboarding' : location.pathname;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={routeKey}>
        {!isAuthenticated ? (
          <>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        ) : !onboardingComplete ? (
          <>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/loading" element={<AIAnalysisLoading />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Layout />}>
              <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
              <Route path="scanner" element={<Suspense fallback={<PageLoader />}><Scanner /></Suspense>} />
              <Route path="sport" element={<Suspense fallback={<PageLoader />}><SportPage /></Suspense>} />
              <Route path="meal-plan" element={<Suspense fallback={<PageLoader />}><MealPlanPage /></Suspense>} />
              <Route path="meal-plan/dish/:dayIndex/:slotIndex" element={<Suspense fallback={<PageLoader />}><DishDetailPage /></Suspense>} />
              <Route path="family" element={<Suspense fallback={<PageLoader />}><FamilyPage /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
              <Route path="journal" element={<Suspense fallback={<PageLoader />}><FoodJournal /></Suspense>} />
              <Route path="cycle" element={<Suspense fallback={<PageLoader />}><FeminineCycle /></Suspense>} />
              <Route path="articles" element={<Suspense fallback={<PageLoader />}><ArticlesPage /></Suspense>} />
              <Route path="articles/:id" element={<Suspense fallback={<PageLoader />}><ArticleDetailPage /></Suspense>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DarkModeApplier />
      <OfflineBanner />
      <ConsentBanner />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
