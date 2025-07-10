import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DarkMode from "../DarkMode";
import { 
  Search, 
  Play, 
  Users, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Star, 
  ArrowRight,
  CheckCircle,
  Globe,
  Clock,
  Download,
  Shield,
  Zap,
  Target,
  Quote,
  Menu,
  X
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const Landing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim() !== ""){
      navigate(`/courses?search=${searchQuery}`)
    }
    setSearchQuery("");
  }

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "50M+ Learners",
      description: "Join millions of students learning worldwide",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "10K+ Courses",
      description: "Expert-designed courses across 2000+ topics",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Access",
      description: "Learn anytime, anywhere at your own pace",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Certified Learning",
      description: "Get industry-recognized certificates",
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
    }
  ];

  const categories = [
    { name: "Web Development", courses: "850+ courses", icon: "🌐" },
    { name: "Frontend Development", courses: "720+ courses", icon: "⚛️" },
    { name: "Backend Development", courses: "650+ courses", icon: "🔧" },
    { name: "Full Stack Development", courses: "580+ courses", icon: "🚀" },
    { name: "Mobile Development", courses: "450+ courses", icon: "📱" },
    { name: "Data Science", courses: "400+ courses", icon: "📊" },
    { name: "Machine Learning", courses: "350+ courses", icon: "🤖" },
    { name: "DevOps & Cloud", courses: "320+ courses", icon: "⚙️" },
    { name: "UI/UX Design", courses: "480+ courses", icon: "🎨" },
    { name: "Database Management", courses: "290+ courses", icon: "🗄️" },
    { name: "Cybersecurity", courses: "270+ courses", icon: "🔒" },
    { name: "Programming Languages", courses: "680+ courses", icon: "💻" },
    { name: "Business & Management", courses: "520+ courses", icon: "💼" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      content: "SkillHive helped me transition into tech. The courses are comprehensive and the instructors are world-class.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Data Scientist at Netflix",
      content: "The data science track on SkillHive gave me the skills I needed to land my dream job. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer at Spotify",
      content: "Amazing platform with practical projects. I learned more here than in my 4-year degree program.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Navigation Header */}
      <nav className="relative z-50 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">SkillHive</span>
          </div>          <div className="flex items-center gap-4">
            <DarkMode />
            <Button 
              variant="ghost" 
              onClick={() => navigate("/courses")}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Browse Courses
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-[size:20px_20px] opacity-20" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-40 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Star className="h-4 w-4" />
            #1 Online Learning Platform
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-slide-up">
            Learn Without
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Limits</span>
            <br />
            Achieve Your Dreams
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Master new skills, advance your career, and transform your life with courses from the world's best instructors.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8 animate-scale-in">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn today?"
                className="w-full pl-12 pr-32 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
            <Button 
              onClick={() => navigate("/login")} 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Learning Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch How It Works
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 dark:text-gray-400 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free courses available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SkillHive?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join millions of learners who trust us to advance their careers and achieve their goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover courses across various fields and start your learning journey today.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.courses}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Success Stories from Our Learners
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how SkillHive has transformed careers and lives around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of learners and take the first step toward achieving your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/login")}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>            <Button 
              onClick={() => navigate("/courses")}
              variant="outline"
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Browse Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 dark:bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">SkillHive</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering learners worldwide with quality education and expert instruction.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Learning</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/courses" className="hover:text-white transition-colors">All Courses</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Free Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Certificates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SkillHive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
