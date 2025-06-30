import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"; 
import notificationReducer from "../features/notificationSlice";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { userApi } from "@/features/api/userApi";
import { adminApi } from "@/features/api/adminApi";
import { instructorApi } from "@/features/api/instructorApi";
import { notificationApi } from "@/features/api/notificationApi";

const rootReducer = combineReducers({
    [authApi.reducerPath]:authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer,
    [userApi.reducerPath]:userApi.reducer,
    [adminApi.reducerPath]:adminApi.reducer,
    [instructorApi.reducerPath]:instructorApi.reducer,
    [notificationApi.reducerPath]:notificationApi.reducer,
    auth:authReducer, 
    notification:notificationReducer,
});
export default rootReducer;