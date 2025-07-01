import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Clock, 
  Users, 
  PlayCircle, 
  BookOpen, 
  CheckCircle,
  BarChart3,
  TrendingUp
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course, viewMode = "grid", showProgress = false }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advance':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  // Calculate total duration from lectures
  const getTotalDuration = () => {
    if (!course.lectures || course.lectures.length === 0) return "0h 0m";
    
    let totalMinutes = 0;
    course.lectures.forEach(lecture => {
      if (lecture.duration && lecture.duration !== "0:00") {
        const [minutes, seconds] = lecture.duration.split(':').map(Number);
        totalMinutes += minutes + (seconds > 30 ? 1 : 0); // Round up if seconds > 30
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Get course rating
  const getCourseRating = () => {
    return course.rating?.average || 4.5;
  };

  // Simulate progress for demo (you can replace this with real progress data)
  const getProgress = () => {
    const seed = course._id?.charCodeAt(0) || 0;
    return Math.floor((seed % 100) + Math.random() * 30) % 100;
  };

  const getStatus = () => {
    const progress = getProgress();
    if (progress === 0) return { label: "Not Started", color: "text-gray-500", icon: BookOpen };
    if (progress === 100) return { label: "Completed", color: "text-green-600", icon: CheckCircle };
    return { label: "In Progress", color: "text-blue-600", icon: TrendingUp };
  };

  const progress = showProgress ? getProgress() : null;
  const status = showProgress ? getStatus() : null;

  if (viewMode === "list") {
    return (
      <Link to={`/course-detail/${course._id}`} className="block group">
        <Card className="overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              {/* Image Section */}
              <div className="relative sm:w-64 sm:flex-shrink-0">
                <img
                  src={course.courseThumbnail}
                  alt={course.courseTitle}
                  className="w-full h-48 sm:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                    <PlayCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {/* Level badge */}
                <div className="absolute top-4 left-4">
                  <Badge className={`${getLevelColor(course.courseLevel)} font-semibold px-2 py-1 rounded-full text-xs`}>
                    {course.courseLevel}
                  </Badge>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="flex-1 p-6">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 flex-1">
                        {course.courseTitle}
                      </h3>
                      <div className="ml-4 flex-shrink-0">
                        <div className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-md text-gray-900 dark:text-white font-bold px-3 py-1 rounded-full shadow-md text-sm">
                          {course.coursePrice === 0 ? (
                            <span className="text-green-600 dark:text-green-400">Free</span>
                          ) : (
                            <span>{formatPrice(course.coursePrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    {course.subTitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {course.subTitle}
                      </p>
                    )}
                    
                    {/* Progress Section (if showing progress) */}
                    {showProgress && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <status.icon className={`h-4 w-4 ${status.color}`} />
                            <span className={`text-sm font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {progress}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="space-y-3">
                    {/* Instructor */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-gray-200 dark:ring-gray-700">
                        <AvatarImage 
                          src={course.creator?.photoUrl || "https://github.com/shadcn.png"} 
                          alt={course.creator?.name}
                        />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium text-sm">
                          {course.creator?.name?.charAt(0)?.toUpperCase() || "I"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {course.creator?.name || "Anonymous Instructor"}
                        </p>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{getCourseRating()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.enrolledStudents?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{getTotalDuration()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.lectures?.length || 0} lectures</span>
                        </div>
                      </div>
                      
                      {showProgress && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                          {progress === 100 ? "Review" : progress === 0 ? "Start" : "Continue"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link to={`/course-detail/${course._id}`} className="block group">
      <Card className="overflow-hidden rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.03] hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-gray-800 h-full">
        <div className="relative overflow-hidden">
          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
          </div>
          
          {/* Course level badge */}
          <div className="absolute top-4 left-4">
            <Badge className={`${getLevelColor(course.courseLevel)} font-semibold px-3 py-1.5 rounded-full border-0 shadow-lg backdrop-blur-sm`}>
              {course.courseLevel}
            </Badge>
          </div>
          
          {/* Price badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-900 dark:text-white font-bold px-3 py-1.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-600">
              {course.coursePrice === 0 ? (
                <span className="text-green-600 dark:text-green-400">Free</span>
              ) : (
                <span>{formatPrice(course.coursePrice)}</span>
              )}
            </div>
          </div>

          {/* Status badge for progress view */}
          {showProgress && (
            <div className="absolute bottom-4 right-4">
              <div className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 flex items-center gap-2`}>
                <status.icon className={`h-4 w-4 ${status.color}`} />
                <span className={`text-xs font-medium ${status.color}`}>
                  {progress}%
                </span>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-6 space-y-4 flex flex-col flex-1">
          {/* Course title */}
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {course.courseTitle}
          </h3>
          
          {/* Course description */}
          {course.subTitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-1">
              {course.subTitle}
            </p>
          )}
          
          {/* Progress section for My Learning */}
          {showProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <status.icon className={`h-4 w-4 ${status.color}`} />
                  <span className={`text-sm font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {/* Instructor info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-gray-200 dark:ring-gray-700">
              <AvatarImage 
                src={course.creator?.photoUrl || "https://github.com/shadcn.png"} 
                alt={course.creator?.name}
              />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium">
                {course.creator?.name?.charAt(0)?.toUpperCase() || "I"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                {course.creator?.name || "Anonymous Instructor"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Instructor
              </p>
            </div>
          </div>
          
          {/* Course stats and action */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{getCourseRating()}</span>
              </div>
              
              {/* Students count */}
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.enrolledStudents?.length || 0}</span>
              </div>
              
              {/* Duration */}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{getTotalDuration()}</span>
              </div>
            </div>

            {/* Action button for My Learning */}
            {showProgress && (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {progress === 100 ? "Review" : progress === 0 ? "Start" : "Continue"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;