import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import NotificationsPage from "./pages/student/NotificationsPage";
import Sidebar from "./pages/instructor/Sidebar";
import Dashboard from "./pages/instructor/Dashboard";
import CourseTable from "./pages/instructor/course/CourseTable";
import AddCourse from "./pages/instructor/course/AddCourse";
import EditCourse from "./pages/instructor/course/EditCourse";
import ViewCourse from "./pages/instructor/course/ViewCourse";
import CreateLecture from "./pages/instructor/lecture/CreateLecture";
import EditLecture from "./pages/instructor/lecture/EditLecture";
import Students from "./pages/instructor/Students";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import RouteErrorBoundary from "./components/RouteErrorBoundary";

import {
  AdminRoute,
  AuthenticatedUser,
  InstructorRoute,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";
import NotificationProvider from "./components/NotificationProvider";
import AdminSidebar from "./pages/admin/AdminSidebar";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminCourseManagement from "./pages/admin/AdminCourseManagement";

import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminCourseDetails from "./pages/admin/AdminCourseDetails";

const appRouter = createBrowserRouter(
  [
    // Standalone pages (no MainLayout/Navbar)
    {
      path: "/",
      element: (
        <ThemeProvider>
          <AuthenticatedUser>
            <Landing />
          </AuthenticatedUser>
        </ThemeProvider>
      ),
    },
    {
      path: "/login",
      element: (
        <ThemeProvider>
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        </ThemeProvider>
      ),
    },
    
        // Individual pages that need the navbar (wrapped in MainLayout)
    {
      path: "/courses",
      element: (
        <ThemeProvider>
          <MainLayout />
        </ThemeProvider>
      ),
      children: [
        {
          index: true,
          element: <Courses />,
        },
      ],
    },
    {
      path: "/my-learning",
      element: (
        <ThemeProvider>
          <MainLayout />
        </ThemeProvider>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <MyLearning />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/profile",
      element: (
        <ThemeProvider>
          <MainLayout />
        </ThemeProvider>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/notifications",
      element: (
        <ThemeProvider>
          <MainLayout />
        </ThemeProvider>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/course-detail/:courseId",
      element: (
        <ThemeProvider>
          <MainLayout />
        </ThemeProvider>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/course-progress/:courseId",
      element: (
        <ThemeProvider>
          <MainLayout />
        </ThemeProvider>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <PurchaseCourseProtectedRoute>
                <CourseProgress />
              </PurchaseCourseProtectedRoute>
            </ProtectedRoute>
          ),
        },
      ],
    },

    // instructor routes
    {
      path: "instructor",
      element: (
        <ThemeProvider>
          <InstructorRoute>
            <Sidebar />
          </InstructorRoute>
        </ThemeProvider>
      ),
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "course",
          element: <CourseTable />,
        },
        {
          path: "course/create",
          element: <AddCourse />,
        },
        {
          path: "course/:courseId",
          element: <EditCourse />,
        },
        {
          path: "course/view/:courseId",
          element: <ViewCourse />,
        },
        {
          path: "course/:courseId/lecture",
          element: <CreateLecture />,
        },
        {
          path: "course/:courseId/lecture/:lectureId",
          element: <EditLecture />,
        },
        {
          path: "students",
          element: <Students />,
        },
      ],
    },

    // admin routes
    {
      path: "admin",
      element: (
        <ThemeProvider>
          <AdminRoute>
            <AdminSidebar />
          </AdminRoute>
        </ThemeProvider>
      ),
      children: [
        {
          path: "dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "users",
          element: <AdminUserManagement />,
        },
        {
          path: "courses",
          element: <AdminCourseManagement />,
        },
        {
          path: "courses/:courseId/details",
          element: <AdminCourseDetails />,
        },
        {
          path: "analytics",
          element: <AdminAnalytics />,
        },
      ],
    },
    
    // Error boundary
    {
      path: "*",
      element: (
        <ThemeProvider>
          <RouteErrorBoundary />
        </ThemeProvider>
      ),
    },
  ]
);

function App() {
  return (
    <main>
      <NotificationProvider>
        <RouterProvider router={appRouter} />
        <Toaster position="bottom-right" />
      </NotificationProvider>
    </main>
  );
}

export default App;
