import { toast } from 'sonner';

// Custom toast functions with cancel button support
export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      action: options.showCancel ? {
        label: '✕',
        onClick: () => {
          if (options.onCancel) {
            options.onCancel();
          }
        },
      } : undefined,
      duration: options.duration || 4000,
      ...options,
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      action: options.showCancel ? {
        label: '✕',
        onClick: () => {
          if (options.onCancel) {
            options.onCancel();
          }
        },
      } : undefined,
      duration: options.duration || 5000,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return toast.warning(message, {
      action: options.showCancel ? {
        label: '✕',
        onClick: () => {
          if (options.onCancel) {
            options.onCancel();
          }
        },
      } : undefined,
      duration: options.duration || 4000,
      ...options,
    });
  },

  info: (message, options = {}) => {
    return toast.info(message, {
      action: options.showCancel ? {
        label: '✕',
        onClick: () => {
          if (options.onCancel) {
            options.onCancel();
          }
        },
      } : undefined,
      duration: options.duration || 4000,
      ...options,
    });
  },

  // Custom toast with action buttons
  action: (message, actions = [], options = {}) => {
    return toast(message, {
      action: actions.length > 0 ? {
        label: actions[0].label || 'Action',
        onClick: actions[0].onClick || (() => {}),
      } : undefined,
      duration: options.duration || 4000,
      ...options,
    });
  },

  // Dismissible toast (always shows cancel button)
  dismissible: (message, options = {}) => {
    return toast(message, {
      action: {
        label: '✕',
        onClick: () => {
          if (options.onCancel) {
            options.onCancel();
          }
        },
      },
      duration: options.duration || 4000,
      ...options,
    });
  },
};

// Export the original toast for backward compatibility
export { toast }; 