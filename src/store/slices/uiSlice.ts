import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveTab, ToastMessage, ToastType } from '../../types/ui';
import { PlatformId } from '../../types/platform';

interface UiState {
  activeTab: ActiveTab;
  sidebarOpen: boolean;
  toasts: ToastMessage[];
  previewPlatform: PlatformId;
  confirmModal: {
    isOpen: boolean;
    title: string;
    message: string;
    draftId: string | null;
  };
}

const initialState: UiState = {
  activeTab: 'dashboard',
  sidebarOpen: true,
  toasts: [],
  previewPlatform: 'twitter',
  confirmModal: {
    isOpen: false,
    title: '',
    message: '',
    draftId: null,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<ActiveTab>) => {
      state.activeTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setPreviewPlatform: (state, action: PayloadAction<PlatformId>) => {
      state.previewPlatform = action.payload;
    },
    addToast: (
      state,
      action: PayloadAction<{ type: ToastType; message: string; title?: string; duration?: number }>
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
      state.toasts.push({
        id,
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 4000,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openConfirmModal: (
      state,
      action: PayloadAction<{ title: string; message: string; draftId: string }>
    ) => {
      state.confirmModal = {
        isOpen: true,
        title: action.payload.title,
        message: action.payload.message,
        draftId: action.payload.draftId,
      };
    },
    closeConfirmModal: (state) => {
      state.confirmModal = {
        isOpen: false,
        title: '',
        message: '',
        draftId: null,
      };
    },
  },
});

export const {
  setActiveTab,
  toggleSidebar,
  setSidebarOpen,
  setPreviewPlatform,
  addToast,
  removeToast,
  openConfirmModal,
  closeConfirmModal,
} = uiSlice.actions;

export default uiSlice.reducer;
