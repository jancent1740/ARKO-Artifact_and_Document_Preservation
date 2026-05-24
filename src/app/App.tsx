import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { Skeleton } from './components/ui/skeleton';
import { Toaster } from './components/ui/sonner';

import LoginRegister from './components/portal/LoginRegister';
import CuratorApp from './components/curator/CuratorApp';
import StaffApp from './components/staff/StaffApp';

function PageLoader() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[72px] border-b border-gray-200 px-4 sm:px-6 lg:px-[88px]">
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

interface UserSession {
  id: number;
  email: string;
  name: string;
  role: string;
  username: string;
  avatarUrl: string | null;
  assignedMuseum: string | null;
}

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserSession | null>(() => {
    const stored = localStorage.getItem('arko_user');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = useCallback((userData: UserSession) => {
    setUser(userData);
    localStorage.setItem('arko_user', JSON.stringify(userData));
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('arko_user');
    localStorage.removeItem('arko_token');
    navigate('/register');
  }, [navigate]);

  const [isReady, setIsReady] = useState(false);
  useEffect(() => { setIsReady(true); }, []);

  if (!isReady) return <PageLoader />;

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route
            path="/register"
            element={
              user ? (
                <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
                  <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <p className="text-gray-600 mb-4">You are already logged in as <strong>{user.name}</strong>.</p>
                    <div className="flex gap-3 justify-center">
                      {user.role === 'curator' && (
                        <button onClick={() => navigate('/curator')} className="px-6 py-2 bg-[#1f2937] text-white rounded-[10px] text-sm font-medium">Go to Curator</button>
                      )}
                      {(user.role === 'staff' || user.role === 'volunteer') && (
                        <button onClick={() => navigate('/staff')} className="px-6 py-2 bg-[#1f2937] text-white rounded-[10px] text-sm font-medium">Go to Staff</button>
                      )}
                      <button onClick={handleLogout} className="px-6 py-2 border border-gray-300 text-gray-600 rounded-[10px] text-sm">Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <LoginRegister onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/curator"
            element={
              user?.role === 'curator' ? (
                <CuratorApp user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/register" replace />
              )
            }
          />
          <Route
            path="/staff"
            element={
              user?.role === 'staff' || user?.role === 'volunteer' ? (
                <StaffApp user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/register" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppContent />
    </BrowserRouter>
  );
}
