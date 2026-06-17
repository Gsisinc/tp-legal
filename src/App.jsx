import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleGuard from '@/components/RoleGuard';
import ScrollToTop from './components/ScrollToTop';
import { APP_ROLES } from '@/lib/constants';

// Public pages
import Landing from './pages/Landing';
import BookConsultation from './pages/BookConsultation';

// Layout
import AppLayout from './components/layout/AppLayout';

// Owner pages
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerMatters from './pages/OwnerMatters';
import OwnerPlaybooks from './pages/OwnerPlaybooks';
import OwnerAnalytics from './pages/OwnerAnalytics';
import OwnerSettings from './pages/OwnerSettings';
import OwnerNetwork from './pages/OwnerNetwork';
import ClientDocuments from './pages/ClientDocuments';
import ClientMessages from './pages/ClientMessages';

// Client pages
import ClientDashboard from './pages/ClientDashboard';

// Network Attorney pages
import NetworkAttorneyDashboard from './pages/NetworkAttorneyDashboard';

// Auth & onboarding pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminSetup from './pages/AdminSetup';
import FirmAdminJoin from './pages/FirmAdminJoin';
import AttorneyJoin from './pages/AttorneyJoin';
import FirmCreate from './pages/FirmCreate';
import AttorneySubscribe from './pages/AttorneySubscribe';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#1a2744] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/book" element={<BookConsultation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin/setup" element={<AdminSetup />} />
      <Route path="/owner/join" element={<FirmAdminJoin />} />
      <Route path="/attorney/join" element={<AttorneyJoin />} />
      <Route path="/firm/create" element={<FirmCreate />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/attorney/subscribe" element={<AttorneySubscribe />} />

        <Route element={<RoleGuard allowedRoles={[APP_ROLES.SUPER_ADMIN]} redirectTo="/login" />}>
          <Route element={<AppLayout />}>
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRoles={[APP_ROLES.SUPER_ADMIN, APP_ROLES.FIRM_ADMIN, APP_ROLES.FIRM_OWNER]} redirectTo="/login" />}>
          <Route element={<AppLayout />}>
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/matters" element={<OwnerMatters />} />
            <Route path="/owner/playbooks" element={<OwnerPlaybooks />} />
            <Route path="/owner/analytics" element={<OwnerAnalytics />} />
            <Route path="/owner/network" element={<OwnerNetwork />} />
            <Route path="/owner/settings" element={<OwnerSettings />} />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRoles={[APP_ROLES.CLIENT]} redirectTo="/login" />}>
          <Route element={<AppLayout />}>
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/client/documents" element={<ClientDocuments />} />
            <Route path="/client/messages" element={<ClientMessages />} />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRoles={[APP_ROLES.NETWORK_ATTORNEY]} redirectTo="/login" />}>
          <Route element={<AppLayout />}>
            <Route path="/attorney" element={<NetworkAttorneyDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
