import React, { useState, useMemo, useCallback } from 'react';
import { useAppSelector } from '../../store';
import { selectScheduledPostsByDateMap, selectScheduledPosts } from '../../store/selectors';
import { DraftPost } from '../../types/post';
import { CalendarCell } from './CalendarCell';
import { SchedulePostModal } from './SchedulePostModal';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from 'date-fns';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const postsByDateMap = useAppSelector(selectScheduledPostsByDateMap);
  const scheduledPosts = useAppSelector(selectScheduledPosts);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<Date>(new Date());
  const [editingPost, setEditingPost] = useState<DraftPost | null>(null);

  // Month Grid Days Calculation
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Week View Days Calculation
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(weekStart);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleOpenScheduleForDate = useCallback((date: Date) => {
    setEditingPost(null);
    setModalInitialDate(date);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditPost = useCallback((post: DraftPost) => {
    setEditingPost(post);
    if (post.scheduledFor) {
      setModalInitialDate(new Date(post.scheduledFor));
    }
    setIsModalOpen(true);
  }, []);

  // Get posts for a specific date cell
  const getPostsForDate = useCallback(
    (date: Date): DraftPost[] => {
      const dateKey = format(date, 'yyyy-MM-dd');
      return postsByDateMap[dateKey] || [];
    },
    [postsByDateMap]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Schedule Modal */}
      <SchedulePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDate={modalInitialDate}
        existingPost={editingPost}
      />

      {/* Header Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <CalendarIcon size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy')}
            </h2>
            <p className="text-xs text-slate-400">
              {scheduledPosts.length} post{scheduledPosts.length === 1 ? '' : 's'} scheduled in queue
            </p>
          </div>
        </div>

        {/* View Switcher & Navigation Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Today Button */}
          <button
            onClick={handleToday}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition-colors"
          >
            Today
          </button>

          {/* Prev/Next */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={handlePrev}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-semibold capitalize rounded-lg transition-all ${
                  viewMode === mode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* New Schedule CTA */}
          <button
            onClick={() => handleOpenScheduleForDate(new Date())}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all active:scale-95"
          >
            <Plus size={16} /> Schedule Post
          </button>
        </div>
      </div>

      {/* MONTH VIEW GRID */}
      {viewMode === 'month' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          {/* Day Headers (Sun-Sat) */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/80 text-center py-2.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7">
            {monthDays.map((day) => (
              <CalendarCell
                key={day.toISOString()}
                date={day}
                currentMonth={currentDate}
                posts={getPostsForDate(day)}
                onSelectDate={handleOpenScheduleForDate}
                onSelectPost={handleOpenEditPost}
              />
            ))}
          </div>
        </div>
      )}

      {/* WEEK VIEW COLUMN BREAKDOWN */}
      {viewMode === 'week' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/80 text-center py-3 text-xs font-bold text-slate-300">
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="space-y-1">
                <span className="text-slate-400 block uppercase">{format(day, 'EEE')}</span>
                <span
                  className={`inline-block w-7 h-7 leading-7 rounded-full ${
                    isSameDay(day, new Date())
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-200'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 min-h-[400px]">
            {weekDays.map((day) => {
              const posts = getPostsForDate(day);
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleOpenScheduleForDate(day)}
                  className="p-3 border-r border-slate-800/80 hover:bg-slate-900/40 transition-colors flex flex-col gap-2 cursor-pointer"
                >
                  {posts.map((p) => (
                    <div
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditPost(p);
                      }}
                      className="p-2.5 rounded-xl bg-indigo-950 border border-indigo-500/30 text-xs shadow-md space-y-1"
                    >
                      <h4 className="font-bold text-white truncate">{p.title}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-indigo-300">
                        <Clock size={10} />
                        <span>{p.scheduledFor ? format(new Date(p.scheduledFor), 'h:mm a') : 'Scheduled'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY VIEW DETAILED AGENDA */}
      {viewMode === 'day' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h3>
              <p className="text-xs text-slate-400">Scheduled Posts Agenda</p>
            </div>
            <button
              onClick={() => handleOpenScheduleForDate(currentDate)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
            >
              <Plus size={16} /> Add Post for Today
            </button>
          </div>

          <div className="space-y-3">
            {getPostsForDate(currentDate).length > 0 ? (
              getPostsForDate(currentDate).map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleOpenEditPost(post)}
                  className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">{post.title}</h4>
                    <p className="text-xs text-slate-400">{post.content}</p>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 px-3 py-1 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
                    {post.scheduledFor ? format(new Date(post.scheduledFor), 'h:mm a') : 'Scheduled'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">No posts scheduled for this day.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
