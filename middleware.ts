import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Hanya /admin yang jadi auth boundary — seluruh 8 halaman publik tidak
// disentuh middleware ini sama sekali (harus tetap statically renderable
// & terindeks Google tanpa redirect apa pun).
export async function middleware(req: NextRequest) {
  const secureCookie = req.nextUrl.protocol === "https:";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
  });

  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
