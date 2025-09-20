import { NextRequest,NextResponse } from "next/server";
import { getListByUser, createPoop, updatePoop } from "@/database/PoopCalendar";

// grant all privileges on all tables in schema poopstats to service_role;


export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") as string;
  // const email = request.headers.get("x-user-email") as string;
  const poops = await getListByUser(userId);
  return NextResponse.json(poops);
}

export async function POST(request: Request) {
  const userId = request.headers.get("x-user-id") as string;
  const poops = await createPoop(userId);
  return NextResponse.json(poops);
}

export async function PUT(request: Request) {
  const userId = request.headers.get("x-user-id") as string;
  const body = await request.json();
  const poops = await updatePoop(userId, body.poopId);
  return NextResponse.json(poops);
}
