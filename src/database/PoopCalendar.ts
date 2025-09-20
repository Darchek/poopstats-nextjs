import { db } from "@/lib/supabaseClient";
import { PoopCalendar } from "@/types/PoopCalendar";
const TABLE = "poop_calendar";

export async function getListByUser(userId: string) {
    const { data, error } = await db.from(TABLE).select("*").eq("created_by", userId);
    if (error) {
        console.log(error);
        throw new Error(error.message);
    }
    return data;
}

export async function getLastPoop(userId: string) {
    const { data, error } = await db.from(TABLE).select("*").eq("created_by", userId).order("started_at", { ascending: false }).limit(1).single();
    if (error) {
        console.log(error);
        throw new Error(error.message);
    }
    return data;
}

export async function getPoopById(poopId: string): Promise<PoopCalendar> {
    const { data, error } = await db.from(TABLE).select("*").eq("id", poopId).single();
    if (error) {
        console.log(error);
        throw new Error(error.message); 
    }
    return data;
}

export async function createPoop(userId: string) {
    const { data, error } = await db.from(TABLE).insert({
        created_by: userId,
        started_at: new Date(),
    }).select("*").single();
    if (error) {
        console.log(error);
        throw new Error(error.message); 
    }
    return data;
}

export async function updatePoop(userId: string, poopId: string) {
    const poop = await getPoopById(poopId);
    if (!poop) {
        throw new Error("Poop not found");
    }

    if (poop.created_by !== userId) {
        throw new Error("You are not allowed to update this poop");
    }

    const { data, error } = await db.from(TABLE).update({
        ended_at: new Date(),
    }).eq("id", poopId).select("*").single();
    if (error) {
        console.log(error);
        throw new Error(error.message); 
    }
    return data;
}

export async function deletePoop(userId: string, poopId: string) {
    const poop = await getPoopById(poopId);
    if (!poop) {
        throw new Error("Poop not found");
    }

    if (poop.created_by !== userId) {
        throw new Error("You are not allowed to update this poop");
    }

    const { data, error } = await db.from(TABLE).delete().eq("id", poopId).select("*").single();
    if (error) {
        console.log(error);
        throw new Error(error.message); 
    }
    return data;
}