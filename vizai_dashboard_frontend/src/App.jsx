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

// PUBLIC_INTERFACE
export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ReconnectBanner />
        <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/animals" replace />} />
              <Route path="/animals" element={<AnimalSelectionPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/animals" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProviders>
  );
}
