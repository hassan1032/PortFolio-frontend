// App.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./store/slices/Userslices";
import { getAllMessages } from "../../dashboard/src/store/slices/message.Slice";
import Login from "./Pages/Login";
import HomePage from "./Pages/HomePages";
import ManageSkills from "./Pages/ManageSkills";
import ManageProjects from "./Pages/ManageProjects";
import UpdateProject from "./Pages/UpdateProject";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ManageTimeline from "./Pages/ManageTimeline";
import ViewProject from "./Pages/ViewProject";
import { getAllSkills } from "./store/slices/Addskill";
import { getAllTimeline } from "./store/slices/timeline.slice";
import { getAllSoftwareApplications } from "./store/slices/addSoftware.Slice";
import { getAllProjects } from "./store/slices/AddProject.slice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllMessages());
    dispatch(getAllSkills());
    dispatch(getAllTimeline());
    dispatch(getAllSoftwareApplications());
    dispatch(getAllProjects());
  }, [dispatch]);

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
