

export async function fetchGemini() {
  const allCookies = getCookies();
    const response = await fetch(`/api/gemini`, {
        method: "GET",
        headers: {
          cookie: allCookies
            .map((c) => `${c.name}=${c.value}`)
            .join("; ")
        },
        credentials: "include",
    });
    const data = await response.json();
    return data.text as string;
}


function getCookies() {
  const cookies = document.cookie.split(";");
  return cookies.map((cookie) => {
    const [name, value] = cookie.split("=");
    return { name, value };
  });
}