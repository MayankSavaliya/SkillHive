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
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);
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

  useEffect(() => {
    if (purchased && course && course.lectures && course.lectures.length > 0) {
      navigate(`/course-progress/${course._id}`);
    }
  }, [purchased, course, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto py-16 px-4 md:px-8">
          <div className="space-y-6">
            <h1 className="font-black text-4xl md:text-5xl lg:text-6xl leading-tight">
              {course?.courseTitle}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-light leading-relaxed max-w-3xl">
              {course?.subTitle || "Master new skills with this comprehensive course"}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <span className="text-blue-200">Created by</span>
                <span className="text-blue-100 font-semibold bg-blue-800/30 px-3 py-1 rounded-full">
                  {course?.creator.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <BadgeInfo size={20} />
                <span>Updated {new Date(course?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full font-medium">
                  {course?.enrolledStudents.length} students enrolled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Column - Course Info */}
          <div className="flex-1 space-y-10">
            {/* Description Section */}
            <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Course Description
              </h2>
              <div
                className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>

            {/* Course Content Section */}
            <Card className="glass border-white/20 dark:border-gray-700/50 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200/50 dark:border-gray-700/50 p-8">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <PlayCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  Course Content
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                  {course.lectures.length} lectures • Learn at your own pace
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {course.lectures.map((lecture, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0">
                      {purchased ? (
                        <PlayCircle className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                      ) : (
                        <Lock className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-lg">
                        {lecture.lectureTitle}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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

          {/* Right Column - Course Preview & Purchase */}
          <div className="w-full lg:w-96 lg:sticky lg:top-8">
            <Card className="glass border-white/20 dark:border-gray-700/50 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                {/* Video Preview */}
                <div className="relative aspect-video bg-gray-900 rounded-t-3xl overflow-hidden">
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={course.lectures[0]?.videoUrl}
                    controls={true}
                    className="rounded-t-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                </div>
                
                {/* Course Info */}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {course.lectures[0]?.lectureTitle || "Course Preview"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Get a taste of what you'll learn in this course
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        Course Price
                      </span>
                      <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {course.coursePrice === 0 ? 'Free' : `₹${course.coursePrice}`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-8 pt-0">
                {purchased ? (
                  <Button 
                    onClick={handleContinueCourse} 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <PlayCircle className="mr-2 h-6 w-6" />
                    Continue Learning
                  </Button>
                ) : (
                  <div className="w-full">
                    <BuyCourseButton courseId={courseId} />
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
