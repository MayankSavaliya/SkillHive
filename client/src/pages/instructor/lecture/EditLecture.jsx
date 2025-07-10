import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const params = useParams();
  const courseId = params.courseId;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={`/instructor/course/${courseId}/lecture`}>
              <Button 
                size="icon" 
                variant="outline" 
                className="rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 transition-colors duration-200"
              >
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit Lecture
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Update lecture content, video, and settings
              </p>
            </div>
          </div>
        </div>
        
        {/* Lecture Tab Content */}
        <LectureTab />
      </div>
    </div>
  );
};

export default EditLecture;
