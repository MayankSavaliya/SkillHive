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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  RefreshCw,
  Send
} from "lucide-react";
import { useGetInstructorStudentsQuery, useGetInstructorAnalyticsQuery, useSendAnnouncementMutation } from "@/features/api/instructorApi";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    message: '',
    courseId: 'all'
  });

  // Fetch real data
  const { data: studentsData, isLoading: studentsLoading, error: studentsError, refetch: refetchStudents } = useGetInstructorStudentsQuery();
  const { data: analyticsData, isLoading: analyticsLoading, refetch: refetchAnalytics } = useGetInstructorAnalyticsQuery();
  const { data: coursesData, refetch: refetchCourses } = useGetCreatorCourseQuery();
  
  // Send announcement mutation
  const [sendAnnouncement, { isLoading: isSending }] = useSendAnnouncementMutation();

  // Refresh all data
  const handleRefresh = () => {
    refetchStudents();
    refetchAnalytics();
    refetchCourses();
  };

  // Handle send announcement
  const handleSendAnnouncement = async () => {
    if (!announcementData.title.trim() || !announcementData.message.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    try {
      const result = await sendAnnouncement({
        title: announcementData.title,
        message: announcementData.message,
        courseId: announcementData.courseId === 'all' ? 'all' : announcementData.courseId
      }).unwrap();

      alert(`Announcement sent successfully to ${result.sentCount || 'all'} students!`);
      setIsAnnouncementOpen(false);
      setAnnouncementData({ title: '', message: '', courseId: 'all' });
    } catch (error) {
      console.error('Send announcement error:', error);
      alert(`Failed to send announcement: ${error?.data?.message || 'Please try again.'}`);
    }
  };

  if (studentsLoading || analyticsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading students data...</p>
        </div>
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Failed to load students</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please try refreshing the page</p>
          <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">Refresh</Button>
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
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Student Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Monitor and engage with your students</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2 flex-1 lg:flex-none"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          {/* Send Announcement Dialog */}
          <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 lg:flex-none">
                <Mail className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Send Announcement</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Announcement
                </DialogTitle>
                <DialogDescription>
                  Send an announcement to your students. You can target all students or specific course students.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input
                    id="announcement-title"
                    placeholder="Enter announcement title..."
                    value={announcementData.title}
                    onChange={(e) => setAnnouncementData(prev => ({ ...prev, title: e.target.value }))}
                    className="border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="announcement-course">Target Course</Label>
                  <Select 
                    value={announcementData.courseId} 
                    onValueChange={(value) => setAnnouncementData(prev => ({ ...prev, courseId: value }))}
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.courseTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="announcement-message">Message</Label>
                  <Textarea
                    id="announcement-message"
                    placeholder="Enter your announcement message..."
                    value={announcementData.message}
                    onChange={(e) => setAnnouncementData(prev => ({ ...prev, message: e.target.value }))}
                    className="min-h-[120px] border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAnnouncementOpen(false)}
                  disabled={isSending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendAnnouncement}
                  disabled={isSending || !announcementData.title.trim() || !announcementData.message.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Announcement
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</CardTitle>
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Across all courses</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Enrollments</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{activeToday}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(analytics.totalRevenue || 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">From {analytics.totalSales || 0} sales</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrollments</CardTitle>
            <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalEnrollments}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full sm:w-[200px] border-gray-300 dark:border-gray-600">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-3">Student</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-3">Enrolled Courses</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-3">Total Spent</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-3">Last Purchase</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-3 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow 
                      key={student.id}
                      className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                    >
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600">
                            <AvatarImage src={student.photoUrl} alt={student.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold">
                              {student.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 dark:text-white truncate">{student.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{student.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="space-y-2">
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
                                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                                >
                                  {course?.courseTitle || 'Unknown Course'}
                                </Badge>
                              );
                            })}
                            {student.enrolledCourses.length > 2 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                +{student.enrolledCourses.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(student.totalSpent)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {student.enrolledCourses.length} enrollments
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {getTimeAgo(student.lastPurchase)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {formatDate(student.lastPurchase)}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 px-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 px-3 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Message</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
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
