import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  MessageSquare, 
  MoreVertical,
  Calendar,
  BookOpen,
  TrendingUp,
  DollarSign,
  Eye,
  RefreshCw
} from "lucide-react";
import { useGetInstructorStudentsQuery, useGetInstructorAnalyticsQuery } from "@/features/api/instructorApi";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Fetch real data
  const { data: studentsData, isLoading: studentsLoading, error: studentsError, refetch: refetchStudents } = useGetInstructorStudentsQuery();
  const { data: analyticsData, isLoading: analyticsLoading, refetch: refetchAnalytics } = useGetInstructorAnalyticsQuery();
  const { data: coursesData, refetch: refetchCourses } = useGetCreatorCourseQuery();

  // Refresh all data
  const handleRefresh = () => {
    refetchStudents();
    refetchAnalytics();
    refetchCourses();
  };

  if (studentsLoading || analyticsLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading students data...</p>
        </div>
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Failed to load students</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please try refreshing the page</p>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>
      </div>
    );
  }

  const students = studentsData?.students || [];
  const analytics = analyticsData?.analytics || {};
  const courses = coursesData?.courses || [];

  // Get unique course titles for filter
  const courseOptions = ['All Courses', ...courses.map(course => course.courseTitle)];

  // Calculate metrics
  const totalStudents = students.length;
  const activeToday = students.filter(student => {
    const lastPurchase = new Date(student.lastPurchase);
    const today = new Date();
    return lastPurchase.toDateString() === today.toDateString();
  }).length;

  const totalEnrollments = students.reduce((sum, student) => sum + student.enrolledCourses.length, 0);
  const avgProgress = 67; // Mock data - can be enhanced with real progress tracking
  const completionsThisMonth = students.filter(student => {
    const lastPurchase = new Date(student.lastPurchase);
    const currentMonth = new Date().getMonth();
    return lastPurchase.getMonth() === currentMonth;
  }).length;

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All Courses' || 
                         student.enrolledCourses.some(enrollment => 
                           courses.find(c => c._id === enrollment.courseId)?.courseTitle === selectedCourse
                         );
    return matchesSearch && matchesCourse;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor and engage with your students</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Send Announcement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Across all courses</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Enrollments</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{activeToday}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(analytics.totalRevenue || 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">From {analytics.totalSales || 0} sales</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrollments</CardTitle>
            <BookOpen className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalEnrollments}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                {courseOptions.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredStudents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Student</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Enrolled Courses</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Total Spent</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Last Purchase</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow 
                    key={student.id}
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.photoUrl} alt={student.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {student.name?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {student.enrolledCourses.length} courses
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {student.enrolledCourses.slice(0, 2).map((enrollment, index) => {
                            const course = courses.find(c => c._id === enrollment.courseId);
                            return (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              >
                                {course?.courseTitle || 'Unknown Course'}
                              </Badge>
                            );
                          })}
                          {student.enrolledCourses.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{student.enrolledCourses.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(student.totalSpent)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.enrolledCourses.length} enrollments
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {getTimeAgo(student.lastPurchase)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(student.lastPurchase)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || selectedCourse !== 'All Courses' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No students have enrolled in your courses yet'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
