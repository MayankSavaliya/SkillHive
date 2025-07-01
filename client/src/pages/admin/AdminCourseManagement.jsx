import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  useGetAllCoursesQuery, 
  useToggleCourseStatusMutation, 
  useDeleteCourseMutation 
} from "@/features/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Trash2, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  User,
  Tag,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { showToast } from "@/lib/toast";

const AdminCourseManagement = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: coursesData, isLoading, error, refetch } = useGetAllCoursesQuery({
    page,
    limit: 10,
    search,
    category: categoryFilter,
    status: statusFilter
  });

  const [toggleCourseStatus, { isLoading: isTogglingStatus }] = useToggleCourseStatusMutation();
  const [deleteCourse, { isLoading: isDeletingCourse }] = useDeleteCourseMutation();

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryFilter = (value) => {
    setCategoryFilter(value);
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleToggleStatus = async (courseId) => {
    try {
      await toggleCourseStatus(courseId).unwrap();
              showToast.success("Course status updated successfully", { showCancel: true });
      refetch();
    } catch (error) {
              showToast.error(error?.data?.message || "Failed to update course status", { showCancel: true });
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      await deleteCourse(selectedCourse._id).unwrap();
              showToast.success("Course deleted successfully", { showCancel: true });
      setShowDeleteDialog(false);
      setSelectedCourse(null);
      refetch();
    } catch (error) {
              showToast.error(error?.data?.message || "Failed to delete course", { showCancel: true });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (isPublished) => {
    return isPublished ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <Eye className="w-3 h-3 mr-1" />
        Published
      </Badge>
    ) : (
      <Badge variant="secondary">
        <EyeOff className="w-3 h-3 mr-1" />
        Draft
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          Error loading courses: {error?.data?.message || "Something went wrong"}
        </div>
      </div>
    );
  }

  const { courses = [], pagination = {} } = coursesData || {};

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Course Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all courses on the platform
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 flex items-center gap-1 self-start sm:self-center">
          <BookOpen className="w-4 h-4" />
          {pagination.totalCourses || 0} Total Courses
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Search & Filter Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                <SelectItem value="Backend Development">Backend Development</SelectItem>
                <SelectItem value="Full Stack Development">Full Stack Development</SelectItem>
                <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                <SelectItem value="DevOps & Cloud">DevOps & Cloud</SelectItem>
                <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                <SelectItem value="Database Management">Database Management</SelectItem>
                <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                <SelectItem value="Programming Languages">Programming Languages</SelectItem>
                <SelectItem value="Business & Management">Business & Management</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Courses ({pagination.totalCourses || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No courses found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              {course.courseThumbnail ? (
                                <img 
                                  src={course.courseThumbnail} 
                                  alt={course.courseTitle}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <BookOpen className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium max-w-[200px] truncate">
                                {course.courseTitle}
                              </div>
                              {course.subTitle && (
                                <div className="text-sm text-gray-500 max-w-[200px] truncate">
                                  {course.subTitle}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                              {course.creator?.name?.charAt(0)?.toUpperCase() || 'I'}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{course.creator?.name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">{course.creator?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Tag className="w-3 h-3 mr-1" />
                            {course.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                            <span className="font-medium">
                              {formatCurrency(course.coursePrice)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-blue-600 mr-1" />
                            <span>{course.enrolledStudents?.length || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(course.isPublished)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(course.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link to={`/admin/courses/${course._id}/details`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(course._id)}
                              disabled={isTogglingStatus}
                              className={course.isPublished ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                            >
                              {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowDeleteDialog(true);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.currentPage - 1) * 10) + 1} to{' '}
                    {Math.min(pagination.currentPage * 10, pagination.totalCourses)} of{' '}
                    {pagination.totalCourses} courses
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPrevPage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Course Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Course
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCourse?.courseTitle}"? This action cannot be undone and will remove all associated lectures and student progress.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCourse}
              disabled={isDeletingCourse}
            >
              {isDeletingCourse ? "Deleting..." : "Delete Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseManagement;
