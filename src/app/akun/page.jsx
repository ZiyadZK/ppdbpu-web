'use client'

import MainLayoutPage from "@/components/mainLayout"
import { toast } from "@/libs/alert"
import { M_Akun_create, M_Akun_delete, M_Akun_getAll, M_Akun_update } from "@/libs/models/M_Akun"
import { M_Pegawai_getAll } from "@/libs/models/M_Pegawai"
import { faEdit, faEye, faFile, faSave } from "@fortawesome/free-regular-svg-icons"
import { faExclamationTriangle, faPlusSquare, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { nanoid } from "nanoid"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function AkunPage() {

    const [loadingFetch, setLoadingFetch] = useState({
        akun: '', pegawai: ''
    })
    const [formTambah, setFormTambah] = useState({
        id_akun: '', id_pegawai_akun: '', nama_akun: '', email_akun: '', password_akun: '', role_akun: 'Operator'
    })
    const [alertFormTambah, setAlertFormTambah] = useState(false)

    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [dataPegawai, setDataPegawai] = useState([])
    const [filteredDataPegawai, setFilteredDataPegawai] = useState([])
    const [searchAkun, setSearchAkun] = useState('')
    const [searchPegawai, setSearchPegawai] = useState('')
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedData, setSelectedData] = useState([])


    

    const getData = async () => {
        const response = await M_Akun_getAll()
        if(response.success) {
            setData(response.data)
            setFilteredData(response.data)
        }
        setLoadingFetch(state => ({...state, akun: 'fetched'}))
    }
    const getPegawai = async () => {
        const response = await M_Pegawai_getAll()
        if(response.success) {
            setDataPegawai(response.data)
            setFilteredDataPegawai(response.data)
        }
        setLoadingFetch(state => ({...state, pegawai: 'fetched'}))
    }

    useEffect(() => {
        getData()
        getPegawai()
    }, [])

    const handleFormTambah_setPegawai = (id_pegawai_akun, nama_akun) => {
        setFormTambah(state => ({...state, id_pegawai_akun, nama_akun}))
    }

    const submitSearchPegawai = () => {
        let updatedData = dataPegawai

        if(searchPegawai !== '') {
            updatedData = updatedData.filter(pegawai => 
                pegawai['nama_pegawai'].toLowerCase().includes(searchPegawai.toLowerCase()) ||
                pegawai['nip'].toLowerCase().includes(searchPegawai.toLowerCase())
            )
        }

        setFilteredDataPegawai(updatedData)
    }

    useEffect(() => {
        submitSearchPegawai()
    }, [searchPegawai])

    const submitSearchAkun = () => {
        let updatedData = data

        if(searchAkun !== '') {
            updatedData = updatedData.filter(akun => 
                akun['nama_akun'].toLowerCase().includes(searchAkun.toLowerCase()) ||
                akun['email_akun'].toLowerCase().includes(searchAkun.toLowerCase()) ||
                akun['password_akun'].toLowerCase().includes(searchAkun.toLowerCase())
            )
        }

        setFilteredData(updatedData)
    }

    useEffect(() => {
        submitSearchAkun()
    }, [searchAkun])

    const submitFormTambah = async (e, modal) => {
        e.preventDefault()
        const updatedData = {...formTambah, id_akun: nanoid()}
        if(Object.values(updatedData).includes('')) {
            return setAlertFormTambah(true)
        }

        document.getElementById(modal).close()
        Swal.fire({
            title: 'Sedang memproses data',
            timer: 10000,
            timerProgressBar: true,
            showConfirmButton: false,
            didOpen: async () => {
                const response = await M_Akun_create(updatedData)
                await getData()
                Swal.close()
                if(response.success) {
                    toast.fire({
                        title: 'Sukses',
                        icon: 'success',
                        text: response.message
                    })
                }else{
                    toast.fire({
                        title: 'Gagal',
                        icon: 'error',
                        text: response.message
                    })
                }
                
            }
        })
    }

    const handleDeleteAkun = async (id_akun) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan menghapus akun tersebut',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEnterKey: false,
                    allowEscapeKey: false,
                    timer: 10000,
                    timerProgressBar: true,
                    didOpen: async () => {
                        const response = await M_Akun_delete(id_akun ? [id_akun] : selectedData)
                        Swal.close()
                        if(response.success) {
                            await getData()
                            return toast.fire({
                                title: 'Sukses',
                                text: 'Berhasil menghapus akun tersebut',
                                icon: 'success'
                            })
                        }else{
                            return toast.fire({
                                title: 'Gagal',
                                text: response.message,
                                icon: 'error'
                            })
                        }
                    }
                }).then(() => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Gagal memproses data, silahkan hubungi administrator',
                        icon: 'error'
                    })
                })
            }
        })
    }

    const submitEditAkun = async (e, modal, id_akun) => {
        e.preventDefault()

        const jsonBody = {
            id_pegawai_akun: e.target[0].value,
            nama_akun: e.target[1].value,
            email_akun: e.target[2].value,
            password_akun: e.target[3].value,
            role_akun: e.target[4].value
        }
        document.getElementById(modal).close()

        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan menyimpan perubahan akun tersebut',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then(result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEnterKey: false,
                    allowEscapeKey: false,
                    timer: 10000,
                    timerProgressBar: true,
                    didOpen: async () => {
                        const response = await M_Akun_update(id_akun ? [id_akun] : selectedData, jsonBody)
                        Swal.close()
                        if(response.success) {
                            await getData()
                            return toast.fire({
                                title: 'Sukses',
                                text: 'Berhasil mengubah akun tersebut',
                                icon: 'success'
                            })
                        }else{
                            return toast.fire({
                                title: 'Gagal',
                                text: response.message,
                                icon: 'error'
                            })
                        }
                    }
                }).then(() => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Gagal memproses data, silahkan hubungi administrator',
                        icon: 'error'
                    })
                })
            }else{
                document.getElementById(modal).showModal()
            }
        })
    }

    const handleSelectData = async (id_akun) => {
        if(selectedData.includes(id_akun)) {
            const updatedSelectedData = selectedData.filter(id => id !== id_akun)
            setSelectedData(updatedSelectedData)
        }else{
            const updatedSelectedData = [...selectedData, id_akun]
            setSelectedData(updatedSelectedData)
        }
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
                            <input type="text" value={searchPegawai} onChange={e => setSearchPegawai(e.target.value)} className="border px-3 py-1 rounded md:text-sm text-xs" placeholder="Cari disini" />
                        </div>
                        <hr className="my-1 opacity-0" />
                        <form onSubmit={(e) => submitFormTambah(e, "tambah_akun")}>
                            <div className="relative overflow-auto w-full max-h-[200px] space-y-1 ">
                                {filteredDataPegawai.slice(0, 20).map((value, index) => (
                                    <button key={index} type="button" onClick={() => handleFormTambah_setPegawai(value['id_pegawai'], value['nama_pegawai'])} className="p-2 rounded-lg border w-full flex items-center justify-between bg-zinc-50 hover:bg-white hover:shadow hover:border-zinc-700 transition-all duration-300">
                                        <div className="space-y-1 text-start">
                                            <p className="text-sm font-medium">
                                                {value['nama_pegawai']}
                                            </p>
                                            <p className="opacity-50 text-xs">
                                                {value['nip']}
                                            </p>
                                        </div>
                                        <p className="md:text-sm text-xs opacity-50">
                                            {value['jabatan']}
                                        </p>
                                    </button>
                                ))}
                            </div>
                            <hr className="my-1 opacity-0" />
                            {alertFormTambah && (
                                <div  id="alert_formTambah" className="p-3 rounded border border-red-500 bg-red-100 text-red-600 flex items-center gap-3 text-xs md:text-sm">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-inherit" />
                                    Anda harus memilih Pegawai terlebih dahulu!
                                </div>
                            )}
                            <hr className="my-1 opacity-0" />
                            <div className="space-y-3">
                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                    <p className="opacity-50 w-full md:w-1/3">
                                        ID Pegawai
                                    </p>
                                    <input type="text" readOnly required className="w-full md:w-2/3 border px-3 py-1 rounded" defaultValue={formTambah['id_pegawai_akun']} placeholder="ID Pegawai" />
                                </div>
                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                    <p className="opacity-50 w-full md:w-1/3">
                                        Nama
                                    </p>
                                    <input type="text" readOnly required className="w-full md:w-2/3 border px-3 py-1 rounded" defaultValue={formTambah['nama_akun']} placeholder="Nama Pegawai" />
                                </div>
                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                    <p className="opacity-50 w-full md:w-1/3">
                                        Email
                                    </p>
                                    <input type="text" required className="w-full md:w-2/3 border px-3 py-1 rounded" value={formTambah['email_akun']} onChange={e => setFormTambah(state => ({...state, email_akun: e.target.value}))} placeholder="Email Akun" />
                                </div>
                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                    <p className="opacity-50 w-full md:w-1/3">
                                        Password
                                    </p>
                                    <input type="text" required className="w-full md:w-2/3 border px-3 py-1 rounded" value={formTambah['password_akun']} onChange={e => setFormTambah(state => ({...state, password_akun: e.target.value}))} placeholder="Password Akun" />
                                </div>
                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                    <p className="opacity-50 w-full md:w-1/3">
                                        Role
                                    </p>
                                    <select value={formTambah['role_akun']} onChange={e => setFormTambah(state => ({...state, role_akun: e.target.value}))} className="w-full md:w-2/3 border px-3 py-1 rounded">
                                        <option value="Operator">Operator</option>
                                        <option value="Account Manager">Account Manager</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="flex items-center justify-center w-fit px-3 py-2 rounded gap-3 text-white bg-green-500 focus:bg-green-600 hover:bg-green-400">
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
                        <input type="text" value={searchAkun} onChange={e => setSearchAkun(e.target.value)} className="px-3 py-1 rounded border bg-zinc-100 w-full text-zinc-700" placeholder="Cari disini" />
                    </div>
                </div>
                {loadingFetch['akun'] !== 'fetched' ? (
                    <div className="w-full flex justify-center items-center gap-3 text-zinc-300 py-6">
                        <div className="loading loading-spinner loading-md "></div>
                        Sedang mendapatkan data
                    </div>
                ): (
                    <div className="divide-y py-2 divide-zinc-200 relative overflow-auto w-full max-h-[500px] md:max-h-[500px]">
                        {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((akun, index) => (
                            <div key={index} className="grid grid-cols-12 hover:bg-zinc-50 *:px-3 *:py-4 text-zinc-700 text-xs md:text-sm group">
                                <div className="col-span-6 md:col-span-3 flex items-center gap-2 ">
                                    <input type="checkbox" checked={selectedData.includes(akun['id_akun'])} onChange={() => handleSelectData(akun['id_akun'])} />
                                    {akun['email_akun']}
                                </div>
                                <div className="col-span-3 hidden md:flex items-center gap-2 opacity-70">
                                    {akun['nama_akun']}
                                    <button type="button" className="w-5 h-5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center md:opacity-0 group-hover:opacity-100">
                                        <FontAwesomeIcon icon={faSearch} className="w-2 h-2 text-inherit" />
                                    </button>
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-2">
                                    {akun['password_akun']}
                                </div>
                                <div className="col-span-2 hidden md:flex items-center gap-2 opacity-70">
                                    {akun['role_akun']}
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
                                                    <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" value={akun['id_pegawai_akun']} placeholder="ID Pegawai" />
                                                </div>
                                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                    <p className="opacity-50 w-full md:w-1/3">
                                                        Nama
                                                    </p>
                                                    <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" value={akun['nama_akun']} placeholder="Nama Pegawai" />
                                                </div>
                                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                    <p className="opacity-50 w-full md:w-1/3">
                                                        Email
                                                    </p>
                                                    <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" value={akun['email_akun']} placeholder="Email Akun" />
                                                </div>
                                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                    <p className="opacity-50 w-full md:w-1/3">
                                                        Password
                                                    </p>
                                                    <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" value={akun['password_akun']} placeholder="Password Akun" />
                                                </div>
                                                <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                    <p className="opacity-50 w-full md:w-1/3">
                                                        Role
                                                    </p>
                                                    <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" value={akun['role_akun']} placeholder="Role Akun" />
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
                                            <form onSubmit={e => submitEditAkun(e, `edit_akun_${index}`, akun['id_akun'])}>
                                                <div className="space-y-3">
                                                    <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                        <p className="opacity-50 w-full md:w-1/3">
                                                            ID Pegawai
                                                        </p>
                                                        <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" defaultValue={akun['id_pegawai_akun']} placeholder="ID Pegawai" />
                                                    </div>
                                                    <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                        <p className="opacity-50 w-full md:w-1/3">
                                                            Nama
                                                        </p>
                                                        <input type="text" disabled required className="w-full md:w-2/3 border px-3 py-1 rounded" defaultValue={akun['nama_akun']} placeholder="Nama Pegawai" />
                                                    </div>
                                                    <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                        <p className="opacity-50 w-full md:w-1/3">
                                                            Email
                                                        </p>
                                                        <input type="text" required className="w-full md:w-2/3 border px-3 py-1 rounded" defaultValue={akun['email_akun']} placeholder="Email Akun" />
                                                    </div>
                                                    <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                        <p className="opacity-50 w-full md:w-1/3">
                                                            Password
                                                        </p>
                                                        <input type="text" required className="w-full md:w-2/3 border px-3 py-1 rounded" defaultValue={akun['password_akun']} placeholder="Password Akun" />
                                                    </div>
                                                    <div className="flex md:items-center flex-col md:flex-row md:text-sm text-xs">
                                                        <p className="opacity-50 w-full md:w-1/3">
                                                            Role
                                                        </p>
                                                        <select defaultValue={akun['role_akun']} required  className="w-full md:w-2/3 border px-3 py-1 rounded">
                                                            <option value="Operator">Operator</option>
                                                            <option value="Account Manager">Account Manager</option>
                                                            <option value="Admin">Admin</option>
                                                        </select>
                                                    </div>
                                                    <button type="submit" className="flex items-center justify-center w-fit px-3 py-2 rounded gap-3 text-white bg-green-500 focus:bg-green-600 hover:bg-green-400">
                                                        <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                                                        Simpan
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </dialog>
                                    <button type="button" onClick={() => handleDeleteAkun(akun['id_akun'])} className="w-6 h-6 flex items-center justify-center bg-red-200 text-red-700 rounded hover:bg-red-300">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                </div>
                            </div>
                        ))}
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