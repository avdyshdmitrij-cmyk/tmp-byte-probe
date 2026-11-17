import { ru } from '@a-drive/shared';
import { getSupabase } from '@a-drive/shared/supabase';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import GaragePage from './pages/GaragePage';
import HistoryPage from './pages/HistoryPage';
import ScanPage from './pages/ScanPage';
import AddReceiptVisitPage from './pages/AddReceiptVisitPage';
import BottomNav from './components/BottomNav';

const logout = () => void getSupabase()?.auth.signOut();

/** Каркас с нижней навигацией. */
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1">{children}</div>
      <BottomNav />
    </div>
  );
}

/**
 * Приложение открывается без входа: гость работает с локальным
 * хранилищем (демо-режим), личные разделы доступны сразу.
 * Вход — чтобы сохранить данные в облаке и получать
 * подтверждения от сервисов (скан QR, визит по фото).
 */
export default function App() {
  const { loading, configured } = useAuth();

  if (!configured) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md items-center px-4">
        <p className="text-center text-slate-600">{ru.common.notConfigured}</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md items-center justify-center px-4">
        <p className="text-slate-600">{ru.common.loading}</p>
      </main>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <AppLayout>
              <DashboardPage onLogout={logout} />
            </AppLayout>
          }
        />
        <Route
          path="/garage"
          element={
            <AppLayout>
              <GaragePage onLogout={logout} />
            </AppLayout>
          }
        />
        <Route
          path="/history"
          element={
            <AppLayout>
              <HistoryPage />
            </AppLayout>
          }
        />
        <Route
          path="/scan"
          element={
            <AppLayout>
              <ScanPage />
            </AppLayout>
          }
        />
        <Route
          path="/add/photo"
          element={
            <AppLayout>
              <AddReceiptVisitPage mode="photo" />
            </AppLayout>
          }
        />
        <Route
          path="/add/manual"
          element={
            <AppLayout>
              <AddReceiptVisitPage mode="manual" />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
