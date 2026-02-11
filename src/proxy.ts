import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('userId')

    // If user is not authenticated and trying to access /dashboard, redirect to /login
    if (request.nextUrl.pathname.startsWith('/dashboard') && !authCookie) {
        // Return 307 Temporary Redirect instead of 302/303 as it is more consistent 
        // with how Next.js suggests.
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user is authenticated and trying to access /login, redirect to /dashboard
    if (request.nextUrl.pathname.startsWith('/login') && authCookie) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
}
