import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle, Users, Clock, Star, BookOpen } from "lucide-react";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  useEffect(() => {
    if (data?.purchased && data?.course && data?.course.lectures && data?.course.lectures.length > 0) {
      navigate(`/course-progress/${data.course._id}`);
    }
  }, [data?.purchased, data?.course, navigate]);

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading course details...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-100 dark:bg-red-900/30 p-8 rounded-3xl max-w-md mx-auto shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Failed to load course
          </h1>
          <p className="text-red-500 dark:text-red-300 mb-6">
            We couldn't fetch the course details. Please try again later.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if(purchased){
      navigate(`/course-progress/${courseId}`)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 opacity-30"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="glass rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 md:p-12 mb-12 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Course Info */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
                  <BookOpen className="h-4 w-4" />
                  <span>Course Details</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                  {course?.courseTitle}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light max-w-3xl">
                  {course?.subTitle || "Master new skills with this comprehensive course"}
                </p>
              </div>
              
              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span>Created by</span>
                  <span className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {course?.creator.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <BadgeInfo className="h-4 w-4" />
                  <span>Updated {new Date(course?.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium">
                    {course?.enrolledStudents.length} students enrolled
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8 (2.1k reviews)</span>
                </div>
              </div>
            </div>
            
            {/* Preview Video */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 dark:border-gray-600/50 aspect-video bg-gray-900">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={course.lectures[0]?.videoUrl}
                  controls={true}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <Card className="glass rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </CardContent>
            </Card>

            {/* Course Content Section */}
            <Card className="glass rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200/50 dark:border-gray-700/50 p-8">
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <PlayCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  Course Content
                </CardTitle>
                <CardDescription className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-2">
                  {course.lectures.length} lectures • Learn at your own pace
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {course.lectures.map((lecture, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm"
                  >
                    <div className="flex-shrink-0">
                      {purchased ? (
                        <PlayCircle className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                      ) : (
                        <Lock className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-base md:text-lg truncate">
                        {lecture.lectureTitle}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Lecture {idx + 1}
                      </p>
                    </div>
                    {!purchased && (
                      <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="glass rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 sticky top-8">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {course.lectures[0]?.lectureTitle || "Course Preview"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Get a taste of what you'll learn in this course
                  </p>
                </div>
                
                <Separator className="bg-gray-200/50 dark:bg-gray-700/50" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                      Course Price
                    </span>
                    <span className="text-xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {course.coursePrice === 0 ? 'Free' : formatPrice(course.coursePrice)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>12 hours of content</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lectures.length} lectures</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolledStudents.length} students enrolled</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  {purchased ? (
                    <Button 
                      onClick={handleContinueCourse} 
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <PlayCircle className="mr-2 h-6 w-6" />
                      Continue Learning
                    </Button>
                  ) : (
                    <div className="w-full">
                      <BuyCourseButton courseId={courseId} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
