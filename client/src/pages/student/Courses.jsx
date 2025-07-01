import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, BookOpen, Grid, List, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";
 
const Courses = () => {
  const {data, isLoading, isError} = useGetPublishedCourseQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/course/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };
 
  if(isError) {
    return (
      <div className="min-h-screen bg-gradient-modern flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-2xl">
            <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-red-500 dark:text-red-300">
              We couldn't fetch the courses. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 opacity-30"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">        {/* Hero Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-md backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
            <BookOpen className="h-4 w-4" />
            <span>Course Library</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            Explore Our Courses
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
            Choose from expertly crafted courses and accelerate your learning journey.
          </p>
        </div>        {/* Search and Filters Section */}
        <div className="glass rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-5 md:p-6 mb-10 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
          <div className="flex flex-col xl:flex-row gap-5 items-start xl:items-center justify-between">
            {/* Search Section */}
            <div className="flex-1 max-w-2xl w-full">
              <form onSubmit={handleSearch} className="relative group">
                <div className="relative">
                  <Search className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for courses, topics, or instructors..."
                    className="w-full pl-12 md:pl-16 pr-32 md:pr-40 py-4 md:py-6 text-base md:text-lg bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-inner backdrop-blur-sm font-medium placeholder:font-normal"
                  />
                  <Button 
                    type="submit" 
                    className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 md:px-8 py-3 md:py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Filters Section */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full xl:w-auto">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-56 h-12 md:h-14 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm font-medium hover:shadow-xl transition-all duration-200 text-sm md:text-base">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-2xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="web-development">🌐 Web Development</SelectItem>
                  <SelectItem value="frontend-development">⚛️ Frontend Development</SelectItem>
                  <SelectItem value="backend-development">🔧 Backend Development</SelectItem>
                  <SelectItem value="full-stack-development">🚀 Full Stack Development</SelectItem>
                  <SelectItem value="mobile-development">📱 Mobile Development</SelectItem>
                  <SelectItem value="data-science">📊 Data Science</SelectItem>
                  <SelectItem value="machine-learning">🤖 Machine Learning</SelectItem>
                  <SelectItem value="devops">⚙️ DevOps & Cloud</SelectItem>
                  <SelectItem value="ui-ux-design">🎨 UI/UX Design</SelectItem>
                  <SelectItem value="database">🗄️ Database Management</SelectItem>
                  <SelectItem value="cybersecurity">🔒 Cybersecurity</SelectItem>
                  <SelectItem value="programming">💻 Programming Languages</SelectItem>
                  <SelectItem value="business">💼 Business & Management</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-52 h-12 md:h-14 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm font-medium hover:shadow-xl transition-all duration-200 text-sm md:text-base">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-2xl">
                  <SelectItem value="popular">⭐ Most Popular</SelectItem>
                  <SelectItem value="newest">🆕 Newest</SelectItem>
                  <SelectItem value="rating">🏆 Highest Rated</SelectItem>
                  <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                  <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-12 md:h-14 px-4 md:px-6 rounded-l-xl rounded-r-none border-0 font-medium text-sm md:text-base"
                >
                  <Grid className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-12 md:h-14 px-4 md:px-6 rounded-r-xl rounded-l-none border-0 font-medium text-sm md:text-base"
                >
                  <List className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>        {/* Results Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            {data?.courses ? (
              <span className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-gray-600 dark:text-gray-400">Showing</span>
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-xl">
                  {data.courses.length}
                </span>
                <span className="text-gray-600 dark:text-gray-400">courses</span>
              </span>
            ) : (
              <span className="flex items-center gap-3 animate-pulse">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce shadow-lg"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading amazing courses...</span>
              </span>
            )}
          </div>
          
          {data?.courses && data.courses.length > 0 && (
            <div className="hidden sm:flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-medium">Use filters to refine results</span>
            </div>
          )}
        </div>        {/* Courses Grid */}
        <div className={`transition-all duration-500 ${
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
            : "space-y-8"
        }`}>
          {isLoading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CourseSkeleton />
              </div>
            ))
          ) : (
            data?.courses && data.courses.length > 0 ? (
              data.courses.map((course, index) => (
                <div 
                  key={course._id} 
                  className="animate-fade-in group" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Course course={course} />
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="text-center py-24">
                  <div className="glass rounded-3xl p-20 max-w-2xl mx-auto shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
                    <div className="mb-12">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <BookOpen className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        No courses found
                      </h3>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                        We couldn't find any courses matching your criteria. Try adjusting your filters or search terms to discover amazing learning opportunities.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Button 
                        onClick={() => {
                          setSearchQuery("");
                          setCategory("all");
                          setSortBy("popular");
                        }}
                        variant="outline"
                        className="border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Clear All Filters
                      </Button>
                      <Button 
                        onClick={() => navigate("/")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        Browse All Courses
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>        {/* Load More Section */}
        {data?.courses && data.courses.length > 0 && (
          <div className="text-center mt-20">
            <div className="glass rounded-3xl p-10 max-w-lg mx-auto shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Want to see more courses?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                Discover thousands more courses across different categories and skill levels.
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Load More Courses
              </Button>
            </div>
          </div>
        )}        {/* Popular Categories Section */}
        {data?.courses && data.courses.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Popular Categories
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore courses by category and find exactly what you're looking for to advance your career.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {[
                { name: "Web Development", icon: "🌐", count: "850+", color: "from-blue-500 to-cyan-500", category: "web-development" },
                { name: "Frontend Dev", icon: "⚛️", count: "720+", color: "from-purple-500 to-pink-500", category: "frontend-development" },
                { name: "Backend Dev", icon: "🔧", count: "650+", color: "from-green-500 to-emerald-500", category: "backend-development" },
                { name: "Full Stack", icon: "🚀", count: "580+", color: "from-orange-500 to-red-500", category: "full-stack-development" },
                { name: "Mobile Dev", icon: "📱", count: "450+", color: "from-indigo-500 to-purple-500", category: "mobile-development" },
                { name: "Data Science", icon: "📊", count: "400+", color: "from-teal-500 to-cyan-500", category: "data-science" },
                { name: "Machine Learning", icon: "🤖", count: "350+", color: "from-rose-500 to-pink-500", category: "machine-learning" },
                { name: "DevOps", icon: "⚙️", count: "320+", color: "from-amber-500 to-orange-500", category: "devops" },
                { name: "UI/UX Design", icon: "🎨", count: "480+", color: "from-violet-500 to-purple-500", category: "ui-ux-design" },
                { name: "Database", icon: "🗄️", count: "280+", color: "from-emerald-500 to-teal-500", category: "database" },
                { name: "Cybersecurity", icon: "🔒", count: "250+", color: "from-red-500 to-rose-500", category: "cybersecurity" },
                { name: "Programming", icon: "💻", count: "900+", color: "from-blue-600 to-indigo-600", category: "programming" }
              ].map((categoryItem, index) => (
                <div 
                  key={index}
                  onClick={() => setCategory(categoryItem.category)}
                  className="group glass rounded-2xl p-4 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-white/20 dark:border-gray-700/50 backdrop-blur-xl relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${categoryItem.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{categoryItem.icon}</div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-xs lg:text-sm group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-200">
                      {categoryItem.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {categoryItem.count} courses
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
const CourseSkeleton = () => {
  return (
    <div className="animate-pulse group">
      <div className="glass rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl overflow-hidden backdrop-blur-xl">
        {/* Image skeleton */}
        <div className="relative">
          <Skeleton className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer" />
          <div className="absolute top-4 left-4">
            <Skeleton className="h-8 w-20 rounded-full bg-gray-300/70 dark:bg-gray-600/70" />
          </div>
          <div className="absolute top-4 right-4">
            <Skeleton className="h-8 w-16 rounded-full bg-gray-300/70 dark:bg-gray-600/70" />
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <Skeleton className="h-6 w-4/5 bg-gray-300/70 dark:bg-gray-600/70 rounded-lg" />
          
          {/* Description */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-gray-200/70 dark:bg-gray-700/70 rounded" />
            <Skeleton className="h-4 w-3/4 bg-gray-200/70 dark:bg-gray-700/70 rounded" />
          </div>
          
          {/* Instructor info */}
          <div className="flex items-center gap-3 pt-4">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-300/70 dark:bg-gray-600/70" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-28 bg-gray-200/70 dark:bg-gray-700/70 rounded" />
              <Skeleton className="h-3 w-20 bg-gray-200/70 dark:bg-gray-700/70 rounded" />
            </div>
          </div>
          
          {/* Stats and price */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-12 bg-gray-200/70 dark:bg-gray-700/70 rounded" />
              <Skeleton className="h-4 w-8 bg-gray-200/70 dark:bg-gray-700/70 rounded" />
              <Skeleton className="h-4 w-10 bg-gray-200/70 dark:bg-gray-700/70 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

