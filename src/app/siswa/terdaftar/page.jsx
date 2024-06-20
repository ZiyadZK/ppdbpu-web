'use client'

import MainLayoutPage from "@/components/mainLayout"
import { toast } from "@/libs/alert"
import { xlsx_getSheets } from "@/libs/excel"
import { formatFileSize } from "@/libs/formatFileSize"
import { M_Akun_getUserdata } from "@/libs/models/M_Akun"
import { faEdit, faFile, faSave } from "@fortawesome/free-regular-svg-icons"
import { faArrowDown, faArrowUp, faArrowsUpDown, faBookmark, faCheck, faDownload, faPlusSquare, faPowerOff, faSearch, faTrash, faTurnDown, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { M_Siswa_create, M_Siswa_delete, M_Siswa_getAll } from "@/libs/models/M_Siswa"
import { date_getYear } from "@/libs/date"
import { useRouter } from "next/navigation"

const formatData = {
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
    tanggal_lahir_wali: "Tanggal lahir wali",
    tahap: 'Tahap Penerimaan'
};

const formatRombel = {
    'DESAIN PEMODELAN DAN INFORMASI BANGUNAN': 'DPIB',
    'TEKNIK GEOSPASIAL': 'GEO',
    'TEKNIK JARINGAN KOMPUTER DAN TELEKOMUNIKASI': 'TKJ',
    'TEKNIK KETENAGALISTRIKAN': 'TITL',
    'TEKNIK MESIN': 'TPM',
    'TEKNIK OTOMOTIF': 'TKR'
}

const formatWarnaRombel = {
    'DESAIN PEMODELAN DAN INFORMASI BANGUNAN': 'amber',
    'TEKNIK GEOSPASIAL': 'red',
    'TEKNIK JARINGAN KOMPUTER DAN TELEKOMUNIKASI': 'green',
    'TEKNIK KETENAGALISTRIKAN': 'zinc',
    'TEKNIK MESIN': 'orange',
    'TEKNIK OTOMOTIF': 'blue'
}

const formatSorting = {
    nama_siswa: '', nisn: '', nomor_reg: '', nisn: ''
}

export default function SiswaTerdaftarPage() {
    const router = useRouter()

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
    const [selectAllData, setSelectAllData] = useState(false)
    const [sorting, setSorting] = useState(formatSorting)
    const [filterData, setFilterData] = useState({
        id_rombel: [], agama: [], jk_siswa: [], kategori: []
    })
    const [filterKategori, setFilterKategori] = useState([])
    const [loadingFetch, setLoadingFetch] = useState('')

    const [loggedAkun, setLoggedAkun] = useState(null)

    const getData = async () => {
        setLoadingFetch('loading')
        const response = await M_Siswa_getAll({
            tahun_masuk: date_getYear(),
            aktif: 1,
            daftar_ulang: 0
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

    const handleChangeFile = async (file) => {
        if(file) {
            setFileData(file)

            const fileName = file.name
            const fileExtension = fileName.split('.').pop()
            if(fileExtension === 'xlsx'){
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
            console.log('excel')
            try {
                const response = await readXLSXFile(fileData)

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
                    setUploadedFile(null)
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
                setUploadedFile(fileData)
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
                            if(key === 'id_rombel') {
                                newRow[key.toLowerCase()] = String(row[key].trim().replace(/\s+/g, ' '))
                            }else if(key === 'tgl_lahir_siswa'){
                                newRow[key.toLowerCase()] = `${row[key].split('/')[2]}-${row[key].split('/')[0]}-${row[key].split('/')[1]}`
                            }else if(key === 'pekerjaan_ayah') {
                                newRow[key.toLowerCase()] = typeof(row[key]) !== 'undefined' || row[key] !== '0' || row[key] !== 0 || row[key] !== '#N/A' ? (row[key] === 'DI RUMAH SAJA' ? 'TIDAK BEKERJA' : String(row[key])) : ''
                            }else if(key === 'pekerjaan_ibu') {
                                newRow[key.toLowerCase()] = typeof(row[key]) !== 'undefined' || row[key] !== '0' || row[key] !== 0 || row[key] !== '#N/A' ? (row[key] === 'DI RUMAH SAJA' ? 'TIDAK BEKERJA' : String(row[key])) : ''
                            }else if(key === 'pekerjaan_wali') {
                                newRow[key.toLowerCase()] = typeof(row[key]) !== 'undefined' || row[key] !== '0' || row[key] !== 0 || row[key] !== '#N/A' ? (row[key] === 'DI RUMAH SAJA' ? 'TIDAK BEKERJA' : String(row[key])) : ''
                            }else{
                                newRow[key.toLowerCase()] = row[key] === 0 || row[key] === '0' || typeof row[key] === 'undefined' || row[key] === '#N/A' ? '' : row[key];
                            }
                        });
                        return newRow;
                    });
            
                    setInfoFileData(state => ({
                        ...state, 
                        jumlahData: formattedData.length, 
                        jumlahKolom: Object.keys(formattedData[0]).length
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

                                if(newColumn === 'id_rombel') {
                                    obj[newColumn] = String(row[index].trim().replace(/\s+/g, ' '))
                                }else if(newColumn === 'tgl_lahir_siswa'){
                                    
                                    const dateValue = new Date((row[index] - 25569) * 86400 * 1000)
                                    
                                    // Construct the date string in the format 'dd/MM/yyyy'
                                    const day = String(dateValue.getDate()).padStart(2, '0');
                                    const month = String(dateValue.getMonth() + 1).padStart(2, '0'); // Month is zero-based
                                    const year = dateValue.getFullYear();
                                    obj[newColumn] = `${year}-${month}-${day}`;
                                }else if(newColumn === 'pekerjaan_ayah') {
                                    obj[newColumn] = row[index] === '0' || row[index] === 0 || typeof row[index] === 'undefined' || row[index] === '#N/A' ? '' : (row[index] === 'DI RUMAH SAJA' ? 'TIDAK BEKERJA' : String(row[index]))
                                }else if(newColumn === 'pekerjaan_ibu') {
                                    obj[newColumn] = row[index] === '0' || row[index] === 0 || typeof row[index] === 'undefined' || row[index] === '#N/A' ? '' : (row[index] === 'DI RUMAH SAJA' ? 'TIDAK BEKERJA' : String(row[index]))
                                }else if(newColumn === 'pekerjaan_wali') {
                                    obj[newColumn] = row[index] === '0' || row[index] === 0 || typeof row[index] === 'undefined' || row[index] === '#N/A' ? '' : (row[index] === 'DI RUMAH SAJA' ? 'TIDAK BEKERJA' : String(row[index]))
                                }else{
                                    obj[newColumn] = row[index] === '0' || row[index] === 0 || typeof row[index] === 'undefined' || row[index] === '#N/A' ? '' : String(row[index])
                                }
                            })
                            console.log(obj)
                            return obj
                        }else{
                            return null
                        }
                    }).filter(obj => obj !== null)
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

    const submitImport = async modal => {
        document.getElementById(modal).close()

        Swal.fire({
            title: 'Apakah anda yakin?',
            icon: 'question',
            text: 'Anda akan import data ke dalam Daftar Calon Siswa',
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: 'Tidak',
        }).then(answer => {
            if(answer.isConfirmed) {
                Swal.fire({
                    title: 'Sedang memproses data',
                    text: 'Harap bersabar, dikarenakan kami sedang memproses data anda.',
                    timer: 60000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEnterKey: false,
                    allowEscapeKey: false,
                    didOpen: async () => {
                        let responseData = { success: false }
                        if(uploadedData.length > 50) {
                            const numBatches = Math.ceil(uploadedData.length / 50)
                            const responseList = []
                            for(let i = 0; i < numBatches; i ++) {
                                const start = i * 50
                                const end = Math.min(start + 50, uploadedData.length)
                                const batch = uploadedData.slice(start, end)
                                const response = await M_Siswa_create(batch)
                                responseList.push(response.success ? 'success': 'failed')
                            }
                            responseData.success = responseList.includes('success')
                        }else{
                            const response = await M_Siswa_create(uploadedData)
                            responseData.success = response.success
                        }

                        const successMessage = responseData.success ? 'Berhasil memproses data!' : 'Gagal memproses data..';
                        const messageText = responseData.success ? 'Berhasil mengupload data import ke data siswa!' : 'Terdapat kendala disaat anda mengimport data ke data siswa!';

                        if(responseData.success) {
                            await getData()
                        }

                        Swal.fire({
                            icon: responseData.success ? 'success' : 'error',
                            title: successMessage,
                            text: messageText,
                            timer: 2000,
                            showConfirmButton: false
                        })
                    }
                })
            }else{
                Swal.close()
                document.getElementById(modal).showModal()
            }
        })

    }
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
            timer: 3000,
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

    const exportFormat = async (type = 'xlsx', fileName = 'Format Data XLSX', {header = [], sheetName = 'Format Data PPDB'}) => {
        if(type === 'xlsx') {
            const worksheet = XLSX.utils.json_to_sheet([])
            const workbook = XLSX.utils.book_new()
            XLSX.utils.sheet_to_csv(worksheet)
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
            XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' })
            return XLSX.writeFile(workbook, `${fileName}.${type}`, { compression: true })

        }else{
            const worksheet = XLSX.utils.json_to_sheet([])
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
            XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' })
            return XLSX.writeFile(workbook, `${fileName}.${type}`, { compression: true })
        }
    }

    const downloadFormat = async (type = 'xlsx') => {
        return await exportFormat(type, 'Format Data', {
            header: Object.keys(formatData)
        })
    }

    return (
        <MainLayoutPage>
            <div className="bg-white h-full md:p-5 px-5 md:rounded-2xl">
                <div className="flex items-center w-full md:w-fit gap-2">
                    {loggedAkun && ['Admin'].includes(loggedAkun['role_akun']) && (
                        <button type="button" onClick={() => router.push('/siswa/terdaftar/new')} className="w-1/2 bg-blue-500 hover:bg-blue-400 focus:bg-blue-600 md:w-fit px-3 py-2 rounded flex items-center justify-center gap-3 text-white text-sm">
                            <FontAwesomeIcon icon={faPlusSquare} className="w-4 h-4 text-inherit" />
                            Tambah
                        </button>
                    )}
                    {loggedAkun && ['Admin'].includes(loggedAkun['role_akun']) && (
                        <button type="button" onClick={() => document.getElementById('import_data').showModal()} className="w-1/2 bg-teal-500 hover:bg-teal-400 focus:bg-teal-600 md:w-fit px-3 py-2 rounded flex items-center justify-center gap-3 text-white text-sm">
                            <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-inherit" />
                            Import
                        </button>
                    )}
                    <dialog id="import_data" className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">Import Data</h3>
                            <hr className="my-2 opacity-0" />
                            <p className="text-sm">File harus berupa .CSV atau .XLSX, dan usahakan kolom-kolom didalamnya sudah cocok dengan yang ada di sistem.</p>
                            <hr className="my-1 opacity-0" />
                            <button type="button" onClick={() => downloadFormat()} className="w-fit px-3 py-2 rounded-lg flex items-center justify-center gap-3 text-sm bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600">
                                <FontAwesomeIcon icon={faBookmark} className="w-3 h-3 text-inherit" />
                                Unduh Format
                            </button>
                            <hr className="my-1 opacity-0" />
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
                                            {infoFileData['ukuran']}
                                        </p>
                                    </div>
                                    <div className="flex items-center w-full">
                                        <p className="w-1/3 opacity-50">
                                            Jumlah Data
                                        </p>
                                        <p className="w-2/3">
                                            {infoFileData['jumlahData']} Baris
                                        </p>
                                    </div>
                                    <div className="flex items-center w-full">
                                        <p className="w-1/3 opacity-50">
                                            Ekstensi
                                        </p>
                                        <p className="w-2/3">
                                            {infoFileData['ekstensi']}
                                        </p>
                                    </div>
                                    <div className="flex items-center w-full">
                                        <p className="w-1/3 opacity-50">
                                            Jumlah Kolom
                                        </p>
                                        <p className="w-2/3">
                                            {infoFileData['jumlahKolom']} <span className="opacity-50">/ {Object.keys(formatData).length}</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                            <hr className="my-2 opacity-0" />
                            {isUploadedDataValid && (
                                <button type="button" onClick={() => submitImport('import_data')} className="px-3 py-2 rounded-lg bg-green-500 hover:bg-green-400 focus:bg-green-600 flex items-center gap-3 text-white text-sm">
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
                                <p className={`text-xs font-medium px-2 py-1 rounded-full bg-zinc-500/10 text-zinc-500`}>
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
                                <button type="button" onClick={() => router.push(`/siswa/terdaftar/update/${siswa.nisn}`)} className="w-6 h-6 rounded bg-amber-500 hover:bg-amber-400 focus:bg-amber-700 text-amber-200 flex items-center justify-center">
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
        </MainLayoutPage>
    )
}