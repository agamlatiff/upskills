import { create } from 'zustand';
import { Toast, ToastType } from '../components/Toast';

interface ToastState {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  showToast: (type: ToastType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, message, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    return id;
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  success: (message: string, duration?: number) => {
    useToastStore.getState().showToast('success', message, duration);
  },

  error: (message: string, duration?: number) => {
    useToastStore.getState().showToast('error', message, duration);
  },

  info: (message: string, duration?: number) => {
    useToastStore.getState().showToast('info', message, duration);
  },

  warning: (message: string, duration?: number) => {
    useToastStore.getState().showToast('warning', message, duration);
  },
}));

export default useToastStore;


