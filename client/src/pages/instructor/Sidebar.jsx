import { 
  ChartNoAxesColumn, 
  SquareLibrary, 
  Users, 
  MessageSquare, 
  Settings, 
  BarChart3,
  Calendar,
  Bell,
  HelpCircle
} from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useGetInstructorAnalyticsQuery, useGetInstructorMessagesQuery } from "@/features/api/instructorApi";

const Sidebar = () => {
  const location = useLocation();
  
  // Fetch real data for sidebar stats
  const { data: analyticsData } = useGetInstructorAnalyticsQuery();
  const { data: messagesData } = useGetInstructorMessagesQuery();
  
  const analytics = analyticsData?.analytics || {};
  const unreadCount = messagesData?.unreadCount || 0;
  
  const sidebarItems = [
    {
      to: "dashboard",
      icon: ChartNoAxesColumn,
      label: "Dashboard",
      badge: null
    },
    {
      to: "course",
      icon: SquareLibrary,
      label: "My Courses",
      badge: null
    },
    {
      to: "analytics",
      icon: BarChart3,
      label: "Analytics",
      badge: "New"
    },
    {
      to: "students",
      icon: Users,
      label: "Students",
      badge: analytics.totalStudents ? analytics.totalStudents.toString() : null
    },
    {
      to: "messages",
      icon: MessageSquare,
      label: "Messages",
      badge: unreadCount > 0 ? unreadCount.toString() : null
    },
    {
      to: "settings",
      icon: Settings,
      label: "Profile & Settings",
      badge: null
    }
  ];

  const isActiveRoute = (route) => {
    return location.pathname.includes(route);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen">
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">I</span>
          </div>
          <h1 className="font-extrabold text-xl xl:text-2xl text-gray-900 dark:text-white">
            Instructor Panel
          </h1>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 px-2">Manage your courses & students</p>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.to);
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={20} 
                      className={`${
                        isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                      } group-hover:scale-105 transition-transform`} 
                    />
                    <span className={`truncate ${isActive ? "text-blue-700 dark:text-blue-300" : ""}`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {item.badge && (
                    <Badge 
                      variant={item.badge === "New" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Courses:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {analytics.publishedCourses || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Students:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {analytics.totalStudents || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">This Month:</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">
                  ₹{analytics.currentMonthRevenue?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
