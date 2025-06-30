import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  Users, 
  Star,
  Bell,
  Eye,
  Shield,
  Download,
  Upload,
  Save,
  Edit3,
  RefreshCw,
  Award,
  Target,
  TestTube
} from "lucide-react";
import { 
  useGetInstructorProfileQuery, 
  useUpdateInstructorProfileMutation 
} from "@/features/api/instructorApi";
import { useCreateNotificationMutation } from "@/features/api/notificationApi";
import { toast } from "sonner";

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    twitter: '',
    expertise: '',
    experience: ''
  });

  // API hooks
  const { data: profileResponse, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useGetInstructorProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateInstructorProfileMutation();
  const [createNotification, { isLoading: creatingNotification }] = useCreateNotificationMutation();

  const profile = profileResponse?.profile;
  const stats = profile?.stats;

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        twitter: profile.twitter || '',
        expertise: profile.expertise || '',
        experience: profile.experience || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(profileData).unwrap();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      refetchProfile();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        twitter: profile.twitter || '',
        expertise: profile.expertise || '',
        experience: profile.experience || ''
      });
    }
    setIsEditing(false);
  };

  const testNotificationSystem = async () => {
    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/notification/test`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Test notification sent! Check your notification bell.");
    } catch (error) {
      toast.error("Failed to send test notification");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (profileLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Failed to load profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please try refreshing the page</p>
          <Button onClick={() => refetchProfile()}>Refresh</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your profile and account preferences</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchProfile()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updating}>
                <Save className="h-4 w-4 mr-2" />
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="test">Test System</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.photoUrl} alt={profile?.name} />
                    <AvatarFallback className="text-2xl">
                      {profile?.name?.charAt(0)?.toUpperCase() || 'I'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {profile?.name || 'Instructor'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">{profile?.email}</p>
                    <Badge variant="secondary" className="mt-2">
                      {profile?.role || 'Instructor'}
                    </Badge>
                  </div>

                  {!isEditing && (
                    <div className="grid grid-cols-2 gap-4 text-center text-sm">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{stats?.totalCourses || 0}</p>
                        <p className="text-gray-500">Courses</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{stats?.totalStudents || 0}</p>
                        <p className="text-gray-500">Students</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              {isEditing && (
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Profile Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Tell students about yourself..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Areas of Expertise</Label>
                  <Input
                    id="expertise"
                    value={profileData.expertise}
                    onChange={(e) => setProfileData({...profileData, expertise: e.target.value})}
                    disabled={!isEditing}
                    placeholder="e.g. Web Development, Data Science, UI/UX Design"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Social Links</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        disabled={!isEditing}
                        placeholder="https://your-website.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                        disabled={!isEditing}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue)}</div>
                <p className="text-xs text-gray-500">All time earnings</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
                <p className="text-xs text-gray-500">{stats?.publishedCourses || 0} published</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
                <p className="text-xs text-gray-500">Across all courses</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.avgRating || '4.6'}</div>
                <p className="text-xs text-gray-500">Student reviews</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-gray-500">{formatDate(stats?.joinedDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Account Status</p>
                    <Badge variant="default">Active Instructor</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New student enrollments</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Student messages</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Course reviews</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment notifications</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System announcements</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Password</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Your password is managed through Firebase Authentication
                    </p>
                    <Button variant="outline">
                      Change Password
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Account Data</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Download or delete your account data
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Test System Tab */}
        <TabsContent value="test" className="space-y-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Test Notification System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Test the notification system to ensure it's working properly. This will send a test notification to your account.
                  </p>
                  
                  <Button 
                    onClick={testNotificationSystem}
                    disabled={creatingNotification}
                    className="w-full sm:w-auto"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {creatingNotification ? 'Sending...' : 'Send Test Notification'}
                  </Button>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How to test:</h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>1. Click the "Send Test Notification" button above</li>
                      <li>2. Check the notification bell icon in the top navigation</li>
                      <li>3. You should see a red badge with the notification count</li>
                      <li>4. Click the bell to view the test notification</li>
                      <li>5. Check if real-time updates work by opening multiple tabs</li>
                    </ol>
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

export default Settings; 