import { Menu, BookOpen, Search, Bell, User, GraduationCap, Settings, LogOut, BarChart3 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useFirebaseLogoutMutation } from "@/features/api/authApi";
import { signOutUser } from "@/services/authService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import NotificationBell from "./NotificationBell";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "@/features/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [firebaseLogout] = useFirebaseLogoutMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const logoutHandler = async () => {
    try {
      await firebaseLogout();
      await signOut(auth);
      dispatch(userLoggedOut());
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/course/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 z-50 shadow-sm backdrop-blur-lg bg-white/95 dark:bg-gray-900/95">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-8 h-full px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <Link to="/" className="flex items-center">
            <h1 className="font-bold text-xl text-gray-900 dark:text-white">
              SkillHive
            </h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link 
            to="/courses" 
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            Browse Courses
          </Link>
          <Link 
            to="/my-learning" 
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            My Learning
          </Link>
        </div>

        {/* Search Bar - Larger Size */}
        <div className="flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for courses, topics, or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full text-base border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
          </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notifications */}
              <NotificationBell />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.photoUrl || "https://github.com/shadcn.png"}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-learning" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        My Learning
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {user?.role === "instructor" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/instructor/dashboard" className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Instructor Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logoutHandler}
                    className="flex items-center gap-2 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="font-medium"
              >
                Log in
              </Button>
              <Button 
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
              >
                Sign up
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <Link to="/">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">
              SkillHive
            </h1>
          </Link>
        </div>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 p-0">
        <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-md">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <Link to="/">SkillHive</Link>
            </SheetTitle>
            <DarkMode />
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {user && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 p-6">
            <div className="space-y-4">
              <SheetClose asChild>
                <Link
                  to="/courses"
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  <BookOpen className="h-5 w-5" />
                  All Courses
                </Link>
              </SheetClose>
              
              {user && (
                <>
                  <SheetClose asChild>
                    <Link
                      to="/my-learning"
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    >
                      <GraduationCap className="h-5 w-5" />
                      My Learning
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                  </SheetClose>

                  {user?.role === "instructor" && (
                    <SheetClose asChild>
                      <Link
                        to="/instructor/dashboard"
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                      >
                        <BarChart3 className="h-5 w-5" />
                        Instructor Dashboard
                      </Link>
                    </SheetClose>
                  )}
                  
                  {user?.role === "admin" && (
                    <SheetClose asChild>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                      >
                        <BarChart3 className="h-5 w-5" />
                        Admin Dashboard
                      </Link>
                    </SheetClose>
                  )}
                </>
              )}
            </div>
          </nav>

          <div className="p-6 border-t border-gray-200 dark:border-gray-800">
            {user ? (
              <Button
                onClick={logoutHandler}
                variant="outline"
                className="w-full flex items-center gap-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            ) : (
              <div className="space-y-3">
                <SheetClose asChild>
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="w-full"
                  >
                    Log in
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Sign up
                  </Button>
                </SheetClose>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
