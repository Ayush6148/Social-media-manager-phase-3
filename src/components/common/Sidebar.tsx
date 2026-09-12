import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveTab, toggleSidebar } from '../../store/slices/uiSlice';
import { clearEditingDraft } from '../../store/slices/postsSlice';
import { logout } from '../../store/slices/authSlice';
import { selectCurrentUser, selectIsAdmin, selectAllDrafts, selectScheduledPosts } from '../../store/selectors';
import { ActiveTab } from '../../types/ui';
import {
  LayoutDashboard,
  PenSquare,
  FileText,
  Calendar as CalendarIcon,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const drafts = useAppSelector(selectAllDrafts);
  const scheduledPosts = useAppSelector(selectScheduledPosts);
  const currentUser = useAppSelector(selectCurrentUser);
  const isAdmin = useAppSelector(selectIsAdmin);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'composer', label: 'Post Composer', icon: <PenSquare size={20} /> },
    { id: 'drafts', label: 'Drafts', icon: <FileText size={20} />, badge: drafts.length },
    { id: 'calendar', label: 'Calendar Schedule', icon: <CalendarIcon size={20} />, badge: scheduledPosts.length },
    { id: 'admin', label: 'Admin Panel', icon: <ShieldCheck size={20} />, adminOnly: true },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    if (tabId === 'composer' && activeTab !== 'composer') {
      dispatch(clearEditingDraft());
    }
    dispatch(setActiveTab(tabId));
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-full bg-slate-900/90 backdrop-blur-md border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 shrink-0">
              <Layers size={22} />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                  PostPulse
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">
                    v3.0
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 truncate">Calendar & Suite</span>
              </div>
            )}
          </div>

          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 hidden md:flex"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Action Button */}
        <div className="p-3">
          <button
            onClick={() => handleNavClick('composer')}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 ${
              !sidebarOpen && 'px-2'
            }`}
          >
            <Sparkles size={18} />
            {sidebarOpen && <span>Create Post</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span className="truncate flex items-center gap-1.5">
                      {item.label}
                      {item.adminOnly && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                          Admin
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {sidebarOpen && item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-indigo-400 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User / Session Footer */}
      {currentUser && (
        <div className="p-3 border-t border-slate-800 m-3 bg-slate-950/60 rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">{currentUser.name}</span>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                  Role: {currentUser.role}
                </span>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <button
              onClick={() => dispatch(logout())}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
