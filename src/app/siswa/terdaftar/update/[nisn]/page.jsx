'use client'

import MainLayoutPage from "@/components/mainLayout"
import { toast } from "@/libs/alert"
import { date_getDay, date_getMonth, date_getYear, date_toFormat, date_toInputHtml } from "@/libs/date"
import { M_Siswa_get, M_Siswa_update } from "@/libs/models/M_Siswa"
import { faNewspaper, faUser } from "@fortawesome/free-regular-svg-icons"
import { faArrowLeft, faPenRuler, faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import html2canvas from "html2canvas-pro"

import jsPDF from "jspdf"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"

const mmToPx = mm => mm * (96 / 25.4)

const formatDataSiswa = {
    'Data Pribadi': {
        nomor_reg: 'No. Pendaftaran',
        nisn: 'NISN',
        nis: 'NIS',
        id_rombel: 'Jurusan',
        nama_siswa: 'Nama Lengkap',
        jk_siswa: 'Jenis Kelamin',
        tempat_lahir_siswa: 'Tempat Lahir',
        tgl_lahir_siswa: 'Tanggal Lahir',
        alamat_siswa: 'Alamat',
        no_telp_siswa: 'No Telepon',
        no_kk: 'No Kartu Keluarga',
        agama: 'Agama',
        status_anak: 'Status Anak',
        jml_saudara: 'Jumlah Saudara',
        alamat_email_siswa: 'Email',
        password_siswa: 'Password',
        kebutuhan_khusus: 'Kebutuhan Khusus',
        bantuanp: 'Bantuan',
        kategori: 'Kategori',
        nik: 'NIK',
        alat_transport: 'Alat Transportasi',
        tinggi_badan: 'Tinggi Badan',
        berat_badan: 'Berat Badan',
        jarak: 'Jarak dari Rumah ke Sekolah',
        lingkar_kepala: 'Lingkar Kepala',
        waktu_dari_rumah_ke_sekolah: 'Waktu dari Rumah ke Sekolah',
        hobby: 'Hobi',
        cita_cita: 'Cita - cita',
        anak_ke_berapa: 'Anak ke berapa',
        tinggal: 'Tinggal bersama',
        tahun_masuk: 'Tahun Masuk'
    },
    'Data Asal Sekolah': {
        asal_sekolah: 'Asal Sekolah',
        no_ijazah: 'No Ijazah',
        tgl_ijazah: 'Tanggal Ijazah',
        no_skhun: 'No SKHUN',
    },
    'Data Orang Tua / Wali': {
        nik_ayah: 'No NIK Ayah',
        nama_ayah: 'Nama Ayah',
        no_telp_ayah: 'No Telp Ayah',
        kebutuhan_ayah: 'Kebutuhan Khusus Ayah',
        pekerjaan_ayah: 'Pekerjaan Ayah',
        pendidikan_ayah: 'Pendidikan Terakhir Ayah',
        penghasilan_ayah: 'Penghasilan Ayah',
        tempat_lahir_ayah: 'Tempat Lahir Ayah',
        tanggal_lahir_ayah: 'Tanggal Lahir Ayah',
        nik_ibu: 'No NIK ibu',
        nama_ibu: 'Nama ibu',
        no_telp_ibu: 'No Telp ibu',
        kebutuhan_ibu: 'Kebutuhan Khusus ibu',
        pekerjaan_ibu: 'Pekerjaan ibu',
        pendidikan_ibu: 'Pendidikan Terakhir ibu',
        penghasilan_ibu: 'Penghasilan ibu',
        tempat_lahir_ibu: 'Tempat Lahir ibu',
        tanggal_lahir_ibu: 'Tanggal Lahir ibu',
        nik_wali: 'No NIK wali',
        nama_wali: 'Nama wali',
        no_telp_wali: 'No Telp wali',
        kebutuhan_wali: 'Kebutuhan Khusus wali',
        pekerjaan_wali: 'Pekerjaan wali',
        pendidikan_wali: 'Pendidikan Terakhir wali',
        penghasilan_wali: 'Penghasilan wali',
        tempat_lahir_wali: 'Tempat Lahir wali',
        tanggal_lahir_wali: 'Tanggal Lahir wali',
        hubungan_wali: 'Hubungan dengan Wali'
    }
}



const formatRombel = {
    'DESAIN PEMODELAN DAN INFORMASI BANGUNAN': 'DPIB',
    'TEKNIK GEOSPASIAL': 'GEO',
    'TEKNIK JARINGAN KOMPUTER DAN TELEKOMUNIKASI': 'TKJ',
    'TEKNIK KETENAGALISTRIKAN': 'TITL',
    'TEKNIK MESIN': 'TPM',
    'TEKNIK OTOMOTIF': 'TKR'
}

export default function SiswaTerdaftarUpdatePage({params: {nisn}}) {
    const router = useRouter()

    const [data, setData] = useState(null)
    const [loadingFetch, setLoadingFetch] = useState('')
    const [bersamaWali, setBersamaWali] = useState(false)
    const componentPDF_1 = useRef(null)
    const componentPDF_2 = useRef(null)

    const getData = async () => {
        setLoadingFetch('loading')
        const response = await M_Siswa_get(nisn, { daftar_ulang: 0, aktif: 1 })
        if(response.success) {
            setData(response.data)
            if(response.data !== null) {
                if(response.data['nama_wali'] !== '') {
                    setBersamaWali(true)
                }
            }
        }
        setLoadingFetch('fetched')
    }

    useEffect(() => {
        getData()
    }, [])

    const submitData = async (e) => {
        e.preventDefault()
        document.getElementById('content_print').classList.remove('hidden')

        Swal.fire({
            title: 'Sedang menyimpan data..',
            timer: 30000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: async () => {
                try {
                    let response
                    if(bersamaWali) {
                        response = await M_Siswa_update(data['nisn'], {...data, daftar_ulang: true})
                    }else{
                        response = await M_Siswa_update(data['nisn'], {
                            ...data,
                            daftar_ulang: true,
                            nama_wali: '',
                            no_telp_wali: '',
                            nik_wali: '',
                            tempat_lahir_wali: '',
                            tanggal_lahir_wali: '',
                            pekerjaan_wali: '',
                            pendidikan_wali: '',
                            penghasilan_wali: ''
                        })
                    }

                    if(response.success) {
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
                        const pdfDataUri = pdf.output('datauristring')
                        // pdf.save(`DATA CALON SISWA DITERIMA - ${data.nama_siswa} - ${data.id_rombel} - ${data.nisn}`)
                        
                        document.getElementById('content_print').classList.add('hidden')

                        Swal.close()
                        Swal.fire({
                            title: 'Sukses',
                            icon: 'success',
                            text: 'Berhasil mengubah data siswa tersebut!',
                            timer: 3000,
                            timerProgressBar: true
                        }).then(() => {
                            const newTab = window.open();
                            newTab.document.write(`<iframe src="${pdfDataUri}" width="100%" height="100%"></iframe>`);
                            router.push('/siswa/terdaftar')
                        })
                    }else{
                        document.getElementById('content_print').classList.add('hidden')
                        toast.fire({
                            title: 'Gagal',
                            text: response.message,
                            icon: 'error',
                            timer: 5000,
                            timerProgressBar: true
                        })
                    }
                } catch (error) {
                    document.getElementById('content_print').classList.add('hidden')
                    console.log(error)
                    toast.fire({
                        title: 'Gagal',
                        text: 'Tampaknya terdapat error, silahkan hubungi Administrator',
                        icon: 'error',
                        timer: 5000,
                        timerProgressBar: true
                    })
                }
            }
        })
    }
    
    return (
        <MainLayoutPage>
            {loadingFetch !== 'fetched' && (
                <div className="flex items-center w-full justify-center gap-5 text-zinc-500 h-screen">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            )}
            {loadingFetch === 'fetched' && data === null && (
                <div className="flex items-center w-full justify-center gap-5 text-zinc-500 h-screen">
                    <div className="p-5 rounded-2xl bg-white w-fit">
                        <h1 className="font-extrabold text-center text-5xl">
                            Data Siswa ini <span className="text-red-500">tidak ditemukan!</span>
                        </h1>
                        <hr className="my-5 opacity-0" />
                        <p className="text-center">
                            Tampaknya Data siswa dengan NISN {nisn} tidak ditemukan, <br /> anda bisa kembali dengan menekan tombol di bawah ini.
                        </p>
                        <hr className="my-5 opacity-0" />
                        <div className="flex w-full justify-center">
                            <button type="button" onClick={() => router.back()} className="px-3 py-2 w-fit flex items-center justify-center gap-5 border rounded-full hover:bg-zinc-100 hover:shadow-lg hover:border-zinc-100/0 transition-all duration-300">
                                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {loadingFetch === 'fetched' && data !== null && (
                <form onSubmit={submitData} className="bg-white h-full md:p-5 px-5 md:rounded-2xl">
                    <div className="flex items-center md:justify-between w-full gap-5 bg-white">
                        <button type="button" onClick={() => router.back()} className="md:w-fit w-1/2 px-3 py-2 rounded-lg flex items-center justify-center gap-3 bg-zinc-100 hover:bg-zinc-200">
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                            Kembali
                        </button>
                        <button type="submit" className="md:w-fit w-1/2 px-3 py-2 rounded-lg flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                            <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                            Simpan
                        </button>
                    </div>
                    <hr className="my-3 opacity-0" />
                    <div className="space-y-5">
                        <div className="collapse bg-zinc-50 hover:bg-white border border-zinc-500/0 hover:border-zinc-200 collapse-arrow hover:shadow-lg transition-all duration-300">
                            <input type="checkbox" defaultChecked /> 
                            <div className="collapse-title text-xl font-medium">
                                Data Pribadi
                            </div>
                            <div className="collapse-content"> 
                                <div className="space-y-2">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Tahap PPDB
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['tahap']} onChange={e => setData(state => ({...state, tahap: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Tahap --</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            No Pendaftaran
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="No Pendaftaran" value={data['nomor_reg']} onChange={e => setData(state => ({...state, nomor_reg: e.target.value}))} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            NISN
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['nisn']} onChange={e => setData(state => ({...state, nisn: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="NISN" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            NIS
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['nis']} onChange={e => setData(state => ({...state, nis: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="NIS" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div  className="w-full md:w-1/5 opacity-70">
                                            Jurusan
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['id_rombel']} onChange={e => setData(state => ({...state, id_rombel: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Jurusan --</option>
                                                {Object.keys(formatRombel).map((rombel, index) => (
                                                    <option key={index} value={rombel}>
                                                        {formatRombel[rombel]}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Nama Lengkap
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['nama_siswa']} onChange={e => setData(state => ({...state, nama_siswa: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Nama Lengkap" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Jenis Kelamin
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['jk_siswa']} onChange={e => setData(state => ({...state, jk_siswa: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                                                <option value="Laki - laki">Laki - laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Tempat Lahir
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['tempat_lahir_siswa']} onChange={e => setData(state => ({...state, tempat_lahir_siswa: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Tempat Lahir" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Tanggal Lahir
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['tgl_lahir_siswa']} onChange={e => setData(state => ({...state, tgl_lahir_siswa: e.target.value}))} type="date" required className="w-full px-3 py-2 rounded-lg border" placeholder="Tanggal Lahir" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Alamat
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['alamat_siswa']} onChange={e => setData(state => ({...state, alamat_siswa: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Alamat" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            No Telepon
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['no_telp_siswa']} onChange={e => setData(state => ({...state, no_telp_siswa: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="No Telepon" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            No Kartu Keluarga
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['no_kk']} onChange={e => setData(state => ({...state, no_kk: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="No Kartu Keluarga" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Agama
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['agama']} onChange={e => setData(state => ({...state, agama: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Agama --</option>
                                                <option value="ISLAM">Islam</option>
                                                <option value="PROTESTAN">Protestan</option>
                                                <option value="KATOLIK">Katolik</option>
                                                <option value="HINDU">Hindu</option>
                                                <option value="BUDDHA">Buddha</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Jumlah Saudara
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['jml_saudara']} onChange={e => setData(state => ({...state, jml_saudara: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Jumlah Saudara" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Anak ke Berapa
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['anak_ke_berapa']} onChange={e => setData(state => ({...state, anak_ke_berapa: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Anak ke Berapa" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Kategori
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['kategori']} onChange={e => setData(state => ({...state, kategori: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Kategori --</option>
                                                <option value="ABK">ABK</option>
                                                <option value="KETM">KETM</option>
                                                <option value="KONDISI TERTENTU">Kondisi Tertentu</option>
                                                <option value="PERPINDAHAN TUGAS ORTU / ANAK GURU">Perpindahan Tugas Ortu / Anak Guru</option>
                                                <option value="PERSIAPAN KELAS INDUSTRI">Persiapan Kelas Industri</option>
                                                <option value="PRESTASI KEJUARAAN">Prestasi Kejuaraan</option>
                                                <option value="PRESTASI RAPOR UMUM">Prestasi Rapor Umum</option>
                                                <option value="PRIORITAS JARAK">Prioritas Jarak</option>
                                            </select>
                                        </div>
                                    </div>
                                    {data['kategori'] === 'PRESTASI KEJUARAAN' && (
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                            <div className="w-full md:w-1/5 opacity-70">
                                                Keterangan Kategori
                                            </div>
                                            <div className="w-full md:w-4/5">
                                                <input value={data['keterangan_kategori']} required={data['kategori'] === 'PRESTASI KEJUARAAN'} onChange={e => setData(state => ({...state, keterangan_kategori: e.target.value}))} type="text" className="w-full px-3 py-2 rounded-lg border" placeholder="Keterangan untuk Prestasi Kejuaraan" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            NIK
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['nik']} onChange={e => setData(state => ({...state, nik: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="NIK" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Alat Transportasi
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['alat_transport']} onChange={e => setData(state => ({...state, alat_transport: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Alat Transportasi --</option>
                                                <option value="ANGKUTAN UMUM">Angkutan Umum</option>
                                                <option value="ANTAR JEMPUT SEKOLAH">Antar Jemput Sekolah</option>
                                                <option value="JALAN KAKI">Jalan Kaki</option>
                                                <option value="MOTOR">Motor</option>
                                                <option value="SEPEDA">Sepeda</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Tinggi Badan (cm)
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['tinggi_badan']} onChange={e => setData(state => ({...state, tinggi_badan: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Tinggi Badan (cm)" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Berat Badan (kg)
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['berat_badan']} onChange={e => setData(state => ({...state, berat_badan: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Berat Badan (kg)" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Jarak ke Sekolah (km)
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['jarak']} onChange={e => setData(state => ({...state, jarak: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Jarak --</option>
                                                <option value="0 - 1 km">0 - 1</option>
                                                <option value="1 - 3 km">1 - 3</option>
                                                <option value="3 - 5 km">3 - 5</option>
                                                <option value="5 - 10 km">5 - 10</option>
                                                <option value="> 10 km">&gt; 10</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Lingkar Kepala (cm)
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['lingkar_kepala']} onChange={e => setData(state => ({...state, lingkar_kepala: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Lingkar Kepala" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Waktu dari Rumah ke Sekolah (menit)
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['waktu_dari_rumah_ke_sekolah']} onChange={e => setData(state => ({...state, waktu_dari_rumah_ke_sekolah: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Waktu dari Rumah ke Sekolah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Hobby
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['hobby']} onChange={e => setData(state => ({...state, hobby: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Hobby" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Cita - cita
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['cita_cita']} onChange={e => setData(state => ({...state, cita_cita: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Cita - cita" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Tinggal 
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['tinggal']} onChange={e => setData(state => ({...state, tinggal: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih --</option>
                                                <option value="Bersama Orang Tua">Bersama Orang Tua</option>
                                                <option value="Wali">Bersama Wali</option>
                                                <option value="Kos">Kos</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="collapse bg-zinc-50 hover:bg-white border border-zinc-500/0 hover:border-zinc-200 collapse-arrow hover:shadow-lg transition-all duration-300 sticky top-4">
                            <input type="checkbox" defaultChecked /> 
                            <div className="collapse-title text-xl font-medium">
                                Data Asal Sekolah
                            </div>
                            <div className="collapse-content"> 
                                <div className="md:space-y-2 space-y-3">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Nama Sekolah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['asal_sekolah']} onChange={e => setData(state => ({...state, asal_sekolah: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Nama Sekolah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            No Ijazah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['no_ijazah']} onChange={e => setData(state => ({...state, no_ijazah: e.target.value}))} type="text" className="w-full px-3 py-2 rounded-lg border" placeholder="No Ijazah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Tanggal Ijazah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['tgl_ijazah']} onChange={e => setData(state => ({...state, tgl_ijazah: e.target.value}))} type="date" className="w-full px-3 py-2 rounded-lg border" placeholder="No Ijazah" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="collapse bg-zinc-50 hover:bg-white border border-zinc-500/0 hover:border-zinc-200 collapse-arrow hover:shadow-lg transition-all duration-300 sticky top-4">
                            <input type="checkbox" defaultChecked /> 
                            <div className="collapse-title text-xl font-medium">
                                Data Orang Tua
                            </div>
                            <div className="collapse-content"> 
                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex items-center gap-5">
                                        <hr className="flex-grow" />
                                        <p className="font-bold">Data Ayah</p>
                                        <hr className="flex-grow" />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Nama Ayah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['nama_ayah']} onChange={e => setData(state => ({...state, nama_ayah: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Nama Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            No Telp Ayah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input type="text" value={data['no_telp_ayah']} onChange={e => setData(state => ({...state, no_telp_ayah: e.target.value}))} required className="w-full px-3 py-2 rounded-lg border" placeholder="No Telp Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            No NIK Ayah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['nik_ayah']} onChange={e => setData(state => ({...state, nik_ayah: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="No NIK Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Tempat Lahir Ayah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['tempat_lahir_ayah']} onChange={e => setData(state => ({...state, tempat_lahir_ayah: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Tempat Lahir Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Tanggal Lahir Ayah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['tanggal_lahir_ayah']} onChange={e => setData(state => ({...state, tanggal_lahir_ayah: e.target.value}))} type="date" required className="w-full px-3 py-2 rounded-lg border" placeholder="Tanggal Lahir Ayah" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Pekerjaan Ayah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['pekerjaan_ayah']} onChange={e => setData(state => ({...state, pekerjaan_ayah: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Pekerjaan --</option>
                                                <option value="BURUH">Buruh</option>
                                                <option value="MENGURUS RUMAH TANGGA">Mengurus Rumah Tangga</option>
                                                <option value="GURU/DOSEN">Guru / Dosen</option>
                                                <option value="PEDAGANG/WIRASWASTA">Pedagang / Wiraswasta</option>
                                                <option value="PEGAWAI SWASTA">Pegawai Swasta</option>
                                                <option value="PNS (Selain Guru dan Dokter)">PNS (Selain Guru dan Dokter)</option>
                                                <option value="TNI/POLRI">TNI / Polri</option>
                                                <option value="LAINNYA">Lainnya</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Pendidikan Terakhir Ayah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['pendidikan_ayah']} onChange={e => setData(state => ({...state, pendidikan_ayah: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Pendidikan --</option>
                                                <option value="TIDAK TAMAT SD/MI/PAKET A">Tidak Tamat SD / MI / Paket A</option>
                                                <option value="SD/MI/PAKET A">SD / MI / Paket A</option>
                                                <option value="SMP/MTS/PAKET B">SMP / MTS / Paket B</option>
                                                <option value="SMA/MA/PAKET C">SMA / MTS / Paket C</option>
                                                <option value="DIPLOMA 1dan2">D1 / D2</option>
                                                <option value="DIPLOMA 3dan4">D3 / D4</option>
                                                <option value="STRATA 1 (Sarjana)">S1</option>
                                                <option value="STRATA 2 (Magister)">S2</option>
                                                <option value="LAINNYA">Lainnya</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Penghasilan Ayah
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['penghasilan_ayah']} onChange={e => setData(state => ({...state, penghasilan_ayah: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Penghasilan --</option>
                                                <option value="TIDAK BERPENGHASILAN">Tidak Berpenghasilan</option>
                                                <option value="< Rp. 1.000.000">&lt; Rp. 1.000.000</option>
                                                <option value="Rp. 1.000.000 - Rp. 3.000.000">Rp. 1.000.000 - Rp. 3.000.000</option>
                                                <option value="Rp. 3.000.000 - Rp. 5.000.000">Rp. 3.000.000 - Rp. 5.000.000</option>
                                                <option value="Rp. 5.000.000 - Rp. 7.000.000">Rp. 5.000.000 - Rp. 7.000.000</option>
                                                <option value="> Rp. 7.000.000">&gt; Rp. 7.000.000</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <hr className="flex-grow" />
                                        <p className="font-bold">Data Ibu</p>
                                        <hr className="flex-grow" />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Nama Ibu
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['nama_ibu']} onChange={e => setData(state => ({...state, nama_ibu: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Nama Ibu" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            No Telp Ibu
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['no_telp_ibu']} onChange={e => setData(state => ({...state, no_telp_ibu: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="No Telp Ibu" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            No NIK Ibu
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['nik_ibu']} onChange={e => setData(state => ({...state, nik_ibu: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="No NIK Ibu" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Tempat Lahir Ibu
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['tempat_lahir_ibu']} onChange={e => setData(state => ({...state, tempat_lahir_ibu: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Tempat Lahir Ibu" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Tanggal Lahir Ibu
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <input value={data['tanggal_lahir_ibu']} onChange={e => setData(state => ({...state, tanggal_lahir_ibu: e.target.value}))} type="date" required className="w-full px-3 py-2 rounded-lg border" placeholder="Tanggal Lahir Ibu" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Pekerjaan Ibu
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['pekerjaan_ibu']} onChange={e => setData(state => ({...state, pekerjaan_ibu: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Pekerjaan --</option>
                                                <option value="BURUH">Buruh</option>
                                                <option value="MENGURUS RUMAH TANGGA">Mengurus Rumah Tangga</option>
                                                <option value="GURU/DOSEN">Guru / Dosen</option>
                                                <option value="PEDAGANG/WIRASWASTA">Pedagang / Wiraswasta</option>
                                                <option value="PEGAWAI SWASTA">Pegawai Swasta</option>
                                                <option value="PNS (Selain Guru dan Dokter)">PNS (Selain Guru dan Dokter)</option>
                                                <option value="TNI/POLRI">TNI / Polri</option>
                                                <option value="LAINNYA">Lainnya</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Pendidikan Terakhir Ibu
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['pendidikan_ibu']} onChange={e => setData(state => ({...state, pendidikan_ibu: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Pendidikan --</option>
                                                <option value="TIDAK TAMAT SD/MI/PAKET A">Tidak Tamat SD / MI / Paket A</option>
                                                <option value="SD/MI/PAKET A">SD / MI / Paket A</option>
                                                <option value="SMP/MTS/PAKET B">SMP / MTS / Paket B</option>
                                                <option value="SMA/MA/PAKET C">SMA / MTS / Paket C</option>
                                                <option value="DIPLOMA 1dan2">D1 / D2</option>
                                                <option value="DIPLOMA 3dan4">D3 / D4</option>
                                                <option value="STRATA 1 (Sarjana)">S1</option>
                                                <option value="STRATA 2 (Magister)">S2</option>
                                                <option value="LAINNYA">Lainnya</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                        <div className="w-full md:w-1/5 opacity-70">
                                            Penghasilan Ibu
                                        </div>
                                        <div className="w-full md:w-4/5">
                                            <select required value={data['penghasilan_ibu']} onChange={e => setData(state => ({...state, penghasilan_ibu: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                <option value="" disabled>-- Pilih Penghasilan --</option>
                                                    <option value="TIDAK BERPENGHASILAN">Tidak Berpenghasilan</option>
                                                    <option value="< Rp. 1.000.000">&lt; Rp. 1.000.000</option>
                                                    <option value="Rp. 1.000.000 - Rp. 3.000.000">Rp. 1.000.000 - Rp. 3.000.000</option>
                                                    <option value="Rp. 3.000.000 - Rp. 5.000.000">Rp. 3.000.000 - Rp. 5.000.000</option>
                                                    <option value="Rp. 5.000.000 - Rp. 7.000.000">Rp. 5.000.000 - Rp. 7.000.000</option>
                                                    <option value="> Rp. 7.000.000">&gt; Rp. 7.000.000</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <hr className="flex-grow" />
                                        <p className="font-bold">Data Wali</p>
                                        <hr className="flex-grow" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="hubungan_dengan_wali" checked={bersamaWali} onChange={() => setBersamaWali(state => !state)} />
                                            <label htmlFor="hubungan_dengan_wali" className="opacity-70 hover:opacity-100 cursor-pointer">Bersama Wali?</label>
                                        </div>
                                        {!bersamaWali && (
                                            <button type="submit" className="md:w-fit w-1/2 px-3 py-2 rounded-lg flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                                                Simpan
                                            </button>
                                        )}
                                    </div>
                                    {bersamaWali && (
                                        <>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                <div className="w-full md:w-1/5 opacity-70">
                                                    Hubungan dengan Wali
                                                </div>
                                                <div className="w-full md:w-4/5">
                                                    <select required value={data['hubungan_wali']} onChange={e => setData(state => ({...state, hubungan_wali: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                        <option value="" disabled>-- Pilih --</option>
                                                        <option value="AYAH SAMBUNG">Ayah Sambung</option>
                                                        <option value="IBU SAMBUNG">Ibu Sambung</option>
                                                        <option value="KAKAK KANDUNG">Kakak Kandung</option>
                                                        <option value="KAKAK IPAR">Kakak Ipar</option>
                                                        <option value="KAKEK">Kakek</option>
                                                        <option value="NENEK">Nenek</option>
                                                        <option value="PAMAN">Paman</option>
                                                        <option value="BIBI">Bibi</option>
                                                        <option value="SAUDARA">Saudara</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                <div className="w-full md:w-1/5 opacity-70">
                                                    Nama Wali
                                                </div>
                                                <div className="w-full md:w-4/5">
                                                    <input value={data['nama_wali']} onChange={e => setData(state => ({...state, nama_wali: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Nama Wali" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                <div className="w-full md:w-1/5 opacity-70">
                                                    No Telp Wali
                                                </div>
                                                <div className="w-full md:w-4/5">
                                                    <input value={data['no_telp_wali']} onChange={e => setData(state => ({...state, no_telp_wali: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="No Telp Wali" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                <div className="w-full md:w-1/5 opacity-70">
                                                    No NIK Wali
                                                </div>
                                                <div className="w-full md:w-4/5">
                                                    <input value={data['nik_wali']} onChange={e => setData(state => ({...state, nik_wali: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="No NIK Wali" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                <div className="w-full md:w-1/5 opacity-70">
                                                    Tempat Lahir Wali
                                                </div>
                                                <div className="w-full md:w-4/5">
                                                    <input value={data['tempat_lahir_wali']} onChange={e => setData(state => ({...state, tempat_lahir_wali: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Tempat Lahir Wali" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                <div className="w-full md:w-1/5 opacity-70">
                                                    Tanggal Lahir Wali
                                                </div>
                                                <div className="w-full md:w-4/5">
                                                    <input type="date" value={data['tanggal_lahir_wali']} onChange={e => setData(state => ({...state, tanggal_lahir_wali: e.target.value}))} required className="w-full px-3 py-2 rounded-lg border" placeholder="Tanggal Lahir Wali" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                <div className="w-full md:w-1/5 opacity-70">
                                                    Pekerjaan Wali
                                                </div>
                                                <div className="w-full md:w-4/5">
                                                    <select required value={data['pekerjaan_wali']} onChange={e => setData(state => ({...state, pekerjaan_wali: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                        <option value="" disabled>-- Pilih Pekerjaan --</option>
                                                        <option value="BURUH">Buruh</option>
                                                        <option value="MENGURUS RUMAH TANGGA">Mengurus Rumah Tangga</option>
                                                        <option value="GURU/DOSEN">Guru / Dosen</option>
                                                        <option value="PEDAGANG/WIRASWASTA">Pedagang / Wiraswasta</option>
                                                        <option value="PEGAWAI SWASTA">Pegawai Swasta</option>
                                                        <option value="PNS (Selain Guru dan Dokter)">PNS (Selain Guru dan Dokter)</option>
                                                        <option value="TNI/POLRI">TNI / Polri</option>
                                                        <option value="LAINNYA">Lainnya</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                <div className="w-full md:w-1/5 opacity-70">
                                                    Pendidikan Terakhir Wali
                                                </div>
                                                <div className="w-full md:w-4/5">
                                                    <select required value={data['pendidikan_wali']} onChange={e => setData(state => ({...state, pendidikan_wali: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                        <option value="" disabled>-- Pilih Pendidikan --</option>
                                                        <option value="TIDAK TAMAT SD/MI/PAKET A">Tidak Tamat SD / MI / Paket A</option>
                                                        <option value="SD/MI/PAKET A">SD / MI / Paket A</option>
                                                        <option value="SMP/MTS/PAKET B">SMP / MTS / Paket B</option>
                                                        <option value="SMA/MA/PAKET C">SMA / MTS / Paket C</option>
                                                        <option value="DIPLOMA 1dan2">D1 / D2</option>
                                                        <option value="DIPLOMA 3dan4">D3 / D4</option>
                                                        <option value="STRATA 1 (Sarjana)">S1</option>
                                                        <option value="STRATA 2 (Magister)">S2</option>
                                                        <option value="LAINNYA">Lainnya</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                                <div className="w-full md:w-1/5 opacity-70">
                                                    Penghasilan Wali
                                                </div>
                                                <div className="w-full md:w-4/5">
                                                    <select required value={data['penghasilan_wali']} onChange={e => setData(state => ({...state, penghasilan_wali: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                        <option value="" disabled>-- Pilih Penghasilan --</option>
                                                        <option value="TIDAK BERPENGHASILAN">Tidak Berpenghasilan</option>
                                                        <option value="< Rp. 1.000.000">&lt; Rp. 1.000.000</option>
                                                        <option value="Rp. 1.000.000 - Rp. 3.000.000">Rp. 1.000.000 - Rp. 3.000.000</option>
                                                        <option value="Rp. 3.000.000 - Rp. 5.000.000">Rp. 3.000.000 - Rp. 5.000.000</option>
                                                        <option value="Rp. 5.000.000 - Rp. 7.000.000">Rp. 5.000.000 - Rp. 7.000.000</option>
                                                        <option value="> Rp. 7.000.000">&gt; Rp. 7.000.000</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <button type="submit" className="md:w-fit w-1/2 px-3 py-2 rounded-lg flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                                                    <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                                                    Simpan
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
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
                                <div className=" pt-5">
                                    <div className="w-full border-4 border-zinc-700"></div>
                                </div>
                                <div className="text-lg">
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
                                                    {data['nik']}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex justify-between items-center w-2/5">
                                                    <p className="font-extrabold flex-grow">NISN</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                    {data['nisn']}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex justify-between items-center w-2/5">
                                                    <p className="font-extrabold flex-grow">Nama Siswa</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                    {data['nama_siswa']}
                                                </p>
                                            </div>
                                            <div className="flex  gap-2">
                                                <div className="flex justify-between  w-2/5">
                                                    <p className="font-extrabold flex-grow">Rombongan Pelajar</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">X - {formatRombel[data['id_rombel']]}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex justify-between items-center w-2/5">
                                                    <p className="font-extrabold flex-grow">Jenis Kelamin</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                    {data['jk_siswa']}
                                                </p>
                                            </div>
                                            <div className="flex  gap-2">
                                                <div className="flex justify-between  w-2/5">
                                                    <p className="font-extrabold flex-grow">TTL</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                    {data['tempat_lahir_siswa']}, {date_getDay(data['tgl_lahir_siswa'])} {date_getMonth('string', data['tgl_lahir_siswa'])} {date_getYear(data['tgl_lahir_siswa'])}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex justify-between items-center w-2/5">
                                                    <p className="font-extrabold flex-grow">Agama</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                    {data['agama']}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex justify-between items-center w-2/5">
                                                    <p className="font-extrabold flex-grow">No. Telepon</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                {data['no_telp_siswa']}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex justify-between items-center w-2/5">
                                                    <p className="font-extrabold flex-grow">Nomor Peserta UN</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                {data['nomor_reg']}
                                                </p>
                                            </div>
                                            <div className="flex  gap-2">
                                                <div className="flex justify-between  w-2/5">
                                                    <p className="font-extrabold flex-grow">Jalur Masuk</p>
                                                    <p className="font-extrabold">:</p>
                                                </div>
                                                <p className="w-3/5">
                                                {data['kategori']}
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
                                                {data['alamat_siswa']}
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
                                                    {data['alat_transport']}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex justify-between items-center w-2/5">
                                                        <p className="font-extrabold flex-grow">Tinggi Badan</p>
                                                        <p className="font-extrabold">:</p>
                                                    </div>
                                                    <p className="w-3/5">
                                                    {data['tinggi_badan']} cm
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex justify-between items-center w-2/5">
                                                        <p className="font-extrabold flex-grow">Berat Badan</p>
                                                        <p className="font-extrabold">:</p>
                                                    </div>
                                                    <p className="w-3/5">
                                                    {data['berat_badan']} kg
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex justify-between items-center w-2/5">
                                                        <p className="font-extrabold flex-grow">Jarak Tempat Tinggal</p>
                                                        <p className="font-extrabold">:</p>
                                                    </div>
                                                    <p className="w-3/5">
                                                    {data['jarak']}
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
                                            {data['nama_ayah']}
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {data['nama_ibu']}
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {bersamaWali ? data['nama_wali'] : '-'}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-12 py-4 px-1">
                                            <div className="col-span-3 flex items-center font-bold text-lg">
                                                No. Telepon
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {data['no_telp_ayah']}
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                                {data['no_telp_ibu']}
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                                {bersamaWali ? data['no_telp_wali'] : '-'}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-12 py-4 px-1">
                                            <div className="col-span-3 flex items-center font-bold text-lg">
                                                Pekerjaan
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {data['pekerjaan_ayah']}
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {data['pekerjaan_ibu']}
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {bersamaWali ? data['pekerjaan_wali'] : '-'}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-12 py-4 px-1">
                                            <div className="col-span-3 flex items-center font-bold text-lg">
                                                Pendidikan
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {data['pendidikan_ayah']}
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {data['pendidikan_ibu']}
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {bersamaWali ? data['pendidikan_wali'] : '-'}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-12 py-4 px-1">
                                            <div className="col-span-3 flex items-center font-bold text-lg">
                                                Penghasilan
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {data['penghasilan_ayah']}
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {data['penghasilan_ibu']}
                                            </div>
                                            <div className="col-span-3 text-lg flex items-center">
                                            {bersamaWali ? data['penghasilan_wali'] : '-'}
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
                                                {data['nama_siswa']}
                                                </p>   
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ref={componentPDF_2} style={{ 
                                width: `${(mmToPx(210) * 1.5)}px`, 
                                height: `${(mmToPx(330) * 1.5)}px`,
                            }} className={`bg-white flex-shrink-0 text-lg`}
                            >
                                <div className="flex items-center w-full px-20 pt-10">
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
                                        <p className="w-1/3 font-medium">: X {formatRombel[data.id_rombel]}</p>
                                    </div>
                                    <div className="flex w-1/2 items-center gap-2 text-lg">
                                        <p className="w-2/3">No Induk Sekolah</p>
                                        <p className="w-1/3 font-medium">: {data.nis || '-'}</p>
                                    </div>
                                    <div className="flex w-1/2 items-center gap-2 text-lg">
                                        <p className="w-2/3">No Induk Siswa Nasional</p>
                                        <p className="w-1/3 font-medium">: {data.nisn || '-'}</p>
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
                                                <p className="font-medium w-2/3">: {data.nama_siswa || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>2.</p>
                                                    <p>NIK</p>
                                                </div>
                                                <p className="font-medium w-2/3">: {data.nik || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>3.</p>
                                                    <p>Jenis Kelamin</p>
                                                </div>
                                                <p className="font-medium w-2/3">: {data.jk_siswa || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>4.</p>
                                                    <p>Tempat dan Tanggal Lahir</p>
                                                </div>
                                                <p className="font-medium w-2/3">: {data.tempat_lahir_siswa || '-'}, {date_getDay(data['tgl_lahir_siswa'])} {date_getMonth('string', data['tgl_lahir_siswa'])} {date_getYear(data['tgl_lahir_siswa'])}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>5.</p>
                                                    <p>Agama</p>
                                                </div>
                                                <p className="font-medium w-2/3">: {data.agama || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>6.</p>
                                                    <p>Anak ke</p>
                                                </div>
                                                <p className="font-medium w-2/3">: {data.anak_ke_berapa || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>7.</p>
                                                    <p className="">No Telp</p>
                                                </div>
                                                <p className="font-medium w-2/3">: {data.no_telp_siswa || '-'}</p>
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
                                                <p className="font-medium w-2/3 text-wrap">: {data.alamat_siswa || '-'}</p>
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
                                                <p className="font-medium w-2/3 text-wrap">: {data.asal_sekolah || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>10.</p>
                                                    <p>Tahun Masuk</p>
                                                </div>
                                                <p className="font-medium w-2/3 text-wrap">: {data.tahun_masuk || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>11.</p>
                                                    <p>Jalur Masuk</p>
                                                </div>
                                                <p className="font-medium w-2/3 text-wrap">: {data.kategori || '-'}</p>
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
                                                <p className="font-medium w-2/3 text-wrap">: {data.nama_ayah || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>13.</p>
                                                    <p>Pekerjaan Ayah</p>
                                                </div>
                                                <p className="font-medium w-2/3 text-wrap">: {data.pekerjaan_ayah || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>14.</p>
                                                    <p>No Telp Ayah</p>
                                                </div>
                                                <p className="font-medium w-2/3 text-wrap">: {data.no_telp_ayah || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>15.</p>
                                                    <p>Nama Ibu</p>
                                                </div>
                                                <p className="font-medium w-2/3 text-wrap">: {data.nama_ibu || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>16.</p>
                                                    <p>Pekerjaan Ibu</p>
                                                </div>
                                                <p className="font-medium w-2/3 text-wrap">: {data.pekerjaan_ibu || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>17.</p>
                                                    <p>No Telp Ibu</p>
                                                </div>
                                                <p className="font-medium w-2/3 text-wrap">: {data.no_telp_ibu || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>18.</p>
                                                    <p>No Kartu Keluarga</p>
                                                </div>
                                                <p className="font-medium w-2/3 text-wrap">: {data.no_kk || '-'}</p>
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
                                                <p className="font-medium w-2/3 text-wrap">: {data.nama_wali || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>20.</p>
                                                    <p>Pekerjaan Wali</p>
                                                </div>
                                                <p className="font-medium w-2/3 text-wrap">: {data.pekerjaan_wali || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 w-full">
                                            <p className="opacity-0">A.</p>
                                            <div className="flex items-center gap-5 w-full">
                                                <div className="flex items-center gap-5 w-1/3">
                                                    <p>21.</p>
                                                    <p>No Telp Wali</p>
                                                </div>
                                                <p className="font-medium w-2/3 text-wrap">: {data.no_telp_wali || '-'}</p>
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
                                                        {data['nama_siswa']}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </form>
            )}
        </MainLayoutPage>
    )
}