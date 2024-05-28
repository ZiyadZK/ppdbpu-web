'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faEdit, faEye, faFile, faSave } from "@fortawesome/free-regular-svg-icons"
import { faPlusSquare, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function AkunPage() {

    const submitTambahAkun = async (e, modal) => {
        e.preventDefault()

        document.getElementById(modal).close()
    }

    return (
        <MainLayoutPage>
            <div className="md:rounded-2xl bg-white w-full p-5 text-zinc-700">
                <button type="button" onClick={() => document.getElementById('tambah_akun').showModal()} className="w-fit px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 focus:bg-blue-600 text-white flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faPlusSquare} className="w-4 h-4 text-inherit" />
                    Tambah Akun
                </button>
                <dialog id="tambah_akun" className="modal">
                    <div className="modal-box md:max-w-[600px]">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Tambah Akun Baru</h3>
                        <hr className="my-3 opacity-0" />
                        <div className="flex items-center justify-between">
                            <p className="opacity-60 md:text-sm text-xs">
                                Pilih Pegawai
                            </p>
                            <input type="text" className="border px-3 py-1 rounded md:text-sm text-xs" placeholder="Cari disini" />
                        </div>
                        <hr className="my-1 opacity-0" />
                        <form onSubmit={(e) => submitTambahAkun(e)}>
                            <div className="relative overflow-auto w-full max-h-[200px] space-y-1">
                                {Array.from({ length: 30 }).map((_, index) => (
                                    <button key={index} type="button" className="p-2 rounded-lg border w-full flex items-center justify-between">
                                        <div className="space-y-1 text-start">
                                            <p className="text-sm font-medium">
                                                Ziyad Jahizh Kartiwa
                                            </p>
                                            <p className="opacity-50 text-xs">
                                                1212121212
                                            </p>
                                        </div>
                                        <p className="md:text-sm text-xs opacity-50">
                                            Kepala Sekolah
                                        </p>
                                    </button>
                                ))}
                            </div>
                            <hr className="my-1 opacity-0" />
                            <div className="space-y-3">
                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                    <p className="opacity-50 w-full md:w-1/3">
                                        ID Pegawai
                                    </p>
                                    <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="ID Pegawai" />
                                </div>
                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                    <p className="opacity-50 w-full md:w-1/3">
                                        Nama
                                    </p>
                                    <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="Nama Pegawai" />
                                </div>
                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                    <p className="opacity-50 w-full md:w-1/3">
                                        Email
                                    </p>
                                    <input type="text" required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="Email Akun" />
                                </div>
                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                    <p className="opacity-50 w-full md:w-1/3">
                                        Password
                                    </p>
                                    <input type="text" required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="Password Akun" />
                                </div>
                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                    <p className="opacity-50 w-full md:w-1/3">
                                        Role
                                    </p>
                                    <select className="w-full md:w-2/3 border px-3 py-1 rounded">
                                        <option value="Operator">Operator</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <button type="button" className="flex items-center justify-center w-fit px-3 py-2 rounded gap-3 text-white bg-green-500 focus:bg-green-600 hover:bg-green-400">
                                    <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
                <hr className="my-2 opacity-0" />
                <div className="grid grid-cols-12 border *:px-3 *:py-2 rounded-lg text-zinc-300 text-sm">
                    <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                        <input type="checkbox" />
                        Email
                    </div>
                    <div className="col-span-3 hidden md:flex items-center gap-2">
                        Nama
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-2">
                        Password
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-2">
                        Role
                    </div>
                    <div className="col-span-6 md:col-span-2 flex items-center gap-2">
                        <input type="text" className="px-3 py-1 rounded border bg-zinc-100 w-full text-zinc-700" placeholder="Cari disini" />
                    </div>
                </div>
                <div className="divide-y py-2 divide-zinc-200 relative overflow-auto w-full max-h-[500px] md:max-h-[500px]">
                    {Array.from({ length: 50 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-12 hover:bg-zinc-50 *:px-3 *:py-4 text-zinc-700 text-xs md:text-sm group">
                            <div className="col-span-6 md:col-span-3 flex items-center gap-2 ">
                                <input type="checkbox" />
                                kakangtea74@gmail.com
                            </div>
                            <div className="col-span-3 hidden md:flex items-center gap-2 opacity-70">
                                Ziyad Jahizh Kartiwa
                                <button type="button" className="w-5 h-5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center md:opacity-0 group-hover:opacity-100">
                                    <FontAwesomeIcon icon={faSearch} className="w-2 h-2 text-inherit" />
                                </button>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-2">
                                Password
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-2 opacity-70">
                                Role
                            </div>
                            <div className="col-span-6 md:col-span-2 flex items-center justify-center gap-2 md:opacity-0 group-hover:opacity-100">
                                <button type="button" onClick={() => document.getElementById(`info_akun_${index}`).showModal()} className="w-6 h-6 flex md:hidden items-center justify-center bg-cyan-200 text-cyan-700 rounded hover:bg-cyan-300">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                </button>
                                <dialog id={`info_akun_${index}`} className="modal">
                                    <div className="modal-box">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Info Akun</h3>
                                        <hr className="my-3 opacity-0" />
                                    
                                        <div className="space-y-3">
                                            <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                <p className="opacity-50 w-full md:w-1/3">
                                                    ID Pegawai
                                                </p>
                                                <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="ID Pegawai" />
                                            </div>
                                            <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                <p className="opacity-50 w-full md:w-1/3">
                                                    Nama
                                                </p>
                                                <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="Nama Pegawai" />
                                            </div>
                                            <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                <p className="opacity-50 w-full md:w-1/3">
                                                    Email
                                                </p>
                                                <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="Email Akun" />
                                            </div>
                                            <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                <p className="opacity-50 w-full md:w-1/3">
                                                    Password
                                                </p>
                                                <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="Password Akun" />
                                            </div>
                                            <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                <p className="opacity-50 w-full md:w-1/3">
                                                    Role
                                                </p>
                                                <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="Role Akun" />
                                            </div>
                                        </div>
                                    </div>
                                </dialog>
                                <button type="button" onClick={() => document.getElementById(`edit_akun_${index}`).showModal()} className="w-6 h-6 flex items-center justify-center bg-amber-200 text-amber-700 rounded hover:bg-amber-300">
                                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                </button>
                                <dialog id={`edit_akun_${index}`} className="modal">
                                <div className="modal-box">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">Edit Akun</h3>
                                        <hr className="my-3 opacity-0" />
                                        <form className="">
                                            <div className="space-y-3">
                                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                    <p className="opacity-50 w-full md:w-1/3">
                                                        ID Pegawai
                                                    </p>
                                                    <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="ID Pegawai" />
                                                </div>
                                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                    <p className="opacity-50 w-full md:w-1/3">
                                                        Nama
                                                    </p>
                                                    <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="Nama Pegawai" />
                                                </div>
                                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                    <p className="opacity-50 w-full md:w-1/3">
                                                        Email
                                                    </p>
                                                    <input type="text" required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="Email Akun" />
                                                </div>
                                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                    <p className="opacity-50 w-full md:w-1/3">
                                                        Password
                                                    </p>
                                                    <input type="text" required className="w-full md:w-2/3 border px-3 py-1 rounded" placeholder="Password Akun" />
                                                </div>
                                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                    <p className="opacity-50 w-full md:w-1/3">
                                                        Role
                                                    </p>
                                                    <select className="w-full md:w-2/3 border px-3 py-1 rounded">
                                                        <option value="Operator">Operator</option>
                                                        <option value="Admin">Admin</option>
                                                    </select>
                                                </div>
                                                <button type="button" className="flex items-center justify-center w-fit px-3 py-2 rounded gap-3 text-white bg-green-500 focus:bg-green-600 hover:bg-green-400">
                                                    <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                                                    Simpan
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </dialog>
                                <button type="button" className="w-6 h-6 flex items-center justify-center bg-red-200 text-red-700 rounded hover:bg-red-300">
                                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center md:justify-between text-xs md:text-sm my-3">
                    <div className="flex md:items-center gap-2 md:justify-start justify-between">
                        <div className="flex items-center gap-2">
                            <p className="px-2 py-1 rounded bg-zinc-100 text-zinc-600 font-medium">
                                2
                            </p>
                            <p>
                                Data dipilih
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" className="w-6 h-6 flex items-center justify-center bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button" className="w-6 h-6 flex items-center justify-center bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300">
                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button" className="w-6 h-6 flex items-center justify-center bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300">
                                <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-fit gap-5">
                        <p>1300 Data</p>
                        <div className="join">
                            <button className="join-item px-3 py-2 bg-zinc-100 hover:bg-zinc-200">«</button>
                            <button className="join-item px-3 py-2 bg-zinc-100 hover:bg-zinc-200">Page 22</button>
                            <button className="join-item px-3 py-2 bg-zinc-100 hover:bg-zinc-200">»</button>
                        </div>
                        <select className="w-fit px-3 py-2 rounded hover:bg-zinc-100 text-zinc-700 cursor-pointer">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}