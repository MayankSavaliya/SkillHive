import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { 
  CheckCircle, 
  CheckCircle2, 
  CirclePlay, 
  Clock, 
  BookOpen, 
  Trophy,
  ArrowLeft,
  Download,
  Share2,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  Maximize,
  Settings,
  ChevronRight,
  Target,
  Award,
  BarChart3,
  Users,
  CalendarDays
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showToast } from "@/lib/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] = useCompleteCourseMutation();
  const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] = useInCompleteCourseMutation();

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      showToast.success(markCompleteData.message || "🎉 Course completed!", {
        description: "Congratulations on finishing this course. Keep learning!",
        duration: 4000,
      });
    }
    if (inCompletedSuccess) {
      refetch();
      showToast.success(markInCompleteData.message || "📚 Course marked as incomplete", {
        description: "You can continue learning and complete it anytime.",
        duration: 3000,
      });
    }
  }, [completedSuccess, inCompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Loading your course</h3>
          <p className="text-gray-600 dark:text-gray-400">Preparing your learning experience...</p>
        </div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Oops! Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-400">We couldn't load your course progress. Please try again.</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/my-learning')}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  // Initialize the first lecture if not exists
  const initialLecture = currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  // Ensure progress is always an array
  const safeProgress = Array.isArray(progress) ? progress : [];

  const isLectureCompleted = (lectureId) => {
    return safeProgress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  // Calculate progress percentage
  const completedLectures = safeProgress.filter(p => p.viewed).length;
  const totalLectures = courseDetails.lectures?.length || 0;
  const progressPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

  // Get current lecture index
  const currentLectureIndex = courseDetails.lectures?.findIndex(
    (lec) => lec._id === (currentLecture?._id || initialLecture?._id)
  ) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-white/30 dark:border-slate-700/50 sticky top-0 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => navigate('/my-learning')}
                className="rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-700/80 px-4 py-3 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-3" />
                <span className="font-medium">Back to Learning</span>
              </Button>
              
              <div className="hidden sm:block w-px h-8 bg-slate-300/60 dark:bg-slate-600/60"></div>
              
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {courseTitle}
                </h1>
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2 bg-blue-50/80 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">{completedLectures} of {totalLectures} lectures</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50/80 dark:bg-green-900/30 px-3 py-1.5 rounded-lg">
                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="font-medium">{progressPercentage}% completed</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="rounded-xl p-3 hover:bg-slate-100/80 dark:hover:bg-slate-700/80">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl p-3 hover:bg-slate-100/80 dark:hover:bg-slate-700/80">
                  <Download className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl p-3 hover:bg-slate-100/80 dark:hover:bg-slate-700/80">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
              
              <Button
                onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
                size="lg"
                className={`${completed 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                } rounded-xl px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105`}
              >
                {completed ? (
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5" />
                    <span>Mark Complete</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Video Player and Course Info - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player Card */}
            <Card className="overflow-hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl shadow-black/10 dark:shadow-black/20 rounded-2xl">
              <div className="aspect-video bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 relative group overflow-hidden rounded-t-2xl">
                {(currentLecture?.videoUrl || initialLecture?.videoUrl) ? (
                  <video
                    src={currentLecture?.videoUrl || initialLecture?.videoUrl}
                    controls
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onPlay={() =>
                      handleLectureProgress(currentLecture?._id || initialLecture?._id)
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-gray-600">
                        <Play className="h-12 w-12 text-gray-300" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-200 text-xl font-medium">No video available</p>
                        <p className="text-gray-400 text-sm">This lecture content will be available soon</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Video overlay controls */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <Button size="lg" className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30">
                      <Play className="h-6 w-6 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Lecture Info */}
              <CardContent className="p-8 space-y-6 bg-white dark:bg-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-medium shadow-lg shadow-violet-500/25">
                        Lecture {currentLectureIndex + 1} of {totalLectures}
                      </Badge>
                      {isLectureCompleted(currentLecture?._id || initialLecture?._id) && (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 px-4 py-2 text-sm font-medium shadow-lg shadow-emerald-500/25">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                      {currentLecture?.lectureTitle || initialLecture?.lectureTitle || 'Loading...'}
                    </h2>
                    
                    {(currentLecture?.description || initialLecture?.description) && (
                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                        {currentLecture?.description || initialLecture?.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <Separator className="my-8 bg-gray-200 dark:bg-slate-600" />
                
                {/* Lecture Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={currentLectureIndex === 0}
                    onClick={() => {
                      const prevLecture = courseDetails.lectures[currentLectureIndex - 1];
                      if (prevLecture) handleSelectLecture(prevLecture);
                    }}
                    className="rounded-xl px-6 py-3 border-2 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <ArrowLeft className="h-5 w-5 mr-3" />
                    <span className="font-medium">Previous Lecture</span>
                  </Button>
                  
                  <div className="flex items-center gap-4 px-6 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <span className="font-medium text-amber-700 dark:text-amber-300">
                      {currentLecture?.duration || initialLecture?.duration || "0:00"}
                    </span>
                  </div>
                  
                  <Button
                    size="lg"
                    disabled={currentLectureIndex === totalLectures - 1}
                    onClick={() => {
                      const nextLecture = courseDetails.lectures[currentLectureIndex + 1];
                      if (nextLecture) handleSelectLecture(nextLecture);
                    }}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl px-6 py-3 font-medium shadow-lg shadow-rose-500/25 transition-all duration-200 transform hover:scale-105"
                  >
                    <span className="font-medium">Next Lecture</span>
                    <ArrowLeft className="h-5 w-5 ml-3 rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Overview Tabs */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl shadow-black/10 dark:shadow-black/20 rounded-2xl overflow-hidden">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-slate-800 dark:to-slate-700">
                  <TabsList className="w-full bg-transparent h-auto p-3 grid grid-cols-3 gap-3">
                    <TabsTrigger 
                      value="overview" 
                      className="rounded-xl px-6 py-4 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notes" 
                      className="rounded-xl px-6 py-4 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Notes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="resources" 
                      className="rounded-xl px-6 py-4 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Resources
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-8 space-y-8 m-0 bg-white dark:bg-slate-800">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        About this course
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
                        {courseDetails.description || "Dive deep into this comprehensive course designed to enhance your skills and knowledge. Learn from expert instructors and gain practical experience through hands-on projects."}
                      </p>
                    </div>
                    
                    {courseDetails.whatYouWillLearn && courseDetails.whatYouWillLearn.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          What you'll learn
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {courseDetails.whatYouWillLearn.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
                              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-emerald-500/25">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="p-8 m-0 bg-white dark:bg-slate-800">
                  <div className="text-center py-16 space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-700">
                      <BookOpen className="h-12 w-12 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Notes</h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                        Take notes while learning to remember key concepts and insights.
                      </p>
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Coming soon in a future update!</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="p-8 m-0 bg-white dark:bg-slate-800">
                  <div className="text-center py-16 space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-2xl flex items-center justify-center mx-auto border border-purple-200 dark:border-purple-700">
                      <Download className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Course Resources</h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                        Download additional materials, worksheets, and supplementary content.
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Resources will be available here soon!</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Progress Overview Card */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl shadow-black/10 dark:shadow-black/20 rounded-2xl overflow-hidden">
              <CardHeader className="pb-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Course Progress</CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">Track your learning journey</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pb-8 bg-white dark:bg-slate-800">
                {/* Enhanced Progress Circle */}
                <div className="relative">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-40 h-40">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#progressGradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - progressPercentage / 100)}`}
                          className="transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="50%" stopColor="#EC4899" />
                            <stop offset="100%" stopColor="#F59E0B" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-1">
                          <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                            {progressPercentage}%
                          </div>
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Complete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-700">
                    <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">{completedLectures}</div>
                    <div className="text-sm font-medium text-cyan-600 dark:text-cyan-400">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border border-rose-200 dark:border-rose-700">
                    <div className="text-3xl font-bold text-rose-700 dark:text-rose-300">{totalLectures - completedLectures}</div>
                    <div className="text-sm font-medium text-rose-600 dark:text-rose-400">Remaining</div>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-slate-600" />

                {/* Enhanced Course Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
                    <span className="text-gray-700 dark:text-gray-200 flex items-center gap-3 font-medium">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      Total Lectures
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">{totalLectures}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                    <span className="text-gray-700 dark:text-gray-200 flex items-center gap-3 font-medium">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      Estimated Time
                    </span>
                    <span className="font-bold text-amber-700 dark:text-amber-300 text-lg">
                      {Math.round(totalLectures * 15)} mins
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                    <span className="text-gray-700 dark:text-gray-200 flex items-center gap-3 font-medium">
                      <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      Certificate
                    </span>
                    <span className={`font-bold text-lg ${completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-violet-700 dark:text-violet-300'}`}>
                      {completed ? "Earned" : "In Progress"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Lecture List Card */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl shadow-black/10 dark:shadow-black/20 rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Course Content</CardTitle>
                  </div>
                  <Badge className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-800 dark:to-blue-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-600 px-3 py-1 font-medium">
                    {totalLectures} lectures
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-white dark:bg-slate-800">
                <div className="max-h-[600px] overflow-y-auto">
                  {courseDetails?.lectures?.map((lecture, index) => {
                    const isCompleted = isLectureCompleted(lecture._id);
                    const isCurrent = lecture._id === (currentLecture?._id || initialLecture?._id);
                    
                    return (
                      <div
                        key={lecture._id}
                        className={`
                          flex items-center gap-4 px-6 py-5 cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-700/30
                          ${isCurrent ? 'bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-l-4 border-indigo-500' : ''}
                          ${index !== (courseDetails.lectures?.length || 0) - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''}
                        `}
                        onClick={() => handleSelectLecture(lecture)}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                              <CheckCircle2 className="h-6 w-6 text-white" />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25">
                              <CirclePlay className="h-6 w-6 text-white" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-700 dark:to-slate-700 rounded-xl flex items-center justify-center border border-gray-200 dark:border-slate-600">
                              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{index + 1}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className={`font-semibold text-base line-clamp-2 transition-colors ${
                            isCompleted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                          } ${isCurrent ? 'text-indigo-700 dark:text-indigo-300' : ''}`}>
                            {lecture.lectureTitle}
                          </h4>
                          {lecture.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                {lecture.duration}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0 flex items-center gap-2">
                          {isCurrent && (
                            <Badge className="bg-gradient-to-r from-rose-500 to-pink-600 text-white border-0 px-3 py-1 text-xs font-medium shadow-lg shadow-rose-500/25">
                              Playing
                            </Badge>
                          )}
                          {isCompleted && !isCurrent && (
                            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 px-3 py-1 text-xs font-medium shadow-lg shadow-emerald-500/25">
                              ✓
                            </Badge>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
