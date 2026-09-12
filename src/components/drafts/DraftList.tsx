import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setEditingDraft,
  duplicateDraft,
} from '../../store/slices/postsSlice';
import { setActiveTab, openConfirmModal, addToast } from '../../store/slices/uiSlice';
import { selectFilteredDrafts, selectAllDrafts } from '../../store/selectors';
import { DraftPost } from '../../types/post';
import { DraftFilters } from './DraftFilters';
import { DraftCard } from './DraftCard';
import { DeleteDraftModal } from './DeleteDraftModal';
import { FileText, Plus, SearchX } from 'lucide-react';

export const DraftList: React.FC = () => {
  const dispatch = useAppDispatch();
  const filteredDrafts = useAppSelector(selectFilteredDrafts);
  const totalAllDrafts = useAppSelector(selectAllDrafts);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleEdit = (draft: DraftPost) => {
    dispatch(setEditingDraft(draft));
    dispatch(setActiveTab('composer'));
  };

  const handleDuplicate = (id: string) => {
    dispatch(duplicateDraft(id));
    dispatch(
      addToast({
        type: 'success',
        title: 'Draft Cloned',
        message: 'A duplicate copy of the draft was created.',
      })
    );
  };

  const handleDeletePrompt = (id: string) => {
    const draft = totalAllDrafts.find((d) => d.id === id);
    dispatch(
      openConfirmModal({
        title: 'Delete Draft',
        message: `Are you sure you want to delete "${draft?.title || 'this draft'}"? This action cannot be reversed.`,
        draftId: id,
      })
    );
  };

  const handleCreateNew = () => {
    dispatch(setEditingDraft(null));
    dispatch(setActiveTab('composer'));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DeleteDraftModal />

      {/* Filters Header */}
      <DraftFilters viewMode={viewMode} onToggleViewMode={setViewMode} />

      {/* Main Drafts Content */}
      {filteredDrafts.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'space-y-3'
          }
        >
          {filteredDrafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDeletePrompt}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : totalAllDrafts.length > 0 ? (
        /* Filter Empty State */
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-4">
            <SearchX size={28} />
          </div>
          <h3 className="text-base font-semibold text-white">No Matching Drafts</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
            No posts match your current search query or platform filters.
          </p>
        </div>
      ) : (
        /* Complete Empty State */
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">No Drafts Saved Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mt-1 mb-6">
            Start drafting your social media campaign! Write, validate constraints, and preview posts across all major platforms.
          </p>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={16} /> Create Your First Post
          </button>
        </div>
      )}
    </div>
  );
};
