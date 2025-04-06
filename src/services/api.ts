import { toast } from "@/components/ui/use-toast";
import axios from "axios";

// Use Vite's import.meta.env instead of process.env
const baseUrl = import.meta.env.VITE_API_BASE_URL;
console.log("hellobaseurl", baseUrl);

// Auth service
export const authService = {
  login: async (email: string, password: string) => {
    // In a real app, this would call fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    // For now, we use the login function in AuthContext.tsx directly
    console.log("Simulated API login call with:", { email, password });
    return null;
  },

  logout: async () => {
    // In a real app, this would call fetchWithAuth('/auth/logout', { method: 'POST' });
    // For now, we use the logout function in AuthContext.tsx directly
    console.log("Simulated API logout call");
    return null;
  },
};
// Work logs service
// Create axios instance with base URL
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const workLogService = {
  getUserWorkLogs: async (userId: string) => {
    try {
      const response = await api.get(`/worklogs/getAllWorkLogs`, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user work logs:", error);
      throw error;
    }
  },

  getAllWorkLogs: async () => {
    try {
      const response = await api.get(`/worklogs/getAllWorkLogs`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all work logs:", error);
      throw error;
    }
  },

  // Update other methods to use the api instance
  createWorkLog: async (workLogData: any) => {
    try {
      const response = await api.post("/worklogs/createWorklog", workLogData);
      return response.data;
    } catch (error) {
      console.error("Error creating work log:", error);
      throw error;
    }
  },
};

// Update other services to use the api instance
export const userService = {
  getUsers: async () => {
    try {
      const response = await api.get("users/getUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("saavik_token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  registerUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await api.post("auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },
};

// Export all services
export default {
  auth: authService,
  workLogs: workLogService,
  users: userService,
};
