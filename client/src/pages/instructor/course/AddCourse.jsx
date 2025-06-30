import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  // for displaying toast
  useEffect(()=>{
    if(isSuccess){
        toast.success(data?.message || "✅ Course created successfully!", {
          description: "Your new course has been added to the system.",
          duration: 3000,
        });
        navigate("/instructor/course");
    }
  },[isSuccess, error])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Course
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add some basic course details to get started. You can edit these later.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Course Title *
              </Label>
              <Input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g., Complete React Development Course"
                className="mt-1.5 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Category *
              </Label>
              <Select onValueChange={getSelectedCategory}>
                <SelectTrigger className="w-full mt-1.5 focus:ring-2 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Select a category for your course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="Web Development">🌐 Web Development</SelectItem>
                    <SelectItem value="Frontend Development">⚛️ Frontend Development</SelectItem>
                    <SelectItem value="Backend Development">🔧 Backend Development</SelectItem>
                    <SelectItem value="Full Stack Development">🚀 Full Stack Development</SelectItem>
                    <SelectItem value="Mobile Development">📱 Mobile Development</SelectItem>
                    <SelectItem value="Data Science">📊 Data Science</SelectItem>
                    <SelectItem value="Machine Learning">🤖 Machine Learning</SelectItem>
                    <SelectItem value="DevOps & Cloud">⚙️ DevOps & Cloud</SelectItem>
                    <SelectItem value="UI/UX Design">🎨 UI/UX Design</SelectItem>
                    <SelectItem value="Database Management">🗄️ Database Management</SelectItem>
                    <SelectItem value="Cybersecurity">🔒 Cybersecurity</SelectItem>
                    <SelectItem value="Programming Languages">💻 Programming Languages</SelectItem>
                    <SelectItem value="Business & Management">💼 Business & Management</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="outline" 
                onClick={() => navigate("/instructor/course")}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                disabled={isLoading || !courseTitle.trim() || !category} 
                onClick={createCourseHandler}
                className="bg-primary hover:bg-primary/90 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
