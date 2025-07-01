import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
    whatYouWillLearn: "",
    requirements: "",
    language: "English",
  });

  const params = useParams();
  const courseId = params.courseId;
  const { data: courseByIdData, isLoading: courseByIdLoading , refetch} =
    useGetCourseByIdQuery(courseId);

    const [publishCourse, { isLoading: isPublishing }] = usePublishCourseMutation();
 
  useEffect(() => {
    if (courseByIdData?.course) { 
        const course = courseByIdData?.course;
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
        whatYouWillLearn: course.whatYouWillLearn?.join('\n') || "",
        requirements: course.requirements?.join('\n') || "",
        language: course.language || "English",
      });
    }
  }, [courseByIdData]);

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };
  const selectLanguage = (value) => {
    setInput({ ...input, language: value });
  };
  // get file
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);
    formData.append("whatYouWillLearn", JSON.stringify(input.whatYouWillLearn.split('\n').filter(item => item.trim())));
    formData.append("requirements", JSON.stringify(input.requirements.split('\n').filter(item => item.trim())));
    formData.append("language", input.language);

    await editCourse({ formData, courseId });
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response.data) {
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update course status");
    }
  };

  // Helper function to check if course is ready for publishing
  const isCourseReadyForPublishing = () => {
    if (!courseByIdData?.course) return false;
    const course = courseByIdData.course;
    return course.courseTitle && course.subTitle && course.description && 
           course.category && course.courseLevel && course.coursePrice && 
           course.lectures.length > 0;
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "✅ Course updated successfully!", {
        description: "Your course changes have been saved.",
        duration: 3000,
      });
    }
    if (error) {
      toast.error("❌ " + (error.data.message || "Failed to update course"), {
        description: "Please check your information and try again.",
        duration: 4000,
      });
    }
  }, [isSuccess, error]);

  if(courseByIdLoading) return <h1>Loading...</h1>
 
  return (
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              Course Information
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Update your course details and settings. All fields marked with * are required.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              disabled={courseByIdLoading || !courseByIdData?.course || isPublishing || (!courseByIdData?.course.isPublished && !isCourseReadyForPublishing())} 
              variant={courseByIdData?.course.isPublished ? "destructive" : "default"}
              onClick={()=> publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}
              title={!courseByIdData?.course.isPublished && !isCourseReadyForPublishing() ? "Complete all required fields and add lectures to publish" : ""}
              className="min-w-[120px]"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {courseByIdData?.course.isPublished ? "Unpublishing..." : "Publishing..."}
                </>
              ) : courseByIdLoading ? "Loading..." : courseByIdData?.course.isPublished ? "📢 Unpublish" : "🚀 Publish"}
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 hover:border-red-300"
            >
              🗑️ Remove Course
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6 lg:gap-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Basic Information
            </h3>
            
            <div className="grid gap-4 lg:gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Course Title *
                </Label>
                <Input
                  type="text"
                  name="courseTitle"
                  value={input.courseTitle}
                  onChange={changeEventHandler}
                  placeholder="e.g., Complete Full Stack Development Course"
                  className="mt-1.5 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Course Subtitle *
                </Label>
                <Input
                  type="text"
                  name="subTitle"
                  value={input.subTitle}
                  onChange={changeEventHandler}
                  placeholder="e.g., Master modern web development from beginner to expert level"
                  className="mt-1.5 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Course Description *
                </Label>
                <div className="mt-1.5">
                  <RichTextEditor input={input} setInput={setInput} />
                </div>
              </div>
            </div>
          </div>

          {/* Course Settings Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Course Settings
            </h3>
            
            <div className="grid gap-4 lg:grid-cols-4 lg:gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Category *
                </Label>
                <Select
                  defaultValue={input.category}
                  onValueChange={selectCategory}
                >
                  <SelectTrigger className="mt-1.5 focus:ring-2 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Course Categories</SelectLabel>
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
              
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Difficulty Level *
                </Label>
                <Select
                  defaultValue={input.courseLevel}
                  onValueChange={selectCourseLevel}
                >
                  <SelectTrigger className="mt-1.5 focus:ring-2 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Difficulty Level</SelectLabel>
                      <SelectItem value="Beginner">🟢 Beginner</SelectItem>
                      <SelectItem value="Medium">🟡 Intermediate</SelectItem>
                      <SelectItem value="Advance">🔴 Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Language
                </Label>
                <Select
                  defaultValue={input.language}
                  onValueChange={selectLanguage}
                >
                  <SelectTrigger className="mt-1.5 focus:ring-2 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Course Language</SelectLabel>
                      <SelectItem value="English">🇺🇸 English</SelectItem>
                      <SelectItem value="Spanish">🇪🇸 Spanish</SelectItem>
                      <SelectItem value="French">🇫🇷 French</SelectItem>
                      <SelectItem value="German">🇩🇪 German</SelectItem>
                      <SelectItem value="Portuguese">🇵🇹 Portuguese</SelectItem>
                      <SelectItem value="Italian">🇮🇹 Italian</SelectItem>
                      <SelectItem value="Russian">🇷🇺 Russian</SelectItem>
                      <SelectItem value="Chinese">🇨🇳 Chinese</SelectItem>
                      <SelectItem value="Japanese">🇯🇵 Japanese</SelectItem>
                      <SelectItem value="Korean">🇰🇷 Korean</SelectItem>
                      <SelectItem value="Hindi">🇮🇳 Hindi</SelectItem>
                      <SelectItem value="Arabic">🇸🇦 Arabic</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Price (₹) *
                </Label>
                <Input
                  type="number"
                  name="coursePrice"
                  value={input.coursePrice}
                  onChange={changeEventHandler}
                  placeholder="0"
                  min="0"
                  className="mt-1.5 focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Set to 0 for free course</p>
              </div>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Course Content Details
            </h3>
            
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  What You'll Learn
                </Label>
                <Textarea
                  name="whatYouWillLearn"
                  value={input.whatYouWillLearn}
                  onChange={changeEventHandler}
                  placeholder="Enter learning outcomes (one per line)&#10;• Master React fundamentals&#10;• Build full-stack applications&#10;• Deploy to production"
                  className="mt-1.5 min-h-[120px] focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter each learning outcome on a new line
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Requirements
                </Label>
                <Textarea
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  placeholder="Enter course requirements (one per line)&#10;• Basic JavaScript knowledge&#10;• Computer with internet access&#10;• Willingness to learn"
                  className="mt-1.5 min-h-[120px] focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter each requirement on a new line
                </p>
              </div>
            </div>
          </div>

          {/* Course Media Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Course Media
            </h3>
            
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Course Thumbnail
              </Label>
              <Input
                type="file"
                onChange={selectThumbnail}
                accept="image/*"
                className="mt-1.5 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 1280x720px, JPG or PNG format
              </p>
              {previewThumbnail && (
                <div className="mt-4">
                  <img
                    src={previewThumbnail}
                    className="w-64 h-36 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                    alt="Course Thumbnail Preview"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              onClick={() => navigate("/instructor/course")} 
              variant="outline"
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              ← Back to Courses
            </Button>
            <Button 
              disabled={isLoading} 
              onClick={updateCourseHandler}
              className="bg-primary hover:bg-primary/90 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "💾 Save Changes"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
