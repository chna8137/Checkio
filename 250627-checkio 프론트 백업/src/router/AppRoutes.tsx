import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../conts/home/Home";
import Login from "../conts/login/Login";
import ProfileList from "../conts/profile/ProfileList";
import ProfileForm from "../conts/profile/ProfileForm";

import AttendanceManage from "../conts/attendance/AttendanceManage";
import ApprovalManage from "../conts/approval/ApprovalManage";
import ApprovalForm from "../conts/approval/ApprovalForm";
import ApprovalDetail from "../conts/approval/ApprovalDetail";
import CommuteList from "../conts/attendance/CommuteList";
import Signup from "../conts/signup/Signup";

const AppRoutes: React.FC = () => {
  const routeList = [
    { path: "/", element: <Home /> },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },

    { path: "/profile", element: <ProfileList /> },
    { path: "/profile/writer", element: <ProfileForm /> },

    { path: "/management", element: <ApprovalManage /> },
    { path: "/management/form", element: <ApprovalForm /> },
    { path: "/management/:id", element: <ApprovalDetail /> },

    { path: "/attendanceManage", element: <AttendanceManage /> },
    { path: "/commuteList", element: <CommuteList /> },

  ]
  return (
    <Routes>
      {routeList.map((route, idx) => (
        <Route key={idx} {...route} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
