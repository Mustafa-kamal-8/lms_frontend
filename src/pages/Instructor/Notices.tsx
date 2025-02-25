import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import CentralizedTable from "../../components/CentralizedTable";
import { noticeColumns } from "../../utils/tableColumns";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Course {
  id: number;
  name: string;
  course_code : number;
}

const Notices: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState([]);

  const columns = useMemo(() => noticeColumns, []);

  console.log("notices are",notices)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Authentication error. Please log in again.");
          return;
        }
  
        const response = await axios.get(`${API_BASE_URL}notice/notice-instructor`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });
  
        if (response.status === 200) {
          setNotices(response.data.notices); // ✅ Correctly store notices
        }
      } catch (error: any) {
        toast.error("Failed to fetch notices.");
        console.error("API Error:", error);
      }
    };
  
    fetchNotices();
  }, []); // Runs only on mount
  

  // Fetch courses on modal open
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Authentication error. Please log in again.");
          return;
        }

        const response = await axios.get<{ courses: Course[] }>(
          `${API_BASE_URL}courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setCourseData(response.data.courses);
        }
      } catch (error) {
        toast.error("Failed to fetch courses.");
        console.error("API Error:", error);
      }
    };

    if (open) {
      fetchCourses();
    }
  }, [open]);

  // Open modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedCourse("");
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedCourse) {
      toast.error("Please select a course.");
      return;
    }
  
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const userCookie = Cookies.get("user");
  
      if (!token || !userCookie) {
        toast.error("Authentication error. Please log in again.");
        return;
      }
  
      // Decode and parse the user cookie to extract user ID
      const user = JSON.parse(decodeURIComponent(userCookie));
      const instructorId = user.id;
  
      const response = await axios.post(
        `${API_BASE_URL}instructor/add`,
        { courseId: selectedCourse, instructorId }, // Passing instructorId
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("You have been added to course!");
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to add notice.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add to any course
      </Button>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Select Course Code</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value as number)}
            >
              {courseData.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.course_code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        {/* Buttons */}
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <div className="mt-4 p-4 text-xl text-blue-500">Notices</div>

      <CentralizedTable columns={columns} data={notices} pageSize={5} />

    </div>
  );
};

export default Notices;
