import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';
import { getMe } from './redux/slices/authSlice';
import Sidebar from './components/layout/Sidebar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import ReportsList from './pages/reports/ReportsList';
import UploadReport from './pages/reports/UploadReport';
import ReportDetail from './pages/reports/ReportDetail';
import ChatPage from './pages/chat/ChatPage';
import AppointmentsList from './pages/appointments/AppointmentsList';
import MedicinesPage from './pages/health/MedicinesPage';
import PredictionsPage from './pages/health/PredictionsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import HealthScorePage from './pages/health/HealthScorePage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookAppointment from './pages/appointments/BookAppointment';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" />;
  return <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f172a]"><Sidebar /><main className="flex-1 min-h-screen overflow-x-hidden"><div className="pt-16 lg:pt-0">{children}</div></main></div>;
}

function AppRoutes() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) dispatch(getMe());
  }, [dispatch]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />

      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsList /></ProtectedRoute>} />
      <Route path="/reports/upload" element={<ProtectedRoute><UploadReport /></ProtectedRoute>} />
      <Route path="/reports/:id" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><AppointmentsList /></ProtectedRoute>} />
      <Route path="/appointments/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
      <Route path="/medicines" element={<ProtectedRoute><MedicinesPage /></ProtectedRoute>} />
      <Route path="/predictions" element={<ProtectedRoute><PredictionsPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/health" element={<ProtectedRoute><HealthScorePage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      <Route path="/doctor/*" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
          <Router>
            <AppRoutes />
            <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', padding: '12px 16px' } }} />
          </Router>
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  );
}
