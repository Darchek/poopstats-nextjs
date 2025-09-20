
import { db } from "@/lib/supabaseClient";


export async function getAllUsers() {

    const { data, error } = await db.from("users").select("*");
  
    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    return data;

}