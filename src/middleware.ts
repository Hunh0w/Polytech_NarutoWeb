import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {url} from "./utils/global_vars";
import {navigation} from "./components/header";

const paths = [
  "/character/"
];

function isNavigationContainsPath(path: string){
    for(const nav of paths){
        if(path.toLowerCase().startsWith(nav))
            return true;
    }
    for(const nav of navigation){
        if(path.toLowerCase().startsWith(nav.path))
            return true;
    }
    return false;
}

export async function middleware(request: NextRequest) {
    if(request.nextUrl.pathname.toLowerCase().startsWith("/disconnect")){
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
    }

    if(isNavigationContainsPath(request.nextUrl.pathname)){
        const token = request.cookies.get("token");
        if(token){
            const response = await fetch(url+"/login/check", {
                method: 'get',
                headers: {
                    "Authorization": token.value
                }
            });
            console.log(response.status);
            if(response.status != 200)
                return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}
