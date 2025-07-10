import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

const EditCourse = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Course Details
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Update your course information and manage content
            </p>
          </div>
          <Link to="lecture">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              📚 Manage Lectures
            </Button>
          </Link>
        </div>
        
        {/* Course Tab Content */}
        <CourseTab/>
      </div>
    </div>
  );
};

export default EditCourse;
