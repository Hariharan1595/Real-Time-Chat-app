import { create } from "zustand";
import axiosInstance from "../pages/axios";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set, get) => ({
  users: [],
  isLoading: false,
  selectedUser: null,
  messages: [],

  getAllUser: async () => {
    try {
      set({ isLoding: true });
      const res = await axiosInstance.get("/message/");
      set({ users: res.data });
      set({ isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
  getMessage: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/message/${id}`);
      set({ message: res.data });
      set({ isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },
  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/${selectedUser._id}`,
        data
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log(error);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
