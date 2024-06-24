import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePages from "./Pages/HomePages";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ManageSkills from "./Pages/ManageSkills";
import ManageTimeline from "./Pages/ManageTimeline";
import ManageProjects from "./Pages/ManageProjects";
import ViewProject from "./Pages/ViewProject";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/Userslices";
import Cookies from "js-cookie";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('portfolioToken');
    if (token) {
      dispatch(getUser()).finally(() => {
        setIsInitialLoading(false);
      });
    } else {
      setIsInitialLoading(false);
    }
  }, [dispatch]);

  if (isInitialLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/manage/skills" element={isAuthenticated ? <ManageSkills /> : <Navigate to="/login" />} />
        <Route path="/manage/timeline" element={isAuthenticated ? <ManageTimeline /> : <Navigate to="/login" />} />
        <Route path="/manage/projects" element={isAuthenticated ? <ManageProjects /> : <Navigate to="/login" />} />
        <Route path="/view/project/:id" element={isAuthenticated ? <ViewProject /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
};

export default App;
