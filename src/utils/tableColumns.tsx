import { useState } from "react";
import { Column } from "react-table";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Delete, Edit } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CourseData {
  id: number;
  course_name: string;
  course_code: string;
  created_by: string;
  created_at: string;
}

export const courseColumns = (navigate: (path: string) => void, handleDelete: (id: number) => void): Column<CourseData>[] => [
  { Header: "SL No.", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Course Name", accessor: "course_name" },
  { Header: "Course Code", accessor: "course_code" },
  { 
    Header: "Created At", 
    accessor: "created_at",  
    Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"),
  },
  { 
    Header: "Actions", 
    accessor: "id", 
    Cell: ({ row }: { row: { original: CourseData } }) => (
      <div style={{ display: "flex", gap: "10px" }}>
        {/* Edit Button - Navigate to Edit Page */}
        <Tooltip title="Edit">
          <IconButton onClick={() => navigate(`/edit-course/${row.original.id}`)} color="primary">
            <Edit />
          </IconButton>
        </Tooltip>

        {/* Delete Button */}
        <Tooltip title="Delete">
      <IconButton onClick={() => handleDelete(row.original.id)} color="error">
        <Delete />
      </IconButton>
    </Tooltip>
      </div>

      
    ),
    
  },
  
];















interface InstructorData {
  id: number;
  course_name: string;
  instructor_name: string;
  added_at: string;
}

export const instructorColumns: Column<InstructorData>[] = [
  { Header: "SL No.", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Course Name", accessor: "course_name" },
  { Header: "Instructor Name", accessor: "instructor_name" },
  {
    Header: "Added At",
    accessor: "added_at",
    Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"),
  },
  {
    Header: "Actions",
    accessor: "id",
    Cell: ({ value }: { value: number }) => (
      <Tooltip title="Delete">
        <IconButton onClick={() => handleDeleteInstructor(value)} color="error">
          <Delete />
        </IconButton>
      </Tooltip>
    ),
  },
];

// Delete handler function
const handleDeleteInstructor = (id: number) => {
  console.log("Delete instructor with ID:", id);
};












interface NoticeData {
  notice_id: number;
  course_name: string;
  message: string;
  file_path?: string;
  created_at: string;
}

export const noticeColumns: Column<NoticeData>[] = [
  { Header: "SL No.", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Course Name", accessor: "course_name" },
  { Header: "Message", accessor: "message" },
  {
    Header: "Attachment",
    accessor: "file_path",
    Cell: ({ value }: { value?: string }) => {
      if (!value) return "No Attachment";
  
      const fileUrl = `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/${value.replace(/^\/+/, '')}`;
  
      return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          View File
        </a>
      );
    },
  },
  
  {
    Header: "Created At",
    accessor: "created_at",
    Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"),
  },
  {
    Header: "Actions",
    accessor: "notice_id",
    Cell: ({ value }: { value: number }) => <ReplyButton noticeId={value} />,
  },
];

const ReplyButton = ({ noticeId }: { noticeId: number }) => {
  const [open, setOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const handleReplySubmit = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        enqueueSnackbar("Authentication error. Please log in again.", { variant: "error" });
        return;
      }

      await axios.post(
        `${API_BASE_URL}notice/reply`,
        { noticeId, reply_message: replyMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     toast.success("Replied successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to send reply.");
      console.error("API Error:", error);
    }
  };

  return (
    <>
      <Button variant="contained" size="small" onClick={() => setOpen(true)}>
        Reply
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reply to Notice</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Your Reply"
            multiline
            rows={3}
            variant="outlined"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleReplySubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


export const noticeColumnsAdmin: Column<NoticeData>[] = [
  { Header: "SL No.", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Course Name", accessor: "course_name" },
  { Header: "Message", accessor: "message" },
  {
    Header: "Attachment",
    accessor: "file_path",
    Cell: ({ value }: { value?: string }) => {
      if (!value) return "No Attachment";
      const fileUrl = `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/${value.replace(/^\/+/, '')}`;
      return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          View File
        </a>
      );
    },
  },
  {
    Header: "Created At",
    accessor: "created_at",
    Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"),
  },
  {
    Header: "Actions",
    accessor: "notice_id",
    Cell: ({ value }: { value: number }) => <ActionButtons noticeId={value} />,
  },
];

// Component for Action Buttons
const ActionButtons = ({ noticeId }: { noticeId: number }) => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(`/notice-reply/${noticeId}`)}  className="text-blue-600 underline hover:text-blue-800 transition-colors">
        Show Replies
      </button>
    </div>
  );
};