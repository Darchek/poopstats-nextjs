// stores/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@supabase/supabase-js";
import { UserState } from "@/types/User";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-store", // storage key
    }
  )
);
