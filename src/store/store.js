import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/Userslices"
import forgotPasswordReducer from "./slices/forgotPassword.slices"


export const store = configureStore({
  reducer: {
    user: userReducer,
     forgotPassword: forgotPasswordReducer,
    // skill: skillReducer,
    // project: projectReducer,
    // timeline: timelineReducer,
    // softwareApplications: softwareApplicationReducer,
    // messages: messageReducer,
  },
});