'use client'

import { toast } from "@/libs/alert"
import { M_Akun_login } from "@/libs/models/M_Akun"
import { faEnvelope, faEye } from "@fortawesome/free-regular-svg-icons"
import { faKey, faSignIn, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {

    const router = useRouter()

    const [loginLoading, setLoginLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [loginForm, setLoginForm] = useState({
        email: '', password: '', rememberMe: false
    })

    const submitLoginForm = async (e) => {
        e.preventDefault()

        setLoginLoading(true)
        const duration = loginForm.rememberMe ? 1000 * 60 * 60 * 7 : 1000 * 60 * 60 * 1

        const response = await M_Akun_login(loginForm.email, loginForm.password, duration)
        if(response.success) {
            toast.fire({
                title: 'Berhasil login!',
                icon: 'success'
            }).then(() => {
                router.push('/')
            })
        }else{
            toast.fire({
                title: 'Gagal untuk login!',
                icon: 'error',
                text: response.message
            })
            setLoginLoading(false)
        }
    }

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-t from-teal-100">
            <form onSubmit={submitLoginForm} className="w-full h-full md:w-1/3 p-5 flex md:block justify-between flex-col md:rounded-2xl bg-white md:h-fit">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src={'/logo-sekolah-2.png'} width={20} height={20} alt="Logo Sekolah" />
                        <h1 className="text-zinc-600 font-bold text-2xl">
                            PP<span className="text-teal-500">DB</span>
                        </h1>
                    </div>
                    <p className="text-xs opacity-70 text-end">
                        SMK PU Negeri Bandung
                    </p>
                </div>
                <div className="md:my-10 md:px-20 space-y-2">
                    <div className="relative w-full flex justify-center">
                        <input type="text" disabled={loginLoading} required onChange={e => setLoginForm(state => ({...state, email: e.target.value}))} className="w-full rounded-full border border-zinc-100/0 bg-zinc-50 shadow-lg pl-12 pr-3 h-12 placeholder-shown:border-zinc-100 placeholder-shown:shadow-none placeholder-shown:bg-zinc-50/0 transition-all duration-300 outline-none peer" placeholder="Masukkan Email anda" />
                        <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center peer-placeholder-shown:text-zinc-600 text-zinc-400">
                            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-inherit" />
                        </div>
                    </div>
                    <div className="relative w-full flex justify-center">
                        <input disabled={loginLoading} type={`${showPass ? 'text' : 'password'}`} required onChange={e => setLoginForm(state => ({...state, password: e.target.value}))} className="w-full rounded-full border border-zinc-100/0 bg-zinc-50 shadow-lg pl-12 pr-3 h-12 placeholder-shown:border-zinc-100 placeholder-shown:shadow-none placeholder-shown:bg-zinc-50/0 transition-all duration-300 outline-none peer" placeholder="Masukkan Password anda" />
                        <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center peer-placeholder-shown:text-zinc-600 text-zinc-400">
                            <FontAwesomeIcon icon={faKey} className="w-4 h-4 text-inherit" />
                        </div>
                        <button type="button"  onClick={() => setShowPass(state => !state)} className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center peer-placeholder-shown:text-zinc-600 text-zinc-400">
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4 text-inherit" />
                        </button>
                    </div>
                    <div className="relative w-full">
                        <div className="flex items-center gap-5 text-xs md:text-sm">
                            <input type="checkbox" checked={loginForm['rememberMe']} onChange={() => setLoginForm(state => ({...state, rememberMe: !state['rememberMe']}))} />
                            Ingat Login saya
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <button type="submit" disabled={loginLoading} className="w-full md:w-1/2 py-2 px-3 rounded-lg bg-teal-500 hover:bg-teal-400 focus:bg-teal-600 text-white flex items-center justify-center gap-3">
                        <FontAwesomeIcon icon={loginLoading ? faSpinner : faSignIn} className={`${loginLoading ? 'w-6 h-6' : 'w-3 h-3'} text-inherit ${loginLoading && 'animate-spin'}`} />
                        <span className={`${loginLoading && 'hidden'}`}>Masuk</span>
                    </button>
                    <button className="w-full md:w-1/2 py-2 px-3 rounded-lg border text-zinc-700 hover:bg-zinc-100 flex items-center justify-center gap-3">
                        <FontAwesomeIcon icon={faSignIn} className="w-3 h-3 text-inherit" />
                        Lupa Password
                    </button>
                </div>
            </form>
        </div>
    )
}