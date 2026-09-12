import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { PlatformId } from '../../types/platform';
import { DraftPost } from '../../types/post';
import { format, parseISO } from 'date-fns';

// Input Selectors
const selectPostsState = (state: RootState) => state.posts;
const selectAuthState = (state: RootState) => state.auth;
const selectFilter = (state: RootState) => state.posts.filter;

// Memoized Auth Selectors
export const selectCurrentUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectIsAdmin = createSelector(
  [selectCurrentUser],
  (user) => user?.role === 'admin'
);

// Memoized Base Posts Selectors
export const selectAllDrafts = createSelector(
  [selectPostsState],
  (posts): DraftPost[] => {
    return posts.allIds.map((id) => posts.byIds[id]).filter(Boolean);
  }
);

// Memoized RBAC-Filtered Drafts (Admin sees all, User sees owned drafts)
export const selectUserDrafts = createSelector(
  [selectAllDrafts, selectCurrentUser],
  (drafts, user): DraftPost[] => {
    if (!user) return [];
    if (user.role === 'admin') return drafts;
    return drafts.filter((d) => !d.authorId || d.authorId === user.id || d.authorId === 'user-admin-1');
  }
);

// Memoized Scheduled Posts Selector
export const selectScheduledPosts = createSelector(
  [selectUserDrafts],
  (drafts): DraftPost[] => {
    return drafts.filter((d) => d.status === 'scheduled' || !!d.scheduledFor);
  }
);

// Map of Scheduled Posts by Date (YYYY-MM-DD -> DraftPost[])
export const selectScheduledPostsByDateMap = createSelector(
  [selectScheduledPosts],
  (scheduledPosts): Record<string, DraftPost[]> => {
    const map: Record<string, DraftPost[]> = {};

    scheduledPosts.forEach((post) => {
      if (post.scheduledFor) {
        try {
          const key = format(parseISO(post.scheduledFor), 'yyyy-MM-dd');
          if (!map[key]) {
            map[key] = [];
          }
          map[key].push(post);
        } catch (e) {
          // ignore invalid dates
        }
      }
    });

    return map;
  }
);

// Memoized Filtered & Sorted Drafts Selector
export const selectFilteredDrafts = createSelector(
  [selectUserDrafts, selectFilter],
  (drafts, filter): DraftPost[] => {
    const query = filter.searchQuery.trim().toLowerCase();

    return drafts
      .filter((draft) => {
        // Search query matching
        if (query !== '') {
          const matchesTitle = draft.title.toLowerCase().includes(query);
          const matchesContent = draft.content.toLowerCase().includes(query);
          const matchesTag = draft.tags?.some((t) => t.toLowerCase().includes(query));
          if (!matchesTitle && !matchesContent && !matchesTag) return false;
        }

        // Platform filter
        if (filter.platform !== 'all') {
          if (!draft.selectedPlatforms?.includes(filter.platform as PlatformId)) return false;
        }

        // Status filter
        if (filter.status !== 'all') {
          if (draft.status !== filter.status) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (filter.sortBy === 'createdAt') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
      });
  }
);

// Memoized Platform Stats Selector
export const selectPlatformStats = createSelector(
  [selectAllDrafts],
  (drafts): Record<PlatformId, number> => {
    const stats: Record<PlatformId, number> = {
      twitter: 0,
      linkedin: 0,
      facebook: 0,
      instagram: 0,
      threads: 0,
    };

    drafts.forEach((draft) => {
      draft.selectedPlatforms?.forEach((pId) => {
        if (stats[pId] !== undefined) {
          stats[pId] += 1;
        }
      });
    });

    return stats;
  }
);

// Memoized Total Drafts Stats Selector
export const selectDraftsSummary = createSelector(
  [selectAllDrafts],
  (drafts) => {
    const total = drafts.length;
    const ready = drafts.filter((d) => d.status === 'ready').length;
    const scheduled = drafts.filter((d) => d.status === 'scheduled' || !!d.scheduledFor).length;
    const draftOnly = total - ready - scheduled;
    return { total, ready, scheduled, draftOnly };
  }
);
