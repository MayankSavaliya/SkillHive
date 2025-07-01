import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/config/firebase";
import { API_ENDPOINTS } from "@/config/api";
// const ADMIN_API = "https://skillhive-backend.vercel.app/";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_ENDPOINTS.ADMIN}/`,
        credentials: 'include',
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
    tagTypes: ['User', 'Course', 'Stats'],
    endpoints: (builder) => ({
        // User Management
        getAllUsers: builder.query({
            query: ({ page = 1, limit = 10, search = '', role = '' }) => ({
                url: `user/admin/users?page=${page}&limit=${limit}&search=${search}&role=${role}`,
                method: "GET"
            }),
            providesTags: ['User']
        }),
        getUserStats: builder.query({
            query: () => ({
                url: "user/admin/users/stats",
                method: "GET"
            }),
            providesTags: ['Stats']
        }),
        updateUserRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `user/admin/users/${userId}/role`,
                method: "PUT",
                body: { role }
            }),
            invalidatesTags: ['User', 'Stats']
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `user/admin/users/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['User', 'Stats']
        }),
        
        // Course Management
        getAllCourses: builder.query({
            query: ({ page = 1, limit = 10, search = '', category = '', status = '' }) => ({
                url: `course/admin/courses?page=${page}&limit=${limit}&search=${search}&category=${category}&status=${status}`,
                method: "GET"
            }),
            providesTags: ['Course']
        }),
        getCourseStats: builder.query({
            query: () => ({
                url: "course/admin/courses/stats",
                method: "GET"
            }),
            providesTags: ['Stats']
        }),
        toggleCourseStatus: builder.mutation({
            query: (courseId) => ({
                url: `course/admin/courses/${courseId}/toggle-status`,
                method: "PATCH"
            }),
            invalidatesTags: ['Course', 'Stats']
        }),
        deleteCourse: builder.mutation({
            query: (courseId) => ({
                url: `course/admin/courses/${courseId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Course', 'Stats']
        }),
        
        // Request Instructor Role
        requestInstructorRole: builder.mutation({
            query: () => ({
                url: "user/request-instructor",
                method: "PUT"
            })
        }),
        
        // Analytics Endpoints
        getEnrollmentAnalytics: builder.query({
            query: () => ({
                url: "user/admin/analytics/enrollments",
                method: "GET"
            }),
            providesTags: ['Stats']
        }),
        getRevenueAnalytics: builder.query({
            query: ({ period = '30d' }) => ({
                url: `user/admin/analytics/revenue?period=${period}`,
                method: "GET"
            }),
            providesTags: ['Stats']
        }),
        getTopPerformingCourses: builder.query({
            query: ({ limit = 10 }) => ({
                url: `user/admin/analytics/top-courses?limit=${limit}`,
                method: "GET"
            }),
            providesTags: ['Stats']
        }),
        getAllEnrollments: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: `user/admin/enrollments?page=${page}&limit=${limit}&search=${search}`,
                method: "GET"
            }),
            providesTags: ['Stats']
        }),
        getAdminCourseDetails: builder.query({
            query: (courseId) => ({
                url: `user/admin/courses/${courseId}/details`,
                method: "GET"
            }),
            providesTags: ['Course']
        })
    })
});

export const {
    useGetAllUsersQuery,
    useGetUserStatsQuery,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
    useGetAllCoursesQuery,
    useGetCourseStatsQuery,
    useToggleCourseStatusMutation,
    useDeleteCourseMutation,
    useRequestInstructorRoleMutation,
    useGetEnrollmentAnalyticsQuery,
    useGetRevenueAnalyticsQuery,
    useGetTopPerformingCoursesQuery,
    useGetAllEnrollmentsQuery,
    useGetAdminCourseDetailsQuery
} = adminApi;
