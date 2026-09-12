import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { login, clearAuthError, DEMO_ADMIN_USER, DEMO_STANDARD_USER } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Layers, ShieldCheck, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);

  const [email, setEmail] = useState('admin@postpulse.io');
  const [password, setPassword] = useState('Admin@123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    dispatch(login({ email, password }));
    dispatch(
      addToast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Signed in as ${email}`,
      })
    );
  };

  const handleQuickDemo = (demoUser: 'admin' | 'user') => {
    dispatch(clearAuthError());
    if (demoUser === 'admin') {
      setEmail(DEMO_ADMIN_USER.email);
      setPassword('Admin@123');
      dispatch(login({ email: DEMO_ADMIN_USER.email, password: 'Admin@123' }));
      dispatch(
        addToast({
          type: 'success',
          title: 'Signed in as Admin',
          message: 'Full administrative & workspace access granted.',
        })
      );
    } else {
      setEmail(DEMO_STANDARD_USER.email);
      setPassword('User@123');
      dispatch(login({ email: DEMO_STANDARD_USER.email, password: 'User@123' }));
      dispatch(
        addToast({
          type: 'info',
          title: 'Signed in as Standard User',
          message: 'Standard creator role permissions active.',
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-xl shadow-indigo-500/25 mb-2">
            <Layers size={30} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign in to PostPulse
          </h2>
          <p className="text-xs text-slate-400">
            Multi-Platform Social Media Post Manager & Scheduler
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            ⚡ Quick Demo Accounts (Click to Auto-Fill & Login)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="flex items-center gap-2 p-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all text-left"
            >
              <ShieldCheck size={16} className="text-indigo-400 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-white">Login as Admin</span>
                <span className="text-[10px] text-slate-400 block truncate">Full Permissions</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="flex items-center gap-2 p-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold transition-all text-left"
            >
              <UserCheck size={16} className="text-sky-400 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-white">Login as User</span>
                <span className="text-[10px] text-slate-400 block truncate">Creator Access</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {authError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (authError) dispatch(clearAuthError());
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight size={16} />
          </button>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
