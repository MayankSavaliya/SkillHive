import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/config/firebase";
import { API_ENDPOINTS } from "@/config/api";

export const instructorApi = createApi({
  reducerPath: "instructorApi",
  tagTypes: ["InstructorAnalytics", "InstructorStudents", "InstructorMessages"],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ENDPOINTS.INSTRUCTOR,
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
  endpoints: (builder) => ({
    // Get instructor analytics
    getInstructorAnalytics: builder.query({
      query: () => ({
        url: "/instructor/analytics",
        method: "GET",
      }),
      providesTags: ["InstructorAnalytics"],
    }),
    
    // Get instructor revenue data
    getInstructorRevenue: builder.query({
      query: (period = "6months") => ({
        url: `/instructor/revenue?period=${period}`,
        method: "GET",
      }),
      providesTags: ["InstructorAnalytics"],
    }),
    
    // Get instructor students data
    getInstructorStudents: builder.query({
      query: () => ({
        url: "/instructor/students",
        method: "GET",
      }),
      providesTags: ["InstructorStudents"],
    }),
    
    // Get course performance metrics
    getCoursePerformance: builder.query({
      query: () => ({
        url: "/instructor/course-performance",
        method: "GET",
      }),
      providesTags: ["InstructorAnalytics"],
    }),





    // Send announcement to all students
    sendAnnouncement: builder.mutation({
      query: ({ title, message, courseId }) => ({
        url: "/instructor/send-announcement",
        method: "POST",
        body: { title, message, courseId },
      }),
      invalidatesTags: ["InstructorMessages"],
    }),

    // Get instructor dashboard summary
    getInstructorDashboard: builder.query({
      query: () => ({
        url: "/instructor/dashboard",
        method: "GET",
      }),
      providesTags: ["InstructorAnalytics"],
    }),
  }),
});

export const {
  useGetInstructorAnalyticsQuery,
  useGetInstructorRevenueQuery,
  useGetInstructorStudentsQuery,
  useGetCoursePerformanceQuery,
  useSendAnnouncementMutation,
  useGetInstructorDashboardQuery,
} = instructorApi;
