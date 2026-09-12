import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSidebar, setActiveTab } from '../../store/slices/uiSlice';
import { setSearchQuery, clearEditingDraft } from '../../store/slices/postsSlice';
import { logout } from '../../store/slices/authSlice';
import { selectCurrentUser, selectIsAdmin } from '../../store/selectors';
import { addToast } from '../../store/slices/uiSlice';
import { Menu, Search, Plus, Bell, LogOut, ShieldCheck, User } from 'lucide-react';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const searchQuery = useAppSelector((state) => state.posts.filter.searchQuery);
  const currentUser = useAppSelector(selectCurrentUser);
  const isAdmin = useAppSelector(selectIsAdmin);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'composer':
        return 'Post Composer';
      case 'drafts':
        return 'Saved Drafts';
      case 'calendar':
        return 'Interactive Content Calendar';
      case 'admin':
        return 'System Administration';
      case 'analytics':
        return 'Analytics & Reach';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'PostPulse';
    }
  };

  const handleCreateNew = () => {
    dispatch(clearEditingDraft());
    dispatch(setActiveTab('composer'));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(
      addToast({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been signed out successfully.',
      })
    );
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors md:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{getTitle()}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Create, validate, schedule and manage your multi-channel posts effortlessly
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search posts, drafts..."
            value={searchQuery}
            onChange={(e) => {
              dispatch(setSearchQuery(e.target.value));
              if (activeTab !== 'drafts' && e.target.value.trim() !== '') {
                dispatch(setActiveTab('drafts'));
              }
            }}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Notifications mock */}
        <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors relative hidden sm:block">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
        </button>

        {/* New Post Button */}
        {activeTab !== 'composer' && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Post</span>
          </button>
        )}

        {/* User Account & Role Badge */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-bold text-white truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold flex items-center justify-end gap-1">
                {isAdmin ? <ShieldCheck size={10} /> : <User size={10} />}
                {currentUser.role.toUpperCase()}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
