import { NextResponse } from "next/server"

// Protect: /admin/* → ADMIN only, /faculty/* → FACULTY+ADMIN
// Role is stored in "userRole" cookie set by the login page
export function proxy(req) {
  const role = req.cookies.get("userRole")?.value
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/?error=unauthorized", req.url))
    }
  }

  if (pathname.startsWith("/faculty")) {
    if (role !== "FACULTY" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/?error=unauthorized", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/faculty/:path*"],
}
