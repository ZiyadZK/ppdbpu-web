import { NextResponse } from "next/server";
import { decryptData } from "./libs/cryptor";
import { cookies } from "next/headers";

const adminPath = [
    '/akun', '/riwayat'
]

export async function middleware(request) {
    if(!cookies().has('userdata')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const encryptedUserdata = cookies().get('userdata')
    try {
        const decryptedUserdata = await decryptData(encryptedUserdata)
        const pathname = request.nextUrl.pathname;
        for (const path of adminPath) {
            if(pathname.startsWith(path)) {
                if(decryptedUserdata['role_akun'] !== 'Admin') {
                    return NextResponse.redirect(new URL('/', request.url))
                }
            }
        }

        return NextResponse.next()
        
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/']
}