'use client'

import { toast } from "@/libs/alert"
import { M_Akun_getUserdata, M_Akun_logout } from "@/libs/models/M_Akun"
import { faBars, faHouse, faSignOut, faTimeline, faUserCheck, faUserGroup, faUserShield, faUsers, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

const navLinkMasterData = [
    { url: '/siswa/terdaftar', icon: faUsers, page: 'Daftar Calon Siswa', name: 'Daftar Calon Siswa', role: ['Admin', 'Operator']},
    { url: '/siswa/diterima', icon: faUserCheck, page: 'Daftar Siswa Diterima', name: 'Daftar Siswa Diterima', role: ['Admin', 'Operator']},
    { url: '/akun', icon: faUserShield, page: 'Data Akun', name: 'Akun', role: [ 'Account Manager']},
    { url: '/riwayat', icon: faTimeline, page: 'Data Riwayat', name: 'Riwayat', role: ['Account Manager']}
]
const navLink = [
    { url: '/', icon: faHouse, page: 'Dashboard', name: 'Dashboard', role: ['Admin', 'Operator']},
    { url: '/siswa', icon: faUserGroup, page: 'Siswa Page', name: 'Siswa', role: ['Admin', 'Operator']},
    ...navLinkMasterData
]

export default function MainLayoutPage({ children }) {

    const path = usePathname()
    const router = useRouter()

    const [showSidebar, setShowSidebar] = useState(false)
    const [loggedAkun, setLoggedAkun] = useState(null)
    const [filteredPath, setFilteredPath] = useState(null)

    const getFilteredPath = () => {
        const updatedPath = navLink.find(item => path === item.url || (path.startsWith(item.url) && item.url !== '/'))
        setFilteredPath(updatedPath)
    }

    useEffect(() => {
        getFilteredPath()
        getLoggedAkun()
    }, [])

    const getLoggedAkun = async () => {
        const response = await M_Akun_getUserdata()
        if(response.success) {
            setLoggedAkun(response.data)
        }
    }

    const handleLogout = async () => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda akan logout dari Web ini",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak"
        }).then(result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    timer: 10000,
                    timerProgressBar: true,
                    allowEnterKey: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: async () => {
                        const response = await M_Akun_logout()
                        if(response.success) {
                            Swal.close()
                            router.push('/login')
                        }else{
                            Swal.close()
                            toast.fire({
                                title: 'Gagal Log Out!',
                                text: response.message,
                                icon: 'error'
                            })
                        }
                    }
                })
            }
        })
    }

    return (
        <div className="w-full h-screen flex md:bg-zinc-100 bg-white">
            <div className="md:w-2/12 hidden md:block h-full relative overflow-auto bg-zinc-900 px-5 py-8">
                <div className="flex items-center  gap-3">
                    <Image src={'/logo-sekolah-2.png'} width={30} height={30} alt="Logo Sekolah" />
                    <h1 className="text-zinc-200 font-bold text-2xl">
                        PP<span className="text-teal-500">DB</span>
                    </h1>
                </div>
                <hr className="my-5 opacity-0" />
                <button type="button" onClick={() => router.push('/')} className={` flex items-center px-3 py-2 rounded gap-5 w-full ${path !== '/' ? 'text-zinc-700 hover:bg-zinc-800 hover:text-zinc-300' : 'text-teal-300 bg-teal-500/10 hover:bg-teal-500/20'}`}>
                    <FontAwesomeIcon icon={faHouse} className={`w-4 h-4 ${path !== '/' ? 'text-inherit' : 'text-teal-500'}`} />
                    Dashboard
                </button>
                <hr className="my-2 opacity-0" />
                <p className="text-zinc-600 font-bold">
                    MASTER DATA
                </p>
                <hr className="my-2 opacity-0" />
                {loggedAkun ? (
                    <div className="space-y-1">
                        {navLinkMasterData.map((value, index) => value['role'].includes(loggedAkun.role_akun) && (
                        <button key={index} type="button" onClick={() => router.push(value.url)}  className={` flex items-center px-3 py-2 rounded gap-5 w-full text-start ${!path.startsWith(value.url)  ? 'text-zinc-700 hover:bg-zinc-800 hover:text-zinc-300' : 'text-teal-300 bg-teal-500/10 hover:bg-teal-500/20'}`}>
                            <FontAwesomeIcon icon={value.icon} className={`w-4 h-4 ${!path.startsWith(value.url) ? 'text-inherit' : 'text-teal-500'}`} />
                            {value.name}
                        </button>
                    ))}
                    </div>
                ):(
                    <div className="space-y-1">
                        <div className="w-full h-8 rounded skeleton  bg-zinc-700 animate-pulse"></div>
                        <div className="w-full h-8 rounded skeleton  bg-zinc-700 animate-pulse"></div>
                        <div className="w-full h-8 rounded skeleton  bg-zinc-700 animate-pulse"></div>
                        <div className="w-full h-8 rounded skeleton  bg-zinc-700 animate-pulse"></div>
                        <div className="w-full h-8 rounded skeleton  bg-zinc-700 animate-pulse"></div>
                    </div>
                )}
            </div>
            {showSidebar ? <Sidebar setShowSidebar={setShowSidebar} /> : (
                <div className="md:w-10/12 w-full h-full relative overflow-auto">
                    <div className="px-5 py-5 bg-white">
                        {filteredPath === null ? (
                            <div className="loading loading-spinner text-teal-500"></div>
                        ):(
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <button type="button" onClick={() => setShowSidebar(state => !state)} className="w-7 h-7 md:hidden flex items-center justify-center text-zinc-600 border border-zinc-200 hover:border-zinc-500 rounded">
                                        <FontAwesomeIcon icon={faBars} className="w-3 h-3 text-inherit" />
                                    </button>
                                    <h1 className="text-teal-400 flex items-center gap-3 font-bold md:text-2xl">
                                        <FontAwesomeIcon icon={filteredPath.icon} className="md:w-5 md:h-5 w-3 h-3 text-inherit" />
                                        {filteredPath.page}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="space-y-1 hidden md:flex flex-col items-end text-end text-zinc-700">
                                        {loggedAkun ? (
                                            <p className="text-sm">{loggedAkun.email_akun}</p>
                                        ): (
                                            <div className="w-20 h-4 rounded bg-zinc-300 animate-pulse"></div>
                                        )}
                                        {loggedAkun ? (
                                            <p className="text-xs opacity-60">{loggedAkun.role_akun}</p>
                                        ):(
                                            <div className="w-10 h-3 rounded bg-zinc-300 animate-pulse"></div>
                                        )}
                                    </div>
                                    <button type="button" onClick={() => handleLogout()} className="w-7 h-7 md:w-fit md:h-fit md:px-3 md:py-2 flex items-center justify-center text-zinc-600 border border-zinc-200 hover:border-zinc-500 rounded md:gap-2 hover:bg-zinc-100">
                                        <FontAwesomeIcon icon={faSignOut} className="w-3 h-3 text-inherit" />
                                        <span className="hidden md:block">Keluar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="md:p-5 w-full text-zinc-700">
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}

function Sidebar({ setShowSidebar }) {
    const router = useRouter()
    const path = usePathname()

    const [loggedAkun, setLoggedAkun] = useState(null)
    const [filteredPath, setFilteredPath] = useState(null)

    const getFilteredPath = () => {
        const updatedPath = navLink.find(item => path === item.url || (path.startsWith(item.url) && item.url !== '/'))
        setFilteredPath(updatedPath)
    }

    useEffect(() => {
        getFilteredPath()
        getLoggedAkun()
    }, [])

    const getLoggedAkun = async () => {
        const response = await M_Akun_getUserdata()
        if(response.success) {
            setLoggedAkun(response.data)
        }
    }

    return (
        <div className="md:hidden w-full h-full relative overflow-auto p-5 bg-zinc-900">
            <div className="flex items-center justify-between">
                <div className="flex items-center  gap-3">
                    <Image src={'/logo-sekolah-2.png'} width={20} height={20} alt="Logo Sekolah" />
                    <h1 className="text-zinc-200 font-bold text-2xl">
                        PP<span className="text-teal-500">DB</span>
                    </h1>
                </div>
                <button type="button" onClick={() => setShowSidebar(state => !state)} className="w-7 h-7 rounded border-zinc-700 text-zinc-500 border">
                    <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-inherit" />
                </button>
            </div>
            <hr className="my-5 opacity-0" />
            <button type="button" onClick={() => router.push('/')} className={` flex items-center px-3 py-2 rounded gap-5 w-full ${path !== '/' ? 'text-zinc-700 hover:bg-zinc-800 hover:text-zinc-300' : 'text-teal-300 bg-teal-500/10 hover:bg-teal-500/20'}`}>
                <FontAwesomeIcon icon={faHouse} className={`w-4 h-4 ${path !== '/' ? 'text-inherit' : 'text-teal-500'}`} />
                Dashboard
            </button>
            <hr className="my-2 opacity-0" />
            <p className="text-zinc-600 font-bold">
                MASTER DATA
            </p>
            <hr className="my-2 opacity-0" />
            {loggedAkun ? (
                <div className="space-y-1">
                    {navLinkMasterData.map((value, index) => (
                    <button key={index} type="button" onClick={() => router.push(value.url)}  className={` flex items-center px-3 py-2 rounded gap-5 w-full ${!path.startsWith(value.url)  ? 'text-zinc-700 hover:bg-zinc-800 hover:text-zinc-300' : 'text-teal-300 bg-teal-500/10 hover:bg-teal-500/20'}`}>
                        <FontAwesomeIcon icon={value.icon} className={`w-4 h-4 ${!path.startsWith(value.url) ? 'text-inherit' : 'text-teal-500'}`} />
                        {value.name}
                    </button>
                ))}
                </div>
            ):(
                <div className="space-y-1">
                    <div className="w-full h-6 rounded bg-zinc-500 animate-pulse"></div>
                    <div className="w-full h-6 rounded bg-zinc-500 animate-pulse"></div>
                    <div className="w-full h-6 rounded bg-zinc-500 animate-pulse"></div>
                    <div className="w-full h-6 rounded bg-zinc-500 animate-pulse"></div>
                    <div className="w-full h-6 rounded bg-zinc-500 animate-pulse"></div>
                </div>
            )}
        </div>
    )
}