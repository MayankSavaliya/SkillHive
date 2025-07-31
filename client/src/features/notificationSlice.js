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
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.lastFetched = Date.now();
    },

    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },

    updateNotification: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.notifications.findIndex(n => n._id === id);
      if (index !== -1) {
        state.notifications[index] = { ...state.notifications[index], ...updates };
        
        if (updates.isRead !== undefined) {
          if (updates.isRead && !state.notifications[index].isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          } else if (!updates.isRead && state.notifications[index].isRead) {
            state.unreadCount += 1;
          }
        }
      }
    },

    removeNotification: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find(n => n._id === id);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n._id !== id);
    },

    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    markAsRead: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find(n => n._id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        if (!notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },

    
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },

    
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    
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