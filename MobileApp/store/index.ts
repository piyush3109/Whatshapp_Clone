import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create((set) => ({
  user: null,
  setUser: async (user: any) => {
    if (user) {
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem('userInfo');
    }
    set({ user });
  },
  loadUser: async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (userInfo) {
      set({ user: JSON.parse(userInfo) });
    }
  },
  selectedChat: null,
  setSelectedChat: (chat: any) => set({ selectedChat: chat }),
  chats: [],
  setChats: (chats: any) => set({ chats }),
  messages: [],
  setMessages: (messages: any) => set({ messages }),
}));
