// messageSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    loading: false,
    messages: [],
    error: null,
    message: null,
  },
  reducers: {
    getAllMessagesRequest(state) {
      state.messages = [];
      state.error = null;
      state.loading = true;
    },
    getAllMessagesSuccess(state, action) {
      state.messages = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllMessagesFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    deleteMessageRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteMessageSuccess(state, action) {
      state.message = action.payload;
      state.loading = false;
      state.error = null;
    },
    deleteMessageFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetMessageSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const getAllMessages = () => async (dispatch) => {
  dispatch(messageSlice.actions.getAllMessagesRequest());
  try {
    const response = await axios.get(
      "http://localhost:5000/api/messages/get-message",
      { withCredentials: true }
    );
    dispatch(
      messageSlice.actions.getAllMessagesSuccess(response.data.messages)
    );
  } catch (error) {
    dispatch(
      messageSlice.actions.getAllMessagesFailed(error.response.data.message)
    );
  }
};

export const deleteMessage = (id) => async (dispatch) => {
  dispatch(messageSlice.actions.deleteMessageRequest());
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/messages/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(messageSlice.actions.deleteMessageSuccess(response.data.message));
    dispatch(getAllMessages()); // Refetch messages after deletion
  } catch (error) {
    dispatch(
      messageSlice.actions.deleteMessageFailed(error.response.data.message)
    );
  }
};

export const clearAllMessageErrors = () => (dispatch) => {
  dispatch(messageSlice.actions.clearAllErrors());
};

export const resetMessagesSlice = () => (dispatch) => {
  dispatch(messageSlice.actions.resetMessageSlice());
};

export default messageSlice.reducer;
