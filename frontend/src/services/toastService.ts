import toast from 'react-hot-toast';

export const toastService = {
  // Success notifications
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#ffffff',
        borderRadius: '0.5rem',
        fontWeight: '500',
      },
    });
  },

  // Error notifications
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#ffffff',
        borderRadius: '0.5rem',
        fontWeight: '500',
      },
    });
  },

  // Loading notifications
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: '#ffffff',
        borderRadius: '0.5rem',
        fontWeight: '500',
      },
    });
  },

  // Update loading toast
  updateLoading: (toastId: string, message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(message, {
        id: toastId,
        duration: 3000,
        style: {
          background: '#10b981',
          color: '#ffffff',
          borderRadius: '0.5rem',
          fontWeight: '500',
        },
      });
    } else {
      toast.error(message, {
        id: toastId,
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#ffffff',
          borderRadius: '0.5rem',
          fontWeight: '500',
        },
      });
    }
  },

  // Promise-based notification
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages, {
      style: {
        borderRadius: '0.5rem',
        fontWeight: '500',
      },
      success: {
        duration: 3000,
        style: {
          background: '#10b981',
          color: '#ffffff',
        },
      },
      error: {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#ffffff',
        },
      },
      loading: {
        style: {
          background: '#3b82f6',
          color: '#ffffff',
        },
      },
    });
  },

  // Warning notifications
  warning: (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#ffffff',
        borderRadius: '0.5rem',
        fontWeight: '500',
      },
    });
  },

  // Info notifications
  info: (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#06b6d4',
        color: '#ffffff',
        borderRadius: '0.5rem',
        fontWeight: '500',
      },
    });
  },

  // Dismiss specific toast
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },
};
