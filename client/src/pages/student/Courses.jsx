import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  LayoutList, 
  BookOpen, 
  Star,
  Users,
  Clock,
  TrendingUp,
  Zap,
  Award,
  X,
  ChevronDown,
  ChevronUp,
  Play,
  Shield,
  Award as AwardIcon,
  Menu,
  Twitter,
  Facebook,
  Linkedin
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery, useGetSearchCourseQuery } from "@/features/api/courseApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { id: "all", label: "All Courses" },
  { id: "web-development", label: "Web Development" },
  { id: "data-science", label: "Data Science" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "business", label: "Business" },
  { id: "mobile-development", label: "Mobile Development" },
  { id: "programming", label: "Programming" },
];

const sortOptions = [
  { value: "popular", label: "Most Popular", icon: TrendingUp },
  { value: "newest", label: "Newest First", icon: Zap },
  { value: "rating", label: "Highest Rated", icon: Star },
  { value: "price-low", label: "Price: Low to High", icon: Award },
];
 
const Courses = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [priceFilter, setPriceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Handle window resize to show filters on desktop if previously hidden
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setShowFilters(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle URL search parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search");
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams]);

  // Use search API when filters are applied
  const shouldUseSearch = selectedCategory !== "all" || priceFilter || searchQuery;
  
  const { 
    data: publishedData, 
    isLoading: isPublishedLoading, 
    isError: isPublishedError 
  } = useGetPublishedCourseQuery(undefined, {
    skip: shouldUseSearch
  });

  const { 
    data: searchData, 
    isLoading: isSearchLoading, 
    isError: isSearchError 
  } = useGetSearchCourseQuery(
    {
      searchQuery: searchQuery || "",
      categories: selectedCategory !== "all" ? [selectedCategory] : [],
      sortByPrice: priceFilter
    },
    {
      skip: !shouldUseSearch
    }
  );

  const data = shouldUseSearch ? searchData : publishedData;
  const isLoading = shouldUseSearch ? isSearchLoading : isPublishedLoading;
  const isError = shouldUseSearch ? isSearchError : isPublishedError;

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceFilter("");
    setSortBy("popular");
  };

  // Apply local sorting
  const getFilteredCourses = () => {
    if (!data?.courses) return [];
    
    let courses = [...data.courses];

    if (sortBy !== "popular") {
      courses.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "rating":
            return (b.averageRating || 0) - (a.averageRating || 0);
          case "price-low":
            return (a.coursePrice || 0) - (b.coursePrice || 0);
          default:
            return 0;
        }
      });
    }

    return courses;
  };

  const filteredCourses = getFilteredCourses();
  const hasActiveFilters = selectedCategory !== "all" || priceFilter || searchQuery;
 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };
 
  if(isError) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
      >
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't load the courses. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Unlock Your Potential</span>
            <span className="block text-blue-600 dark:text-blue-500">Start Learning Today</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Explore a vast library of courses taught by industry experts. Find your passion and achieve your goals with SkillHive.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg">
              Explore Courses
            </Button>
            <Button size="lg" variant="outline">
              Become an Instructor
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          {/* Left: Search + Filter Toggle */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
            <form onSubmit={handleSearch} className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Right: Filter Toggle, Sort & View */}
          <div className="flex items-center gap-3">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {filteredCourses?.length || 0}
                  </span>
                  {" "}courses found
                </span>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sort by: Most Relevant</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex gap-8">
          {/* Sidebar Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-64 flex-shrink-0"
              >
            <aside className="sticky top-24">
              <div className="h-full overflow-y-auto p-6 lg:p-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 p-0 h-auto"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Categories</h3>
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <label key={category.id} className="flex items-center">
                            <input
                              type="radio"
                              checked={selectedCategory === category.id}
                              onChange={() => setSelectedCategory(category.id)}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              name="category"
                            />
                            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                              {category.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Price Range</h3>
                      <div className="space-y-3">
                        {["free", "paid"].map((price) => (
                          <label key={price} className="flex items-center">
                            <input
                              type="radio"
                              checked={priceFilter === price}
                              onChange={() => setPriceFilter(price)}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              name="price"
                            />
                            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {price}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-500 mr-2">Active filters:</span>
                
                {searchQuery && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-blue-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {categories.find(c => c.id === selectedCategory)?.label}
                    <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:bg-purple-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Courses Grid/List */}
            {isLoading ? (
              <div className={`${
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" 
                  : "space-y-6"
              }`}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <CourseSkeleton key={index} />
                ))}
              </div>
            ) : filteredCourses && filteredCourses.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`${
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" 
                  : "space-y-6"
              }`}>
                {filteredCourses.map((course) => (
                  <Course 
                    key={course._id} 
                    course={course}
                    viewMode={viewMode}
                    variants={itemVariants}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    No courses found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We couldn't find any courses matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear all filters
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* About SkillHive */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">SkillHive</span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} SkillHive, Inc. All rights reserved.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex justify-center md:justify-end gap-6">
              <a href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      <Skeleton className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-6">
        <Skeleton className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
        <Skeleton className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <Skeleton className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default Courses;

