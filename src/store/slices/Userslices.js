import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
    error: null,
    message: null,
    isUpdated: false,
  },
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.error = null;
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    loadUserRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loadUserFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = action.payload;
    },
    logoutFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
      state.error = action.payload;
    },
    updatePasswordRequest: (state) => {
      state.loading = true;
      state.isUpdated = false;
      state.message = null;
      state.error = null;
    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload;
      state.error = null;
    },
    updatePasswordFailed: (state, action) => {
      state.loading = false;
      state.isUpdated = false;
      state.message = null;
      state.error = action.payload;
    },
    updateProfileRequest: (state) => {
      state.loading = true;
      state.isUpdated = false;
      state.message = null;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload;
      state.error = null;
    },
    updateProfileFailed: (state, action) => {
      state.loading = false;
      state.isUpdated = false;
      state.message = null;
      state.error = action.payload;
    },
    updateProfileResetAfterUpdate: (state) => {
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
      "http://localhost:5000/api/user/login",
      { email, password },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    Cookies.set('portfolioToken', data?.token);
    dispatch(userSlice.actions.loginSuccess({ user: data.user, message: data.message }));
  } catch (error) {
    dispatch(userSlice.actions.loginFailed(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(userSlice.actions.loadUserRequest());
  try {
    const token = Cookies.get('portfolioToken');
    if (!token) {
      throw new Error('No token found');
    }

    const { data } = await axios.get("http://localhost:5000/api/user/me", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    dispatch(userSlice.actions.loadUserSuccess(data.user));
  } catch (error) {
    dispatch(userSlice.actions.loadUserFailed(error.response?.data?.message || 'Failed to load user'));
    Cookies.remove('portfolioToken');
  }
};

export const logout = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      "http://localhost:5000/api/user/logout",
      { withCredentials: true }
    );
    Cookies.remove("portfolioToken");
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
      const token = Cookies.get('portfolioToken');
      const { data } = await axios.put(
        "http://localhost:5000/api/user/update-password",
        { currentPassword, newPassword, confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
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
    const token = Cookies.get('portfolioToken');
    const response = await axios.put(
      "http://localhost:5000/api/user/update-profile",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );
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
