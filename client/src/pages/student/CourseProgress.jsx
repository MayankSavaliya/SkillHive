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
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Loading Course</h3>
          <p className="text-gray-500 dark:text-gray-400">Just a moment, we're getting everything ready.</p>
        </div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Could Not Load Course</h3>
          <p className="text-gray-600 dark:text-gray-400">We ran into an issue loading your course progress. Please check your connection and try again.</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/my-learning')}>
            Go to My Learning
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="bg-white dark:bg-slate-800/50 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700/50 sticky top-0 z-20"
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/my-learning')}
                className="rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Learning
              </Button>
              
              <div className="hidden sm:block border-l border-gray-200 dark:border-slate-700 h-8"></div>
              
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {courseTitle}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{completedLectures} / {totalLectures} lectures</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{progressPercentage}% complete</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
                size="lg"
                className={`${completed 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                  } rounded-md font-semibold transition-all duration-200 shadow-lg`}
              >
                {completed ? (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Course Completed
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Mark as Complete
                  </div>
                )}
              </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player and Course Info - Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Video Player Card */}
            <Card className="overflow-hidden bg-white dark:bg-slate-800/50 border border-gray-200/80 dark:border-slate-700/50 shadow-sm rounded-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLecture?._id || initialLecture?._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-video bg-slate-900 relative group"
                >
                {(currentLecture?.videoUrl || initialLecture?.videoUrl) ? (
                  <video
                    key={currentLecture?._id || initialLecture?._id}
                    src={currentLecture?.videoUrl || initialLecture?.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onPlay={() =>
                      handleLectureProgress(currentLecture?._id || initialLecture?._id)
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
                        <Play className="h-10 w-10 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-200 text-lg font-medium">No video available</p>
                        <p className="text-slate-400 text-sm">Select a lecture to begin.</p>
                      </div>
                    </div>
                  </div>
                )}
                </motion.div>
              </AnimatePresence>
              
              {/* Lecture Info */}
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-medium">
                        Lecture {currentLectureIndex + 1} / {totalLectures}
                      </Badge>
                      {isLectureCompleted(currentLecture?._id || initialLecture?._id) && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-transparent">
                          <CheckCircle className="h-4 w-4 mr-1.5" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentLecture?.lectureTitle || initialLecture?.lectureTitle || 'Welcome to the Course'}
                    </h2>
                    
                    {(currentLecture?.description || initialLecture?.description) && (
                      <p className="text-base text-gray-600 dark:text-gray-300 max-w-3xl">
                        {currentLecture?.description || initialLecture?.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-slate-700 rounded-md">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-mono text-sm font-medium text-gray-600 dark:text-gray-300">
                      {currentLecture?.duration || initialLecture?.duration || "00:00"}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-4 bg-gray-200 dark:bg-slate-700" />
                
                {/* Lecture Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    disabled={currentLectureIndex === 0}
                    onClick={() => {
                      const prevLecture = courseDetails.lectures[currentLectureIndex - 1];
                      if (prevLecture) handleSelectLecture(prevLecture);
                    }}
                    className="rounded-md"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    disabled={currentLectureIndex === totalLectures - 1}
                    onClick={() => {
                      const nextLecture = courseDetails.lectures[currentLectureIndex + 1];
                      if (nextLecture) handleSelectLecture(nextLecture);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Next Lecture
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Overview Tabs */}
            <Card className="bg-white dark:bg-slate-800/50 border border-gray-200/80 dark:border-slate-700/50 shadow-sm rounded-xl">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200 dark:border-slate-700">
                  <TabsList className="w-full justify-start bg-transparent p-2">
                    <TabsTrigger value="overview" className="text-base font-semibold">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="text-base font-semibold">
                      Notes
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="text-base font-semibold">
                      Resources
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-6 space-y-6 m-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        About this course
                      </h3>
                      <p className="text-base text-gray-600 dark:text-gray-300">
                        {courseDetails.description || "Dive deep into this comprehensive course designed to enhance your skills and knowledge. Learn from expert instructors and gain practical experience through hands-on projects."}
                      </p>
                    </div>
                    
                    {courseDetails.whatYouWillLearn && courseDetails.whatYouWillLearn.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                          What you'll learn
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {courseDetails.whatYouWillLearn.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-gray-700 dark:text-gray-300">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="p-6 m-0">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Notes</h3>
                    <p className="text-gray-500 dark:text-gray-400">Feature coming soon. You'll be able to take notes on lectures here.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="resources" className="p-6 m-0">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Downloads & Resources</h3>
                    <p className="text-gray-500 dark:text-gray-400">No resources available for this course yet.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Lectures List - Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="space-y-6"
          >
            <Card className="bg-white dark:bg-slate-800/50 border border-gray-200/80 dark:border-slate-700/50 shadow-sm rounded-xl">
              <CardHeader className="p-4 border-b border-gray-200 dark:border-slate-700">
                <CardTitle className="text-lg font-bold">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1 max-h-[calc(100vh-20rem)] overflow-y-auto"
                >
                  {courseDetails.lectures && courseDetails.lectures.map((lecture, index) => {
                    const isActive = (currentLecture?._id || initialLecture?._id) === lecture._id;
                    const isCompleted = isLectureCompleted(lecture._id);
                    return (
                      <motion.button
                        key={lecture._id}
                        variants={itemVariants}
                        onClick={() => handleSelectLecture(lecture)}
                        className={`w-full text-left p-4 transition-colors duration-200 flex items-center gap-4 ${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/30' 
                            : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <CirclePlay className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>
                            {index + 1}. {lecture.lectureTitle}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                            <Clock className="h-3 w-3" />
                            {lecture.duration || '5m'}
                          </p>
                        </div>
                        {isActive && (
                          <motion.div 
                            layoutId="active-lecture-indicator"
                            className="w-2 h-2 bg-blue-600 rounded-full"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
