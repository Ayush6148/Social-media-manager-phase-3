import { Middleware } from '@reduxjs/toolkit';
import { saveDraftsToStorage } from '../../utils/storage';

export const localStorageMiddleware: Middleware = (storeApi) => (next) => (action: any) => {
  const result = next(action);

  if (
    action.type?.startsWith('posts/saveDraft') ||
    action.type?.startsWith('posts/updateDraft') ||
    action.type?.startsWith('posts/deleteDraft') ||
    action.type?.startsWith('posts/duplicateDraft')
  ) {
    const state = storeApi.getState();
    if (state.posts?.byIds && state.posts?.allIds) {
      const draftsArray = state.posts.allIds
        .map((id: string) => state.posts.byIds[id])
        .filter(Boolean);
      saveDraftsToStorage(draftsArray);
    }
  }

  return result;
};
