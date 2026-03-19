import { create } from 'zustand';

export const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  setUser: (user) => {
    localStorage.setItem('userInfo', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  },
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  chats: [],
  setChats: (chats) => set({ chats }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));
