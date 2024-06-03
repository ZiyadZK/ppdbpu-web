import { NextResponse } from "next/server";
import { decryptData } from "./libs/cryptor";
import { cookies } from "next/headers";

const rolePath = {
    'Account Manager': ['/', '/akun', '/riwayat'],
    'Operator': ['/', '/siswa/diterima', '/siswa/diterima/update', '/siswa/terdaftar', '/siswa/terdaftar/update', '/siswa/terdaftar/new'],
    'Admin': ['/', '/akun', '/siswa/diterima', '/siswa/diterima/update', '/siswa/terdaftar', '/siswa/terdaftar/new', '/siswa/terdaftar/update', '/riwayat']
}

export async function middleware(request) {
    if(!cookies().has('userdata')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const encryptedUserdata = cookies().get('userdata')
    const decryptedUserdata = await decryptData(encryptedUserdata)
    const pathname = request.nextUrl.pathname;

    // Ensure the user's role exists in the rolePath object
    const allowedPaths = rolePath[decryptedUserdata['role_akun']];
    if (!allowedPaths) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if the path is allowed for the user's role
    const isAllowed = allowedPaths.some(path => pathname.startsWith(path) || pathname === '/');
    if (!isAllowed) {
        return NextResponse.redirect(new URL('/', request.url)); // Redirect to home page if path is not allowed
    }

    return NextResponse.next()
    
}

export const config = {
    matcher: ['/', '/akun', '/riwayat', '/siswa/terdaftar/:path*', '/siswa/diterima/:path*']
}