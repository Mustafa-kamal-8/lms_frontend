import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditCourse = () => {
  const { courseId } = useParams<{ courseId: string }>(); // Get courseId from URL params
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [open, setOpen] = useState(true); // Keep the dialog open initially

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    }
  }, [courseId]);

  const fetchCourseDetails = async (id: string) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}courses/get-course-by-id`,
        { courseId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { course_name, course_code } = response.data.data;
      setCourseName(course_name);
      setCourseCode(course_code);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to fetch course details.");
    }
  };

  const handleUpdate = async () => {
    if (!courseId) return;

    const token = Cookies.get("token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}courses/edit-course`,
        { courseId, course_name: courseName, course_code: courseCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Course Updated Successfully!");
      handleClose(); // Close the dialog after success
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate(-1); // Navigate back after closing
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Course</DialogTitle>
      <DialogContent>
        <TextField 
          label="Course Name" 
          fullWidth 
          margin="dense" 
          value={courseName} 
          onChange={(e) => setCourseName(e.target.value)} 
        />
        <TextField 
          label="Course Code" 
          fullWidth 
          margin="dense" 
          value={courseCode} 
          onChange={(e) => setCourseCode(e.target.value)} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleUpdate} color="primary" variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCourse;
