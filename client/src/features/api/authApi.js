import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
import { auth } from "@/config/firebase";

const USER_API = "http://localhost:8080/user/"
// const USER_API = "https://skillhive-backend.vercel.app/user/";

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:'include',
        prepareHeaders: async (headers) => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const token = await user.getIdToken();
                    headers.set('Authorization', `Bearer ${token}`);
                }
            } catch (error) {
                console.error('Error getting Firebase token:', error);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        loadUser: builder.query({
            query: () => ({
                url:"profile",
                method:"GET"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url:"profile/update",
                method:"PUT",
                body:formData,
                credentials:"include"
            })
        }),
        requestInstructorRole: builder.mutation({
            query: () => ({
                url:"request-instructor",
                method:"PUT"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        // Firebase authentication endpoints
        firebaseAuth: builder.mutation({
            query: (authData) => ({
                url:"auth/firebase",
                method:"POST",
                body:authData
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        firebaseSignup: builder.mutation({
            query: (signupData) => ({
                url:"auth/firebase/signup",
                method:"POST",
                body:signupData
            })
        }),
        firebaseLogout: builder.mutation({
            query: () => ({
                url:"auth/firebase/logout",
                method:"POST"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try { 
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            }
        })
    })
});

export const {
    useLoadUserQuery,
    useUpdateUserMutation,
    useRequestInstructorRoleMutation,
    useFirebaseAuthMutation,
    useFirebaseSignupMutation,
    useFirebaseLogoutMutation
} = authApi;
