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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showToast } from "@/lib/toast";
import { API_ENDPOINTS } from "@/config/api";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("0:00");
  const [lectureIndex, setLectureIndex] = useState(1);
  const params = useParams();
  const { courseId, lectureId } = params;

  const {data:lectureData} = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(()=>{
    if(lecture){
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setDescription(lecture.description || "");
      setDuration(lecture.duration || "0:00");
      setLectureIndex(lecture.lectureIndex || 1);
      // Check if lecture has videoUrl and publicId
      if(lecture.videoUrl && lecture.publicId){
        setVideoInfo({
          videoUrl: lecture.videoUrl,
          publicId: lecture.publicId
        });
      }
    }
  },[lecture]);

  const [edtiLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();
    const [removeLecture,{data:removeData, isLoading:removeLoading, isSuccess:removeSuccess}] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${API_ENDPOINTS.MEDIA}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
  
          setVideoInfo({
            videoUrl: res.data.data.secure_url || res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          showToast.success(res.data.message || "🎥 Video uploaded successfully!", {
            description: "Your lecture video is ready to be added to the course.",
            duration: 3000,
          });
        }
      } catch (error) {
        console.log(error);
        showToast.error("❌ Video upload failed", {
          description: "Please check your internet connection and try again.",
          duration: 4000,
        });
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    const lectureData = { 
      lectureTitle, 
      videoInfo, 
      isFree: isFree, 
      description,
      duration,
      lectureIndex,
      courseId, 
      lectureId 
    };
    
    const response = await edtiLecture(lectureData);
    if (response.data) {
              showToast.success(response.data.message);
    }
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  }

  useEffect(() => {
    if (isSuccess) {
      showToast.success(data.message || "✅ Lecture updated successfully!", {
        description: "Your lecture changes have been saved.",
        duration: 3000,
      });
    }
    if (error) {
      showToast.error("❌ " + (error.data.message || "Failed to update lecture"), {
        description: "Please check your information and try again.",
        duration: 4000,
      });
    }
  }, [isSuccess, error]);

  useEffect(()=>{
    if(removeSuccess){
      showToast.success(removeData.message || "🗑️ Lecture deleted successfully!", {
        description: "The lecture has been removed from your course.",
        duration: 3000,
      });
    }
  },[removeSuccess])

  return (
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              Edit Lecture Content
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Update lecture details, upload video content, and manage settings.
            </CardDescription>
          </div>
          <Button 
            disabled={removeLoading} 
            variant="destructive" 
            onClick={removeLectureHandler}
            className="min-w-[140px] shrink-0"
          >
            {removeLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Deleting...
              </>
            ) : (
              "🗑️ Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 overflow-x-hidden">
        <div className="space-y-8">
          {/* Lecture Title */}
          <div>
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Lecture Title *
            </Label>
            <Input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              type="text"
              placeholder="e.g., Introduction to JavaScript Fundamentals"
              className="mt-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Lecture Description */}
          <div>
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Lecture Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what students will learn in this lecture..."
              className="mt-1.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Duration and Lecture Index */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Duration (mm:ss)
              </Label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                type="text"
                placeholder="10:30"
                pattern="[0-9]+:[0-9]{2}"
                className="mt-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Format: minutes:seconds (e.g., 10:30 for 10 minutes 30 seconds)
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Lecture Order
              </Label>
              <Input
                value={lectureIndex}
                onChange={(e) => setLectureIndex(Number(e.target.value))}
                type="number"
                min="1"
                placeholder="1"
                className="mt-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Order in which this lecture appears in the course
              </p>
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Lecture Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="file"
              accept="video/*"
              onChange={fileChangeHandler}
              className="mt-1.5 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supported formats: MP4, MOV, AVI. Maximum file size: 500MB
            </p>
          </div>

          {/* Free Preview Toggle */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Switch 
              checked={isFree} 
              onCheckedChange={setIsFree} 
              id="preview-mode" 
              className="data-[state=checked]:bg-green-500"
            />
            <div className="min-w-0 flex-1">
              <Label htmlFor="preview-mode" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                Free Preview
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Allow students to watch this lecture without purchasing the course
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {mediaProgress && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Label className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2 block">
                📤 Uploading Video...
              </Label>
              <Progress value={uploadProgress} className="mb-2" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {uploadProgress}% uploaded - Please don't close this page
              </p>
            </div>
          )}

          {/* Video Preview */}
          {videoInfo?.videoUrl && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Label className="text-sm font-medium text-green-900 dark:text-green-300 mb-3 block">
                ✅ Video Preview
              </Label>
              <div className="w-full max-w-2xl">
                <video 
                  src={videoInfo.videoUrl} 
                  controls 
                  className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                  preload="metadata"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              disabled={isLoading || !lectureTitle.trim()} 
              onClick={editLectureHandler}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
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

export default LectureTab;
