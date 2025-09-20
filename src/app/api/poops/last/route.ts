import { NextRequest,NextResponse } from "next/server";
import { getLastPoop } from "@/database/PoopCalendar";


export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(pathname);

  const userId = request.headers.get("x-user-id") as string;
  const poops = await getLastPoop(userId);
  return NextResponse.json(poops);
}