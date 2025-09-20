import { NextResponse } from "next/server";
import { getAllUsers } from "@/database/Users";

// grant usage on schema poopstats to service_role;
// grant all privileges on all tables in schema poopstats to service_role;


export async function GET() {

  const users = await getAllUsers();
  console.log(users);

  return NextResponse.json({ message: "Hello from GET endpoint!" });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ message: "Hello from POST", data: body });
}
