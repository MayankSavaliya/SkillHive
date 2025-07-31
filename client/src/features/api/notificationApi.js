import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/config/firebase";
import { API_ENDPOINTS } from "@/config/api";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_ENDPOINTS.NOTIFICATION,
    credentials: "include",
    prepareHeaders: async (headers) => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Error getting Firebase token:', error);
      }
      return headers;
    }
  }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, limit = 20, unreadOnly = false } = {}) => ({
        url: "/",
        method: "GET",
        params: { page, limit, unreadOnly },
      }),
      providesTags: ["Notification"],
    }),

    getUnreadCount: builder.query({
      query: () => ({
        url: "/unread-count",
        method: "GET",
      }),
      transformResponse: (response) => response?.count || 0,
      providesTags: ["Notification"],
    }),

    getNotificationMeta: builder.query({
      query: () => ({
        url: "/meta",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    markAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    createNotification: builder.mutation({
      query: (notificationData) => ({
        url: "/create",
        method: "POST",
        body: notificationData,
      }),
      invalidatesTags: ["Notification"],
    }),
    



  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useCreateNotificationMutation,
} = notificationApi; 