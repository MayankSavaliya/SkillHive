import multer from "multer";

// const upload = multer({dest:"uploads/"});
// export default upload


const storage = multer.memoryStorage();
const upload = multer({ storage });
export default upload;