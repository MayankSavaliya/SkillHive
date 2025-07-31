# Admin Pages & Backend Controllers Mapping

## Overview
This document provides a comprehensive mapping of all admin pages in the SkillHive learning platform to their corresponding backend controllers, routes, and functionality.

---

## Admin Page Structure

The admin panel consists of **6 main pages** located in `client/src/pages/admin/`:

1. **AdminDashboard.jsx** - Main overview dashboard
2. **AdminUserManagement.jsx** - User management and role control
3. **AdminCourseManagement.jsx** - Course management and moderation
4. **AdminCourseDetails.jsx** - Detailed course information
5. **AdminAnalytics.jsx** - Platform analytics and insights
6. **AdminSettings.jsx** - System settings and configuration

---

## 1. AdminDashboard.jsx

### **Purpose:** 
Main overview dashboard showing key platform metrics and statistics

### **Frontend Hooks Used:**
- `useGetUserStatsQuery`
- `useGetCourseStatsQuery` 
- `useGetEnrollmentAnalyticsQuery`
- `useGetRevenueAnalyticsQuery`

### **Backend Mapping:**

| Frontend Hook | Backend Controller | Route | Controller File |
|---------------|-------------------|-------|----------------|
| `useGetUserStatsQuery` | `getUserStats` | `GET /api/user/admin/users/stats` | `user.controller.js` |
| `useGetCourseStatsQuery` | `getCourseStats` | `GET /api/course/admin/courses/stats` | `course.controller.js` |
| `useGetEnrollmentAnalyticsQuery` | `getEnrollmentAnalytics` | `GET /api/user/admin/analytics/enrollments` | `user.controller.js` |
| `useGetRevenueAnalyticsQuery` | `getRevenueAnalytics` | `GET /api/user/admin/analytics/revenue` | `user.controller.js` |

### **Data Provided:**
- **User Stats:** Total users, new registrations, user growth rate
- **Course Stats:** Total courses, published courses, course approval rate
- **Enrollment Analytics:** Total enrollments, enrollment growth rate
- **Revenue Analytics:** Total revenue, revenue trends, period comparisons

---

## 2. AdminUserManagement.jsx

### **Purpose:** 
Comprehensive user management with search, filtering, role management, and user deletion

### **Frontend Hooks Used:**
- `useGetAllUsersQuery`
- `useUpdateUserRoleMutation`
- `useDeleteUserMutation`

### **Backend Mapping:**

| Frontend Hook | Backend Controller | Route | Controller File |
|---------------|-------------------|-------|----------------|
| `useGetAllUsersQuery` | `getAllUsers` | `GET /api/user/admin/users` | `user.controller.js` |
| `useUpdateUserRoleMutation` | `updateUserRole` | `PUT /api/user/admin/users/:userId/role` | `user.controller.js` |
| `useDeleteUserMutation` | `deleteUser` | `DELETE /api/user/admin/users/:userId` | `user.controller.js` |

### **Features:**
- **Pagination:** Page-based user listing with configurable limits
- **Search:** Search users by name or email using regex
- **Role Filtering:** Filter users by role (student, instructor, admin)
- **Role Management:** Change user roles with confirmation dialogs
- **User Deletion:** Remove users with cascade deletion of related data
- **Enrollment Details:** View user's enrolled courses and progress

### **Query Parameters:**
```
GET /api/user/admin/users?page=1&limit=10&search=john&role=student
```

---

## 3. AdminCourseManagement.jsx

### **Purpose:** 
Course moderation, status management, and course oversight

### **Frontend Hooks Used:**
- `useGetAllCoursesQuery` (from adminApi)
- `useToggleCourseStatusMutation`
- `useDeleteCourseMutation`

### **Backend Mapping:**

| Frontend Hook | Backend Controller | Route | Controller File |
|---------------|-------------------|-------|----------------|
| `useGetAllCoursesQuery` | `getAllCoursesForAdmin` | `GET /api/course/admin/courses` | `course.controller.js` |
| `useToggleCourseStatusMutation` | `toggleCourseStatus` | `PATCH /api/course/admin/courses/:courseId/toggle-status` | `course.controller.js` |
| `useDeleteCourseMutation` | `deleteCourseByAdmin` | `DELETE /api/course/admin/courses/:courseId` | `course.controller.js` |

### **Features:**
- **Course Listing:** Paginated list of all courses with instructor details
- **Search & Filter:** Search by title, filter by category and status
- **Status Management:** Approve/reject course publication
- **Course Deletion:** Remove inappropriate or violating courses
- **Instructor Info:** View course creator details and statistics

### **Query Parameters:**
```
GET /api/course/admin/courses?page=1&limit=10&search=javascript&category=programming&status=published
```

---

## 4. AdminCourseDetails.jsx

### **Purpose:** 
Detailed view of specific courses with enrollment data and management options

### **Frontend Hooks Used:**
- `useGetAdminCourseDetailsQuery`

### **Backend Mapping:**

| Frontend Hook | Backend Controller | Route | Controller File |
|---------------|-------------------|-------|----------------|
| `useGetAdminCourseDetailsQuery` | `getAdminCourseDetails` | `GET /api/user/admin/courses/:courseId/details` | `user.controller.js` |

