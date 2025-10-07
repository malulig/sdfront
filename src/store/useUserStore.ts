import { create } from "zustand";
import type { User } from "../interfaces/User";

type UserState = User & {
  setUser: (user: Partial<User>) => void;
};

export const useUserStore = create<UserState>((set) => ({
  id: "",
  role: "",
  email: "",
  displayName: "",
  access_token: "",
  setUser: (user) => set((state) => ({ ...state, ...user })),
}));
