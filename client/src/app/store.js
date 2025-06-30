import {configureStore} from "@reduxjs/toolkit" 
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { userApi } from "@/features/api/userApi";
import { adminApi } from "@/features/api/adminApi";
import { instructorApi } from "@/features/api/instructorApi";
import { notificationApi } from "@/features/api/notificationApi";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware, userApi.middleware, adminApi.middleware, instructorApi.middleware, notificationApi.middleware)
});