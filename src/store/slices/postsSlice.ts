import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DraftFilterState, DraftPost, DraftStatus } from '../../types/post';
import { PlatformId } from '../../types/platform';
import { getInitialMockDrafts, loadDraftsFromStorage } from '../../utils/storage';

interface PostsNormalizedState {
  byIds: Record<string, DraftPost>;
  allIds: string[];
  editingDraft: DraftPost | null;
  filter: DraftFilterState;
  isLoading: boolean;
  error: string | null;
}

// Hydrate initial drafts & pre-seed scheduled mock posts
const storedDrafts = loadDraftsFromStorage();
const initialDraftsArray = storedDrafts.length > 0 ? storedDrafts : getInitialMockDrafts();

const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

const initialByIds: Record<string, DraftPost> = {};
const initialAllIds: string[] = [];

initialDraftsArray.forEach((draft) => {
  const normalizedDraft: DraftPost = {
    ...draft,
    authorId: draft.authorId || 'user-admin-1',
    authorName: draft.authorName || 'Ayush Yadav (Admin)',
  };

  // Add scheduled date to initial sample drafts for instant rich calendar demo
  if (draft.id === 'draft-1') {
    normalizedDraft.status = 'scheduled';
    normalizedDraft.scheduledFor = tomorrow.toISOString();
  } else if (draft.id === 'draft-2') {
    normalizedDraft.status = 'scheduled';
    normalizedDraft.scheduledFor = inThreeDays.toISOString();
  }

  initialByIds[draft.id] = normalizedDraft;
  initialAllIds.push(draft.id);
});

const initialFilter: DraftFilterState = {
  searchQuery: '',
  platform: 'all',
  status: 'all',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
};

