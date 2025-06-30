import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseByIdQuery } from "@/features/api/courseApi";
import { useGetInstructorStudentsQuery } from "@/features/api/instructorApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  BookOpen, 
  Play, 
  Star, 
  Calendar, 
  DollarSign,
  TrendingUp,
  BarChart3,
  Eye,
  Clock,
  Award,
  Download
} from "lucide-react";
import ReactPlayer from "react-player";

const ViewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedLecture, setSelectedLecture] = useState(0);
  
  const { data: courseData, isLoading: courseLoading, error: courseError } = useGetCourseByIdQuery(courseId);
  const { data: studentsData, isLoading: studentsLoading } = useGetInstructorStudentsQuery();

  if (courseLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (courseError || !courseData?.course) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Course not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The course you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/instructor/course')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  const course = courseData.course;
  const courseStudents = studentsData?.students?.filter(student => 
    student.enrolledCourses.some(enrolledCourse => enrolledCourse.courseId === courseId)
  ) || [];

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

  // Calculate course metrics
  const totalRevenue = courseStudents.reduce((sum, student) => {
    const enrollment = student.enrolledCourses.find(c => c.courseId === courseId);
    return sum + (enrollment?.amount || 0);
  }, 0);

  const averageRating = 4.7; // Mock data - can be enhanced with real ratings
  const completionRate = 78; // Mock data - can be calculated from real progress

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/instructor/course')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {course.courseTitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Course Management & Analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/instructor/course/${courseId}`)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Course
            </Button>
            <Badge className={getLevelColor(course.courseLevel)}>
              {course.courseLevel}
            </Badge>
            <Badge variant={course.isPublished ? "default" : "secondary"}>
              {course.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{courseStudents.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(totalRevenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    {averageRating}
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lectures">Lectures</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                      <div 
                        className="text-gray-600 dark:text-gray-400 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: course.description }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                        <p className="font-medium text-gray-900 dark:text-white">{course.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {course.coursePrice === 0 ? 'Free' : formatPrice(course.coursePrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Lectures</p>
                        <p className="font-medium text-gray-900 dark:text-white">{course.lectures?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Course Preview */}
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Course Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.lectures && course.lectures.length > 0 && (
                      <div className="space-y-4">
                        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                          <ReactPlayer
                            url={course.lectures[0]?.videoUrl}
                            width="100%"
                            height="100%"
                            controls
                            light={true}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {course.lectures[0]?.lectureTitle}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            First lecture preview
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Lectures Tab */}
          <TabsContent value="lectures" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Lectures ({course.lectures?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {course.lectures && course.lectures.length > 0 ? (
                  <div className="space-y-4">
                    {course.lectures.map((lecture, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => setSelectedLecture(index)}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {lecture.lectureTitle}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Lecture {index + 1}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>5 min</span>
                        </div>
                        <Play className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No lectures added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Enrolled Students ({courseStudents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courseStudents.length > 0 ? (
                  <div className="space-y-4">
                    {courseStudents.map((student) => {
                      const enrollment = student.enrolledCourses.find(c => c.courseId === courseId);
                      return (
                        <div key={student.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.photoUrl} alt={student.name} />
                            <AvatarFallback>
                              {student.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {student.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatPrice(enrollment?.amount || 0)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(enrollment?.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No students enrolled yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Revenue</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatPrice(totalRevenue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average per Student</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatPrice(courseStudents.length > 0 ? totalRevenue / courseStudents.length : 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Course Price</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatPrice(course.coursePrice)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                        <span className="font-bold text-gray-900 dark:text-white">{completionRate}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Student Satisfaction</span>
                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                          {averageRating} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </span>
                      </div>
                      <Progress value={(averageRating / 5) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewCourse;
