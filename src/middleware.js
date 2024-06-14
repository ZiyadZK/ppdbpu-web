import { NextResponse } from "next/server";
import { decryptData } from "./libs/cryptor";
import { cookies } from "next/headers";

// const rolePath = {
//     'Account Manager': ['/', '/akun', '/riwayat'],
//     'Operator': ['/', '/siswa/diterima', '/siswa/diterima/update', '/siswa/terdaftar', '/siswa/terdaftar/update', '/siswa/terdaftar/new'],
//     'Admin': ['/', '/akun', '/siswa/diterima', '/siswa/diterima/update', '/siswa/terdaftar', '/siswa/terdaftar/new', '/siswa/terdaftar/update', '/riwayat']
// }

const rolePath = {
    '/akun': ['Account Manager'],
    '/riwayat': ['Account Manager'],
    '/siswa': ['Admin', 'Operator']
}

export async function middleware(request) {
    if(!cookies().has('userdata')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const encryptedUserdata = cookies().get('userdata')
    const decryptedUserdata = await decryptData(encryptedUserdata)
    const pathname = request.nextUrl.pathname;

    if(pathname !== '/') {
        for(let path of Object.keys(rolePath)) {
            if(pathname.startsWith(path)) {
                if(!rolePath[path].includes(decryptedUserdata.role_akun)) {
                    return NextResponse.redirect(new URL('/', request.url))
                }
            }
        }
    }

    return NextResponse.next()
    
}

export const config = {
    matcher: ['/', '/akun', '/riwayat', '/siswa/terdaftar/:path*', '/siswa/diterima/:path*']
}