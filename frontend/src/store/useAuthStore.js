// store/useAuthStore.js
import { create } from "zustand";
import axios from "axios";

// Use VITE_API if available, else fallback to localhost
// const API_URL = import.meta.env.VITE_API || "http://localhost:3000";
const API_URL = "https://four04foundus-7gpg.onrender.com/api";
console.log("API URL being used:", API_URL);

// Create Axios instance to avoid repeating URL/credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // include cookies automatically
});

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  onlineUsers: [],

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await api.get("/user/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error.response?.data || error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/user/login", data);
      set({ authUser: res.data });
      return res.data; // return user to handle navigation in component
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/user/logout");
      set({ authUser: null });
    } catch (error) {
      console.log("Logout error:", error.response?.data || error.message);
    }
  },
}));
