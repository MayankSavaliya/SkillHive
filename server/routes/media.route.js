import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";
import fs from "fs";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async(req,res) => {
        try {
            // const result = await uploadMedia(req.file.path);
            const result = await uploadMedia(req.file.buffer);
            return res.status(200).json({
                success: true,
                url: result.secure_url
            });
        } catch (error) {
            // Delete the uploaded file if there's an error
            if (req.file) {
                fs.unlink(req.file.path, () => {});
            }
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Failed to upload file"
            });
        }
});
export default router;