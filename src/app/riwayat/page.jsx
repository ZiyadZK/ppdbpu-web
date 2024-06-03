'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

export default function RiwayatPage() {

    const [data, setData] = useState([])
    const [searchData, setSearchData] = useState('')

    return (
        <MainLayoutPage>
            <div className="md:rounded-2xl bg-white w-full p-5 text-zinc-700">
                <div className="grid grid-cols-12 border *:px-3 *:py-2 rounded-lg text-zinc-300 text-sm">
                    <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                        Akun
                    </div>
                    <div className="col-span-5 hidden md:flex items-center gap-2">
                        Aksi - Keterangan
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-2">
                        Tanggal - Waktu
                    </div>
                    <div className="col-span-6 md:col-span-2 flex items-center gap-2">
                        <input type="text" value={searchData} onChange={e => setSearchData(e.target.value)} className="px-3 py-1 rounded border bg-zinc-100 w-full text-zinc-700" placeholder="Cari disini" />
                    </div>
                </div>
                <div className="divide-y relative py-2 overflow-auto w-full max-h-[400px]">
                    <div className="grid grid-cols-12 *:px-3 *:py-4 text-sm hover:bg-zinc-50">
                        <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                            <div className="">
                                <p>
                                    Ziyad Jahizh Kartiwa
                                </p>
                                <p className="text-xs opacity-50">
                                    yad@gmail.com
                                </p>
                            </div>
                        </div>
                        <div className="col-span-5 hidden md:flex flex-col opacity-50">
                            <p className="px-2 py-1 w-fit rounded-full text-xs bg-green-100 text-green-500">
                                Tambah
                            </p>
                            <p>
                                Menambahkan bla bla bla ke dalam data siswa
                            </p>
                        </div>
                        <div className="col-span-2 hidden md:flex items-center gap-2 opacity-50">
                            12/10/2022 - 17:30
                        </div>
                        <div className="col-span-6 md:col-span-2 flex items-center justify-center gap-2">
                            <button type="button" className="w-6 h-6 flex items-center justify-center bg-blue-200 text-blue-700 rounded hover:bg-blue-300">
                                <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}