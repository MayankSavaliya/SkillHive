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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { 
  BadgeInfo, 
  Lock, 
  PlayCircle, 
  Users, 
  Clock, 
  Star, 
  BookOpen, 
  CheckCircle,
  Download,
  FileText,
  Globe,
  Award,
  Smartphone,
  Infinity,
  ChevronRight,
  Home,
  ArrowLeft,
  Heart,
  Share2,
  MoreVertical,
  Calendar,
  Target,
  TrendingUp,
  Shield,
  MessageSquare,
  ThumbsUp
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);

  useEffect(() => {
    if (data?.purchased && data?.course && data?.course.lectures && data?.course.lectures.length > 0) {
      navigate(`/course-progress/${data.course._id}`);
    }
  }, [data?.purchased, data?.course, navigate]);

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/30 dark:bg-amber-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-rose-200/20 dark:bg-rose-900/15 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Loading course details</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">Fetching the latest information about this amazing course...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-lg mx-auto p-8">
        <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course not found</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            The course you're looking for seems to have wandered off. Let's get you back on track!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3"
          >
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/courses')}
            className="px-8 py-3"
          >
            Browse Courses
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

  // Calculate total duration from lectures
  const getTotalDuration = () => {
    if (!course.lectures || course.lectures.length === 0) {
      return '0h 0m';
    }

    let totalSeconds = 0;
    course.lectures.forEach(lecture => {
      if (lecture.duration && typeof lecture.duration === 'string' && lecture.duration.includes(':')) {
        const [minutes, seconds] = lecture.duration.split(':').map(Number);
        if (!isNaN(minutes) && !isNaN(seconds)) {
          totalSeconds += (minutes * 60) + seconds;
        }
      }
    });

    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advance':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700/60 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm font-medium">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/courses')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Home className="h-4 w-4 mr-2" />
                <span>Courses</span>
              </Button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{course.category}</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white truncate max-w-xs">
                {course.courseTitle}
              </span>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
                <Badge 
                  className={`${getDifficultyColor(course.courseLevel)} font-semibold px-3 py-1 rounded-full text-sm`}
                >
                  {course.courseLevel || 'Intermediate'}
                </Badge>

                {/* Course Title */}
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  {course.courseTitle}
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {course.subTitle || course.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                </p>

                {/* Instructor Info */}
                <div className="flex items-center space-x-3 pt-2">
                  <img src={course.creator?.photoUrl || "https://github.com/shadcn.png"} alt={course.creator.name} className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Created by <span className="font-semibold text-blue-600 dark:text-blue-400">{course.creator.name}</span>
                  </span>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{course.rating?.average || 4.5}</span>
                    <span>({course.rating?.count || 0} ratings)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolledStudents?.length || 0} students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{getTotalDuration()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lectures?.length || 0} lectures</span>
                  </div>
                </div>
            </div>

            {/* Tabs Content */}
            <div className="pt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <TabsList className="bg-transparent p-0 h-auto -mb-px">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-4 py-3 font-semibold text-gray-500">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-4 py-3 font-semibold text-gray-500">
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="instructor" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-4 py-3 font-semibold text-gray-500">
                      Instructor
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-4 py-3 font-semibold text-gray-500">
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="py-6">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="m-0 space-y-8">
                    {/* Course Description */}
                    <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Course Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: course.description }}
                        />
                      </CardContent>
                    </Card>

                    {/* What You'll Learn */}
                    {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                      <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">What you'll learn</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.whatYouWillLearn.map((item, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{item}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Requirements */}
                    {course.requirements && course.requirements.length > 0 && (
                      <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 list-disc list-inside">
                            {course.requirements.map((requirement, index) => (
                              <li key={index} className="text-gray-700 dark:text-gray-300">{requirement}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Course Content Tab */}
                  <TabsContent value="content" className="m-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          Course Content
                        </h2>
                        <Badge variant="outline">
                          {course.lectures.length} lectures • {getTotalDuration()}
                        </Badge>
                      </div>
                      
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {course.lectures.map((lecture, idx) => (
                          <div 
                            key={idx} 
                            className="p-4 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 bg-white dark:bg-gray-800"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                {purchased || lecture.isPreviewFree ? (
                                  <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                ) : (
                                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {lecture.lectureTitle}
                                </h3>
                                {lecture.isPreviewFree && (
                                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Lecture {idx + 1}
                              </span>
                            </div>
                            
                            {lecture.duration && (
                              <Badge variant="outline" className="text-xs hidden sm:flex">
                                <Clock className="h-3 w-3 mr-1" />
                                {lecture.duration}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Instructor Tab */}
                  <TabsContent value="instructor" className="m-0">
                    <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img src={course.creator?.photoUrl || "https://github.com/shadcn.png"} alt={course.creator.name} className="w-16 h-16 rounded-full" />
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                              {course.creator.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Course Instructor</p>
                            <p className="text-gray-700 dark:text-gray-300">
                              Experienced professional with expertise in {course.category}.
                              Passionate about sharing knowledge and helping students achieve their learning goals.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="m-0">
                    <div className="text-center py-12 space-y-4">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reviews Coming Soon!</h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        We're working on bringing you authentic student reviews and ratings. 
                        Check back soon to see what learners are saying about this course.
                      </p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Video Preview */}
              <Card className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                <div className="aspect-video bg-black relative group">
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={course.lectures[0]?.videoUrl}
                    controls={true}
                    light={true}
                    playing={false}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
              </Card>

              {/* Pricing Card */}
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                <CardContent className="p-6 space-y-4">
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {course.coursePrice === 0 ? 'Free' : formatPrice(course.coursePrice)}
                    </span>
                    {course.originalPrice && course.originalPrice > course.coursePrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <div>
                    {purchased ? (
                      <Button 
                        onClick={handleContinueCourse} 
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                      >
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Continue Learning
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <BuyCourseButton courseId={courseId} />
                        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                          30-day money-back guarantee
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course Includes */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">This course includes:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{getTotalDuration()} on-demand video</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{course.lectures?.length || 0} articles & resources</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Smartphone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">Access on mobile and desktop</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Award className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">Certificate of completion</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Infinity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">Full lifetime access</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
