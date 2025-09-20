import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SECRET_KEY || "";

// pnpm dlx supabase gen types typescript --project-id zddpqyqvxmdrslauznlf --schema poopstats > src/types/supabase.ts

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("middleware", pathname);

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && pathname.startsWith('/api')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } else if (!user && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/home', request.url));
  } else if (user && pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  supabaseResponse.headers.set("x-user-id", user?.id ?? "");
  supabaseResponse.headers.set("x-user-email", user?.email ?? "");
  return supabaseResponse;
}

// Apply only to API routes
export const config = {
  matcher: ["/((?!login|signup|_next|.well-known|favicon.ico|favicon.png).*)"],
};