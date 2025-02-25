import { create } from "zustand";
import { io } from "socket.io-client";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.MODE === "development"? "http://localhost:3000/":"/";


export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoadind: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get(`/auth/`);
      set({ authUser: res.data, isCheckingAuth: false });
      get().connectSocket();
    } catch (error) {
      console.log(error);
      set({ isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (formData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(`/auth/sign-up`, formData);
      set({ authUser: res.data.user, isLoading: false });
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  signIn: async (formData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(`/auth/sign-in`, formData);
      set({ authUser: res.data.user, isLoading: false });
      get().connectSocket();

      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    try {
      const res = await axiosInstance.post(`/auth/sign-out`);
      set({ authUser: null });
      res.data.message && toast.success(res.data.message);
      get().disconnectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  updateProfile: async (formData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.put("/auth/update-profile", formData);
      set({ authUser: res.data.user, isLoading: false });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error(error.response.data.message);
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) return;
    const socket = io(baseURL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (usersIds) => {
      set({ onlineUsers: usersIds });
    });

    
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
  },
}));
