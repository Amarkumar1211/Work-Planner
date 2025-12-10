import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Create Edge-compatible Supabase client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        }
    );

    // Get session from cookies - Supabase stores auth in a single cookie
    // The cookie name pattern is: sb-<project-ref>-auth-token
    // We'll look for any cookie that matches this pattern
    let session = null;

    // Find the Supabase auth cookie
    const cookieStore = req.cookies;
    const authCookie = cookieStore.getAll().find(cookie =>
        cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    );

    if (authCookie?.value) {
        try {
            // Parse the cookie value which contains the session data
            const authData = JSON.parse(authCookie.value);
            if (authData.access_token && authData.refresh_token) {
                const { data } = await supabase.auth.setSession({
                    access_token: authData.access_token,
                    refresh_token: authData.refresh_token
                });
                session = data.session;
            }
        } catch (error) {
            // Cookie parsing failed, session will remain null
            console.error('Failed to parse auth cookie:', error);
        }
    }

    // If user is not signed in and trying to access protected routes, redirect to login
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // If user is signed in and trying to access auth pages, redirect to dashboard
    if (session && req.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/:path*'],
};
