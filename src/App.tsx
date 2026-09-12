import React from 'react';
import { useAppSelector } from './store';
import { selectIsAdmin } from './store/selectors';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { PostComposer } from './components/composer/PostComposer';
import { DraftList } from './components/drafts/DraftList';
import { CalendarView } from './components/calendar/CalendarView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UnauthorizedView } from './components/auth/UnauthorizedView';
import { PlaceholderView } from './components/common/PlaceholderView';

export const AppContent: React.FC = () => {
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const isAdmin = useAppSelector(selectIsAdmin);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'composer' && <PostComposer />}
          {activeTab === 'drafts' && <DraftList />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'admin' && (isAdmin ? <AdminDashboard /> : <UnauthorizedView />)}
          {activeTab === 'analytics' && <PlaceholderView tab="analytics" />}
          {activeTab === 'settings' && <PlaceholderView tab="settings" />}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  );
};

export default App;
