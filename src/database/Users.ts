
import { db } from "@/lib/supabaseClient";


export async function getAllUsers() {
    const { data, error } = await db.from("users").select("*");
    if (error) {
        console.log(error);
        throw new Error(error.message);
    }
    return data;
}


export async function updateUserRole(userId: string, role: string) {
    const { data, error } = await db.auth.admin.updateUserById(userId, 
      { "role": role }
    );
    if (error) {
        console.log(error);
        throw new Error(error.message);
    }
    return data.user
}

export async function updateUserEmailVerification(userId: string) {
    const { data, error } = await db.auth.admin.updateUserById(userId, 
      { "email_confirm": true }
    );
    if (error) {
        console.log(error);
        throw new Error(error.message);
    }
    return data.user
}