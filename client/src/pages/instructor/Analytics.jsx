import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Download,
  Calendar,
  Target,
  Award,
  DollarSign,
  RefreshCw,
  BookOpen
} from "lucide-react";
import { 
  useGetInstructorAnalyticsQuery, 
  useGetInstructorRevenueQuery,
  useGetCoursePerformanceQuery 
} from "@/features/api/instructorApi";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6months');

  // Fetch real data
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError, refetch: refetchAnalytics } = useGetInstructorAnalyticsQuery();
  const { data: revenueData, isLoading: revenueLoading, refetch: refetchRevenue } = useGetInstructorRevenueQuery(timeRange);
  const { data: performanceData, isLoading: performanceLoading, refetch: refetchPerformance } = useGetCoursePerformanceQuery();
  const { data: coursesData, refetch: refetchCourses } = useGetCreatorCourseQuery();

  // Refresh all data
  const handleRefresh = () => {
    refetchAnalytics();
    refetchRevenue();
    refetchPerformance();
    refetchCourses();
  };

  if (analyticsLoading || revenueLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Failed to load analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please try refreshing the page</p>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>
      </div>
    );
  }

  const analytics = analyticsData?.analytics || {};
  const courses = coursesData?.courses || [];
  const revenueChartData = revenueData?.revenueData || [];
  const coursePerformance = performanceData?.coursePerformance || [];
  const categoryData = performanceData?.categoryData || [];

  // Prepare course performance data for table
  const coursePerformanceData = courses.map(course => {
    const performanceStats = coursePerformance.find(p => p.courseId === course._id) || {};
    return {
      course: course.courseTitle,
      students: performanceStats.enrollments || 0,
      completion: performanceStats.completionRate || 67, // Mock completion rate
      rating: performanceStats.avgRating || 4.6, // Mock rating
      revenue: performanceStats.revenue || (course.coursePrice * (performanceStats.enrollments || 0)),
      category: course.category,
      isPublished: course.isPublished
    };
  });

  // Device distribution (mock data - can be enhanced with real tracking)
  const deviceData = [
    { name: 'Desktop', value: 65, color: '#8884d8' },
    { name: 'Mobile', value: 25, color: '#82ca9d' },
    { name: 'Tablet', value: 10, color: '#ffc658' }
  ];

  // Time spent data (mock data - can be enhanced with real tracking)
  const timeSpentData = [
    { hour: '9 AM', minutes: 45 },
    { hour: '10 AM', minutes: 78 },
    { hour: '11 AM', minutes: 92 },
    { hour: '12 PM', minutes: 125 },
    { hour: '1 PM', minutes: 98 },
    { hour: '2 PM', minutes: 156 },
    { hour: '3 PM', minutes: 134 },
    { hour: '4 PM', minutes: 187 },
    { hour: '5 PM', minutes: 234 },
    { hour: '6 PM', minutes: 198 },
    { hour: '7 PM', minutes: 276 },
    { hour: '8 PM', minutes: 321 }
  ];

  // Category performance for pie chart
  const categoryChartData = categoryData.map((item, index) => ({
    name: item.category,
    value: item.revenue,
    count: item.courses,
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'][index % 6]
  }));

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300">Detailed insights into your course performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(analytics.totalRevenue || 0)}
            </div>
            <p className="text-xs text-green-600">
              {analytics.revenueGrowth > 0 ? '+' : ''}{analytics.revenueGrowth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(analytics.totalStudents || 0)}
            </div>
            <p className="text-xs text-blue-600">Across {analytics.publishedCourses || 0} courses</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Rating</CardTitle>
            <Award className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.avgRating || '4.6'}
            </div>
            <p className="text-xs text-yellow-600">Based on student feedback</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.publishedCourses || 0}
            </div>
            <p className="text-xs text-purple-600">
              {analytics.totalCourses - analytics.publishedCourses || 0} in draft
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Revenue Trends */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatPrice(value), 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({name, value}) => `${name}: ${formatPrice(value)}`}
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatPrice(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Device Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Daily Learning Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSpentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} min`, 'Watch Time']} />
                <Bar dataKey="minutes" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Course Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Course</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Students</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Status</th>
                </tr>
              </thead>
              <tbody>
                {coursePerformanceData.map((course, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{course.course}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{course.category}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{course.students}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-900 dark:text-white">{course.rating}</span>
                        <Award className="h-4 w-4 text-yellow-500" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {formatPrice(course.revenue)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={course.isPublished ? "default" : "secondary"}
                        className={course.isPublished 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                        }
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
