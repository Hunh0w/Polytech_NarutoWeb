import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if(request.nextUrl.pathname.toLowerCase().startsWith("/disconnect")){
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
    }
    return NextResponse.next();
}
