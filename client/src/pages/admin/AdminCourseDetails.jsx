import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAdminCourseDetailsQuery } from "@/features/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  ArrowLeft,
  Users, 
  DollarSign, 
  BookOpen, 
  Calendar,
  Play,
  Download,
  TrendingUp,
  BarChart3,
  User,
  Mail,
  Clock,
  Tag,
  Star,
  Eye
} from "lucide-react";

const AdminCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const { data: courseData, isLoading, error } = useGetAdminCourseDetailsQuery(courseId);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !courseData?.course) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">The course you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/admin/courses')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>
    );
  }

  const course = courseData.course;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/courses')}
            className="flex items-center self-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {course.courseTitle}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Created by {course.creator?.name} • {course.category}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={course.isPublished ? "success" : "secondary"}>
            {course.isPublished ? "Published" : "Draft"}
          </Badge>
          <Badge variant="outline">
            {course.courseLevel}
          </Badge>
        </div>
      </div>

      {/* Course Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Enrollments</CardTitle>
            <Users className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">
              {course.analytics?.totalEnrollments || 0}
            </div>
            <div className="flex items-center mt-2 text-sm opacity-90">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Total students enrolled</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">
              {formatCurrency(course.analytics?.totalRevenue || 0)}
            </div>
            <div className="flex items-center mt-2 text-sm opacity-90">
              <BarChart3 className="h-4 w-4 mr-1" />
              <span>Course price: {formatCurrency(course.coursePrice)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Lectures</CardTitle>
            <Play className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">
              {course.lectures?.length || 0}
            </div>
            <div className="flex items-center mt-2 text-sm opacity-90">
              <Clock className="h-4 w-4 mr-1" />
              <span>Course content</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Course Rating</CardTitle>
            <Star className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">
              {course.rating?.average ? course.rating.average.toFixed(1) : 'N/A'}
            </div>
            <div className="flex items-center mt-2 text-sm opacity-90">
              <Eye className="h-4 w-4 mr-1" />
              <span>{course.rating?.count || 0} reviews</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Details Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lectures">Lectures</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</p>
                    <p className="text-sm font-semibold">{course.courseTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                    <Badge variant="outline">
                      <Tag className="w-3 h-3 mr-1" />
                      {course.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Level</p>
                    <p className="text-sm font-semibold">{course.courseLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</p>
                    <p className="text-sm font-semibold">{course.language || 'English'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                    <p className="text-sm font-semibold text-green-600">{formatCurrency(course.coursePrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="text-sm font-semibold">{getTotalDuration()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-sm">{formatDate(course.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated</p>
                    <p className="text-sm">{formatDate(course.updatedAt)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {course.description || "No description available"}
                  </p>
                </div>

                {/* What You'll Learn */}
                {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">What Students Will Learn</p>
                    <div className="space-y-1">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Course Requirements</p>
                    <div className="space-y-1">
                      {course.requirements.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{course.creator?.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-1" />
                      {course.creator?.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lectures Tab */}
        <TabsContent value="lectures">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Course Lectures ({course.lectures?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.lectures && course.lectures.length > 0 ? (
                <div className="space-y-4">
                  {course.lectures.map((lecture, index) => (
                    <div key={lecture._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {lecture.lectureIndex || index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{lecture.lectureTitle}</p>
                          {lecture.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                              {lecture.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{lecture.isPreviewFree ? "Free Preview" : "Premium Content"}</span>
                            {lecture.duration && lecture.duration !== "0:00" && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{lecture.duration}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={lecture.isPreviewFree ? "success" : "secondary"}>
                          {lecture.isPreviewFree ? "Free" : "Premium"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No lectures available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrollments Tab */}
        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Enrolled Students ({course.enrollments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.enrollments && course.enrollments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.enrollments.map((enrollment) => (
                      <TableRow key={enrollment._id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {enrollment.student?.name?.charAt(0)}
                              </span>
                            </div>
                            <p className="font-medium">{enrollment.student?.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>{enrollment.student?.email}</TableCell>
                        <TableCell>{formatDate(enrollment.enrollmentDate)}</TableCell>
                        <TableCell>
                          <Badge variant="success">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No students enrolled yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.analytics?.enrollmentsByMonth && Object.keys(course.analytics.enrollmentsByMonth).length > 0 ? (
                    Object.entries(course.analytics.enrollmentsByMonth).map(([month, count]) => (
                      <div key={month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium">{month}</p>
                        <Badge variant="secondary">{count} enrollments</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No enrollment data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="font-medium">Total Revenue</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(course.analytics?.totalRevenue || 0)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-medium">Price per Student</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(course.coursePrice)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="font-medium">Average Monthly Revenue</p>
                    <p className="text-lg font-bold text-purple-600">
                      {formatCurrency((course.analytics?.totalRevenue || 0) / Math.max(Object.keys(course.analytics?.enrollmentsByMonth || {}).length, 1))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCourseDetails;
