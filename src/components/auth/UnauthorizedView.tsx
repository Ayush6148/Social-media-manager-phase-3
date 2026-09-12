import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveTab } from '../../store/slices/uiSlice';
import { login, DEMO_ADMIN_USER } from '../../store/slices/authSlice';
import { selectCurrentUser } from '../../store/selectors';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

export const UnauthorizedView: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleSwitchToAdmin = () => {
    dispatch(login({ email: DEMO_ADMIN_USER.email, password: 'Admin@123' }));
    dispatch(setActiveTab('admin'));
  };

  return (
    <div className="max-w-xl mx-auto my-12 flex flex-col items-center justify-center p-8 sm:p-12 bg-slate-900/80 border border-rose-500/30 rounded-3xl text-center space-y-5 shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <ShieldAlert size={36} />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          403 Access Forbidden
        </span>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          Admin Authorization Required
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
          Your current account (<span className="font-semibold text-white">{currentUser?.email}</span>) has role <span className="font-mono text-indigo-400">"{currentUser?.role}"</span>. Admin permissions are required to access user management and global security controls.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full max-w-xs">
        <button
          onClick={() => dispatch(setActiveTab('dashboard'))}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </button>

        <button
          onClick={handleSwitchToAdmin}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
        >
          <KeyRound size={16} /> Switch to Admin Account
        </button>
      </div>
    </div>
  );
};
