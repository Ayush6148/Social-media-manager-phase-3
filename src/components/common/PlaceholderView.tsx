import React from 'react';
import { useAppDispatch } from '../../store';
import { setActiveTab } from '../../store/slices/uiSlice';
import { BarChart3, Settings, Sparkles, ArrowRight } from 'lucide-react';

interface PlaceholderViewProps {
  tab: 'analytics' | 'settings';
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ tab }) => {
  const dispatch = useAppDispatch();
  const isAnalytics = tab === 'analytics';

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800 rounded-3xl text-center space-y-5 min-h-[400px]">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
        {isAnalytics ? <BarChart3 size={32} /> : <Settings size={32} />}
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-bold text-white">
          {isAnalytics ? 'Analytics & Performance (Phase 2)' : 'Platform Connections (Phase 2)'}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {isAnalytics
            ? 'Track reach, engagement rate, impressions, and best publishing times across all connected social channels.'
            : 'Configure OAuth API integrations for X/Twitter, LinkedIn, Facebook Pages, Instagram Graph, and Threads.'}
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={() => dispatch(setActiveTab('composer'))}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Sparkles size={16} /> Return to Post Composer <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
