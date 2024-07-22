import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: {},
    isAuthenticated: false,
    error: null,
    message: null,
    isUpdated: false,
  },
  reducers: {
    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = action.payload;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
      state.error = action.payload;
    },
    loadUserRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loadUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loadUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    updatePasswordRequest(state, action) {
      state.loading = true;
      state.isUpdated = false;
      state.message = null;
      state.error = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload;
      state.error = null;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.message = null;
      state.error = action.payload;
    },
    updateProfileRequest(state, action) {
      state.loading = true;
      state.isUpdated = false;
      state.message = null;
      state.error = null;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload;
      state.error = null;
    },
    updateProfileFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.message = null;
      state.error = action.payload;
    },
    updateProfileResetAfterUpdate(state, action) {
      state.error = null;
      state.isUpdated = false;
      state.message = null;
    },
    clearAllUserErrors: (state) => {
      state.error = null;
    },
  },
});


export const login = (email, password) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const { data } = await axios.post(
      "https://backend-portfolio-2-ibw1.onrender.com/api/user/login",
      { email, password },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    
    localStorage.setItem('portfolioToken', data?.token);
    console.log("token",data?.token);
    dispatch(userSlice.actions.loginSuccess({ user: data.user, message: data.message }));
  } catch (error) {
    dispatch(userSlice.actions.loginFailed(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(userSlice.actions.loadUserRequest());
  try {
    const token = localStorage.getItem('portfolioToken');
    if (!token) {
      throw new Error('No token found');
    }

    const { data } = await axios.get("https://backend-portfolio-2-ibw1.onrender.com/api/user/me", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    dispatch(userSlice.actions.loadUserSuccess(data.user));
  } catch (error) {
    dispatch(userSlice.actions.loadUserFailed(error.response?.data?.message || 'Failed to load user'));
    // localStorage.removeItem('portfolioToken');
  }
};

export const logout = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      "https://backend-portfolio-2-ibw1.onrender.com/api/user/logout",
      { withCredentials: true }
    );
    localStorage.removeItem('portfolioToken');
    dispatch(userSlice.actions.logoutSuccess(data.message));
    dispatch(userSlice.actions.clearAllUserErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed(error.response.data.message));
  }
};


export const updatePassword =
  (currentPassword, newPassword, confirmPassword) => async (dispatch) => {
    dispatch(userSlice.actions.updatePasswordRequest());
    try {
      const { data } = await axios.put(
        "https://backend-portfolio-2-ibw1.onrender.com/api/user/update-password",
        { currentPassword, newPassword, confirmPassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(userSlice.actions.updatePasswordSuccess(data.message));
      dispatch(userSlice.actions.clearAllUserErrors());
    } catch (error) {
      dispatch(
        userSlice.actions.updatePasswordFailed(error.response.data.message)
      );
    }
  };


  export const updateProfile = (data) => async (dispatch) => {

    
    dispatch(userSlice.actions.updateProfileRequest());
    try {
      const response = await axios.put(
        
        "https://backend-portfolio-2-ibw1.onrender.com/api/user/update-profile",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("respne>",response),
     

      dispatch(userSlice.actions.updateProfileSuccess(response.data.message));
      dispatch(userSlice.actions.clearAllUserErrors());
    } catch (error) {
      dispatch(
        userSlice.actions.updateProfileFailed(error.response.data.message)
      );
    }
  };

export const resetProfile = () => (dispatch) => {
  dispatch(userSlice.actions.updateProfileResetAfterUpdate());
};

export const clearAllUserErrors = () => (dispatch) => {
  dispatch(userSlice.actions.clearAllUserErrors());
};

export default userSlice.reducer;
