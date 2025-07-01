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
    if (!course.lectures || course.lectures.length === 0) return "0h 0m";
    
    let totalMinutes = 0;
    course.lectures.forEach(lecture => {
      if (lecture.duration && lecture.duration !== "0:00") {
        const [minutes, seconds] = lecture.duration.split(':').map(Number);
        totalMinutes += minutes + (seconds > 30 ? 1 : 0);
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'advance':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/30 dark:bg-amber-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-rose-200/20 dark:bg-rose-900/15 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Navigation Header */}
      <div className="relative z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-b border-gray-200/60 dark:border-slate-700/60 sticky top-0 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-3 text-sm">
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => navigate('/courses')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl px-4 py-2"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="font-medium">Courses</span>
              </Button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">{course.category}</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white font-semibold truncate max-w-48">
                {course.courseTitle}
              </span>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-slate-700">
                <Heart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-slate-700">
                <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-slate-700">
                <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card className="overflow-hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl shadow-black/10 dark:shadow-black/20 rounded-2xl">
              <CardContent className="p-10">
                {/* Course Badges */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <Badge className={`${getDifficultyColor(course.courseLevel)} border-2 font-semibold px-4 py-2 text-sm rounded-xl shadow-lg`}>
                    {course.courseLevel || 'Intermediate'}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 font-semibold px-4 py-2 text-sm rounded-xl shadow-lg shadow-indigo-500/25">
                    {course.category}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-violet-500 to-pink-600 text-white border-0 font-semibold px-4 py-2 text-sm rounded-xl shadow-lg shadow-violet-500/25">
                    <Globe className="h-4 w-4 mr-2" />
                    {course.language || 'English'}
                  </Badge>
                </div>

                {/* Course Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  {course.courseTitle}
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 max-w-4xl">
                  {course.subTitle || course.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                </p>

                {/* Enhanced Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl border border-amber-200 dark:border-amber-700">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
                      <Star className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-300 mb-1">
                      {course.rating?.average || 4.5}
                    </div>
                    <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      ({(course.rating?.count || 1250).toLocaleString()}) reviews
                    </div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl border border-cyan-200 dark:border-cyan-700">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/25">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-300 mb-1">
                      {course.enrolledStudents?.length || 0}
                    </div>
                    <div className="text-sm font-medium text-cyan-600 dark:text-cyan-400">students</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                      <Clock className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                      {getTotalDuration()}
                    </div>
                    <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">duration</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-700">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                      {course.lectures?.length || 0}
                    </div>
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400">lectures</div>
                  </div>
                </div>

                {/* Enhanced Instructor Info */}
                <div className="flex items-center p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-700">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mr-6 shadow-lg shadow-indigo-500/25">
                    {course.creator.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Course by</p>
                    <p className="font-bold text-gray-900 dark:text-white text-xl">
                      {course.creator.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Updated</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      {new Date(course.updatedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl shadow-black/10 dark:shadow-black/20 rounded-2xl overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-slate-800 dark:to-slate-700">
                  <TabsList className="w-full bg-transparent h-auto p-3 grid grid-cols-4 gap-2">
                    <TabsTrigger 
                      value="overview" 
                      className="rounded-xl px-6 py-4 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="content" 
                      className="rounded-xl px-6 py-4 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger 
                      value="instructor" 
                      className="rounded-xl px-6 py-4 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Instructor
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reviews" 
                      className="rounded-xl px-6 py-4 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="p-10 space-y-10 m-0 bg-white dark:bg-slate-800">
                  {/* What You'll Learn */}
                  {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                          <Target className="h-7 w-7 text-white" />
                        </div>
                        What you'll learn
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {course.whatYouWillLearn.map((item, index) => (
                          <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-emerald-500/25">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed text-lg">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {course.requirements && course.requirements.length > 0 && (
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                          <BadgeInfo className="h-7 w-7 text-white" />
                        </div>
                        Requirements
                      </h2>
                      <div className="space-y-4">
                        {course.requirements.map((requirement, index) => (
                          <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl border border-cyan-200 dark:border-cyan-700">
                            <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed text-lg">{requirement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Course Description */}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <FileText className="h-7 w-7 text-white" />
                      </div>
                      Course Description
                    </h2>
                    <div 
                      className="prose prose-xl max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                  </div>
                </TabsContent>

                {/* Course Content Tab */}
                <TabsContent value="content" className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Course Content
                  </h2>
                      <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {course.lectures.length} lectures • {getTotalDuration()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                    {course.lectures.map((lecture, idx) => (
                        <Card 
                        key={idx} 
                          className="hover:shadow-md transition-all duration-200 border-gray-200 dark:border-gray-700"
                      >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          {purchased ? (
                                    <PlayCircle className="h-5 w-5 text-white" />
                          ) : (
                                    <Lock className="h-5 w-5 text-white" />
                          )}
                        </div>
                              </div>
                              
                        <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Lecture {idx + 1}
                                  </span>
                                  {lecture.duration && (
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {lecture.duration}
                                    </Badge>
                                  )}
                                  {lecture.isPreviewFree && (
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                                      Free Preview
                                    </Badge>
                                  )}
                                </div>
                                
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {lecture.lectureTitle}
                                </h3>
                                
                                {lecture.description && (
                                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {lecture.description}
                          </p>
                                )}
                        </div>
                              
                              {!purchased && !lecture.isPreviewFree && (
                                <Lock className="h-5 w-5 text-gray-400" />
                              )}
                      </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Instructor Tab */}
                <TabsContent value="instructor" className="p-8">
                  <div className="space-y-8">
                  <div className="flex items-start gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                      {course.creator.name.charAt(0)}
                    </div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        {course.creator.name}
                      </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Course Instructor</p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Experienced professional with expertise in {course.category}.
                          Passionate about sharing knowledge and helping students achieve their learning goals.
                        </p>
                        
                        <div className="grid grid-cols-3 gap-6 mt-8">
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">5+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">1.2k+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Students Taught</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
                <TabsContent value="reviews" className="p-8">
                  <div className="text-center py-16 space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                      <MessageSquare className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews Coming Soon!</h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        We're working on bringing you authentic student reviews and ratings. 
                        Check back soon to see what learners are saying about this course.
                      </p>
                    </div>
                </div>
              </TabsContent>
            </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Video Preview */}
              <Card className="overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-white/20 dark:border-slate-700/50 shadow-xl">
                <div className="aspect-video bg-black relative group">
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={course.lectures[0]?.videoUrl}
                    controls={true}
                    light={true}
                    playing={false}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/70 text-white hover:bg-black/80 backdrop-blur-sm">
                      <PlayCircle className="h-3 w-3 mr-1" />
                      Preview
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Pricing Card */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-white/20 dark:border-slate-700/50 shadow-xl">
                <CardContent className="p-6 space-y-6">
                                 {/* Pricing */}
                  <div className="text-center">
                   <div className="flex items-center justify-center gap-3 mb-2">
                     <span className="text-4xl font-black text-gray-900 dark:text-white">
                       {course.coursePrice === 0 ? 'Free' : formatPrice(course.coursePrice)}
                     </span>
                     {course.originalPrice && course.originalPrice > course.coursePrice && (
                       <span className="text-lg text-gray-500 line-through">
                         {formatPrice(course.originalPrice)}
                       </span>
                     )}
                   </div>
                   {course.discountPercentage && course.discountPercentage > 0 && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-4">
                        🎉 {course.discountPercentage}% OFF - Limited Time!
                     </Badge>
                   )}
                 </div>

                {/* Action Button */}
                  <div>
                  {purchased ? (
                    <Button 
                      onClick={handleContinueCourse} 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Continue Learning
                    </Button>
                  ) : (
                      <div className="space-y-4">
                      <BuyCourseButton courseId={courseId} />
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Shield className="h-4 w-4" />
                          <span>30-day money-back guarantee</span>
                        </div>
                    </div>
                  )}
                </div>

                                 {/* Course Includes */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">This course includes:</h3>
                   <div className="space-y-3">
                     <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                       <span className="text-gray-700 dark:text-gray-300">
                          {getTotalDuration()} on-demand video
                       </span>
                     </div>
                      
                     <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                       <span className="text-gray-700 dark:text-gray-300">
                          {course.lectures?.length || 0} downloadable resources
                       </span>
                     </div>
                      
                     <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Smartphone className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                       <span className="text-gray-700 dark:text-gray-300">
                          Access on mobile and desktop
                       </span>
                     </div>
                      
                     <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                          <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                     </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Certificate of completion
                        </span>
                     </div>
                      
                     <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                          <Infinity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                     </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Full lifetime access
                        </span>
                   </div>
                 </div>
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
