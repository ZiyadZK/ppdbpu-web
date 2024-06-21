'use client'

import MainLayoutPage from "@/components/mainLayout"
import { toast } from "@/libs/alert"
import { xlsx_export} from "@/libs/excel"
import { M_Akun_getUserdata } from "@/libs/models/M_Akun"
import { faEdit, faUser } from "@fortawesome/free-regular-svg-icons"
import { faArrowDown, faArrowUp, faArrowsUpDown, faFile, faPowerOff, faPrint, faTrash, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import {  M_Siswa_delete, M_Siswa_getAll, M_Siswa_update } from "@/libs/models/M_Siswa"
import { date_getDay, date_getMonth, date_getYear } from "@/libs/date"
import { useRouter } from "next/navigation"
import Image from "next/image"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"

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

const mmToPx = mm => mm * (96 / 25.4)

const formatRombel = {
    'DESAIN PEMODELAN DAN INFORMASI BANGUNAN': 'DPIB',
    'TEKNIK GEOSPASIAL': 'GEO',
    'TEKNIK JARINGAN KOMPUTER DAN TELEKOMUNIKASI': 'TKJ',
    'TEKNIK KETENAGALISTRIKAN': 'TITL',
    'TEKNIK MESIN': 'TPM',
    'TEKNIK OTOMOTIF': 'TKR'
}

const formatWarnaRombel = {
    ' DESAIN PEMODELAN DAN INFORMASI BANGUNAN ': 'amber',
    ' TEKNIK GEOSPASIAL ': 'red',
    ' TEKNIK JARINGAN KOMPUTER DAN TELEKOMUNIKASI ': 'green',
    ' TEKNIK KETENAGALISTRIKAN ': 'zinc',
    ' TEKNIK MESIN ': 'orange',
    ' TEKNIK OTOMOTIF ': 'blue'
}

const formatSorting = {
    nama_siswa: '', nisn: '', nomor_reg: '', nisn: ''
}

export default function SiswaDiterimaPage() {
    const router = useRouter()

    const componentPDF_1 = useRef(null)
    const componentPDF_2 = useRef(null)
    const [printedData, setPrintedData] = useState({})

    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [pagination, setPagination] = useState(1)
    const [totalList, setTotalList] = useState(10)
    const [selectedData, setSelectedData] = useState([])
    const [searchData, setSearchData] = useState('')
    const [selectAllData, setSelectAllData] = useState(false)
    const [sorting, setSorting] = useState(formatSorting)
    const [filterData, setFilterData] = useState({
        id_rombel: [], agama: [], jk_siswa: [], kategori: []
    })
    const [loadingFetch, setLoadingFetch] = useState('')
    const [filterKategori, setFilterKategori] = useState([])

    const [loggedAkun, setLoggedAkun] = useState(null)

    const getData = async () => {
        setLoadingFetch('loading')
        const response = await M_Siswa_getAll({
            tahun_masuk: date_getYear(),
            aktif: 1,
            daftar_ulang: 1
        })

        if(response.success) {
            setData(response.data)
            setFilteredData(response.data)

            setFilterKategori(state => {
                const updatedState = []
                response.data.forEach(value => {
                    if(!updatedState.includes(value['kategori'])) {
                        updatedState.push(value['kategori'])
                    }
                })
                return updatedState
            })
        }

        setLoadingFetch('fetched')
    }

    const getLoggedAkun = async () => {
        const response = await M_Akun_getUserdata()
        if(response.success) {
            setLoggedAkun(response.data)
        }
    }

    useEffect(() => {
        getLoggedAkun()
        getData()
    }, [])

    
    const handleFilter = (key, value) => {
        setFilterData(state => {
            let updatedState 
            let updatedFilter
            if(state[key].includes(value)){
                updatedFilter = state[key].filter(v => v !== value)
                updatedState = {...state, [key]: updatedFilter}
            }else{
                updatedState = {...state, [key]: [...state[key], value]}
            }
            return updatedState
        })
    }

    const submitFilter = () => {
        let updatedData = data

        // Filter Jurusan
        if(filterData['id_rombel'].length > 0) {
            updatedData = updatedData.filter(value => filterData['id_rombel'].includes(value['id_rombel']))
        }

        // Filter Jenis Kelamin
        if(filterData['jk_siswa'].length > 0) {
            updatedData = updatedData.filter(value => filterData['jk_siswa'].includes(value['jk_siswa']))
        }

        // FIlter Kategori
        if(filterData['kategori'].length > 0) {
            updatedData = updatedData.filter(value => filterData['kategori'].includes(value['kategori']))
        }

        // Filter Search Data
        if(searchData !== '') {
            updatedData = updatedData.filter(value => 
                value['nama_siswa'].toLowerCase().includes(searchData.toLowerCase()) ||
                value['nomor_reg'].includes(searchData) ||
                value['nisn'].includes(searchData)
            )
        }

        // Sorting
        
        let sortedFilter = [];
        if(sorting.nama_siswa !== '') {
            sortedFilter = updatedData.sort((a, b) => {
                if(sorting.nama_siswa === 'asc') {
                    if (a.nama_siswa < b.nama_siswa) return -1;
                    if (a.nama_siswa > b.nama_siswa) return 1;
                    return 0;
                }
                
                if(sorting.nama_siswa === 'dsc') {
                    if (a.nama_siswa < b.nama_siswa) return 1;
                    if (a.nama_siswa > b.nama_siswa) return -1;
                    return 0;
                }
            })
        }

        if(sorting.nomor_reg !== '') {
            sortedFilter = updatedData.sort((a, b) => {
                if(sorting.nomor_reg === 'asc') {
                    if (a.nomor_reg < b.nomor_reg) return -1;
                    if (a.nomor_reg > b.nomor_reg) return 1;
                    return 0;
                }
                
                if(sorting.nomor_reg === 'dsc') {
                    if (a.nomor_reg < b.nomor_reg) return 1;
                    if (a.nomor_reg > b.nomor_reg) return -1;
                    return 0;
                }
            })
        }

        if(sorting.nisn !== '') {
            sortedFilter = updatedData.sort((a, b) => {
                if(sorting.nisn === 'asc') {
                    if (a.nisn < b.nisn) return -1;
                    if (a.nisn > b.nisn) return 1;
                    return 0;
                }
                
                if(sorting.nisn === 'dsc') {
                    if (a.nisn < b.nisn) return 1;
                    if (a.nisn > b.nisn) return -1;
                    return 0;
                }
            })
        }

        updatedData = sortedFilter.length > 0 ? sortedFilter : updatedData

        setFilteredData(updatedData)

    }

    useEffect(() => {
        submitFilter()
    }, [searchData, filterData, sorting])

    const handleSelectData = (nisn) => {
        let updatedData
        if(selectedData.includes(nisn)) {
            updatedData = selectedData.filter(value => value !== nisn)
        }else{
            updatedData = [...selectedData, nisn]
        }

        setSelectedData(updatedData)
    }

    const handleSelectAllData = () => {
        if(!selectAllData) {
            let updatedData = selectedData
            filteredData.forEach(value => {
                if(!updatedData.includes(value.nisn)) {
                    updatedData.push(value.nisn)
                }else{
                    updatedData = updatedData.filter(v => v !== nisn)
                }
            })
    
            setSelectedData(updatedData)
            setSelectAllData(state => true)
        }else{
            setSelectedData([])
            setSelectAllData(state => false)
        }
    }

    const handleDeleteData = async (nisn) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: `Anda akan menghapus data siswa ${typeof nisn === 'undefined' ? ' Yang dipilih' : 'dengan NISN ' + nisn}, dan data ini akan hilang dari database. Jika anda menghapus ini, maka tidak bisa dikembalikan!`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
            timer: 30000,
            timerProgressBar: true
        }).then(answer => {
            if(answer.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    timer: 30000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    didOpen: async () => {
                        const response = await M_Siswa_delete(typeof nisn === 'undefined' ? selectedData : nisn)

                        if(response.success) {
                            Swal.close()
                            return toast.fire({
                                title: 'Sukses',
                                text: `Berhasil menghapus Data Siswa ${typeof nisn === 'undefined' ? 'yang dipilih' : 'dengan NISN ' + nisn}`,
                                icon: 'success',
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: async () => {
                                    setSelectedData([])
                                    await getData()
                                }
                            })
                        }else{
                            Swal.close()
                            return toast.fire({
                                title: 'Gagal',
                                text: response.message,
                                icon: 'error',
                                timer: 5000,
                                timerProgressBar: true
                            })
                        }
                    }
                })
            }
        })
    }

    const handleSorting = (key) => {
        setSorting(state => {
            let updatedState = formatSorting

            if(state[key] === '') {
                updatedState = {...updatedState, [key]: 'asc'}
                return updatedState
            }

            if(state[key] === 'asc') {
                updatedState = {...updatedState, [key]: 'dsc'}
                return updatedState
            }
            if(state[key] === 'dsc') {
                updatedState = {...updatedState, [key]: ''}
                return updatedState
            }
        })
    }

    const handlePrintData = async (nisn) => {
        if(printedData['nisn'] !== nisn) {
            const selectedPrintedData = data.find(value => value['nisn'] === nisn)
            return setPrintedData(selectedPrintedData)
        }

        document.getElementById('content_print').classList.remove('hidden')

        Swal.fire({
            title: 'Sedang memproses data..',
            timer: 30000,
            timerProgressBar: true,
            showConfirmButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
            didOpen: async () => {
                const content_1 = componentPDF_1.current
                const content_2 = componentPDF_2.current

                const canvas_1 = await html2canvas(content_1, { scale: 3})
                const imgData_1 = canvas_1.toDataURL('image/jpeg', 0.1)

                const canvas_2 = await html2canvas(content_2, { scale: 3})
                const imgData_2 = canvas_2.toDataURL('image/jpeg', 0.1)

                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: [330, 210],
                    compress: true,
                    precision: 2
                });
        
                const pdfW = pdf.internal.pageSize.getWidth();
                const pdfH = pdf.internal.pageSize.getHeight();
        
                const addImageToPDF = (imgData, pdf) => {
                    const imgW = canvas_1.width;
                    const imgH = canvas_1.height;
        
                    // Calculate scaling factor to fit the image into the PDF page
                    const ratio = Math.min(pdfW / imgW, pdfH / imgH);
        
                    // Calculate the dimensions and position of the image to be centered on the PDF page
                    const imgWidth = imgW * ratio;
                    const imgHeight = imgH * ratio;
                    const imgX = (pdfW - imgWidth) / 2;
                    const imgY = (pdfH - imgHeight) / 2;
        
                    // Add the image to the PDF
                    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
                };

                addImageToPDF(imgData_1, pdf)

                pdf.addPage()

                addImageToPDF(imgData_2, pdf)

                // pdf.save(`DATA CALON SISWA DITERIMA - ${printedData.nama_siswa} - ${formatRombel[printedData.id_rombel]} - ${printedData.nisn}`)
                const pdfDataUri = pdf.output('datauristring');
                const pdfBlob = pdf.output('blob')
                const pdfUrl = URL.createObjectURL(pdfBlob)
                document.getElementById('content_print').classList.add('hidden')

                Swal.close()
                toast.fire({
                    title: 'Sukses',
                    text: 'Berhasil mengexport data siswa tersebut!',
                    icon: 'success'
                })

                // window.open(pdfUrl, '_blank')
                // setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000)
                const newTab = window.open()
                newTab.document.write(`<iframe src="${pdfDataUri}" width="100%" height="100%"></iframe>`)
            }
        })
    }

    const handleTutupPPDB = async (modal, type) => {
        if(data.length < 1) {
            return toast.fire({
                title: 'Error',
                text: 'Data masih kosong, anda belum bisa Export!',
                icon: 'error',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            })
        }

        const updatedData = data.map(state => {
            document.getElementById(modal).close()

            return {
                kelas: 'X',
                rombel: `${formatRombel[state['id_rombel']]}`,
                no_rombel: '',
                nama_siswa: state['nama_siswa'],
                nis: state['nis'],
                nisn: state['nisn'],
                nik: state['nik'],
                no_kk: state['no_kk'],
                tempat_lahir: state['tempat_lahir_siswa'],
                tanggal_lahir: state['tgl_lahir_siswa'],
                agama: state['agama'],
                status_dalam_keluarga: state['status_anak'],
                anak_ke: state['anak_ke_berapa'],
                alamat: state['alamat_siswa'],
                no_hp_siswa: state['no_telp_siswa'],
                asal_sekolah: state['asal_sekolah'],
                kategori: state['kategori'],
                tahun_masuk: state['tahun_masuk'],
                nama_ayah: state['nama_ayah'],
                nama_ibu: state['nama_ibu'],
                telp_ortu: state['no_telp_ayah'] || state['no_telp_ibu'],
                pekerjaan_ayah: state['pekerjaan_ayah'],
                pekerjaan_ibu: state['pekerjaan_ibu'],
                aktif: 'aktif'
            }   
        })

        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Export data secara langsung akan menghapus data siswa yang di export dari server, pastikan bahwa PPDB sudah selesai!',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya',
            timer: 15000,
            timerProgressBar: true,
            allowOutsideClick: true
        }).then(answer => {
            if(answer.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data...',
                    timer: 30000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: async () => {
                        const response = await M_Siswa_update(data.map(v => v['nisn']), { aktif: 0 })
                        if(response.success) {
                            await getData()
                            if(type === 'xlsx') {
                                return await xlsx_export('xlsx', updatedData, `PPDB - DATA SISWA DITERIMA - ${date_getYear()}`, {
                                    header: Object.keys(updatedData[0]),
                                    sheetName: `TAHUN ${date_getYear()}`
                                }).then(() => {
                                    Swal.close()
                                    return toast.fire({
                                        title: 'Sukses',
                                        text: 'Berhasil mengexport Data PPDB Siswa yang Diterima!',
                                        icon: 'success',
                                        timer: 3000, 
                                        timerProgressBar: true
                                    })
                                })
                            }
            
                            if(type === 'csv') {
                                return await xlsx_export('csv', updatedData, `PPDB - DATA SISWA DITERIMA - ${date_getYear()}`, {
                                    header: Object.keys(updatedData[0]),
                                    sheetName: `TAHUN ${date_getYear()}`
                                }).then(() => {
                                    Swal.close()
                                    return toast.fire({
                                        title: 'Sukses',
                                        text: 'Berhasil mengexport Data PPDB Siswa yang Diterima!',
                                        icon: 'success',
                                        timer: 3000, 
                                        timerProgressBar: true
                                    })
                                })
                            }
                        }else{
                            Swal.fire({
                                title: 'Gagal',
                                text: 'Terdapat error disaat memproses data, hubungi Administrator!',
                                icon: 'error',
                                timer: 5000,
                                timerProgressBar: true
                            })
                        }
        
                    }
                })
            }else{
                document.getElementById(modal).showModal()
            }
        })
    }

    const handleExportData = async (type) => {
        const updatedData = data.map(state => {
            return {
                kelas: 'X',
                rombel: `${formatRombel[state['id_rombel']]}`,
                no_rombel: '',
                nama_siswa: state['nama_siswa'],
                nis: state['nis'],
                nisn: state['nisn'],
                nik: state['nik'],
                no_kk: state['no_kk'],
                tempat_lahir: state['tempat_lahir_siswa'],
                tanggal_lahir: state['tgl_lahir_siswa'],
                agama: state['agama'],
                status_dalam_keluarga: state['status_anak'],
                anak_ke: state['anak_ke_berapa'],
                alamat: state['alamat_siswa'],
                no_hp_siswa: state['no_telp_siswa'],
                asal_sekolah: state['asal_sekolah'],
                kategori: state['kategori'],
                tahun_masuk: state['tahun_masuk'],
                nama_ayah: state['nama_ayah'],
                nama_ibu: state['nama_ibu'],
                telp_ortu: state['no_telp_ayah'] || state['no_telp_ibu'],
                pekerjaan_ayah: state['pekerjaan_ayah'],
                pekerjaan_ibu: state['pekerjaan_ibu'],
                aktif: 'aktif'
            }   
        })

        if(type === 'xlsx') {
            return await xlsx_export('xlsx', updatedData, `PPDB - DATA SISWA DITERIMA - ${date_getYear()}`, {
                header: Object.keys(updatedData[0]),
                sheetName: `TAHUN ${date_getYear()}`
            }).then(() => {
                Swal.close()
                return toast.fire({
                    title: 'Sukses',
                    text: 'Berhasil mengexport Data PPDB Siswa yang Diterima!',
                    icon: 'success',
                    timer: 3000, 
                    timerProgressBar: true
                })
            })
        }

        if(type === 'csv') {
            return await xlsx_export('csv', updatedData, `PPDB - DATA SISWA DITERIMA - ${date_getYear()}`, {
                header: Object.keys(updatedData[0]),
                sheetName: `TAHUN ${date_getYear()}`
            }).then(() => {
                Swal.close()
                return toast.fire({
                    title: 'Sukses',
                    text: 'Berhasil mengexport Data PPDB Siswa yang Diterima!',
                    icon: 'success',
                    timer: 3000, 
                    timerProgressBar: true
                })
            })
        }
    }

    return (
        <MainLayoutPage>
            <div className="bg-white h-full md:p-5 px-5 md:rounded-2xl">
                <div className="space-y-2">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="rounded flex items-center gap-3 px-3 py-2 bg-blue-500 hover:bg-blue-400 focus:bg-blue-600 text-white">
                            <FontAwesomeIcon icon={faUpload} className="w-4 h-4 text-inherit" />
                            Export Data
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52">
                            <li>
                                <button type="button" onClick={() => handleExportData('xlsx')} className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faFile} className="w-4 h-4 text-green-500" />
                                    XLSX
                                </button>
                            </li>
                            <li>
                                <button type="button" onClick={() => handleExportData('csv')} className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faFile} className="w-4 h-4 text-green-500" />
                                    CSV
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:gap-0 md:items-center">
                        <p className="w-full md:w-1/6 flex-shrink-0 text-xs md:text-sm opacity-70">
                            Filter Jurusan
                        </p>
                        <div className="w-full md:w-5/6 flex-shrink-0 text-xs md:text-sm flex items-center gap-3 relative overflow-auto">
                            {Object.keys(formatRombel).map((rombel, index) => (
                                <button key={index} type="button" onClick={() => handleFilter('id_rombel', rombel)} className={`rounded px-3 py-2 ${filterData.id_rombel.includes(rombel) ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700'} flex-shrink-0`}>
                                    {formatRombel[rombel]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:gap-0 md:items-center">
                        <p className="w-full md:w-1/6 flex-shrink-0 text-xs md:text-sm opacity-70">
                            Filter Jenis Kelamin
                        </p>
                        <div className="w-full md:w-5/6 flex-shrink-0 text-xs md:text-sm flex items-center gap-3 relative overflow-auto">
                            <button type="button" onClick={() => handleFilter('jk_siswa', 'Laki - laki')} className={`rounded px-3 py-2 ${filterData.jk_siswa.includes('Laki - laki') ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700'} flex-shrink-0`}>
                                Laki-laki
                            </button>
                            <button type="button" onClick={() => handleFilter('jk_siswa', 'Perempuan')} className={`rounded px-3 py-2 ${filterData.jk_siswa.includes('Perempuan') ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700'} flex-shrink-0`}>
                                Perempuan
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:gap-0 md:items-center">
                        <p className="w-full md:w-1/6 flex-shrink-0 text-xs md:text-sm opacity-70">
                            Filter Kategori
                        </p>
                        <div className="w-full md:w-5/6 flex-shrink-0 text-xs md:text-sm flex items-center gap-3 relative overflow-auto">
                            {loadingFetch !== 'fetched' && (
                                <div className="loading loading-spinner loading-md py-5 px-2 text-zinc-400"></div>
                            )}
                            {filterKategori.map((kategori, index) => (
                                <button key={index} type="button" onClick={() => handleFilter('kategori', kategori)} className={`rounded px-3 py-2 ${filterData.kategori.includes(kategori) ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700'} flex-shrink-0`}>
                                    {kategori}
                                </button>
                            ))}
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
                        {loggedAkun && ['Admin'].includes(loggedAkun['role_akun']) && (
                            <input type="checkbox" checked={selectAllData} onChange={() => handleSelectAllData()}  />
                        )}
                        <p className="opacity-50 text-sm">Nama</p>
                        <button type="button" onClick={() => handleSorting('nama_siswa')} className="text-zinc-400 w-5 h-5 flex items-center justify-center rounded  hover:bg-zinc-100 hover:text-zinc-700">
                            <FontAwesomeIcon icon={sorting.nama_siswa === '' ? faArrowsUpDown : (sorting.nama_siswa === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                        </button>
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-2">
                        <p className="opacity-50 text-sm">No. Pendaftaran</p>
                        <button type="button" onClick={() => handleSorting('nomor_reg')} className="text-zinc-400 w-5 h-5 flex items-center justify-center rounded  hover:bg-zinc-100 hover:text-zinc-700">
                            <FontAwesomeIcon icon={sorting.nomor_reg === '' ? faArrowsUpDown : (sorting.nomor_reg === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                        </button>
                    </div>
                    <div className="col-span-1 hidden md:flex items-center gap-2">
                        <p className="opacity-50 text-sm">Jurusan</p>
                    </div>
                    <div className="col-span-1 hidden md:flex items-center gap-2">
                        <p className="opacity-50 text-sm">NISN</p>
                        <button type="button" onClick={() => handleSorting('nisn')} className="text-zinc-400 w-5 h-5 flex items-center justify-center rounded  hover:bg-zinc-100 hover:text-zinc-700">
                            <FontAwesomeIcon icon={sorting.nisn === '' ? faArrowsUpDown : (sorting.nisn === 'asc' ? faArrowUp : faArrowDown )} className="w-3 h-3 text-inherit" />
                        </button>
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-2">
                        <p className="opacity-50 text-sm">Tempat, Tanggal Lahir</p>
                    </div>
                    <div className="col-span-2 hidden md:flex items-center gap-2">
                        <p className="opacity-50 text-sm">Kategori</p>
                    </div>
                    <div className="col-span-5 md:col-span-2 flex items-center gap-2">
                        <input type="text" value={searchData} onChange={e => setSearchData(e.target.value)} className="w-full px-2 py-1 text-sm rounded border bg-zinc-50 hover:border-zinc-700" placeholder="Cari disini" />
                    </div>
                </div>
                {loadingFetch !== 'fetched' && (
                    <div className="w-full flex justify-center items-center py-5">
                        <div className="loading loading-dots loading-lg text-zinc-500"></div>
                    </div>
                )}
                <div className="divide-y relative overflow-auto w-full max-h-[400px] py-2">
                    {filteredData.slice(pagination === 1 ? totalList - totalList : (totalList * pagination) - totalList, totalList * pagination).map((siswa, index) => (
                        <div key={index} className="grid grid-cols-12 *:px-3 *:py-4 hover:bg-zinc-50 group">
                            <div className="col-span-7 md:col-span-2 flex items-center gap-2">
                                {loggedAkun && ['Admin'].includes(loggedAkun['role_akun']) && (
                                    <input type="checkbox" checked={selectedData.includes(siswa.nisn)} onChange={() => handleSelectData(siswa.nisn)}  />
                                )}
                                <p className="text-xs font-medium">
                                    {siswa.nama_siswa}
                                </p>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-2">
                                <p className="opacity-50 text-xs font-medium">
                                    {siswa.nomor_reg}
                                </p>
                            </div>
                            <div className="col-span-1 hidden md:flex items-center gap-2">
                                <p className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                                    X {formatRombel[siswa['id_rombel']]} 1
                                </p>
                            </div>
                            <div className="col-span-1 hidden md:flex items-center gap-2">
                                <p className="opacity-50 text-xs font-medium">
                                    {siswa.nisn}
                                </p>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-2">
                                <p className="text-xs font-medium">
                                    {siswa.tempat_lahir_siswa}, {siswa.tgl_lahir_siswa.split('-').reverse().join('/')} </p>
                            </div>
                            <div className="col-span-2 hidden md:flex items-center gap-2">
                                <p className="opacity-50 text-xs font-medium">
                                    {siswa.kategori}
                                </p>
                            </div>
                            <div className="col-span-5 md:col-span-2 flex items-center justify-center gap-1 md:gap-2 ">
                                <button type="button" onClick={() => handlePrintData(siswa.nisn)} className="w-6 h-6 rounded bg-blue-500 hover:bg-blue-400 focus:bg-blue-700 text-blue-200 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faPrint} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" onClick={() => router.push(`/siswa/diterima/update/${siswa.nisn}`)} className="w-6 h-6 rounded bg-amber-500 hover:bg-amber-400 focus:bg-amber-700 text-amber-200 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-inherit" />
                                </button>
                                {loggedAkun && ['Admin'].includes(loggedAkun['role_akun']) && (
                                    <button type="button" onClick={() => handleDeleteData(siswa.nisn)} className="w-6 h-6 rounded bg-red-500 hover:bg-red-400 focus:bg-red-700 text-red-200 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center md:justify-between text-xs md:text-sm my-3">
                    {loggedAkun && ['Admin'].includes(loggedAkun['role_akun']) && (
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
                                <button type="button" onClick={() => handleDeleteData()} className="w-6 h-6 flex items-center justify-center bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300">
                                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-inherit" />
                                </button>
                                <button type="button" onClick={() => setSelectedData([])} className="w-6 h-6 flex items-center justify-center bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300">
                                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3 text-inherit" />
                                </button>
                            </div>}
                        </div>
                    )}
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
            <hr className="md:my-5 md:opacity-0" />
            <div className="w-full h-full bg-white p-5 md:rounded-2xl">
                <h1 className="font-bold text-2xl flex items-center gap-5">
                    <FontAwesomeIcon icon={faPrint} className="w-5 h-5 text-inherit" />
                    Halaman Print
                </h1>
                <hr className="my-3 opacity-0" />
                <div id="content_print" className="hidden">
                    <hr className="my-5 opacity-0" />
                    <p>Halaman ini hanya diperuntukkan melihat sekilas layout untuk hasil print saja.</p>
                    <hr className="my-5 opacity-0" />
                    <div className="bg-zinc-700 rounded-2xl flex flex-col items-center gap-5 p-5">
                        <div  ref={componentPDF_1} style={{
                            width: `${mmToPx(210) * 1.5}px`, height: `${mmToPx(330) * 1.5}px`
                        }} className="bg-white flex-shrink-0 px-10 py-10">
                            <div className="flex items-center w-full px-10 text-lg">
                                <div className="w-fit flex items-center justify-start">
                                    <Image src={'/jabar.gif'} width={160} height={160} />
                                </div>
                                <div className={`w-full font-bold tracking-tighter text-center`}>
                                    <h1 className="font-bold tracking-tighter text-center">
                                        PEMERINTAH DAERAH PROVINSI JAWA BARAT
                                    </h1>
                                    <h2 className="font-bold tracking-tighter text-center">
                                        DINAS PENDIDIKAN
                                    </h2>
                                    <h3 className="font-bold tracking-tighter text-center">
                                        CABANG DINAS PENDIDIKAN WILAYAH VII
                                    </h3>
                                    <p className="font-bold tracking-tighter text-center">
                                        SMK PEKERJAAN UMUM NEGERI BANDUNG
                                    </p>
                                    <p className="text-sm tracking-tight">
                                        Jl. Garut No. 10 Telp./Fax (022) 7208317 BANDUNG 40271
                                    </p>
                                    <p className="text-sm tracking-tight">
                                        Website : <span className="italic text-blue-600 underline decoration-blue-600">http://www.smkpunegerijabar.sch.id</span>
                                    </p>
                                    <p className="text-sm tracking-tight">
                                        Email : <span className="italic text-blue-600 underline decoration-blue-600">info@smkpunegerijabar.sch.id</span>
                                    </p>
                                </div>
                                <div className="w-fit flex items-center justify-end">
                                    <Image src={'/logo-sekolah-2.png'} width={120} height={120} />
                                </div>
                            </div>
                            <div className=" pt-5 ">
                                <div className="w-full border-4 border-zinc-700"></div>
                            </div>
                            <div className="">
                                <hr className="my-3 opacity-0" />
                                <h1 className="text-center font-extrabold text-lg">
                                    FORMULIR DAFTAR ULANG
                                </h1>
                                <h1 className="text-center font-extrabold text-lg">
                                    PESERTA DIDIK BARU {date_getYear()}
                                </h1>
                                <hr className="my-5 opacity-0" /> 
                                <h1 className="font-bold text-2xl">IDENTITAS PESERTA DIDIK</h1>
                                <div className="flex mt-3 text-lg gap-10">
                                    <div className="w-1/2 space-y-5 ">
                                        <div className="flex items-center gap-2">
                                            <div className="flex justify-between items-center w-2/5">
                                                <p className="font-extrabold flex-grow">NIK</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-3/5">
                                                {printedData ? printedData['nik'] : '-'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex justify-between items-center w-2/5">
                                                <p className="font-extrabold flex-grow">NISN</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-3/5">
                                                {printedData ? printedData['nisn'] : '-'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex justify-between items-center w-2/5">
                                                <p className="font-extrabold flex-grow">Nama Siswa</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-3/5">
                                            {printedData ? printedData['nama_siswa'] : '-'}
                                            </p>
                                        </div>
                                        <div className="flex  gap-2">
                                            <div className="flex justify-between  w-2/5">
                                                <p className="font-extrabold flex-grow">Rombongan Pelajar</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-3/5">X - {printedData ? formatRombel[printedData['id_rombel']] : '-'}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex justify-between items-center w-2/5">
                                                <p className="font-extrabold flex-grow">Jenis Kelamin</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-3/5">
                                            {printedData ? printedData['jk_siswa'] : '-'}
                                            </p>
                                        </div>
                                        <div className="flex  gap-2">
                                            <div className="flex justify-between  w-2/5">
                                                <p className="font-extrabold flex-grow">TTL</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-3/5">
                                            {printedData ? printedData['tempat_lahir_siswa'] : '-'}, {printedData['tgl_lahir_siswa']  ? `${date_getDay(printedData['tgl_lahir_siswa'])} ${date_getMonth('string' ,printedData['tgl_lahir_siswa'])} ${date_getYear(printedData['tgl_lahir_siswa'])}` : '-'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex justify-between items-center w-2/5">
                                                <p className="font-extrabold flex-grow">Agama</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-3/5">
                                            {printedData ? printedData['agama'] : '-'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex justify-between items-center w-2/5">
                                                <p className="font-extrabold flex-grow">No. Telepon</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-3/5">
                                            {printedData ? printedData['no_telp_siswa'] : '-'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex justify-between items-center w-2/5">
                                                <p className="font-extrabold flex-grow">Nomor Peserta UN</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-3/5">
                                            {printedData ? printedData['nomor_reg'] : '-'}
                                            </p>
                                        </div>
                                        <div className="flex  gap-2">
                                            <div className="flex justify-between  w-2/5">
                                                <p className="font-extrabold flex-grow">Jalur Masuk</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-3/5">
                                            {printedData ? printedData['kategori'] : '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="flex flex-col">
                                            <div className="flex gap-5 w-fit">
                                                <p className="font-extrabold flex-grow">Alamat</p>
                                                <p className="font-extrabold">:</p>
                                            </div>
                                            <p className="w-full">
                                            {printedData ? printedData['alamat_siswa'] : '-'}
                                            </p>
                                        </div>
                                        <hr className="my-8 border border-zinc-700" />
                                        <h1 className="font-bold text-2xl">DATA PERIODIK</h1>
                                        <div className="mt-3 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex justify-between items-center w-2/5">
                                                    <p className="font-extrabold flex-grow">Alat Transportasi</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                {printedData ? printedData['alat_transport'] : '-'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex justify-between items-center w-2/5">
                                                    <p className="font-extrabold flex-grow">Tinggi Badan</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                {printedData ? printedData['tinggi_badan'] : '-'} cm
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex justify-between items-center w-2/5">
                                                    <p className="font-extrabold flex-grow">Berat Badan</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                {printedData ? printedData['berat_badan'] : '-'} kg
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex justify-between items-center w-2/5">
                                                    <p className="font-extrabold flex-grow">Jarak Tempat Tinggal</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                {printedData ? printedData['jarak'] : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-8 opacity-0" />
                                <h1 className="font-bold text-2xl">DATA ORANG TUA DAN WALI SISWA</h1>
                                <hr className="my-3 opacity-0" />
                                <div className="grid grid-cols-12 border-b-4 py-3 px-1">
                                    <div className="col-span-3 flex items-center font-bold text-lg">
                                        
                                    </div>
                                    <div className="col-span-3 flex items-center font-bold text-lg">
                                        Ayah
                                    </div>
                                    <div className="col-span-3 flex items-center font-bold text-lg">
                                        Ibu
                                    </div>
                                    <div className="col-span-3 flex items-center font-bold text-lg">
                                        Wali
                                    </div>
                                </div>
                                <div className="divide-y">
                                    <div className="grid grid-cols-12 py-4 px-1">
                                        <div className="col-span-3 flex items-center font-bold text-lg">
                                            Nama
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['nama_ayah'] : '-'}
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['nama_ibu'] : '-'}
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['nama_wali'] : '-'}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 py-4 px-1">
                                        <div className="col-span-3 flex items-center font-bold text-lg">
                                            No. Telepon
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['no_telp_ayah'] : '-'}
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['no_telp_ibu'] : '-'}
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['no_telp_wali'] : '-'}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 py-4 px-1">
                                        <div className="col-span-3 flex items-center font-bold text-lg">
                                            Pekerjaan
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['pekerjaan_ayah'] : '-'}
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['pekerjaan_ibu'] : '-'}
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['pekerjaan_wali'] : '-'}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 py-4 px-1">
                                        <div className="col-span-3 flex items-center font-bold text-lg">
                                            Pendidikan
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['pendidikan_ayah'] : '-'}
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['pendidikan_ibu'] : '-'}
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['pendidikan_wali'] : '-'}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 py-4 px-1">
                                        <div className="col-span-3 flex items-center font-bold text-lg">
                                            Penghasilan
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['penghasilan_ayah'] : '-'}
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['penghasilan_ibu'] : '-'}
                                        </div>
                                        <div className="col-span-3 text-lg flex items-center">
                                        {printedData ? printedData['penghasilan_wali'] : '-'}
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-8 opacity-0" />
                                <div className="flex gap-3">
                                    <div className="w-1/2">
                                        <div className="border p-5 text-justify text-xl border-zinc-500">
                                            Berkas ini merupakan bukti bahwa calon peserta didik telah melakukan pendaftaran ulang sebagai peserta didik kelas X di SMK PU Negeri Bandung. Dengan ini maka peserta didik yang bersangkutan dianggap menyetujui untuk mematuhi segala perarturan yang berlaku di SMK PU Negeri Bandung
                                        </div>
                                    </div>
                                    <div className="w-1/2 flex justify-around items-center gap-5">
                                        <div style={{ width: `${113}px`, height: `${151}px`}} className="flex items-center justify-center bg-zinc-400">
                                            <FontAwesomeIcon icon={faUser} className="text-white w-20 h-20" />
                                        </div>
                                        <div className="w-fit h-full flex flex-col justify-between">
                                            <div className="">
                                                <p className="font-medium text-xl text-center">
                                                    Bandung, {date_getDay()} {date_getMonth('string')} {date_getYear()}
                                                </p>   
                                            </div>
                                            <p className="font-extrabold text-xl text-center">
                                            {printedData ? printedData['nama_siswa'] : '-'}
                                            </p>   
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref={componentPDF_2} style={{ 
                            width: `${(mmToPx(210) * 1.5)}px`, 
                            height: `${(mmToPx(330) * 1.5)}px`,
                        }} className={`bg-white flex-shrink-0`}
                        >
                            <div className="flex items-center w-full px-20 pt-10 text-lg">
                                <div className="w-fit flex items-center justify-start">
                                    <Image src={'/jabar.gif'} width={160} height={160} />
                                </div>
                                <div className={`w-full font-bold tracking-tighter text-center`}>
                                    <h1 className="font-bold tracking-tighter text-center">
                                        PEMERINTAH DAERAH PROVINSI JAWA BARAT
                                    </h1>
                                    <h2 className="font-bold tracking-tighter text-center">
                                        DINAS PENDIDIKAN
                                    </h2>
                                    <h3 className="font-bold tracking-tighter text-center">
                                        CABANG DINAS PENDIDIKAN WILAYAH VII
                                    </h3>
                                    <p className="font-bold tracking-tighter text-center">
                                        SMK PEKERJAAN UMUM NEGERI BANDUNG
                                    </p>
                                    <p className="text-sm tracking-tight">
                                        Jl. Garut No. 10 Telp./Fax (022) 7208317 BANDUNG 40271
                                    </p>
                                    <p className="text-sm tracking-tight">
                                        Website : <span className="italic text-blue-600 underline decoration-blue-600">http://www.smkpunegerijabar.sch.id</span>
                                    </p>
                                    <p className="text-sm tracking-tight">
                                        Email : <span className="italic text-blue-600 underline decoration-blue-600">info@smkpunegerijabar.sch.id</span>
                                    </p>
                                </div>
                                <div className="w-fit flex items-center justify-end">
                                    <Image src={'/logo-sekolah-2.png'} width={120} height={120} />
                                </div>
                            </div>
                            <div className="px-10 pt-5 mb-8">
                                <div className="w-full border-4 border-zinc-700"></div>
                            </div>
                            <h1 className="text-center font-extrabold">LEMBAR BUKU INDUK SMK</h1>
                            <h2 className="text-center font-extrabold">TAHUN PELAJARAN {date_getYear()}/{Number(date_getYear()) + 1}</h2>
                            <hr className="my-3 opacity-0" />
                            <div className="px-20">
                                <div className="flex w-1/2 items-center gap-2 text-lg">
                                    <p className="w-2/3">Kompetensi Keahlian</p>
                                    <p className="w-1/3 font-medium">: X {printedData ? formatRombel[printedData['id_rombel']] : '-'} </p>
                                </div>
                                <div className="flex w-1/2 items-center gap-2 text-lg">
                                    <p className="w-2/3">No Induk Sekolah</p>
                                    <p className="w-1/3 font-medium">: {printedData ? printedData['nis'] : '-'}</p>
                                </div>
                                <div className="flex w-1/2 items-center gap-2 text-lg">
                                    <p className="w-2/3">No Induk Siswa Nasional</p>
                                    <p className="w-1/3 font-medium">: {printedData ? printedData['nisn'] : '-'}</p>
                                </div>
                                <hr className="my-3 opacity-0" />
                                <div className="px-10 text-lg">
                                    <div className="font-bold flex items-center gap-5">
                                        <p>A.</p>
                                        <p>KETERANGAN PRIBADI SISWA</p>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>1.</p>
                                                <p>Nama</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {printedData ? printedData['nama_siswa'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>2.</p>
                                                <p>NIK</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {printedData ? printedData['nik'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>3.</p>
                                                <p>Jenis Kelamin</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {printedData ? printedData['jk_siswa'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>4.</p>
                                                <p>Tempat dan Tanggal Lahir</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {printedData ? printedData['tempat_lahir_siswa'] : '-'}, {printedData['tgl_lahir_siswa'] ? `${date_getDay(printedData['tgl_lahir_siswa'])} ${date_getMonth('string' ,printedData['tgl_lahir_siswa'])} ${date_getYear(printedData['tgl_lahir_siswa'])}` : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>5.</p>
                                                <p>Agama</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {printedData ? printedData['agama'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>6.</p>
                                                <p>Anak ke</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {printedData ? printedData['anak_ke_berapa'] : '-'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>7.</p>
                                                <p className="">No Telp</p>
                                            </div>
                                            <p className="font-medium w-2/3">: {printedData ? printedData['no_telp_siswa'] : '-'}</p>
                                        </div>
                                    </div>
                                    <hr className="my-3 opacity-0" />
                                    <div className="font-bold flex items-center gap-5">
                                        <p>B.</p>
                                        <p>KETERANGAN TEMPAT TINGGAL</p>
                                    </div>
                                    <div className="flex  gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex  gap-5 w-full">
                                            <div className="flex gap-5 w-1/3">
                                                <p>8.</p>
                                                <p>Alamat</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['alamat_siswa'] : '-'}</p>
                                        </div>
                                    </div>
                                    <hr className="my-3 opacity-0" />
                                    <div className="font-bold flex items-center gap-5">
                                        <p>C.</p>
                                        <p>KETERANGAN SEKOLAH SEBELUMNYA</p>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>9.</p>
                                                <p>Asal Sekolah</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['asal_sekolah'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>10.</p>
                                                <p>Tahun Masuk</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['tahun_masuk'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>11.</p>
                                                <p>Jalur Masuk</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['kategori'] : '-'}</p>
                                        </div>
                                    </div>
                                    <hr className="my-3 opacity-0" />
                                    <div className="font-bold flex items-center gap-5">
                                        <p>D.</p>
                                        <p>KETERANGAN ORANG TUA KANDUNG</p>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>12.</p>
                                                <p>Nama Ayah</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['nama_ayah'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>13.</p>
                                                <p>Pekerjaan Ayah</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['pekerjaan_ayah'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>14.</p>
                                                <p>No Telp Ayah</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['no_telp_ayah'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>15.</p>
                                                <p>Nama Ibu</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['nama_ibu'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>16.</p>
                                                <p>Pekerjaan Ibu</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['pekerjaan_ibu'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>17.</p>
                                                <p>No Telp Ibu</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['no_telp_ibu'] : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>18.</p>
                                                <p>No Kartu Keluarga</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData ? printedData['no_kk'] : '-'}</p>
                                        </div>
                                    </div>
                                    <hr className="my-3 opacity-0" />
                                    <div className="font-bold flex items-center gap-5">
                                        <p>D.</p>
                                        <p>KETERANGAN WALI</p>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>19.</p>
                                                <p>Nama Wali</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData.nama_wali || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>20.</p>
                                                <p>Pekerjaan Wali</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData.pekerjaan_wali || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 w-full">
                                        <p className="opacity-0">A.</p>
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex items-center gap-5 w-1/3">
                                                <p>21.</p>
                                                <p>No Telp Wali</p>
                                            </div>
                                            <p className="font-medium w-2/3 text-wrap">: {printedData.no_telp_wali || '-'}</p>
                                        </div>
                                    </div>
                                    <hr className="my-5 opacity-0" />
                                    <div className="flex items-center w-full gap-5 h-full">
                                        <div className="w-1/2 h-full"></div>
                                        <div className="w-1/2 flex items-center justify-center gap-5 h-full">
                                            <div className="w-[113.39px] h-[151.18px] border-2 border-zinc-700 flex items-center justify-center  font-bold flex-shrink-0">
                                                <p className="text-zinc-500/0 text-3xl">3x4</p>
                                            </div>
                                            <div className="w-full flex flex-col justify-between h-60 ">
                                                <p className="text-center">
                                                    Bandung, ...................................
                                                </p>
                                                <p className="text-center font-bold">
                                                    {printedData['nama_siswa']}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <hr className="my-5 opacity-0" />
            <div className="flex justify-end items-center">
                {['Admin'].includes(loggedAkun.role_akun) && (
                    <button type="button" onClick={() => document.getElementById('tutup_ppdb').showModal()} className="flex items-center w-fit px-3 py-2 rounded-lg justify-center gap-3 bg-red-500 hover:bg-red-400 focus:bg-red-600 text-white">
                        <FontAwesomeIcon icon={faPowerOff} className="w-4 h-4 text-inherit" />
                        Tutup PPDB
                    </button>
                )}
                <dialog id="tutup_ppdb" className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Apakah anda yakin?</h3>
                        <hr className="my-3 opacity-0" />
                        <p className="text-sm">Dengan anda menutup PPDB Tahun ini, data PPDB yang ada di tahun ini akan hilang. Silahkan pilih terlebih dahulu ekstensi apa yang ingin anda gunakan untuk meng-extract data tersebut.</p>
                        <hr className="my-2 opacity-0" />
                        <button type="button" onClick={() => handleTutupPPDB('tutup_ppdb', 'xlsx')} className="px-3 py-2 rounded-lg flex items-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white text-sm">
                            <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                            Export sebagai XLSX
                        </button>
                        <button type="button" onClick={() => handleTutupPPDB('tutup_ppdb', 'csv')} className="px-3 py-2 rounded-lg flex items-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white text-sm">
                            <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-inherit" />
                            Export sebagai CSV
                        </button>
                    </div>
                </dialog>
            </div>
        </MainLayoutPage>
    )
}