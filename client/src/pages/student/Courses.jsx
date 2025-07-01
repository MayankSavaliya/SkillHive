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
  X
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery, useGetSearchCourseQuery } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "all", label: "All Courses", icon: "📚", color: "bg-slate-100 text-slate-700 hover:bg-slate-200", activeColor: "bg-blue-600 text-white" },
  { id: "web-development", label: "Web Dev", icon: "🌐", color: "bg-blue-50 text-blue-700 hover:bg-blue-100", activeColor: "bg-blue-600 text-white" },
  { id: "mobile-development", label: "Mobile", icon: "📱", color: "bg-green-50 text-green-700 hover:bg-green-100", activeColor: "bg-green-600 text-white" },
  { id: "data-science", label: "Data Science", icon: "📊", color: "bg-purple-50 text-purple-700 hover:bg-purple-100", activeColor: "bg-purple-600 text-white" },
  { id: "machine-learning", label: "AI/ML", icon: "🤖", color: "bg-red-50 text-red-700 hover:bg-red-100", activeColor: "bg-red-600 text-white" },
  { id: "ui-ux-design", label: "UI/UX", icon: "🎨", color: "bg-pink-50 text-pink-700 hover:bg-pink-100", activeColor: "bg-pink-600 text-white" },
  { id: "business", label: "Business", icon: "💼", color: "bg-orange-50 text-orange-700 hover:bg-orange-100", activeColor: "bg-orange-600 text-white" },
  { id: "programming", label: "Programming", icon: "💻", color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100", activeColor: "bg-indigo-600 text-white" },
];

const sortOptions = [
  { value: "popular", label: "Most Popular", icon: TrendingUp },
  { value: "newest", label: "Newest First", icon: Zap },
  { value: "rating", label: "Highest Rated", icon: Star },
  { value: "price-low", label: "Price: Low to High", icon: Award },
];
 
const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [priceFilter, setPriceFilter] = useState("");
  const navigate = useNavigate();

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
 
  if(isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Amazing Courses
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Learn new skills with our comprehensive collection of expert-led courses
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for anything..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 transition-all duration-200"
                />
              </div>
            </form>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm ${
                  selectedCategory === category.id
                    ? category.activeColor + ' shadow-lg'
                    : category.color + ' shadow-sm'
                }`}
              >
                <span className="mr-2 text-base">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          {/* Results Info */}
          <div className="flex items-center gap-4">
            <div className="text-gray-600 dark:text-gray-400">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Loading courses...</span>
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
            
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
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
            
            {priceFilter && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Price: {priceFilter === 'low' ? 'Low to High' : 'High to Low'}
                <button onClick={() => setPriceFilter("")} className="ml-1 hover:bg-green-200 rounded-full p-0.5">
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
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
          }`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))}
          </div>
        ) : filteredCourses && filteredCourses.length > 0 ? (
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
          }`}>
            {filteredCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
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
          </div>
        )}

        {/* Stats Section */}
        {filteredCourses && filteredCourses.length > 0 && (
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredCourses.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Courses Available</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Students Learning</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hours of Content</div>
              </div>
            </div>
          </div>
        )}
      </div>
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

