import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";
import fs from "fs";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async(req,res) => {
    try {
        const result = await uploadMedia(req.file.path);

        // Delete the local file after successful upload to Cloudinary
        await fs.promises.unlink(req.file.path);

        res.status(200).json({
            success:true,
            message:"File uploaded successfully.",
            data:result
        });
    } catch (error) {
        console.log(error);
        
        // Also delete the local file if there was an error uploading to Cloudinary
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting local file after upload error:', err);
                } else {
                    console.log('Local file cleaned up after error:', req.file.path);
                }
            });
        }
        
        res.status(500).json({message:"Error uploading file"})
    }
});
export default router;