import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {url} from "./utils/global_vars";
import {navigation} from "./components/header";

const paths = [
    "/admin"
];

function isNavigationContainsPath(path: string){
    for(const nav of paths){
        if(path.toLowerCase().startsWith(nav))
            return true;
    }
    return false;
}

function base64DecodeUnicode(str: string) {
    // Convert Base64 encoded bytes to percent-encoding, and then get the original string.
    const percentEncodedStr = atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('');
    return decodeURIComponent(percentEncodedStr);
}

function isAdmin(token: string){
    const json_str = base64DecodeUnicode(token);
    const json_obj = JSON.parse(json_str);
    const privileges: number = json_obj.privileges;
    return privileges >= 100;
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
            if(response.status != 200 || !isAdmin(token.value)){
                const response = NextResponse.redirect(new URL("/login", request.url));
                return response;
            }
        }else {
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("token");
            return response;
        }

    }

    return NextResponse.next();
}
