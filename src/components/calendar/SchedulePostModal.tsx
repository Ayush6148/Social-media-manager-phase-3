import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { schedulePost, cancelSchedule } from '../../store/slices/postsSlice';
import { addToast } from '../../store/slices/uiSlice';
import { selectAllDrafts, selectCurrentUser } from '../../store/selectors';
import { PlatformId } from '../../types/platform';
import { DraftPost } from '../../types/post';
import { PlatformSelector } from '../composer/PlatformSelector';
import { Modal } from '../common/Modal';
import { format, parseISO, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  existingPost?: DraftPost | null;
}

export const SchedulePostModal: React.FC<SchedulePostModalProps> = ({
  isOpen,
  onClose,
  initialDate,
  existingPost,
}) => {
  const dispatch = useAppDispatch();
  const allDrafts = useAppSelector(selectAllDrafts);
  const currentUser = useAppSelector(selectCurrentUser);

  const defaultDateStr = format(initialDate || addDays(new Date(), 1), 'yyyy-MM-dd');
  const defaultTimeStr = '14:00';

  const [selectedDraftId, setSelectedDraftId] = useState<string>('new');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(['twitter', 'linkedin']);
  const [dateStr, setDateStr] = useState(defaultDateStr);
  const [timeStr, setTimeStr] = useState(defaultTimeStr);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Synchronize when existingPost or initialDate changes
  useEffect(() => {
    if (existingPost) {
      setSelectedDraftId(existingPost.id);
      setTitle(existingPost.title || '');
      setContent(existingPost.content || '');
      setSelectedPlatforms(existingPost.selectedPlatforms || ['twitter', 'linkedin']);
      if (existingPost.scheduledFor) {
        try {
          const parsed = parseISO(existingPost.scheduledFor);
          setDateStr(format(parsed, 'yyyy-MM-dd'));
          setTimeStr(format(parsed, 'HH:mm'));
        } catch (e) {
          setDateStr(defaultDateStr);
        }
      }
    } else {
      setSelectedDraftId('new');
      setTitle('');
      setContent('');
      setSelectedPlatforms(['twitter', 'linkedin']);
      setDateStr(format(initialDate || addDays(new Date(), 1), 'yyyy-MM-dd'));
      setTimeStr('14:00');
    }
  }, [existingPost, initialDate, isOpen]);

  const handleSelectDraftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const draftId = e.target.value;
    setSelectedDraftId(draftId);

    if (draftId !== 'new') {
      const found = allDrafts.find((d) => d.id === draftId);
      if (found) {
        setTitle(found.title);
        setContent(found.content);
        setSelectedPlatforms(found.selectedPlatforms);
      }
    }
  };

  const handleTogglePlatform = (pId: PlatformId) => {
    if (selectedPlatforms.includes(pId)) {
      if (selectedPlatforms.length === 1) return;
      setSelectedPlatforms(selectedPlatforms.filter((id) => id !== pId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, pId]);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!content.trim()) {
      setValidationError('Post content cannot be empty.');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setValidationError('At least one platform must be selected.');
      return;
    }

    const combinedDateTimeStr = `${dateStr}T${timeStr}:00`;
    const scheduledDateTime = new Date(combinedDateTimeStr);

    if (isNaN(scheduledDateTime.getTime())) {
      setValidationError('Invalid date or time selected.');
      return;
    }

    // Schedule post action
    dispatch(
      schedulePost({
        id: selectedDraftId === 'new' ? undefined : selectedDraftId,
        authorId: currentUser?.id,
        authorName: currentUser?.name,
        title: title.trim() || 'Scheduled Post',
        content,
        selectedPlatforms,
        scheduledFor: scheduledDateTime.toISOString(),
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Post Scheduled!',
        message: `Scheduled for ${format(scheduledDateTime, 'MMM d, yyyy @ h:mm a')}`,
      })
    );

    onClose();
  };

  const handleCancelSchedule = () => {
    if (existingPost) {
      dispatch(cancelSchedule(existingPost.id));
      dispatch(
        addToast({
          type: 'info',
          title: 'Schedule Canceled',
          message: 'Post returned to standard drafts.',
        })
      );
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingPost ? 'Edit Scheduled Post' : 'Schedule Post for Calendar'}
      maxWidth="lg"
    >
      <form onSubmit={handleScheduleSubmit} className="space-y-4">
        {validationError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Existing Draft Selector Option */}
        {!existingPost && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Select Post Source</label>
            <select
              value={selectedDraftId}
              onChange={handleSelectDraftChange}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="new">+ Write New Post to Schedule</option>
              {allDrafts.map((draft) => (
                <option key={draft.id} value={draft.id}>
                  Draft: {draft.title} ({draft.selectedPlatforms.join(', ')})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Post Title</label>
          <input
            type="text"
            placeholder="Title / Campaign Topic"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Post Body Content</label>
          <textarea
            rows={4}
            placeholder="Write your post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
          />
        </div>

        {/* Platforms */}
        <div className="pt-1">
          <PlatformSelector
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={handleTogglePlatform}
          />
        </div>

        {/* Date & Time Picker Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CalendarIcon size={14} className="text-indigo-400" /> Target Publish Date
            </label>
            <input
              type="date"
              required
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock size={14} className="text-indigo-400" /> Target Publish Time
            </label>
            <input
              type="time"
              required
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {existingPost && (
            <button
              type="button"
              onClick={handleCancelSchedule}
              className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition-colors"
            >
              Unschedule Post
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              {existingPost ? 'Save Schedule Changes' : 'Confirm & Schedule Post'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
