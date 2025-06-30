import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit, BookOpen, Plus, TrendingUp, Users, Eye } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const {data, isLoading, error} = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if(isLoading) return (
    <div className="p-6 flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your courses...</p>
      </div>
    </div>
  )

  if(error) return (
    <div className="p-6 flex items-center justify-center h-96">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 dark:text-red-400 text-lg mb-4">Failed to load courses</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    </div>
  )

  const courses = data?.courses || [];
  const publishedCourses = courses.filter(course => course.isPublished);
  const draftCourses = courses.filter(course => !course.isPublished);

  // If no courses exist, show welcome screen
  if (courses.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Your Teaching Journey!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              You haven't created any courses yet. Start sharing your knowledge with students around the world by creating your first course.
            </p>
            <Button 
              onClick={() => navigate('create')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Course
            </Button>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="p-6 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Courses</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
              Manage your course content and track performance
            </p>
          </div>
          <Button 
            onClick={() => navigate('create')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {publishedCourses.length} published, {draftCourses.length} drafts
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Published Courses
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{publishedCourses.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Live and available to students
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Draft Courses
              </CardTitle>
              <Edit className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{draftCourses.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                In development
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Table */}
        <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Course Management</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              View and manage all your courses in one place
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100 pl-6">Course</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Price</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Lectures</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900 dark:text-gray-100 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow 
                    key={course._id}
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                            {course.courseTitle}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {course.category || 'No category'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={course.isPublished ? "default" : "secondary"}
                        className={course.isPublished 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800" 
                          : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                        }
                      >
                        {course.isPublished ? "✅ Published" : "📝 Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {course?.coursePrice ? `₹${course.coursePrice.toLocaleString()}` : "Free"}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {course.lectures?.length || 0} lectures
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => navigate(`${course._id}`)}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {course.isPublished && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => navigate(`view/${course._id}`)}
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseTable;
