import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";


const NoticeReply = () => {
  const { noticeId } = useParams();
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const token = Cookies.get("token"); // Get token from localStorage
        if (!token) {
          setError("Unauthorized: No token found");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}notice/notice-reply`,
          { noticeId }, // Pass noticeId in the body
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setReplies(response.data.replies || []);
      } catch (err) {
        setError("Failed to fetch replies");
      } finally {
        setLoading(false);
      }
    };

    if (noticeId) {
      fetchReplies();
    }
  }, [noticeId]);

  return (
    <div className="p-6">
     

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : replies.length === 0 ? (
        <p>No replies found.</p>
      ) : (
        <ul className="border border-gray-300 rounded-lg p-4">
          {replies.map((reply, index) => (
            <li key={index} className="border-b last:border-none py-2">
              <p className="text-gray-800">
                <span className="font-bold">Replied By:</span> {reply.replied_by_name}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Message:</span> {reply.reply_message}
              </p>
              <p className="text-gray-500 text-sm">
                <span className="font-bold">Date:</span> {new Date(reply.replied_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NoticeReply;
