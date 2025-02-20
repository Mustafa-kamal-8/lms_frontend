import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";



interface LoginResponse {
  error: string;
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role_id: number;
    gender_id: number;
    created_at: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
 
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data: LoginResponse = await response.json();
  
      if (response.status === 200) {
        // Show success message
        toast.success(data.message);
  
        // Store the token and user details in cookies
        Cookies.set("token", data.token, { expires: 1 }); // Expires in 1 day
        Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
  
        // Get role_id from response
        const roleId = data.user?.role_id;
      
  
        // Save "yes" in localStorage if role_id is 1
        if (roleId === 1) {
        
          navigate("/dashboard"); // Admin
        } else if (roleId === 2) {
          navigate("/notices"); // Instructor
        } else {
          toast.error("Invalid role. Contact admin.");
        }
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Server error");
    }
  };
  
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
        
       
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg shadow-md transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
      Don't have an account?{" "}
      <span 
        className="text-blue-500 hover:underline cursor-pointer" 
        onClick={() => navigate("/register")}
      >
        Sign up
      </span>
    </p>
      </div>
    </div>
  );
};

export default Login;
