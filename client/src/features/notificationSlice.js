import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  isConnected: false,
  lastFetched: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Set notifications
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.lastFetched = Date.now();
    },

    // Add new notification (from real-time)
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },

    // Update notification (mark as read, etc.)
    updateNotification: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.notifications.findIndex(n => n._id === id);
      if (index !== -1) {
        state.notifications[index] = { ...state.notifications[index], ...updates };
        
        // Update unread count if read status changed
        if (updates.isRead !== undefined) {
          if (updates.isRead && !state.notifications[index].isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          } else if (!updates.isRead && state.notifications[index].isRead) {
            state.unreadCount += 1;
          }
        }
      }
    },

    // Remove notification
    removeNotification: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find(n => n._id === id);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n._id !== id);
    },

    // Set unread count
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    // Mark notification as read
    markAsRead: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find(n => n._id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    // Mark all notifications as read
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        if (!notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },

    // Set socket connection status
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },

    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    // Reset notification state (on logout)
    resetState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setNotifications,
  addNotification,
  updateNotification,
  removeNotification,
  setUnreadCount,
  markAsRead,
  markAllAsRead,
  setConnectionStatus,
  clearNotifications,
  resetState,
} = notificationSlice.actions;

export default notificationSlice.reducer; 