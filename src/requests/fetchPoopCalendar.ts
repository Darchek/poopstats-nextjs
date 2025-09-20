
import { PoopCalendar } from "@/types/PoopCalendar";


const API_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export async function fetchPoopCalendar(): Promise<PoopCalendar[]> {
  const allCookies = getCookies();
    const response = await fetch(`${API_URL}/api/poops`, {
        method: "GET",
        headers: {
          cookie: allCookies
            .map((c) => `${c.name}=${c.value}`)
            .join("; "),
          // authorization: allHeaders.get("authorization") ?? "",
        },
        credentials: "include",
    });
    const data = await response.json();
    return data as PoopCalendar[];
}

export async function getLastPoop(): Promise<PoopCalendar> {
  const allCookies = getCookies();
    const response = await fetch(`${API_URL}/api/poops/last`, {
        method: "GET",
        headers: {
          cookie: allCookies
            .map((c) => `${c.name}=${c.value}`)
            .join("; ")
        },
        credentials: "include",
    });
    const data = await response.json();
    return data as PoopCalendar;
}


export async function createPoop(): Promise<PoopCalendar> {
  const allCookies = getCookies();
  const response = await fetch(`${API_URL}/api/poops`, {
      method: "POST",
      headers: {
        cookie: allCookies
          .map((c) => `${c.name}=${c.value}`)
          .join("; ")
      },
      credentials: "include",
  });
  const data = await response.json();
  return data as PoopCalendar;
}

export async function updatePoop(poopId: string): Promise<PoopCalendar> {
  const allCookies = getCookies();
  const response = await fetch(`${API_URL}/api/poops`, {
      method: "PUT",
      body: JSON.stringify({
        poopId: poopId,
      }),
      headers: {
        cookie: allCookies
          .map((c) => `${c.name}=${c.value}`)
          .join("; ")
      },
      credentials: "include",
  });
  const data = await response.json();
  return data as PoopCalendar;
}


function getCookies() {
  const cookies = document.cookie.split(";");
  return cookies.map((cookie) => {
    const [name, value] = cookie.split("=");
    return { name, value };
  });
}