### **Data Provided:**
- **Course Information:** Complete course details, curriculum, pricing
- **Enrollment Data:** Student enrollment statistics and trends
- **Revenue Metrics:** Course-specific revenue and performance data
- **Student List:** Enrolled students with progress tracking
- **Instructor Details:** Course creator information and history

---

## 5. AdminAnalytics.jsx

### **Purpose:** 
Comprehensive platform analytics with charts, trends, and detailed insights

### **Frontend Hooks Used:**
- `useGetEnrollmentAnalyticsQuery`
- `useGetRevenueAnalyticsQuery`
- `useGetTopPerformingCoursesQuery`
- `useGetAllEnrollmentsQuery`

### **Backend Mapping:**

| Frontend Hook | Backend Controller | Route | Controller File |
|---------------|-------------------|-------|----------------|
| `useGetEnrollmentAnalyticsQuery` | `getEnrollmentAnalytics` | `GET /api/user/admin/analytics/enrollments` | `user.controller.js` |
| `useGetRevenueAnalyticsQuery` | `getRevenueAnalytics` | `GET /api/user/admin/analytics/revenue` | `user.controller.js` |
| `useGetTopPerformingCoursesQuery` | `getTopPerformingCourses` | `GET /api/user/admin/analytics/top-courses` | `user.controller.js` |
| `useGetAllEnrollmentsQuery` | `getAllEnrollments` | `GET /api/user/admin/enrollments` | `user.controller.js` |

### **Analytics Features:**
- **Enrollment Trends:** Time-based enrollment analytics with growth rates
- **Revenue Analytics:** Financial performance with period comparisons
- **Top Courses:** Best performing courses by enrollment and revenue
- **Recent Enrollments:** Latest course purchases with search and pagination
- **Time Filtering:** Support for different time periods (7d, 30d, 90d, 1y)

### **Query Parameters:**
```
GET /api/user/admin/analytics/revenue?period=30d
GET /api/user/admin/analytics/top-courses?limit=10
GET /api/user/admin/enrollments?page=1&limit=10&search=john
```

---

## 6. AdminSettings.jsx

### **Purpose:** 
System configuration and platform settings management

### **Status:** 
*Note: This component may not be fully implemented or may use different API endpoints*

---

## Backend Controller Details

### **user.controller.js**
**Location:** `server/controllers/user.controller.js`

**Admin Functions:**
- `getAllUsers` - Paginated user listing with search and role filtering
- `getUserStats` - User statistics for dashboard
- `updateUserRole` - Change user roles (student/instructor/admin)
- `deleteUser` - Remove users with cascade deletion
- `getEnrollmentAnalytics` - Enrollment trends and metrics
- `getRevenueAnalytics` - Revenue analytics with period support
- `getTopPerformingCourses` - Best performing courses analysis
- `getAllEnrollments` - Detailed enrollment listing with search
- `getAdminCourseDetails` - Course-specific admin details

### **course.controller.js**
**Location:** `server/controllers/course.controller.js`

**Admin Functions:**
- `getAllCoursesForAdmin` - Complete course listing for admin review
- `getCourseStats` - Course statistics for dashboard
- `toggleCourseStatus` - Approve/reject course publication
- `deleteCourseByAdmin` - Remove courses from platform

---

## Authentication & Authorization

### **Middleware Used:**
- `verifyFirebaseAdmin` - Ensures only admin users can access these endpoints
- `verifyFirebaseToken` - Basic authentication check

### **Route Protection:**
All admin routes are protected by `verifyFirebaseAdmin` middleware, ensuring only users with `admin` role can access these functionalities.

---

## API Base Configuration

### **Frontend API Configuration:**
```javascript
// client/src/features/api/adminApi.js
baseUrl: `${API_ENDPOINTS.ADMIN}/`
```

### **Backend Route Configuration:**
```javascript
// User routes: /api/user/admin/*
// Course routes: /api/course/admin/*
```

---

## Data Flow Summary

1. **Frontend Components** use RTK Query hooks
2. **RTK Query** makes HTTP requests to backend APIs
3. **Express Routes** receive requests and apply middleware
4. **Middleware** verifies admin authentication
5. **Controllers** process business logic and database operations
6. **Database** (MongoDB) stores and retrieves data
7. **Response** flows back through the same chain to update UI

---

## Key Features Across All Admin Pages

### **Common Functionality:**
- **Pagination:** Most endpoints support page-based pagination
- **Search:** Text-based search capabilities
- **Filtering:** Role, status, category, and time-based filters
- **Real-time Updates:** RTK Query caching and invalidation
- **Error Handling:** Comprehensive error states and user feedback
- **Loading States:** Proper loading indicators and skeleton screens

### **Security Features:**
- **Role-based Access Control:** Admin-only access enforcement
- **Firebase Authentication:** Secure token-based authentication
- **Input Validation:** Server-side validation for all requests
- **CORS Protection:** Configured cross-origin request handling

---

*This documentation covers the complete admin panel architecture as of the current implementation. For specific implementation details, refer to the individual controller files and frontend components.*