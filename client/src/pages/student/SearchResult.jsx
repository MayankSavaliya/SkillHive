import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";
import { User, Star, Clock, BookOpen, Globe } from "lucide-react";

const SearchResult = ({ course }) => {
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

  const getRatingCount = () => {
    return course.rating?.count || 1200;
  };
   
  return (
    <div className="glass rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 group">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-6 w-full"
      >
        <div className="w-full md:w-64 h-40 md:h-32 flex-shrink-0 relative overflow-hidden rounded-xl">
          <img
            src={course.courseThumbnail}
            alt="course-thumbnail"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-600/90 hover:bg-blue-700/90 text-white font-semibold text-xs px-3 py-1 backdrop-blur-sm">
              {course.courseLevel}
            </Badge>
          </div>
        </div>
        
        <div className="flex-1 space-y-3">
          <h1 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
            {course.courseTitle}
          </h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {course.subTitle}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4 text-blue-500" />
            <span>Instructor: <span className="font-semibold text-blue-600 dark:text-blue-400">{course.creator?.name}</span></span>
          </div>
          
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{getCourseRating()}</span>
              <span>({getRatingCount().toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{getTotalDuration()}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <BookOpen className="h-3 w-3" />
              <span>{course.lectures?.length || 0} lectures</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Globe className="h-3 w-3" />
              <span>{course.language || 'English'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 text-right space-y-2">
          <h1 className="font-black text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ₹{course.coursePrice}
          </h1>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            View Details
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResult;
