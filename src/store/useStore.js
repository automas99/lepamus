import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  isAuthenticated: () => !!useStore.getState().user,
}));

export default useStore;
