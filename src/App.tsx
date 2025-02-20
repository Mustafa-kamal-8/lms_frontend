import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import Login from "./components/auth/login";
import Dashboard from "./pages/Dashboard"; // Example protected page
import NotFound from "./pages/404";
import ProtectedRoute from "./components/auth/protected";
import Register from "./components/auth/register";
import Course from "./pages/Course"
import Instructor from "./pages/Instructor";
import Notice from "./pages/Notice"
import InstructorNotices from "./pages/Instructor/Notices"
import NoticeReply from "./pages/NoticeReply";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected Routes (Requires Auth) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course" element={<Course />} />
            <Route path="/instructor" element={<Instructor />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/notices" element={<InstructorNotices />} />
            <Route path="/notice-reply/:noticeId" element={<NoticeReply />} />

          </Route>
        </Route>

        {/* 404 Page for Unknown Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
