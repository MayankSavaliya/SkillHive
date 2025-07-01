import React from "react";
import { Link } from "react-router-dom";
import { 
  useGetUserStatsQuery, 
  useGetCourseStatsQuery,
  useGetEnrollmentAnalyticsQuery,
  useGetRevenueAnalyticsQuery 
} from "@/features/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  GraduationCap, 
  Shield, 
  UserCheck,
  Eye,
  FileText,
  Star,
  BarChart3,
  Activity,
  ArrowRight
} from "lucide-react";

const AdminDashboard = () => {
  const { data: userStats, isLoading: userStatsLoading } = useGetUserStatsQuery();
  const { data: courseStats, isLoading: courseStatsLoading } = useGetCourseStatsQuery();
  const { data: enrollmentData, isLoading: enrollmentLoading } = useGetEnrollmentAnalyticsQuery();
  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueAnalyticsQuery({ period: '30d' });

  if (userStatsLoading || courseStatsLoading || enrollmentLoading || revenueLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <Badge variant="secondary" className="px-3 py-1">
          <Shield className="w-4 h-4 mr-1" />
          Administrator
        </Badge>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active platform users
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {userStats?.stats?.students || 0}
            </div>
            <Progress 
              value={userStats?.stats?.totalUsers ? (userStats?.stats?.students / userStats?.stats?.totalUsers) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userStats?.stats?.instructors || 0}
            </div>
            <Progress 
              value={userStats?.stats?.totalUsers ? (userStats?.stats?.instructors / userStats?.stats?.totalUsers) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {userStats?.stats?.admins || 0}
            </div>
            <Progress 
              value={userStats?.stats?.totalUsers ? (userStats?.stats?.admins / userStats?.stats?.totalUsers) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseStats?.stats?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">
              All courses on platform
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {courseStats?.stats?.publishedCourses || 0}
            </div>
            <Progress 
              value={courseStats?.stats?.totalCourses ? (courseStats?.stats?.publishedCourses / courseStats?.stats?.totalCourses) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Courses</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {courseStats?.stats?.draftCourses || 0}
            </div>
            <Progress 
              value={courseStats?.stats?.totalCourses ? (courseStats?.stats?.draftCourses / courseStats?.stats?.totalCourses) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(revenueData?.analytics?.totalRevenue || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment and Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Enrollment Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Completed Enrollments</span>
              <span className="text-2xl font-bold">{enrollmentData?.analytics?.totalEnrollments || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Course Price</span>
              <span className="text-lg font-semibold">
                {formatCurrency(courseStats?.stats?.averagePrice || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Top Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courseStats?.stats?.topCategories?.map((category, index) => (
                <div key={category._id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm font-medium">
                      {category._id || 'Uncategorized'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {category.count} courses
                    </span>
                    <Progress 
                      value={courseStats?.stats?.totalCourses ? (category.count / courseStats?.stats?.totalCourses) * 100 : 0} 
                      className="w-16"
                    />
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">
                  No categories data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Platform Analytics
              </span>
              <Link to="/admin/analytics">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">Total Enrollments</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {(courseStats?.stats?.totalEnrollments || 0) }
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium">Platform Revenue</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency((courseStats?.stats?.totalRevenue || 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Recent Activity
              </span>
              <Link to="/admin/analytics">
                <Button variant="ghost" size="sm">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">New course published today</span>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">5 new student registrations</span>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">3 course enrollments today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/users">
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Manage Users</h3>
                <p className="text-sm text-muted-foreground">View and manage all platform users</p>
              </div>
            </Link>
            <Link to="/admin/courses">
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Manage Courses</h3>
                <p className="text-sm text-muted-foreground">Review and moderate course content</p>
              </div>
            </Link>
            <Link to="/admin/analytics">
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">View detailed platform analytics</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
