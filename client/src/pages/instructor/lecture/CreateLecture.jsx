import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2, BookOpen } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "@/lib/toast";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideInfo, setUploadVideInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    const lectureData = {
      lectureTitle,
      videoInfo: uploadVideInfo,
      isPreviewFree: isFree,
      courseId,
    };
    
    const response = await createLecture(lectureData);
    if (response.data) {
              showToast.success(response.data.message);
      // Reset form
      setLectureTitle("");
      setUploadVideInfo(null);
      setIsFree(false);
      navigate(`/instructor/course/${courseId}`);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      showToast.success(data.message || "📚 Lecture created successfully!", {
        description: "Your new lecture has been added to the course.",
        duration: 3000,
      });
    }
    if (error) {
      showToast.error("❌ " + (error.data.message || "Failed to create lecture"), {
        description: "Please check your information and try again.",
        duration: 4000,
      });
    }
  }, [isSuccess, error]);

  console.log(lectureData);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Course Lectures
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add and organize lectures for your course. Each lecture should have a clear, descriptive title.
          </p>
        </div>

        {/* Create Lecture Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Add New Lecture
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Lecture Title *
              </Label>
              <Input
                type="text"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                placeholder="e.g., Introduction to React Components"
                className="mt-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => navigate(`/instructor/course/${courseId}`)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                ← Back to Course
              </Button>
              <Button 
                disabled={isLoading || !lectureTitle.trim()} 
                onClick={createLectureHandler}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "✨ Create Lecture"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Existing Lectures */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Course Lectures
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {lectureLoading ? "Loading..." : 
               lectureError ? "Failed to load lectures" :
               lectureData?.lectures?.length === 0 ? "No lectures added yet" :
               `${lectureData?.lectures?.length} lecture(s) in this course`}
            </p>
          </div>
          
          <div className="p-6">
            {lectureLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading lectures...</p>
                </div>
              </div>
            ) : lectureError ? (
              <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400">Failed to load lectures. Please try again.</p>
              </div>
            ) : lectureData?.lectures?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No lectures available</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">Create your first lecture to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lectureData.lectures.map((lecture, index) => (
                  <Lecture
                    key={lecture._id}
                    lecture={lecture}
                    courseId={courseId}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
