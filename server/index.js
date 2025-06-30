import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import instructorRoute from "./routes/instructor.route.js";
import notificationRoute from "./routes/notification.route.js";
import { initializeFirebase } from "./config/firebase.js";
import socketManager from "./utils/socketManager.js";

dotenv.config({});

// Initialize Firebase
initializeFirebase();

// call database connection here
connectDB();
const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 8080;

// Initialize Socket.io
socketManager.initialize(server);

// default middleware
app.use(express.json());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
 
// apis
app.get("/", (req, res)=> {
    res.send("SkillHive Server is running");
});
app.use("/media", mediaRoute);
app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/purchase", purchaseRoute);
app.use("/progress", courseProgressRoute);
app.use("/instructor", instructorRoute);
app.use("/notification", notificationRoute);
 
 
server.listen(PORT, () => {
    console.log(`Server listen at port ${PORT}`);
    console.log(`Socket.io server is ready for connections`);
})


