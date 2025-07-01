import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  User, 
  Mail, 
  Shield, 
  Edit, 
  BookOpen, 
  Camera,
  Upload,
  X,
  Check,
  Calendar,
  Award,
  TrendingUp,
  Activity
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import {
  useUpdateUserMutation,
  useRequestInstructorRoleMutation,
} from "@/features/api/authApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [tempPhoto, setTempPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isSuccess }] = useUpdateUserMutation();
  const [requestInstructorRole, { isLoading: isRequestingInstructor }] = useRequestInstructorRoleMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setProfilePhoto(user.photoUrl || user.photoURL || "");
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      setIsEditing(false);
      setTempPhoto(null);
      setPreviewUrl(null);
      toast.success(updateUserData.message || "Profile updated successfully!");
    }
  }, [isSuccess, updateUserData]);

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (tempPhoto) {
      formData.append("profilePhoto", tempPhoto);
    }

    setIsLoading(true);
    try {
      const result = await updateUser(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestInstructorRole = async () => {
    try {
      const result = await requestInstructorRole().unwrap();
      toast.success("Instructor role request sent successfully! We'll review your application soon.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to request instructor role");
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading profile...</p>
      </div>
    </div>
  );

  const userStats = [
    {
      id: "enrolled-courses",
      label: "Enrolled Courses",
      value: user.enrolledCourses?.length || 0,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
    },
    {
      id: "completed-courses",
      label: "Completed",
      value: Math.floor((user.enrolledCourses?.length || 0) * 0.6),
      icon: Award,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
    },
    {
      id: "in-progress-courses",
      label: "In Progress",
      value: Math.ceil((user.enrolledCourses?.length || 0) * 0.4),
      icon: TrendingUp,
      color: "from-orange-500 to-yellow-500",
      bgColor: "from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20"
    },
    {
      id: "learning-hours",
      label: "Learning Hours",
      value: Math.floor((user.enrolledCourses?.length || 0) * 12.5),
      icon: Activity,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/5 to-blue-400/5 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Enhanced Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-md backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 transition-all duration-300">
            <User className="h-4 w-4" />
            <span>Your Profile</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Manage your profile and account settings.
          </p>
        </div>

        {/* Enhanced Profile Card */}
        <div className="glass rounded-3xl p-6 lg:p-10 mb-12 shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:shadow-3xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Enhanced Avatar Section */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative group">
                <Avatar className="h-32 w-32 lg:h-40 lg:w-40 ring-4 ring-blue-200/50 dark:ring-blue-800/50 shadow-2xl transition-all duration-300 group-hover:ring-blue-300 dark:group-hover:ring-blue-700 group-hover:scale-105">
                  <AvatarImage
                    src={user?.photoUrl || user?.photoURL || "https://github.com/shadcn.png"}
                    alt={user.name}
                    className="object-cover"
                    onError={() => setIsImageError(true)}
                    onLoad={() => setIsImageError(false)}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl lg:text-3xl font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                {/* Floating camera icon */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{user.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Profile Info */}
            <div className="flex-1 w-full space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {userStats.map((stat) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={stat.id} className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-4 lg:p-6 border border-white/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-lg group`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                        </div>
                      </div>
                      <div className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-800/70">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Full Name</h3>
                  </div>
                  <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">{user.name}</p>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-800/70">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Email Address</h3>
                  </div>
                  <p className="text-xl text-gray-700 dark:text-gray-300 font-medium break-all">{user.email}</p>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-800/70">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Account Type</h3>
                  </div>
                  <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                    user.role === 'instructor' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      : user.role === 'admin'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-800/70">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Member Since</h3>
                  </div>
                  <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric' 
                    }) : 'Recently'}
                  </p>
                </div>
              </div>

              {/* Enhanced Edit Button */}
              <div className="flex justify-center lg:justify-start">
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                    >
                      <Edit className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-lg glass border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Edit className="h-6 w-6 text-blue-600" />
                        Edit Profile
                      </DialogTitle>
                      <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Update your profile information and photo. All changes will be saved automatically.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors duration-200"
                          required
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="photo" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Profile Photo
                        </Label>
                        
                        {/* Image Preview */}
                        {previewUrl && (
                          <div className="relative inline-block">
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600"
                            />
                            <button
                              onClick={() => {
                                setTempPhoto(null);
                                setPreviewUrl(null);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        
                        {/* Drag & Drop Area */}
                        <div
                          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                            photoLoading 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                          onDrop={(e) => {
                            e.preventDefault();
                            setPhotoLoading(false);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setPhotoLoading(true);
                          }}
                          onDragLeave={() => setPhotoLoading(false)}
                          onClick={() => {
                            if (user) {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = onChangeHandler;
                              input.click();
                            }
                          }}
                        >
                          <div className="space-y-3">
                            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                              <Upload className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Drop your image here or <span className="text-blue-600 hover:text-blue-700 cursor-pointer">browse</span>
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                PNG, JPG, JPEG up to 5MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button
                        disabled={isLoading}
                        onClick={updateUserHandler}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                            Updating Profile...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Become an Instructor Section */}
        {user.role === 'student' && (
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:shadow-3xl">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <User className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Become an Instructor
              </h3>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Share your knowledge and expertise with thousands of students worldwide. 
                Join our community of passionate educators and start teaching today!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Create Courses</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Build and publish your own courses</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Earn Revenue</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monetize your teaching skills</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Build Reputation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Establish yourself as an expert</p>
                </div>
              </div>
              
              <Button
                onClick={handleRequestInstructorRole}
                disabled={isRequestingInstructor}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequestingInstructor ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    Request Instructor Access
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
