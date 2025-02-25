import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import CentralizedTable from "../components/CentralizedTable";
import { noticeColumnsAdmin } from "../utils/tableColumns";



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Course {
  id: number;
  course_name: string;
}

interface User {
  id: number;
  name: string;
  role_id: number;
}

const Notice: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
   const [notices, setNotices] = useState([]);
    const [userData, setUsersData] = useState<User[]>([]);

  const [selectedInstructor, setSelectedInstructor] = useState<string>("");

    const columns = useMemo(() => noticeColumnsAdmin, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setMessage("");
    setFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Authentication error. Please log in again.");
          return;
        }
  
        const response = await axios.get(`${API_BASE_URL}notice/`, {
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

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Authentication error. Please log in again.");
          return;
        }

        const response = await axios.get<{ users: User[] }>(`${API_BASE_URL}users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUsersData(response.data.users.filter((user) => user.role_id === 2));
        }
      } catch (error) {
        toast.error("Failed to fetch users.");
        console.error("API Error:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!file || !message) {
      toast.error("Please enter a message and select a file.");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get("token");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("message", message);
      formData.append("courseId", selectedCourse); // Replace with dynamic courseId if needed
      formData.append("instructorId", selectedInstructor);

      const response = await axios.post(`${API_BASE_URL}notice/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Notice uploaded successfully!");
        handleClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload notice");
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Upload Notice
      </Button>

      {/* Upload Notice Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Upload Notice</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Notice Message"
            variant="outlined"
            margin="dense"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courseData.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.course_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Select Instructor</InputLabel>
                      <Select
                        value={selectedInstructor}
                        onChange={(e) => setSelectedInstructor(e.target.value)}
                      >
                        {userData.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
          <input type="file" onChange={handleFileChange} style={{ marginTop: 10 }} />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained"
            color="primary" disabled={loading}>
            {loading ? "Uploading..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <div className="mt-4 p-4 text-xl text-blue-500">Notices</div>

<CentralizedTable columns={columns} data={notices} pageSize={5} />
    </div>

    
  );
};

export default Notice;
