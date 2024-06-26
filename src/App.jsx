import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Pages/Login";
import HomePage from "./Pages/HomePages";
import ManageSkills from "./Pages/ManageSkills";
import ManageProjects from "./Pages/ManageProjects";
import UpdateProject from "./Pages/UpdateProject";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./store/slices/Userslices";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
// import { getAllSkills } from "./store/slices/skillSlice";
// import { getAllSoftwareApplications } from "./store/slices/softwareApplicationSlice";
// import { getAllTimeline } from "./store/slices/timelineSlice";
import { getAllMessages } from "./store/slices/message.Slice";
import ManageTimeline from "./Pages/ManageTimeline";
//import { getAllProjects } from "./store/slices/projectSlice";
import ViewProject from "./Pages/ViewProject";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    // dispatch(getAllSkills());
    // dispatch(getAllSoftwareApplications());
    //  dispatch(getAllTimeline());
    dispatch(getAllMessages());
    //  dispatch(getAllProjects());
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/manage/skills" element={<ManageSkills />} />
        <Route path="/manage/timeline" element={<ManageTimeline />} />
        <Route path="/manage/projects" element={<ManageProjects />} />
        <Route path="/view/project/:id" element={<ViewProject />} />
        <Route path="/update/project/:id" element={<UpdateProject />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
}

export default App;
