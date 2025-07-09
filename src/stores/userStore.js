import {create} from "zustand";
import {persist} from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => (
      {
        user: null, setUser: (user) => set({user}), logout: () => set({user: null}),
      }
    ),
    {
      name: "fast-community-user", // localStorage key
      partialize: (state) => ({user: state.user}),
    }
  )
);

export default useUserStore;
