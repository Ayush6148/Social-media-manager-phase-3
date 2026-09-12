import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveTab } from '../../store/slices/uiSlice';
import { clearEditingDraft } from '../../store/slices/postsSlice';
import { selectDraftsSummary, selectPlatformStats, selectCurrentUser } from '../../store/selectors';
import { QuickStatsCard } from './QuickStatsCard';
import { RecentDraftsWidget } from './RecentDraftsWidget';
import { PLATFORMS } from '../../types/platform';
import { PlatformIcon } from '../common/PlatformIcon';
import { Sparkles, FileText, CheckCircle2, Share2, Layers, Zap } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { total, ready } = useAppSelector(selectDraftsSummary);
  const platformStats = useAppSelector(selectPlatformStats);

  const handleCreatePost = () => {
    dispatch(clearEditingDraft());
    dispatch(setActiveTab('composer'));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Zap size={14} className="text-indigo-400" /> Multi-Channel Social Hub • Phase 2 Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser?.name || 'Creator'}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              JWT session active ({currentUser?.role.toUpperCase()} role). Write content once, validate platform constraints, and manage your social campaigns securely.
            </p>
          </div>

          <button
            onClick={handleCreatePost}
            className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all transform active:scale-95 shrink-0"
          >
            <Sparkles size={18} /> Compose New Post
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatsCard
          title="Total Drafts"
          value={total}
          subtitle="Saved in LocalStorage"
          icon={<FileText size={20} />}
          trend="+2 this week"
          trendUp={true}
        />
        <QuickStatsCard
          title="Ready to Publish"
          value={ready}
          subtitle="All constraints validated"
          icon={<CheckCircle2 size={20} />}
          trend={`${Math.round((ready / (total || 1)) * 100)}% of total`}
          trendUp={true}
        />
        <QuickStatsCard
          title="Supported Channels"
          value="5"
          subtitle="X, LinkedIn, FB, IG, Threads"
          icon={<Share2 size={20} />}
        />
        <QuickStatsCard
          title="Validation Engine"
          value="100%"
          subtitle="Real-time constraint checks"
          icon={<Layers size={20} />}
        />
      </div>

      {/* Main Grid: Recent Drafts + Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Drafts Widget */}
        <div className="lg:col-span-8">
          <RecentDraftsWidget />
        </div>

        {/* Platform Coverage Widget */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Platform Distribution
            </h3>

            <div className="space-y-3">
              {Object.values(PLATFORMS).map((p) => {
                const count = platformStats[p.id] || 0;
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-slate-950 border border-slate-800">
                          <PlatformIcon platformId={p.id} size={14} />
                        </div>
                        <span className="font-medium text-slate-200">{p.name}</span>
                      </div>
                      <span className="font-mono text-slate-400">
                        {count} post{count === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tip Card */}
          <div className="bg-gradient-to-tr from-slate-900 to-indigo-950/40 border border-indigo-500/20 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              <Sparkles size={16} /> Pro Tip
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use the top-right user menu to switch between Admin and User roles to test Role-Based Access Control (RBAC) permissions!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
