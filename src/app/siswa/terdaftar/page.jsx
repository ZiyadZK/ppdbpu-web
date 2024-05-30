'use client'

import MainLayoutPage from "@/components/mainLayout"
import { toast } from "@/libs/alert"
import { xlsx_getSheets } from "@/libs/excel"
import { formatFileSize } from "@/libs/formatFileSize"
import { M_Akun_getUserdata } from "@/libs/models/M_Akun"
import { faEdit, faFile, faSave } from "@fortawesome/free-regular-svg-icons"
import { faCheck, faDownload, faPlusSquare, faPowerOff, faSearch, faTrash, faTurnDown, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

const formatData = {
    id_siswa: "ID siswa",
    nomor_reg: "Nomor registrasi",
    nisn: "NISN",
    nis: "NIS",
    id_rombel: "ID rombel",
    nama_siswa: "Nama siswa",
    jk_siswa: "Jenis kelamin siswa",
    tempat_lahir_siswa: "Tempat lahir siswa",
    tgl_lahir_siswa: "Tanggal lahir siswa",
    alamat_siswa: "Alamat siswa",
    no_telp_siswa: "Nomor telepon siswa",
    asal_sekolah: "Asal sekolah",
    no_ijazah: "Nomor ijazah",
    tgl_ijazah: "Tanggal ijazah",
    no_skhun: "Nomor SKHUN",
    no_kk: "Nomor kartu keluarga",
    agama: "Agama",
    status_anak: "Status anak",
    jml_saudara: "Jumlah saudara",
    alamat_email_siswa: "Alamat email siswa",
    password_siswa: "Password siswa",
    kebutuhan_khusus: "Kebutuhan khusus",
    bantuanp: "Bantuan pendidikan",
    kategori: "Kategori",
    foto: "Foto",
    nik: "NIK",
    tahun_masuk: "Tahun masuk",
    alat_transport: "Alat transportasi",
    tinggi_badan: "Tinggi badan",
    berat_badan: "Berat badan",
    jarak: "Jarak",
    lingkar_kepala: "Lingkar kepala",
    waktu_dari_rumah_ke_sekolah: "Waktu dari rumah ke sekolah",
    hobby: "Hobi",
    cita_cita: "Cita-cita",
    anak_ke_berapa: "Anak ke berapa",
    tinggal: "Tinggal",
    nama_ayah: "Nama ayah",
    no_telp_ayah: "Nomor telepon ayah",
    kebutuhan_ayah: "Kebutuhan ayah",
    pekerjaan_ayah: "Pekerjaan ayah",
    pendidikan_ayah: "Pendidikan ayah",
    penghasilan_ayah: "Penghasilan ayah",
    nama_ibu: "Nama ibu",
    no_telp_ibu: "Nomor telepon ibu",
    kebutuhan_ibu: "Kebutuhan ibu",
    pekerjaan_ibu: "Pekerjaan ibu",
    pendidikan_ibu: "Pendidikan ibu",
    penghasilan_ibu: "Penghasilan ibu",
    nama_wali: "Nama wali",
    kebutuhan_wali: "Kebutuhan wali",
    no_telp_wali: "Nomor telepon wali",
    pekerjaan_wali: "Pekerjaan wali",
    pendidikan_wali: "Pendidikan wali",
    penghasilan_wali: "Penghasilan wali",
    hubungan_wali: "Hubungan wali",
    nik_ayah: "NIK ayah",
    tempat_lahir_ayah: "Tempat lahir ayah",
    tanggal_lahir_ayah: "Tanggal lahir ayah",
    nik_ibu: "NIK ibu",
    tempat_lahir_ibu: "Tempat lahir ibu",
    tanggal_lahir_ibu: "Tanggal lahir ibu",
    nik_wali: "NIK wali",
    tempat_lahir_wali: "Tempat lahir wali",
    tanggal_lahir_wali: "Tanggal lahir wali"
};


export default function SiswaTerdaftarPage() {

    const [fileData, setFileData] = useState(null)
    const [infoFileData, setInfoFileData] = useState({
        ekstensi: '', ukuran: '', jumlahData: '', jumlahKolom: ''
    })
    const [uploadedFile, setUploadedFile] = useState(null)
    const [namaSheet, setNamaSheet] = useState('')
    const [loadingReadFormat, setLoadingReadFormat] = useState('')
    const [listSheet, setListSheet] = useState([])
    const [uploadedData, setUploadedData] = useState([])
    const [isUploadedDataValid, setIsUploadedDataValid] = useState(false)

    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedData, setSelectedData] = useState([])
    const [searchData, setSearchData] = useState('')
    const [sorting, setSorting] = useState({
        nama_siswa: '', nisn: ''
    })
    const [filterData, setFilterData] = useState({
        id_rombel: [], agama: [], jk_siswa: [], kategori: []
    })
    const [loadingFetch, setLoadingFetch] = useState('')

    const [loggedAkun, setLoggedAkun] = useState(null)

    const getLoggedAkun = async () => {
        const response = await M_Akun_getUserdata()
        if(response.success) {
            setLoggedAkun(response.data)
        }
    }

    useEffect(() => {
        getLoggedAkun()
    }, [])

    const handleChangeFile = async (file) => {
        if(file) {
            setFileData(file)

            const fileName = file.name
            const fileExtension = fileName.split('.').pop()
            if(fileExtension === 'xlsx' || fileExtension === 'csv'){
                const sheets = await xlsx_getSheets(file)
                setNamaSheet('')
                setListSheet(Object.keys(sheets))
            }else{
                setNamaSheet('')
                setListSheet([])
                setIsUploadedDataValid(false)
            }
        }else{
            setListSheet([])
        }
    }

    const handleImportFile = async (e, modal) => {
        e.preventDefault()

        const fileName = fileData.name
        const fileExtension = fileName.split('.').pop()
        const fileSize = formatFileSize(fileData.size)
        setInfoFileData(state => ({...state, ukuran: fileSize, ekstensi: fileExtension}))
        setLoadingReadFormat('loading')

        if(fileExtension === 'xlsx') {
            try {
                const response = await readXLSXFile(fileData)
                console.log(response)

                setInfoFileData(state => ({...state, jumlahData: response.data.length, jumlahKolom: Object.keys(response.data[0]).length}))
                let isNotSimilar = false
                Object.keys(response.data[0]).forEach(value => {
                    if(Object.keys(formatData).includes(value === false)) {
                        if(isNotSimilar === false) {
                            isNotSimilar = true
                            
                        }
                    }
                })

                if(isNotSimilar) {
                    setUploadedData([])
                    setLoadingReadFormat('fetched')
                    document.getElementById(modal).close()
                    return Swal.fire({
                        title: 'Gagal',
                        icon: 'error',
                        message: 'Terdapat kolom yang tidak sesuai!'
                    }).then(() => {
                        document.getElementById(modal).showModal()
                    })
                }

                setIsUploadedDataValid(true)
                setUploadedData(response.data)
                setLoadingReadFormat('fetched')
            } catch (error) {
                console.log(error)
                setUploadedFile(null)
                setUploadedData([])
                setIsUploadedDataValid(false)

                setLoadingReadFormat('fetched')
            }
        }

        if(fileExtension === 'csv') {
            Papa.parse(fileData, {
                worker: true,
                header: true,
                complete: async result => {
                    const formattedData = result.data.map(row => {
                        const newRow = {};
                        Object.keys(row).forEach(key => {
                            newRow[key.toLowerCase()] = row[key];
                        });
                        return newRow;
                    });
            
                    setInfoFileData(state => ({
                        ...state, 
                        jumlahData: formattedData.length, 
                        jumlahKolom: Object.keys(formattedData[0])
                    }));
            
                    let isNotSimilar = false;
                    Object.keys(formattedData[0]).forEach(value => {
                        if (!Object.keys(formatData).includes(value)) {
                            if (!isNotSimilar) {
                                isNotSimilar = true;
                            }
                        }
                    });
            
                    setUploadedFile(fileData);
            
                    if (isNotSimilar) {
                        setUploadedData([]);
                        setLoadingReadFormat('fetched');
                        document.getElementById(modal).close();
                        return Swal.fire({
                            title: 'Gagal',
                            icon: 'error',
                            text: 'Terdapat kolom yang tidak sesuai!'
                        }).then(() => {
                            document.getElementById(modal).showModal();
                        });
                    }
                    
                    setIsUploadedDataValid(true)
                    setUploadedData(formattedData);
                    setLoadingReadFormat('fetched');
                },
                error: async (error, file) => {
                    console.log(error);
                    console.log(file);
                    setUploadedData([]);
                    setLoadingReadFormat('fetched');
                    return Swal.fire({
                        title: 'Gagal',
                        icon: 'error',
                        text: 'Terdapat error disaat sedang memproses data'
                    }).then(() => {
                        document.getElementById(modal).showModal();
                    });
                }
            });
        }
    }

    const readXLSXFile = async file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = e => {
                const datas = new Uint8Array(e.target.result)
                const workbook = XLSX.read(datas, { type: 'array' })
                const worksheet = workbook.Sheets[namaSheet]
                const records = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
                if(typeof(worksheet) === 'undefined') {
                    reject({
                        success: false,
                        message: 'Sheet tidak ada!'
                    })
                }

                if(records.length > 1) {
                    const columns = records[0]
                    const dataObjects = records.slice(1).map((row, index) => {
                        if(row.length > 0) {
                            let obj = {}
                            columns.forEach((column, index) => {
                                const newColumn = column.toLowerCase()
                                obj[newColumn] = String(row[index])
                            })
                            return obj
                        }else{
                            return null
                        }
                    }).filter(obj => obj !== null)
                    console.log(dataObjects)
                    resolve({
                        success: true,
                        message: 'Sheet ditemukan!',
                        data: dataObjects
                    })
                }else{
                    resolve({
                        success: true,
                        message: 'Sheet ditemukan!',
                        data: []
                    })
                }
            }

            reader.onerror = reject

            reader.readAsArrayBuffer(file)
        })
    }

    return (
        <MainLayoutPage>
            <div className="bg-white h-full md:p-5 px-5 md:rounded-2xl">
                <div className="flex items-center w-full md:w-fit gap-2">
                    <button className="w-1/2 bg-blue-500 hover:bg-blue-400 focus:bg-blue-600 md:w-fit px-3 py-2 rounded flex items-center justify-center gap-3 text-white text-sm">
                        <FontAwesomeIcon icon={faPlusSquare} className="w-4 h-4 text-inherit" />
                        Tambah
                    </button>
                    <button type="button" onClick={() => document.getElementById('import_data').showModal()} className="w-1/2 bg-teal-500 hover:bg-teal-400 focus:bg-teal-600 md:w-fit px-3 py-2 rounded flex items-center justify-center gap-3 text-white text-sm">
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                        Import
                    </button>
                    <dialog id="import_data" className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">Import Data</h3>
                            <hr className="my-2 opacity-0" />
                            <p className="text-sm">File harus berupa .CSV atau .XLSX, dan usahakan kolom-kolom didalamnya sudah cocok dengan yang ada di sistem.</p>
                            <form onSubmit={e => handleImportFile(e, 'import_data')} className="space-y-2 mt-5">
                                <input type="file" onChange={e => handleChangeFile(e.target.files[0])} required className="w-full" />
                                {listSheet.length > 0 && (
                                    <select value={namaSheet} onChange={e => setNamaSheet(e.target.value)} required className="w-full px-3 py-2 mb-2 rounded border text-sm">
                                        <option value="" disabled>-- Nama Sheet --</option>
                                        {listSheet.map((value, index) => (
                                            <option key={index} value={value}>{value}</option>
                                        ))}
                                    </select>
                                )}
                                {fileData && (
                                    <button type="submit" className="px-3 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 focus:bg-teal-600 flex items-center gap-3 text-white text-sm">
                                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                                        Import
                                    </button>
                                )}
                            </form>
                            <hr className="my-1 opacity-0" />
                            {uploadedFile && (
                                <div className="p-3 rounded-lg border text-sm space-y-2">
                                    <button type="button" onClick={() => document.getElementById('cek_kolom').showModal()} className="px-3 py-2 rounded-full text-xs flex items-center justify-center gap-3 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-300">
                                        <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-inherit" />
                                        Cek Kolom
                                    </button>
                                    <dialog id="cek_kolom" className="modal">
                                        <div className="modal-box">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            <hr className="my-2 opacity-0" />
                                            <div className="grid grid-cols-12 border p-3 rounded-lg">
                                                <div className="col-span-10 flex justify-center items-center text-sm opacity-50">
                                                    Nama Kolom
                                                </div>
                                                <div className="col-span-2 flex justify-center items-center text-sm opacity-50">
                                                    Status
                                                </div>
                                            </div>
                                            <div className="divide-y relative overflow-auto w-full max-h-[500px]">
                                                {Object.keys(formatData).map((kolomSistem, index) => (
                                                    <div key={index} className="grid grid-cols-12 p-3 rounded-lg">
                                                        <div className="col-span-10 flex justify-center items-center text-sm ">
                                                            {kolomSistem}
                                                        </div>
                                                        <div className="col-span-2 flex justify-center items-center text-sm ">
                                                            <div className={`w-5 h-5 rounded-full ${Object.keys(uploadedData[0]).includes(kolomSistem) ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} flex items-center justify-center`}>
                                                                <FontAwesomeIcon icon={Object.keys(uploadedData[0]).includes(kolomSistem) ? faCheck : faXmark} className="w-3 h-3 text-inherit" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </dialog>
                                    <div className="flex items-center w-full">
                                        <p className="w-1/3 opacity-50">
                                            Ukuran
                                        </p>
                                        <p className="w-2/3">
                                            212 KB
                                        </p>
                                    </div>
                                    <div className="flex items-center w-full">
                                        <p className="w-1/3 opacity-50">
                                            Jumlah Data
                                        </p>
                                        <p className="w-2/3">
                                            120 Baris
                                        </p>
                                    </div>
                                    <div className="flex items-center w-full">
                                        <p className="w-1/3 opacity-50">
                                            Ekstensi
                                        </p>
                                        <p className="w-2/3">
                                            .CSV
                                        </p>
                                    </div>
                                    <div className="flex items-center w-full">
                                        <p className="w-1/3 opacity-50">
                                            Jumlah Kolom
                                        </p>
                                        <p className="w-2/3">
                                            0 <span className="opacity-50">/ {Object.keys(formatData).length}</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                            <hr className="my-2 opacity-0" />
                            {isUploadedDataValid && (
                                <button type="button" className="px-3 py-2 rounded-lg bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center gap-3 text-white text-sm">
                                    <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                                    Simpan
                                </button>
                            )}
                        </div>
                    </dialog>
                </div>
                <hr className="my-2 opacity-0" />
                <div className="space-y-2">
                    <div className="flex flex-col md:flex-row gap-1 md:gap-0 md:items-center">
                        <p className="w-full md:w-1/6 flex-shrink-0 text-xs md:text-sm opacity-70">
                            Filter Jurusan
                        </p>
                        <div className="w-full md:w-5/6 flex-shrink-0 text-xs md:text-sm flex items-center gap-3 relative overflow-auto">
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                TKJ
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                TITL
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                TKR
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                TPM
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                DPIB
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                GEO
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:gap-0 md:items-center">
                        <p className="w-full md:w-1/6 flex-shrink-0 text-xs md:text-sm opacity-70">
                            Filter Agama
                        </p>
                        <div className="w-full md:w-5/6 flex-shrink-0 text-xs md:text-sm flex items-center gap-3 relative overflow-auto">
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                Islam
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                Non Islam
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:gap-0 md:items-center">
                        <p className="w-full md:w-1/6 flex-shrink-0 text-xs md:text-sm opacity-70">
                            Filter Jenis Kelamin
                        </p>
                        <div className="w-full md:w-5/6 flex-shrink-0 text-xs md:text-sm flex items-center gap-3 relative overflow-auto">
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                Laki-laki
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                Perempuan
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:gap-0 md:items-center">
                        <p className="w-full md:w-1/6 flex-shrink-0 text-xs md:text-sm opacity-70">
                            Filter Kategori
                        </p>
                        <div className="w-full md:w-5/6 flex-shrink-0 text-xs md:text-sm flex items-center gap-3 relative overflow-auto">
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                ABK
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                KETM
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                Kondisi Tertentu
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                Perpindahan Tugas Ortu / Anak Guru
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                Persiapan Kelas Industri
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                Prestasi Kejuaraan
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                Prestasi Rapor Umum
                            </button>
                            <button type="button" className={"rounded px-3 py-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex-shrink-0"}>
                                Prioritas Jarak
                            </button>
                        </div>
                    </div>
                </div>
                <hr className="my-2 opacity-0" />
                <div className="flex items-center gap-2 text-xs">
                    <p className="opacity-50">
                        Hasil Pencarian
                    </p>
                    <p className="">{filteredData.length}</p>
                    <p className="opacity-50">
                        Data ditemukan
                    </p>
                </div>
                <hr className="my-1 opacity-0" />
                <div className="grid grid-cols-12 *:px-3 *:py-2 rounded-lg border border-zinc-500">
                    <div className="col-span-7 md:col-span-2 flex items-center gap-2">
                        <input type="checkbox"  />
                        <p className="opacity-50 text-sm">Nama</p>
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-2">
                        <p className="opacity-50 text-sm">No. Pendaftaran</p>
                    </div>
                    <div className="col-span-1 hidden md:flex items-center gap-2">
                        <p className="opacity-50 text-sm">Jurusan</p>
                    </div>
                    <div className="col-span-1 hidden md:flex items-center gap-2">
                        <p className="opacity-50 text-sm">NISN</p>
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-2">
                        <p className="opacity-50 text-sm">Tempat, Tanggal Lahir</p>
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-2">
                        <p className="opacity-50 text-sm">Kategori</p>
                    </div>
                    <div className="col-span-5 md:col-span-2 flex items-center gap-2">
                        <input type="text" className="w-full px-2 py-1 text-sm rounded border bg-zinc-50 hover:border-zinc-700" placeholder="Cari disini" />
                    </div>
                </div>
                <div className="divide-y relative overflow-auto w-full max-h-[400px] py-2">
                    {Array.from({ length: 50 }).slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((_, index) => (
                        <div key={index} className="grid grid-cols-12 *:px-3 *:py-4 hover:bg-zinc-50 group">
                            <div className="col-span-7 md:col-span-2 flex items-center gap-2">
                                <input type="checkbox"  />
                                <p className="text-xs font-medium">Ziyad Jahizh Kartiwa</p>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-2">
                                <p className="opacity-50 text-xs font-medium">1023012930213912309</p>
                            </div>
                            <div className="col-span-1 hidden md:flex items-center gap-2">
                                <p className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-500">X TKJ 1</p>
                            </div>
                            <div className="col-span-1 hidden md:flex items-center gap-2">
                                <p className="opacity-50 text-xs font-medium">1232103921039</p>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-2">
                                <p className="text-xs font-medium">Bandung, 13 November 2003</p>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-2">
                                <p className="opacity-50 text-xs font-medium">ALDHAO DKJAHW DLWA DWAD WA IJD A</p>
                            </div>
                            <div className="col-span-5 md:col-span-2 flex items-center justify-center gap-1 md:gap-2 md:opacity-0 md:group-hover:opacity-100">
                                <button type="button" className="w-6 h-6 rounded bg-blue-500 hover:bg-blue-400 focus:bg-blue-700 text-blue-200 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" className="w-6 h-6 rounded bg-amber-500 hover:bg-amber-400 focus:bg-amber-700 text-amber-200 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" className="w-6 h-6 rounded bg-red-500 hover:bg-red-400 focus:bg-red-700 text-red-200 flex items-center justify-center">
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