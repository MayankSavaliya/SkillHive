import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  lectureTitle: {
    type: String,
    required: true,
  },
  videoUrl: { type: String },
  publicId: { type: String },
  isPreviewFree: { type: Boolean, default: false },
  description: {
    type: String,
    default: ""
  },
  duration: {
    type: String, // "5:30" format (minutes:seconds)
    default: "0:00"
  },
  lectureIndex: {
    type: Number,
    required: true,
    default: 1
  }
},{timestamps:true});

export const Lecture = mongoose.model("Lecture", lectureSchema);
