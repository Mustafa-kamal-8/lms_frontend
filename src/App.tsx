import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import InstructorLayout from "./components/common/InstructorLayout";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Instructor from "./pages/Instructor";
import Notice from "./pages/Notice";
import InstructorNotices from "./pages/Instructor/Notices";
import NoticeReply from "./pages/NoticeReply";
import NotFound from "./pages/404";
import ProtectedRoute from "./components/auth/protected";
import EditCourse from "./pages/EditCourse";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Requires Auth) */}
        <Route element={<ProtectedRoute />}>
          {/* Routes using the Main Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course" element={<Course />} />
            <Route path="/instructor" element={<Instructor />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/notice-reply/:noticeId" element={<NoticeReply />} />
            <Route path="/edit-course/:courseId" element={<EditCourse />} />
          </Route>

          {/* Route using the Instructor Layout */}
          <Route element={<InstructorLayout />}>
            <Route path="/notices" element={<InstructorNotices />} />
          </Route>
        </Route>

        {/* 404 Page for Unknown Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
