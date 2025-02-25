import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaChalkboardTeacher, FaBook, FaUsers, FaEye, FaClock, FaPoll } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface GenderSplit {
  gender: string;
  count: number;
}

interface CourseWiseUpdates {
  course_id: number;
  updates: number;
}

interface DashboardData {
  total_courses: number;
  total_teachers: number;
  avg_teachers_per_course: number | null;
  notice_viewership: number | null;
  notice_responses: number | null;
  avg_lms_duration: number | null;
  gender_split: GenderSplit[];
  course_wise_notice_updates: CourseWiseUpdates[];
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get<DashboardData>(`${API_BASE_URL}dashboard/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDashboardData(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="text-center text-blue-500 text-lg font-semibold">Loading Dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg font-semibold">Error: {error}</p>;
  }

  // Stats
  const stats = [
    { label: "Total Courses", value: dashboardData?.total_courses ?? "N/A", icon: <FaBook className="text-blue-600" /> },
    { label: "Total Teachers", value: dashboardData?.total_teachers ?? "N/A", icon: <FaChalkboardTeacher className="text-green-600" /> },
    { 
      label: "Avg Teachers per Course", 
      value: typeof dashboardData?.avg_teachers_per_course === "number" 
        ? dashboardData.avg_teachers_per_course.toFixed(2) 
        : "0.00", 
      icon: <FaUsers className="text-purple-600" /> 
    },
    { 
      label: "Notice Viewership (%)", 
      value: typeof dashboardData?.notice_viewership === "number" 
        ? `${dashboardData.notice_viewership.toFixed(2)}%` 
        : "0.00%", 
      icon: <FaEye className="text-orange-600" /> 
    },
    { 
      label: "Notice Responses (%)", 
      value: typeof dashboardData?.notice_responses === "number" 
        ? `${dashboardData.notice_responses.toFixed(2)}%` 
        : "0.00%", 
      icon: <FaPoll className="text-yellow-600" /> 
    },
    { 
      label: "Avg LMS Usage Duration", 
      value: typeof dashboardData?.avg_lms_duration === "number" 
        ? `${dashboardData.avg_lms_duration} mins` 
        : "N/A", 
      icon: <FaClock className="text-red-600" /> 
    },
  ];

  // Gender Distribution
  const genderStats = dashboardData?.gender_split?.length
  ? dashboardData.gender_split.map((item) => ({
      label: `Gender: ${item.gender}`,
      value: item.count,
      icon: <FaUsers className="text-pink-600" />,
    }))
  : [];


  // Course-Wise Notice Updates
  const courseStats = dashboardData?.course_wise_notice_updates.map((item) => ({
    label: `Course ID ${item.course_id}`,
    value: `${item.updates} Updates`,
    icon: <FaBook className="text-blue-600" />,
  })) ?? [];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📊 Dashboard Overview</h2>

      {genderStats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">👥 Gender Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {genderStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4 hover:shadow-xl transition"
                >
                  <div className="text-4xl">{stat.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
                    <p className="text-gray-900 text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
      )}
  
      
    
 
          {/* Course-Wise Notice Updates Section */}
          {courseStats.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">📢 Course-Wise Notice Updates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courseStats.map((stat, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4 hover:shadow-xl transition">
                  <div className="text-4xl">{stat.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
                    <p className="text-gray-900 text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
             )}
      
      {/* Stats Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4 hover:shadow-xl transition">
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
              <p className="text-gray-900 text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
  
      {/* Gender Distribution & Course-Wise Notice Updates */}
    
    </div>
  );
  };
  
  export default Dashboard;
  