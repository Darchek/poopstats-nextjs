
import { User } from "@supabase/supabase-js";

     
export type UserState = {
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
};
