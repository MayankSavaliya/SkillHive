import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
}; 

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
    },
    userLoggedOut:(state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
    },
    updateToken: (state, action) => {
        state.token = action.payload;
    }
  },
});

export const {userLoggedIn, userLoggedOut, updateToken} = authSlice.actions;
export default authSlice.reducer;
