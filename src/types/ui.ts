export type ActiveTab = 'dashboard' | 'composer' | 'drafts' | 'calendar' | 'admin' | 'analytics' | 'settings';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}
