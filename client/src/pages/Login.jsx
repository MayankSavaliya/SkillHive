// McgPr7oX7v1mMcbN
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useFirebaseAuthMutation,
  useFirebaseSignupMutation,
} from "@/features/api/authApi";
import { Loader2, Eye, EyeOff, BookOpen, Users, Award, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/lib/toast";
import DarkMode from "@/DarkMode";
import { 
  signUpWithEmailPassword, 
  signInWithEmailPassword, 
  signInWithGoogle, 
  signInWithFacebook 
} from "@/services/authService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState({ login: false, signup: false });
  const [currentTab, setCurrentTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  const [firebaseAuth] = useFirebaseAuthMutation();
  const [firebaseSignup] = useFirebaseSignupMutation();
  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const togglePassword = (type) => {
    setShowPassword(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // Firebase Authentication Handlers
  const handleFirebaseAuth = async (authResult, isSignup = false) => {
    if (authResult.success) {
      try {
        const userData = {
          name: authResult.user.displayName || signupInput.name,
          email: authResult.user.email,
          photoUrl: authResult.user.photoURL
        };

        if (isSignup) {
          const response = await firebaseSignup({
            idToken: authResult.token,
            userData
          });
          
          if (response.data?.success) {
            showToast.success(response.data.message, {
              description: "Welcome to SkillHive! You can now start learning.",
              duration: 4000,
              showCancel: true,
            });
            setCurrentTab("login");
          }
        } else {
          const response = await firebaseAuth({
            idToken: authResult.token,
            userData
          });
          
          if (response.data?.success) {
            showToast.success(response.data.message, {
              description: "You have successfully signed in to SkillHive.",
              duration: 3000,
              showCancel: true,
            });
          }
        }
      } catch (error) {
        toast.error("Authentication failed", {
          description: error.data?.message || "Please try again.",
          duration: 4000,
        });
      }
    } else {
      toast.error("Authentication failed", {
        description: authResult.error || "Please try again.",
        duration: 4000,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      await handleFirebaseAuth(result, currentTab === "signup");
    } catch (error) {
      toast.error('Google sign-in error:');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithFacebook();
      await handleFirebaseAuth(result, currentTab === "signup");
    } catch (error) {
      toast.error('Facebook sign-in error:');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPasswordAuth = async (type) => {
    if (type === "signup") {
      // Validation
      if (!signupInput.name.trim()) {
        toast.error("Please enter your full name");
        return;
      }
      if (!signupInput.email.trim()) {
        toast.error("Please enter your email address");
        return;
      }
      if (!signupInput.password.trim()) {
        toast.error("Please create a password");
        return;
      }
      if (signupInput.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }

      setIsLoading(true);
      const result = await signUpWithEmailPassword(
        signupInput.email,
        signupInput.password,
        signupInput.name
      );

      if (result.success) {
        await firebaseSignup({
          idToken: result.token,
          userData: {
            name: signupInput.name,
            email: signupInput.email
          }
        });
      } else {
        toast.error(result.error);
      }
      setIsLoading(false);

    } else {
      // Login validation
      if (!loginInput.email.trim()) {
        toast.error("Please enter your email address");
        return;
      }
      if (!loginInput.password.trim()) {
        toast.error("Please enter your password");
        return;
      }

      setIsLoading(true);
      const result = await signInWithEmailPassword(loginInput.email, loginInput.password);

      if (result.success) {
        await firebaseAuth({
          idToken: result.token
        });
      } else {
        toast.error(result.error);
      }
      setIsLoading(false);
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    
    // Use Firebase authentication
    await handleEmailPasswordAuth(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="h-12 w-12" />
              SkillHive
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
              Transform your career with world-class online learning
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Join 50M+ Learners</h3>
                <p className="text-blue-100 text-lg">Learn from industry experts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Get Certified</h3>
                <p className="text-blue-100 text-lg">Earn certificates that matter</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Advance Your Career</h3>
                <p className="text-blue-100 text-lg">Skills that get you hired</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Theme toggle and mobile logo */}
          <div className="flex justify-between items-center mb-8">
            <div className="lg:hidden">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-7 w-7 text-blue-600" />
                SkillHive
              </h1>
            </div>
            <DarkMode />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 lg:p-10">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl h-12">
                <TabsTrigger 
                  value="login"
                  className="rounded-xl py-3 text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-xl py-3 text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>              <TabsContent value="login" className="mt-0">
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Welcome back</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Sign in to continue your learning journey</p>
                  </div>
                  
                  <form className="space-y-6">
                    <div>
                      <Label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Email address
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        name="email"
                        value={loginInput.email}
                        onChange={(e) => changeInputHandler(e, "login")}
                        placeholder="Enter your email"
                        required={true}
                        className="w-full px-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword.login ? "text" : "password"}
                          name="password"
                          value={loginInput.password}
                          onChange={(e) => changeInputHandler(e, "login")}
                          placeholder="Enter your password"
                          required={true}
                          className="w-full px-4 py-4 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword('login')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          {showPassword.login ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                        <label htmlFor="remember-me" className="ml-3 block text-base text-gray-700 dark:text-gray-300">
                          Remember me
                        </label>
                      </div>
                      <div className="text-base">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                          Forgot password?
                        </a>
                      </div>
                    </div>

                    <Button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleRegistration("login")}
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-4 px-4 rounded-xl transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>              <TabsContent value="signup" className="mt-0">
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Create your account</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Join millions of learners worldwide</p>
                  </div>
                  
                  <form className="space-y-6">
                    <div>
                      <Label htmlFor="signup-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Full name
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        name="name"
                        value={signupInput.name}
                        onChange={(e) => changeInputHandler(e, "signup")}
                        placeholder="Enter your full name"
                        required={true}
                        className="w-full px-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Email address
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        name="email"
                        value={signupInput.email}
                        onChange={(e) => changeInputHandler(e, "signup")}
                        placeholder="Enter your email"
                        required={true}
                        className="w-full px-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword.signup ? "text" : "password"}
                          name="password"
                          value={signupInput.password}
                          onChange={(e) => changeInputHandler(e, "signup")}
                          placeholder="Create a strong password"
                          required={true}
                          className="w-full px-4 py-4 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword('signup')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          {showPassword.signup ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-6">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div className="ml-3 text-base">
                        <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                          I agree to the{' '}
                          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>

                    <Button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleRegistration("signup")}
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-4 px-4 rounded-xl transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>            {/* Social Login */}
            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full inline-flex justify-center py-4 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <svg className="h-6 w-6" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="ml-3">Google</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleFacebookSignIn}
                  className="w-full inline-flex justify-center py-4 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="ml-3">Facebook</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
