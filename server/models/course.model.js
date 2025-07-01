import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:true
    },
    subTitle: {type:String}, 
    description:{ type:String},
    category:{
        type:String,
        required:true
    },
    courseLevel:{
        type:String,
        enum:["Beginner", "Medium", "Advance"]
    },
    coursePrice:{
        type:Number
    },
    originalPrice: {
        type: Number
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    courseThumbnail:{
        type:String
    },
    enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    lectures:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    whatYouWillLearn: {
        type: [String],
        default: []
    },
    requirements: {
        type: [String],
        default: []
    },
    language: {
        type: String,
        default: 'English'
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    }

}, {timestamps:true});

export const Course = mongoose.model("Course", courseSchema);