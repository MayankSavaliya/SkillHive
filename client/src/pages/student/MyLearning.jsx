import React, { useState } from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";
import { BookOpen, GraduationCap, Filter, CheckCircle, Clock, PlayCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MyLearning = () => { 
  const {data, isLoading} = useLoadUserQuery();
  const [progressFilter, setProgressFilter] = useState("all");

  const myLearning = data?.user.enrolledCourses || [];
  
  // Filter courses based on progress
  const filteredCourses = myLearning.filter(course => {
    if (progressFilter === "all") return true;
    
    // Simulate progress calculation (you can replace with real progress data)
    const progress = course._id?.charCodeAt(0) % 100;
    
    if (progressFilter === "not-started") return progress === 0;
    if (progressFilter === "in-progress") return progress > 0 && progress < 100;
    if (progressFilter === "completed") return progress === 100;
    
    return true;
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 opacity-30"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 animate-fade-in">
              <GraduationCap className="h-4 w-4" />
              <span>Learning Dashboard</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              My Learning Progress
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Track your progress and continue your learning journey across all enrolled courses.
            </p>
          </div>
        </div>

        {/* Learning Stats Cards */}
        {!isLoading && myLearning.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Courses</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{myLearning.length}</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{Math.round(myLearning.length * 0.7)}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{Math.round(myLearning.length * 0.3)}</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Hours Learned</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Math.round(myLearning.length * 12.5)}</p>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Filters */}
        {!isLoading && myLearning.length > 0 && (
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by progress:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={progressFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProgressFilter("all")}
                    className="text-xs"
                  >
                    All ({myLearning.length})
                  </Button>
                  <Button
                    variant={progressFilter === "not-started" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProgressFilter("not-started")}
                    className="text-xs flex items-center gap-1"
                  >
                    <PlayCircle className="h-3 w-3" />
                    Not Started
                  </Button>
                  <Button
                    variant={progressFilter === "in-progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProgressFilter("in-progress")}
                    className="text-xs flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    In Progress
                  </Button>
                  <Button
                    variant={progressFilter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProgressFilter("completed")}
                    className="text-xs flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Completed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Courses Grid */}
        <div>
          {isLoading ? (
            <MyLearningSkeleton />
          ) : myLearning.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Start Your Learning Journey
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  You haven't enrolled in any courses yet. Explore our course library and start learning something new today!
                </p>
                <Button 
                  onClick={() => window.location.href = '/courses'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          ) : filteredCourses.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No courses match your current filter. Try a different filter option.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setProgressFilter("all")}
                  size="sm"
                >
                  Clear Filter
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course, index) => (
                <div 
                  key={course._id} 
                  className="animate-fade-in" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Course course={course} showProgress={true}/>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;
// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <Card key={index} className="border-0 shadow-sm">
        <div className="animate-pulse">
          {/* Image skeleton */}
          <div className="relative">
            <Skeleton className="w-full h-48 rounded-t-lg" />
            <div className="absolute top-4 left-4">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
          
          {/* Content skeleton */}
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-4/5" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="pt-4">
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-20 mt-2" />
            </div>
          </CardContent>
        </div>
      </Card>
    ))}
  </div>
);

