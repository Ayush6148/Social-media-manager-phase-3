import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeConfirmModal, addToast } from '../../store/slices/uiSlice';
import { deleteDraft } from '../../store/slices/postsSlice';
import { Modal } from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

export const DeleteDraftModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.ui.confirmModal);

  const handleConfirmDelete = () => {
    if (modal.draftId) {
      dispatch(deleteDraft(modal.draftId));
      dispatch(
        addToast({
          type: 'info',
          title: 'Draft Deleted',
          message: 'The draft has been permanently removed.',
        })
      );
      dispatch(closeConfirmModal());
    }
  };

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={() => dispatch(closeConfirmModal())}
      title={modal.title || 'Delete Draft'}
      footer={
        <>
          <button
            onClick={() => dispatch(closeConfirmModal())}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-600/20 transition-all active:scale-95"
          >
            Delete Draft
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {modal.message || 'Are you sure you want to delete this draft? This action cannot be undone.'}
          </p>
        </div>
      </div>
    </Modal>
  );
};
