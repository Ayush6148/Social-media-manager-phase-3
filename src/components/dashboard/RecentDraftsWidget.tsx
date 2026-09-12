import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setEditingDraft } from '../../store/slices/postsSlice';
import { setActiveTab } from '../../store/slices/uiSlice';
import { selectAllDrafts } from '../../store/selectors';
import { PlatformIcon } from '../common/PlatformIcon';
import { Badge } from '../common/Badge';
import { formatRelativeTime, truncateText } from '../../utils/formatters';
import { DraftPost } from '../../types/post';
import { ArrowRight, Edit3 } from 'lucide-react';

export const RecentDraftsWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const drafts = useAppSelector(selectAllDrafts);

  // Take top 4 most recently updated drafts
  const recentDrafts = [...drafts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const handleEdit = (draft: DraftPost) => {
    dispatch(setEditingDraft(draft));
    dispatch(setActiveTab('composer'));
  };

  const handleViewAll = () => {
    dispatch(setActiveTab('drafts'));
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Recent Draft Activity
        </h3>
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          View All ({drafts.length}) <ArrowRight size={14} />
        </button>
      </div>

      {recentDrafts.length > 0 ? (
        <div className="space-y-3">
          {recentDrafts.map((draft) => (
            <div
              key={draft.id}
              onClick={() => handleEdit(draft)}
              className="group flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 rounded-xl transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-1 shrink-0">
                  {draft.selectedPlatforms?.map((pId) => (
                    <div key={pId} className="p-1 rounded bg-slate-900 border border-slate-800">
                      <PlatformIcon platformId={pId} size={12} />
                    </div>
                  ))}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                    {draft.title || 'Untitled Post'}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {truncateText(draft.content, 60)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  {formatRelativeTime(draft.updatedAt)}
                </span>
                <Badge variant={draft.status === 'ready' ? 'success' : 'default'} size="sm">
                  {draft.status === 'ready' ? 'Ready' : 'Draft'}
                </Badge>
                <Edit3 size={14} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 text-center py-6">No recent drafts found.</p>
      )}
    </div>
  );
};
