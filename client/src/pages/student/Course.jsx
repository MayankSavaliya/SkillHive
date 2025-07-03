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
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="relative w-full lg:w-80 xl:w-96 flex-shrink-0">
                <img
                  src={course.courseThumbnail}
                  alt={course.courseTitle}
                  className="w-full h-48 lg:h-64 xl:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                    <PlayCircle className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 lg:top-4 left-3 lg:left-4 flex flex-col gap-1 lg:gap-2">
                  {course.isBestseller && (
                    <Badge className="bg-orange-500 text-white border-0 font-medium px-2 py-1 text-xs">
                      Bestseller
                    </Badge>
                  )}
                  {course.isPopular && (
                    <Badge className="bg-blue-500 text-white border-0 font-medium px-2 py-1 text-xs">
                      Popular
                    </Badge>
                  )}
                </div>

                {/* Level badge */}
                <div className="absolute top-3 lg:top-4 right-3 lg:right-4">
                  <Badge className={`${getLevelColor(course.courseLevel)} font-semibold px-2 py-1 rounded-full text-xs`}>
                    {course.courseLevel}
                  </Badge>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="flex-1 p-4 lg:p-6">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 lg:mb-3">
                      <h3 className="font-bold text-lg lg:text-xl text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 flex-1 mb-2 sm:mb-0">
                        {course.courseTitle}
                      </h3>
                      <div className="sm:ml-4 flex-shrink-0">
                        <div className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-md text-gray-900 dark:text-white font-bold px-3 py-1 rounded-full shadow-md text-sm lg:text-base">
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
                      <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 lg:mb-4">
                        {course.subTitle}
                      </p>
                    )}

                    {/* Price with discount information */}
                    {course.coursePrice > 0 && course.originalPrice && course.originalPrice > course.coursePrice && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm lg:text-base text-gray-500 line-through">
                          {formatPrice(course.originalPrice)}
                        </span>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs">
                          {Math.round((1 - course.coursePrice / course.originalPrice) * 100)}% OFF
                        </Badge>
                      </div>
                    )}

                    {/* Rating with full stars display */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-gray-200 text-gray-200" />
                        </div>
                        <span className="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300">
                          {getCourseRating()}
                        </span>
                        <span className="text-sm lg:text-base text-gray-500">
                          ({course.rating?.count || 0})
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    {course.category && (
                      <div className="mb-3 lg:mb-4">
                        <Badge 
                          variant="outline" 
                          className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-0 text-xs"
                        >
                          {course.category}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Progress Section (if showing progress) */}
                    {showProgress && (
                      <div className="mb-3 lg:mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <status.icon className={`h-4 w-4 ${status.color}`} />
                            <span className={`text-sm lg:text-base font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <span className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400">
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
                      <Avatar className="h-8 w-8 lg:h-10 lg:w-10 ring-2 ring-gray-200 dark:ring-gray-700">
                        <AvatarImage 
                          src={course.creator?.photoUrl || "https://github.com/shadcn.png"} 
                          alt={course.creator?.name}
                        />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium text-sm lg:text-base">
                          {course.creator?.name?.charAt(0)?.toUpperCase() || "I"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm lg:text-base text-gray-900 dark:text-white truncate">
                          {course.creator?.name || "Anonymous Instructor"}
                        </p>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm lg:text-base text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.enrolledStudents?.length || 0} students</span>
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
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
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
      <Card className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-sm mx-auto">
        <div className="relative h-40 sm:h-48 lg:h-56">
          {/* Course Thumbnail */}
          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="w-full h-full object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
            {course.isBestseller && (
              <Badge className="bg-orange-500 text-white border-0 font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs">
                Bestseller
              </Badge>
            )}
            {course.isPopular && (
              <Badge className="bg-blue-500 text-white border-0 font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs">
                Popular
              </Badge>
            )}
          </div>

          {/* Level badge */}
          <Badge 
            className={`${getLevelColor(course.courseLevel)} absolute top-2 sm:top-3 right-2 sm:right-3 font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs`}
          >
            {course.courseLevel}
          </Badge>
        </div>

        <CardContent className="p-3 sm:p-4 lg:p-5">
          {/* Course Title */}
          <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.courseTitle}
          </h3>

          {/* Instructor Info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
              <AvatarImage 
                src={course.creator?.photoUrl || "https://github.com/shadcn.png"} 
                alt={course.creator?.name}
              />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs">
                {course.creator?.name?.charAt(0)?.toUpperCase() || "I"}
              </AvatarFallback>
            </Avatar>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
              {course.creator?.name || "Anonymous Instructor"}
            </p>
          </div>

          {/* Rating and Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
            <div className="flex items-center gap-1">
              <div className="flex">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-gray-200 text-gray-200" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {getCourseRating()}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                ({course.rating?.count || 0})
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{course.enrolledStudents?.length || 0} students</span>
            </div>
          </div>

          {/* Course Meta */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{getTotalDuration()}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{course.lectures?.length || 0} lectures</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-3">
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {course.coursePrice === 0 ? 'Free' : formatPrice(course.coursePrice)}
            </span>
            {course.originalPrice && course.originalPrice > course.coursePrice && course.coursePrice > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  {formatPrice(course.originalPrice)}
                </span>
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs">
                  {Math.round((1 - course.coursePrice / course.originalPrice) * 100)}% OFF
                </Badge>
              </div>
            )}
          </div>

          {/* Category */}
          {course.category && (
            <div>
              <Badge 
                variant="outline" 
                className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-0 text-xs"
              >
                {course.category}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;