import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { InteractiveTimerPage } from './pages/InteractiveTimerPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <Navigate to="/timer" replace /> : <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/timer" replace />} />
        <Route path="/timer" element={<InteractiveTimerPage />} />
        <Route path="/tasks"      element={<PrivateRoute><TasksPage /></PrivateRoute>} />
        <Route path="/statistics" element={<PrivateRoute><StatisticsPage /></PrivateRoute>} />
        <Route path="/chat"       element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/settings"   element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/login"      element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register"   element={<AuthRoute><RegisterPage /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/timer" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
