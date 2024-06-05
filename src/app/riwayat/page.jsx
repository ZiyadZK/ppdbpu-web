'use client'

import MainLayoutPage from "@/components/mainLayout"
import { M_Riwayat_getAll } from "@/libs/models/M_Riwayat"
import { faClipboard, faEye, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import chalk from "chalk"
import prettyJs from "pretty-js"
import { useEffect, useState } from "react"
import JsonFormatter from "react-json-formatter"

const colorizeCode = (code) => {
    // Match object keys and values, and color them accordingly
    return code
      .replace(/\[/g, chalk.grey('['))
      .replace(/\]/g, chalk.grey(']'))
      .replace(/\{/g, chalk.white('{'))
      .replace(/\}/g, chalk.white('}'))
      .replace(/:\s/g, chalk.white(': ')) // Coloring colons as white
      .replace(/(['"])?([a-zA-Z_]\w*)\1(?=\s*:)/g, (match, p1, p2) => chalk.cyan(p2)) // Coloring keys as cyan
      .replace(/:\s*([^,}\s]+)/g, (match, p1) => `: ${chalk.hex('#FFA500')(p1)}`); // Coloring values as orange
  };

export default function RiwayatPage() {

    const [data, setData] = useState([])
    const [searchData, setSearchData] = useState('')
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedData, setSelectedData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [loadingFetch, setLoadingFetch] = useState('')
    const [selectAllData, setSelectAllData] = useState(false)

    const getData = async () => {
        setLoadingFetch('loading')
        const response = await M_Riwayat_getAll()
        if(response.success) {
            setData(response.data)
            setFilteredData(response.data)
        }
        setLoadingFetch('fetched')
    }

    useEffect(() => {
        getData()
    }, [])

    const handleSelectData = (no_riwayat) => {
        let updatedData
        if(selectedData.includes(no_riwayat)) {
            updatedData = selectedData.filter(value => value !== no_riwayat)
        }else{
            updatedData = [...selectedData, no_riwayat]
        }

        setSelectedData(updatedData)
    }

    const handleSelectAllData = () => {
        if(!selectAllData) {
            let updatedData = selectedData
            filteredData.forEach(value => {
                if(!updatedData.includes(value.no_riwayat)) {
                    updatedData.push(value.no_riwayat)
                }
            })
    
            setSelectedData(updatedData)
            setSelectAllData(state => true)
        }else{
            setSelectedData([])
            setSelectAllData(state => false)
        }
    }


    return (
        <MainLayoutPage>
            <div className="md:rounded-2xl bg-white w-full p-5 text-zinc-700">
                <div className="grid grid-cols-12 border *:px-3 *:py-2 rounded-lg text-zinc-300 text-sm">
                    <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                        <input type="checkbox" checked={selectAllData} onChange={() => handleSelectAllData()} />
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
                {loadingFetch !== 'fetched' && (
                    <div className="flex w-full justify-center py-5">
                        <div className="loading loading-dots text-zinc-500 loading-md"></div>
                    </div>
                )}
                {loadingFetch === 'fetched' && (
                    <div className="divide-y relative py-2 overflow-auto w-full max-h-[400px]">
                        {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((value, index) => (
                            <div key={index} className="grid grid-cols-12 *:px-3 *:py-4 text-sm hover:bg-zinc-50">
                                <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                                    <input type="checkbox" checked={selectedData.includes(value['no_riwayat'])} onChange={() => handleSelectData(value['no_riwayat'])} />
                                    <div className="">
                                        <p>
                                            {value['nama_akun']}
                                        </p>
                                        <p className="text-xs opacity-50">
                                            {value['email_akun']}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-5 hidden md:flex flex-col">
                                    {value['aksi'] === 'Tambah' && (
                                        <p className="px-2 py-1 w-fit rounded-full text-xs bg-green-600 text-white">
                                            Tambah
                                        </p>
                                    )}
                                    {value['aksi'] === 'Hapus' && (
                                        <p className="px-2 py-1 w-fit rounded-full text-xs bg-red-600 text-white">
                                            Hapus
                                        </p>
                                    )}
                                    {value['aksi'] === 'Ubah' && (
                                        <p className="px-2 py-1 w-fit rounded-full text-xs bg-orange-600 text-white">
                                            Ubah
                                        </p>
                                    )}
                                    <p>
                                        {value['keterangan']}
                                    </p>
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-2 opacity-50">
                                    {value['tanggal'].split('-').reverse().join('/')} - {value['waktu']}
                                </div>
                                <div className="col-span-6 md:col-span-2 flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => document.getElementById(`modal_info_${index}`).showModal()} className="px-3 py-2 flex items-center justify-center rounded-full bg-zinc-100 gap-4 hover:bg-zinc-200">
                                        <FontAwesomeIcon icon={faEye} className="w-4 h-4 text-inherit" />
                                        Lihat Data
                                    </button>
                                    <dialog id={`modal_info_${index}`} className="modal">
                                        <div className="modal-box w-full max-w-5xl">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <h3 className="font-bold text-lg">JSON Data</h3>
                                            <hr className="my-3 opacity-0" />
                                            <div className="w-full p-5 bg-zinc-800 rounded-2xl text-white">
                                                <textarea value={prettyJs(JSON.parse(value['data']))} readOnly rows={30} className="bg-transparent outline-none w-full h-fit" />
                                            </div>
                                        </div>
                                    </dialog>
                                </div>
                            </div>
                        )).reverse()}
                    </div>
                )}
                <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center md:justify-between text-xs md:text-sm my-3">
                    <div className="flex md:items-center gap-2 md:justify-start justify-between">
                        <div className="flex items-center gap-2">
                            <p className="px-2 py-1 rounded bg-zinc-100 text-zinc-600 font-medium">
                                {selectedData.length}
                            </p>
                            <p>
                                Data dipilih
                            </p>
                        </div>
                        {selectedData.length > 0 && <div className="flex items-center gap-2">
                            <button type="button" onClick={() => handleDeleteAkun()} className="w-6 h-6 flex items-center justify-center bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300">
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                            </button>
                            <button type="button" onClick={() => setSelectedData([])} className="w-6 h-6 flex items-center justify-center bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300">
                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                            </button>
                        </div>}
                    </div>
                    <div className="flex items-center justify-between w-full md:w-fit gap-5">
                        <p>{data.length} Data</p>
                        <div className="join">
                            <button className="join-item px-3 py-2 bg-zinc-100 hover:bg-zinc-200" onClick={() => setPagination(state => state > 1 ? state - 1 : state)}>«</button>
                            <button className="join-item px-3 py-2 bg-zinc-100 hover:bg-zinc-200">Page {pagination}</button>
                            <button className="join-item px-3 py-2 bg-zinc-100 hover:bg-zinc-200" onClick={() => setPagination(state => state < Math.ceil(data.length / totalList) ? state + 1 : state)}>»</button>
                        </div>
                        <select value={totalList} onChange={e => setTotalList(e.target.value)} className="w-fit px-3 py-2 rounded hover:bg-zinc-100 text-zinc-700 cursor-pointer">
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