const initialState: PostsNormalizedState = {
  byIds: initialByIds,
  allIds: initialAllIds,
  editingDraft: null,
  filter: initialFilter,
  isLoading: false,
  error: null,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    saveDraft: (
      state,
      action: PayloadAction<
        Omit<DraftPost, 'id' | 'createdAt' | 'updatedAt'> & {
          id?: string;
          authorId?: string;
          authorName?: string;
        }
      >
    ) => {
      const nowIso = new Date().toISOString();
      const payload = action.payload;

      if (payload.id && state.byIds[payload.id]) {
        // Update existing draft
        const existing = state.byIds[payload.id];
        const updated: DraftPost = {
          ...existing,
          title: payload.title || 'Untitled Post',
          content: payload.content,
          selectedPlatforms: payload.selectedPlatforms,
          platformOverrides: payload.platformOverrides,
          tags: payload.tags || [],
          status: payload.status || 'draft',
          scheduledFor: payload.scheduledFor || existing.scheduledFor,
          updatedAt: nowIso,
        };
        state.byIds[payload.id] = updated;
        state.editingDraft = updated;
        return;
      }

      // Create new draft
      const newId = payload.id || `draft-${Date.now()}`;
      const newDraft: DraftPost = {
        id: newId,
        authorId: payload.authorId || 'user-admin-1',
        authorName: payload.authorName || 'Ayush Yadav (Admin)',
        title: payload.title.trim() || 'Untitled Draft',
        content: payload.content,
        selectedPlatforms: payload.selectedPlatforms,
        platformOverrides: payload.platformOverrides,
        tags: payload.tags || [],
        status: payload.status || 'draft',
        scheduledFor: payload.scheduledFor,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      state.byIds[newId] = newDraft;
      state.allIds.unshift(newId);
      state.editingDraft = newDraft;
    },

    schedulePost: (
      state,
      action: PayloadAction<{ id?: string; title: string; content: string; selectedPlatforms: PlatformId[]; platformOverrides?: Record<string, string>; scheduledFor: string; authorId?: string; authorName?: string }>
    ) => {
      const nowIso = new Date().toISOString();
      const payload = action.payload;
      const targetId = payload.id || `draft-${Date.now()}`;

      const existing = state.byIds[targetId];
      const scheduledDraft: DraftPost = {
        id: targetId,
        authorId: payload.authorId || existing?.authorId || 'user-admin-1',
        authorName: payload.authorName || existing?.authorName || 'Ayush Yadav (Admin)',
        title: payload.title.trim() || 'Untitled Scheduled Post',
        content: payload.content,
        selectedPlatforms: payload.selectedPlatforms,
        platformOverrides: payload.platformOverrides || existing?.platformOverrides || {},
        tags: existing?.tags || ['Scheduled'],
        status: 'scheduled',
        scheduledFor: payload.scheduledFor,
        createdAt: existing?.createdAt || nowIso,
        updatedAt: nowIso,
      };

      state.byIds[targetId] = scheduledDraft;
      if (!state.allIds.includes(targetId)) {
        state.allIds.unshift(targetId);
      }
      if (state.editingDraft?.id === targetId) {
        state.editingDraft = scheduledDraft;
      }
    },

    reschedulePost: (state, action: PayloadAction<{ id: string; scheduledFor: string }>) => {
      const { id, scheduledFor } = action.payload;
      if (state.byIds[id]) {
        state.byIds[id] = {
          ...state.byIds[id],
          scheduledFor,
          status: 'scheduled',
          updatedAt: new Date().toISOString(),
        };
        if (state.editingDraft?.id === id) {
          state.editingDraft = state.byIds[id];
        }
      }
    },

    cancelSchedule: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.byIds[id]) {
        state.byIds[id] = {
          ...state.byIds[id],
          status: 'draft',
          scheduledFor: undefined,
          updatedAt: new Date().toISOString(),
        };
        if (state.editingDraft?.id === id) {
          state.editingDraft = state.byIds[id];
        }
      }
    },

    updateDraft: (state, action: PayloadAction<DraftPost>) => {
      const updated = {
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      state.byIds[updated.id] = updated;
      if (state.editingDraft?.id === updated.id) {
        state.editingDraft = updated;
      }
    },

    deleteDraft: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.byIds[id];
      state.allIds = state.allIds.filter((item) => item !== id);
      if (state.editingDraft?.id === id) {
        state.editingDraft = null;
      }
    },

    duplicateDraft: (state, action: PayloadAction<string>) => {
      const target = state.byIds[action.payload];
      if (target) {
        const nowIso = new Date().toISOString();
        const newId = `draft-${Date.now()}`;
        const clone: DraftPost = {
          ...target,
          id: newId,
          title: `${target.title} (Copy)`,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        state.byIds[newId] = clone;
        state.allIds.unshift(newId);
      }
    },

    setEditingDraft: (state, action: PayloadAction<DraftPost | null>) => {
      state.editingDraft = action.payload;
    },

    clearEditingDraft: (state) => {
      state.editingDraft = null;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filter.searchQuery = action.payload;
    },

    setPlatformFilter: (state, action: PayloadAction<PlatformId | 'all'>) => {
      state.filter.platform = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<DraftStatus | 'all'>) => {
      state.filter.status = action.payload;
    },

    setSortOption: (
      state,
      action: PayloadAction<{ sortBy: 'updatedAt' | 'createdAt' | 'title'; sortOrder?: 'asc' | 'desc' }>
    ) => {
      state.filter.sortBy = action.payload.sortBy;
      if (action.payload.sortOrder) {
        state.filter.sortOrder = action.payload.sortOrder;
      }
    },

    resetFilters: (state) => {
      state.filter = initialFilter;
    },
  },
});

export const {
  saveDraft,
  schedulePost,
  reschedulePost,
  cancelSchedule,
  updateDraft,
  deleteDraft,
  duplicateDraft,
  setEditingDraft,
  clearEditingDraft,
  setSearchQuery,
  setPlatformFilter,
  setStatusFilter,
  setSortOption,
  resetFilters,
} = postsSlice.actions;

export default postsSlice.reducer;
