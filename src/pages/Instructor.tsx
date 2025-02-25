import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  Modal,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Typography,
} from "@mui/material";
import CentralizedTable from "../components/CentralizedTable";
import { instructorColumns } from "../utils/tableColumns";
import { CloudUploadIcon } from "lucide-react";

interface Course {
  id: number;
  course_name: string;
}

interface User {
  id: number;
  name: string;
  role_id: number;
}

const Instructor: React.FC = () => {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [userData, setUsersData] = useState<User[]>([]);
  const [instructorData, setInsructorData] = useState([]);
  const [open, setOpen] = useState<boolean>(false);
  const [bulkOpen, setBulkOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const columns = useMemo(() => instructorColumns, []);

  console.log(instructorData)

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Authentication error. Please log in again.");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}instructor/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });

        if (response.status === 200) {
          setInsructorData(response.data); // Store course data
        }
      } catch (error: any) {
        toast.error("Failed to fetch instructors.");
        console.error("API Error:", error);
      }
    };

    fetchInstructors();
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleBulkUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
console.log("formdata is",formData)
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        return;
      }

      await axios.post(`${API_BASE_URL}courses/bulk-upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload file.");
    }
  };

  const handleSubmit = async () => {
    try {
      // Get token and user details from cookies
      const token = Cookies.get("token");
      const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
  
      if (!token || !user) {
        toast.error("Authentication error. Please log in again.");
        return;
      }
  
      // Validate selections
      if (!selectedCourse || !selectedInstructor) {
        toast.error("Please select both a course and an instructor.");
        return;
      }
  
      const requestData = {
        courseId: selectedCourse,
        instructorId: selectedInstructor,
      };
  
      const response = await axios.post(`${API_BASE_URL}instructor/add`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the header
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        toast.success("Instructor added successfully!");
        setOpen(false); // Close modal
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add instructor");
      console.error("API Error:", error);
    }
  };
  

  const handleClose = () => setOpen(false);
  
  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Instructor
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
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
  
          <DialogActions>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Modal>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setBulkOpen(true)}
        sx={{ marginLeft: 2 }}
      >
        Bulk Upload
      </Button>

      <Button
        variant="contained"
        color="secondary"
       
        sx={{ marginLeft: 2 }}
      >
        Template Download
      </Button>
    
      {/* Bulk Upload Modal */}
      <Modal open={bulkOpen} onClose={() => setBulkOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upload Excel File
          </Typography>

          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ mb: 2 }}
          >
            Select File
            <input
              type="file"
              accept=".xlsx, .xls"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {file && <Typography>{file.name}</Typography>}

          <DialogActions>
            <Button onClick={() => setBulkOpen(false)} color="error" variant="outlined">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBulkUpload}
            >
              Upload
            </Button>
          </DialogActions>
        </Box>
      </Modal>

    

      <div className="mt-4 p-4 text-xl text-blue-500">Instructors</div>

      <CentralizedTable columns={columns} data={instructorData} pageSize={5} />
    </div>
  );
};

export default Instructor;
