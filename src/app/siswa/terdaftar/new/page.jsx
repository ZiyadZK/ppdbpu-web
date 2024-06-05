'use client'

import MainLayoutPage from "@/components/mainLayout"
import { toast } from "@/libs/alert"
import { date_getYear } from "@/libs/date"
import { M_Siswa_create, M_Siswa_get, M_Siswa_update } from "@/libs/models/M_Siswa"
import { faArrowLeft,  faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import Swal from "sweetalert2"


const formatDataSiswa = {
        nomor_reg: '',
        nisn: '',
        nis: '',
        id_rombel: '',
        nama_siswa: '',
        jk_siswa: '',
        tempat_lahir_siswa: '',
        tgl_lahir_siswa: '',
        alamat_siswa: '',
        no_telp_siswa: '',
        no_kk: '',
        agama: '',
        status_anak: '',
        jml_saudara: '',
        alamat_email_siswa: '',
        password_siswa: '',
        kebutuhan_khusus: '',
        bantuanp: '',
        kategori: '',
        nik: '',
        alat_transport: '',
        tinggi_badan: '',
        berat_badan: '',
        jarak: '',
        lingkar_kepala: '',
        waktu_dari_rumah_ke_sekolah: '',
        hobby: '',
        cita_cita: '',
        anak_ke_berapa: '',
        tinggal: '',
        asal_sekolah: '',
        no_ijazah: '',
        tgl_ijazah: '',
        no_skhun: '',
        nik_ayah: '',
        nama_ayah: '',
        no_telp_ayah: '',
        kebutuhan_ayah: '',
        pekerjaan_ayah: '',
        pendidikan_ayah: '',
        penghasilan_ayah: '',
        tempat_lahir_ayah: '',
        tanggal_lahir_ayah: '',
        nik_ibu: '',
        nama_ibu: '',
        no_telp_ibu: '',
        kebutuhan_ibu: '',
        pekerjaan_ibu: '',
        pendidikan_ibu: '',
        penghasilan_ibu: '',
        tempat_lahir_ibu: '',
        tanggal_lahir_ibu: '',
        nik_wali: '',
        nama_wali: '',
        no_telp_wali: '',
        kebutuhan_wali: '',
        pekerjaan_wali: '',
        pendidikan_wali: '',
        penghasilan_wali: '',
        tempat_lahir_wali: '',
        tanggal_lahir_wali: '',
        hubungan_wali: '',
        tahap: 1,
        tahun_masuk: date_getYear()
}


const formatRombel = {
    'DESAIN PEMODELAN DAN INFORMASI BANGUNAN': 'DPIB',
    'TEKNIK GEOSPASIAL': 'GEO',
    'TEKNIK JARINGAN KOMPUTER DAN TELEKOMUNIKASI': 'TKJ',
    'TEKNIK KETENAGALISTRIKAN': 'TITL',
    'TEKNIK MESIN': 'TPM',
    'TEKNIK OTOMOTIF': 'TKR'
}

export default function SiswaTerdaftarUpdatePage() {
    const router = useRouter()

    const [data, setData] = useState(formatDataSiswa)
    const [bersamaWali, setBersamaWali] = useState(false)

    const submitData = async (e) => {
        e.preventDefault()

        Swal.fire({
            title: 'Sedang menyimpan data..',
            timer: 15000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: async () => {
                try {
                    let response
                    if(bersamaWali) {
                        response = await M_Siswa_create({...data, aktif: 1, daftar_ulang: 0})
                    }else{
                        response = await M_Siswa_create({
                            ...data,
                            aktif: 1,
                            daftar_ulang: 0,
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
                        Swal.close()
                        Swal.fire({
                            title: 'Sukses',
                            icon: 'success',
                            text: 'Berhasil menambah data siswa tersebut!',
                            timer: 3000,
                            timerProgressBar: true
                        }).then(() => {
                            router.push('/siswa/terdaftar')
                        })
                    }else{
                        toast.fire({
                            title: 'Gagal',
                            text: response.message,
                            icon: 'error',
                            timer: 5000,
                            timerProgressBar: true
                        })
                    }
                } catch (error) {
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
                                       Tahap
                                    </div>
                                    <div className="w-full md:w-4/5">
                                        <select value={data['tahap']} required onChange={e => setData(state => ({...state, tahap: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer" >
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
                                        <select value={data['id_rombel']} onChange={e => setData(state => ({...state, id_rombel: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
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
                                        <select value={data['jk_siswa']} onChange={e => setData(state => ({...state, jk_siswa: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
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
                                        <select value={data['agama']} onChange={e => setData(state => ({...state, agama: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
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
                                        <select value={data['kategori']} onChange={e => setData(state => ({...state, kategori: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
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
                                        <select value={data['alat_transport']} onChange={e => setData(state => ({...state, alat_transport: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
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
                                        <select value={data['jarak']} onChange={e => setData(state => ({...state, jarak: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                            <option value="" disabled>-- Pilih Jarak --</option>
                                            <option value="0 - 1 km">0 - 1 km</option>
                                            <option value="1 - 3 km">1 - 3 km</option>
                                            <option value="3 - 5 km">3 - 5 km</option>
                                            <option value="5 - 10 km">5 - 10 km</option>
                                            <option value="> 10 km">&gt; 10 km</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                    <div className="w-full md:w-1/5 opacity-70">
                                        Lingkar Kepala
                                    </div>
                                    <div className="w-full md:w-4/5">
                                        <input value={data['lingkar_kepala']} onChange={e => setData(state => ({...state, lingkar_kepala: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="Lingkar Kepala" />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                    <div className="w-full md:w-1/5 opacity-70">
                                        Waktu dari Rumah ke Sekolah
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
                                        <select value={data['tinggal']} onChange={e => setData(state => ({...state, tinggal: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
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
                                        <input value={data['no_ijazah']} onChange={e => setData(state => ({...state, no_ijazah: e.target.value}))} type="text" required className="w-full px-3 py-2 rounded-lg border" placeholder="No Ijazah" />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                    <div className="w-full md:w-1/5 opacity-70">
                                        Tanggal Ijazah
                                    </div>
                                    <div className="w-full md:w-4/5">
                                        <input value={data['tgl_ijazah']} onChange={e => setData(state => ({...state, tgl_ijazah: e.target.value}))} type="date" required className="w-full px-3 py-2 rounded-lg border" placeholder="No Ijazah" />
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
                                        <select value={data['pekerjaan_ayah']} onChange={e => setData(state => ({...state, pekerjaan_ayah: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                            <option value="" disabled>-- Pilih Pekerjaan --</option>
                                            <option value="BURUH">Buruh</option>
                                            <option value="TIDAK BEKERJA">Tidak Bekerja</option>
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
                                        <select value={data['pendidikan_ayah']} onChange={e => setData(state => ({...state, pendidikan_ayah: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
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
                                        <select value={data['penghasilan_ayah']} onChange={e => setData(state => ({...state, penghasilan_ayah: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                            <option value="" disabled>-- Pilih Penghasilan --</option>
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
                                        <select value={data['pekerjaan_ibu']} onChange={e => setData(state => ({...state, pekerjaan_ibu: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                            <option value="" disabled>-- Pilih Pekerjaan --</option>
                                            <option value="BURUH">Buruh</option>
                                            <option value="TIDAK BEKERJA">Tidak Bekerja</option>
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
                                        <select value={data['pendidikan_ibu']} onChange={e => setData(state => ({...state, pendidikan_ibu: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
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
                                        <select value={data['penghasilan_ibu']} onChange={e => setData(state => ({...state, penghasilan_ibu: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                            <option value="" disabled>-- Pilih Penghasilan --</option>
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

                                <div className="flex items-center gap-3">
                                    <input type="checkbox" id="hubungan_dengan_wali" checked={bersamaWali} onChange={() => setBersamaWali(state => !state)} />
                                    <label htmlFor="hubungan_dengan_wali" className="opacity-70 hover:opacity-100 cursor-pointer">Bersama Wali?</label>
                                </div>
                                {bersamaWali && (
                                    <>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                                            <div className="w-full md:w-1/5 opacity-70">
                                                Hubungan dengan Wali
                                            </div>
                                            <div className="w-full md:w-4/5">
                                                <select value={data['hubungan_wali']} onChange={e => setData(state => ({...state, hubungan_wali: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                    <option value="" disabled>-- Pilih --</option>
                                                    <option value="AYAH">Ayah</option>
                                                    <option value="AYAH KANDUNG">Ayah Kandung</option>
                                                    <option value="AYAH SAMBUNG">Ayah Sambung</option>
                                                    <option value="BIBI">Bibi</option>
                                                    <option value="Ibu">Ibu</option>
                                                    <option value="KAKA KANDUNG">Kakak Kandung</option>
                                                    <option value="KAKAK">Kakak</option>
                                                    <option value="KAKAK IPAR">Kakak Ipar</option>
                                                    <option value="KAKAK KANDUNG">Kakak Kandung</option>
                                                    <option value="KAKEK">Kakek</option>
                                                    <option value="NENEK">Nenek</option>
                                                    <option value="ORANG TUA">Orang Tua</option>
                                                    <option value="PAMAN">Paman</option>
                                                    <option value="SAUDARA">Saudara</option>
                                                    <option value="TANTE">Tante</option>
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
                                                <select value={data['pekerjaan_wali']} onChange={e => setData(state => ({...state, pekerjaan_wali: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                    <option value="" disabled>-- Pilih Pekerjaan --</option>
                                                    <option value="BURUH">Buruh</option>
                                                    <option value="TIDAK BEKERJA">Tidak Bekerja</option>
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
                                                <select value={data['pendidikan_wali']} onChange={e => setData(state => ({...state, pendidikan_wali: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
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
                                                <select value={data['penghasilan_wali']} onChange={e => setData(state => ({...state, penghasilan_wali: e.target.value}))} className="w-full px-3 py-2 rounded-lg border cursor-pointer">
                                                    <option value="" disabled>-- Pilih Penghasilan --</option>
                                                    <option value="< Rp. 1.000.000">&lt; Rp. 1.000.000</option>
                                                    <option value="Rp. 1.000.000 - Rp. 3.000.000">Rp. 1.000.000 - Rp. 3.000.000</option>
                                                    <option value="Rp. 3.000.000 - Rp. 5.000.000">Rp. 3.000.000 - Rp. 5.000.000</option>
                                                    <option value="Rp. 5.000.000 - Rp. 7.000.000">Rp. 5.000.000 - Rp. 7.000.000</option>
                                                    <option value="> Rp. 7.000.000">&gt; Rp. 7.000.000</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayoutPage>
    )
}