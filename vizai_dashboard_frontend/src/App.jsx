import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import ReconnectBanner from './components/common/ReconnectBanner';
import './App.css';

// Lazy loaded pages for faster initial load
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AnimalSelectionPage = lazy(() => import('./pages/AnimalSelectionPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// PUBLIC_INTERFACE
export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ReconnectBanner />
        <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
          <Routes>
            {/* New explicit auth routes per UI flow */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Keep legacy /auth route for compatibility */}
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/animals" element={<AnimalSelectionPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              {/* Alerts stub for nav alignment */}
              <Route path="/alerts" element={<div className="content-card"><h2>Alerts</h2><div className="small">Coming soon</div></div>} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProviders>
  );
}
