import { School } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Users, BarChart3, TrendingUp, Home } from "lucide-react";

const AdminSidebar = () => {
  const sidebarItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      isExternal: true
    },
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: TrendingUp,
      label: "Analytics",
      path: "/admin/analytics",
    },
    {
      icon: Users,
      label: "User Management",
      path: "/admin/users",
    },
    {
      icon: School,
      label: "Course Management",
      path: "/admin/courses",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar - Fixed width and responsive */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen">
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <School size={32} className="text-blue-600" />
          <h1 className="font-extrabold text-xl xl:text-2xl text-gray-900 dark:text-white">
            SkillHive Admin
          </h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    item.path === "/"
                      ? "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon 
                    size={20} 
                    className={`group-hover:scale-105 transition-transform ${
                      item.path === "/" ? "text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300" : ""
                    }`} 
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
                <SheetTitle className="flex items-center gap-3 text-left">
                  <School size={28} className="text-blue-600" />
                  <span className="font-extrabold text-xl">SkillHive Admin</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="p-4">
                <ul className="space-y-1">
                  {sidebarItems.map((item, index) => (
                    <li key={index}>
                      <SheetClose asChild>
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            item.path === "/"
                              ? "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          <item.icon 
                            size={20} 
                            className={item.path === "/" ? "text-green-600 dark:text-green-400" : ""} 
                          />
                          <span>{item.label}</span>
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <School size={24} className="text-blue-600" />
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Admin</h1>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSidebar;
