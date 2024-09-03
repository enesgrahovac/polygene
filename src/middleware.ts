import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/auth/middleware'
import { createClient } from '@/utils/supabase/auth/server'
export async function middleware(request: NextRequest) {
    const supabase = createClient()
    // Retrieve the pathname from the request
    const { pathname } = request.nextUrl;

    // List of paths that require authentication
    const protectedRoutes = ['/settings', '/home'];
    const redirectIfAuthenticated = ['/auth'];

    const { data, error } = await supabase.auth.getUser()

    let session;
    if (error || !data?.user) {
        session = false
    } else {
        session = true
    }

    // Check if the path is protected and there is no session
    if (protectedRoutes.some(path => pathname.startsWith(path)) && !session) {
        // Redirect to login if not authenticated
        return NextResponse.rewrite(new URL('/auth', request.url))
    } else if (redirectIfAuthenticated.some(path => pathname.startsWith(path)) && session) {
        // Redirect to home if authenticated
        return NextResponse.rewrite(new URL('/home', request.url))
    } else if (pathname === "/") {
        if (session) {
            // Redirect to home if authenticated
            return NextResponse.rewrite(new URL('/home', request.url))
        } else {
            // Redirect to login if not authenticated
            return NextResponse.rewrite(new URL('/landing', request.url))
        }
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}