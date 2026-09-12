import React from 'react';
import { DraftPost } from '../../types/post';
import { PlatformIcon } from '../common/PlatformIcon';
import { Badge } from '../common/Badge';
import { formatRelativeTime, truncateText } from '../../utils/formatters';
import { validateAllSelectedPlatforms } from '../../utils/validation';
import { Edit3, Copy, Trash2, Clock, Tag, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DraftCardProps {
  draft: DraftPost;
  onEdit: (draft: DraftPost) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export const DraftCard: React.FC<DraftCardProps> = ({
  draft,
  onEdit,
  onDuplicate,
  onDelete,
  viewMode = 'grid',
}) => {
  const validation = validateAllSelectedPlatforms(
    draft.content,
    draft.platformOverrides || {},
    draft.selectedPlatforms || []
  );

  if (viewMode === 'list') {
    return (
      <div className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="text-sm font-semibold text-white truncate max-w-md">
              {draft.title || 'Untitled Post'}
            </h3>
            <Badge variant={draft.status === 'ready' ? 'success' : 'default'} size="sm">
              {draft.status === 'ready' ? 'Ready' : 'Draft'}
            </Badge>

            {validation.isAllValid ? (
              <Badge variant="info" size="sm">
                <CheckCircle2 size={10} /> Validated
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                <AlertTriangle size={10} /> Limit Over
              </Badge>
            )}
          </div>

          <p className="text-xs text-slate-300 line-clamp-1 mb-2">
            {truncateText(draft.content, 120)}
          </p>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              {draft.selectedPlatforms?.map((pId) => (
                <div key={pId} className="p-1 rounded bg-slate-950 border border-slate-800">
                  <PlatformIcon platformId={pId} size={12} />
                </div>
              ))}
            </div>

            <span className="flex items-center gap-1 text-slate-500">
              <Clock size={12} /> {formatRelativeTime(draft.updatedAt)}
            </span>

            {draft.tags && draft.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag size={11} className="text-slate-500" />
                <span className="text-slate-400">#{draft.tags.join(', #')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
          <button
            onClick={() => onEdit(draft)}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors"
          >
            <Edit3 size={14} /> Edit
          </button>

          <button
            onClick={() => onDuplicate(draft.id)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>

          <button
            onClick={() => onDelete(draft.id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between h-full shadow-sm hover:shadow-xl relative">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {draft.selectedPlatforms?.map((pId) => (
              <div key={pId} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                <PlatformIcon platformId={pId} size={14} />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant={draft.status === 'ready' ? 'success' : 'default'} size="sm">
              {draft.status === 'ready' ? 'Ready' : 'Draft'}
            </Badge>
          </div>
        </div>

        {/* Title & Snippet */}
        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2 line-clamp-1">
          {draft.title || 'Untitled Post'}
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4 font-sans">
          {draft.content || <span className="text-slate-600 italic">Empty post body...</span>}
        </p>

        {/* Tags */}
        {draft.tags && draft.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {draft.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-auto">
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock size={12} /> {formatRelativeTime(draft.updatedAt)}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(draft.id)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Duplicate draft"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => onDelete(draft.id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Delete draft"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => onEdit(draft)}
            className="flex items-center gap-1 ml-1 px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-semibold transition-all"
          >
            <Edit3 size={13} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};
