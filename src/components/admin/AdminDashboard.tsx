import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectAllDrafts, selectCurrentUser } from '../../store/selectors';
import { DEMO_ADMIN_USER, DEMO_STANDARD_USER } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { User, UserRole } from '../../types/auth';
import { ShieldCheck, Users, Lock, Key, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const allDrafts = useAppSelector(selectAllDrafts);

  // Managed system users state
  const [usersList, setUsersList] = useState<User[]>([
    DEMO_ADMIN_USER,
    DEMO_STANDARD_USER,
    {
      id: 'user-demo-3',
      name: 'Alex Rivera',
      email: 'alex.rivera@company.com',
      role: 'user',
      createdAt: '2026-02-10T14:20:00.000Z',
    },
    {
      id: 'user-demo-4',
      name: 'Elena Rostova',
      email: 'elena.r@company.com',
      role: 'user',
      createdAt: '2026-03-01T09:15:00.000Z',
    },
  ]);

  const handleToggleRole = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newRole: UserRole = u.role === 'admin' ? 'user' : 'admin';
          dispatch(
            addToast({
              type: 'info',
              title: 'Role Updated',
              message: `${u.name} role changed to ${newRole.toUpperCase()}`,
            })
          );
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/60 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <ShieldCheck size={14} className="text-indigo-400" /> Admin Access Controls (RBAC)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Administration & User Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Logged in as <span className="font-semibold text-white">{currentUser?.name}</span> ({currentUser?.email})
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800">
          <Key size={16} className="text-indigo-400" />
          <span className="text-xs text-slate-300 font-mono font-medium">JWT Status: Active</span>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="p-2 rounded-xl bg-slate-950 text-indigo-400 border border-slate-800">
              <Users size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white">{usersList.length} Accounts</h3>
          <p className="text-xs text-slate-500 mt-1">
            {usersList.filter((u) => u.role === 'admin').length} Admins, {usersList.filter((u) => u.role === 'user').length} Standard Users
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Global Posts
            </span>
            <div className="p-2 rounded-xl bg-slate-950 text-sky-400 border border-slate-800">
              <FileText size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white">{allDrafts.length} Posts</h3>
          <p className="text-xs text-slate-500 mt-1">Across all workspace creators</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Security Engine
            </span>
            <div className="p-2 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800">
              <Lock size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-400">JWT HS256</h3>
          <p className="text-xs text-slate-500 mt-1">1-Hour token auto-expiry enforced</p>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users size={16} className="text-indigo-400" /> User Accounts & Role Permissions
          </h3>
          <span className="text-xs text-slate-400">Click button to toggle roles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 px-3">User Name</th>
                <th className="pb-3 px-3">Email Address</th>
                <th className="pb-3 px-3">Current Role</th>
                <th className="pb-3 px-3">Created Date</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((userItem) => {
                const isAdmin = userItem.role === 'admin';
                return (
                  <tr key={userItem.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold text-[10px]">
                        {userItem.name.substring(0, 2).toUpperCase()}
                      </div>
                      {userItem.name}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{userItem.email}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold text-[11px] border ${
                          isAdmin
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                            : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        }`}
                      >
                        {isAdmin ? <ShieldCheck size={12} /> : <Users size={12} />}
                        {userItem.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleRole(userItem.id)}
                        className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors border ${
                          isAdmin
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        {isAdmin ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Logs Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-400" /> Security Audit Log & Token Verification
        </h3>
        <div className="space-y-2 font-mono text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
            <span>[AUTHENTICATION] Validated JWT bearer signature for {currentUser?.email}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={12} /> VERIFIED
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
            <span>[RBAC_PERMISSIONS] Admin role verified for route /admin</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={12} /> GRANTED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
