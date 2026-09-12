import React from 'react';
import { DraftPost } from '../../types/post';
import { PlatformIcon } from '../common/PlatformIcon';
import { format, isSameDay, isToday } from 'date-fns';
import { Clock, Plus } from 'lucide-react';

interface CalendarCellProps {
  date: Date;
  currentMonth: Date;
  posts: DraftPost[];
  onSelectDate: (date: Date) => void;
  onSelectPost: (post: DraftPost) => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = React.memo(
  ({ date, currentMonth, posts, onSelectDate, onSelectPost }) => {
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
    const today = isToday(date);

    return (
      <div
        onClick={() => onSelectDate(date)}
        className={`group min-h-[110px] p-2 border-b border-r border-slate-800/80 transition-all flex flex-col justify-between cursor-pointer hover:bg-slate-900/60 ${
          !isCurrentMonth ? 'opacity-35 bg-slate-950/40' : 'bg-slate-950/20'
        } ${today ? 'ring-1 ring-inset ring-indigo-500/60 bg-indigo-950/10' : ''}`}
      >
        {/* Cell Header */}
        <div className="flex items-center justify-between mb-1">
          <span
            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold ${
              today
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : isCurrentMonth
                ? 'text-slate-300'
                : 'text-slate-600'
            }`}
          >
            {format(date, 'd')}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectDate(date);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-all"
            title="Schedule post on this date"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Scheduled Posts Chips */}
        <div className="space-y-1 overflow-y-auto max-h-[85px] no-scrollbar">
          {posts.map((post) => {
            const timeFormatted = post.scheduledFor
              ? format(new Date(post.scheduledFor), 'h:mm a')
              : 'Scheduled';

            return (
              <div
                key={post.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPost(post);
                }}
                className="p-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/90 border border-indigo-500/30 text-xs transition-all shadow-sm flex flex-col gap-0.5 group/chip"
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    {post.selectedPlatforms?.map((pId) => (
                      <PlatformIcon key={pId} platformId={pId} size={11} />
                    ))}
                    <span className="font-semibold text-white truncate text-[11px] group-hover/chip:text-indigo-200">
                      {post.title || 'Post'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-indigo-300">
                  <Clock size={10} />
                  <span>{timeFormatted}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      isSameDay(prevProps.date, nextProps.date) &&
      prevProps.currentMonth.getMonth() === nextProps.currentMonth.getMonth() &&
      prevProps.posts.length === nextProps.posts.length &&
      prevProps.posts.every((p, idx) => p.id === nextProps.posts[idx]?.id && p.scheduledFor === nextProps.posts[idx]?.scheduledFor)
    );
  }
);
