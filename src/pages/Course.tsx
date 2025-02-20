import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import CentralizedTable from "../components/CentralizedTable";
import { courseColumns } from "../utils/tableColumns";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const Course: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
  });

  const columns = useMemo(() => courseColumns, []); // ✅ Simply reference the array




  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Authentication error. Please log in again.");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}courses`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });

        if (response.status === 200) {
          setCourseData(response.data.courses); // Store course data
        }
      } catch (error: any) {
        toast.error("Failed to fetch courses.");
        console.error("API Error:", error);
      }
    };

    fetchCourses();
  }, []); // Runs only on mount

  const handleSubmit = async () => {
    try {
      // Get token and user details from cookies
      const token = Cookies.get("token");
      const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;

      if (!token || !user) {
        toast.error("Authentication error. Please log in again.");
        return;
      }

      const requestData = {
        ...formData,
        created_by: user.role_id, // Pass the user name from cookies
      };

      const response = await axios.post(`${API_BASE_URL}courses/create`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the header
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Course created successfully!");
        setFormData({ course_name: "", course_code: "" }); // Reset form
        handleClose(); // Close modal      
    fetchCourses();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create course");
      console.error("API Error:", error);
    }
  };

  return (
    <div className="">
      {/* Add Course Button */}
      <Button 
        variant="contained"
        onClick={handleOpen}
        className="bg-theme-primary text-white px-4 py-2 rounded-md shadow-md hover:opacity-90 transition"
      >
        Add Course
      </Button>

      <div className="mt-4 p-4 text-xl text-blue-500">Courses</div>
      <CentralizedTable columns={columns} data={courseData} pageSize={5} />

    
      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle className="text-center font-semibold text-lg">Add New Course</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <TextField
              label="Course Name"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Course Code"
              name="course_code"
              value={formData.course_code}
              onChange={handleChange}
              fullWidth
              required
            />
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button 
           variant="contained"
            color="primary"
            onClick={handleSubmit} 
            className="bg-theme-primary text-white px-4 py-2 rounded-md shadow-md hover:opacity-90 transition"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Course;
function fetchCourses() {
    throw new Error("Function not implemented.");
}

