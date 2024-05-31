'use client'

import MainLayoutPage from "@/components/mainLayout"
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useState } from "react"

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



export default function SiswaTerdaftarUpdatePage({params: {nisn}}) {
    const router = useRouter()

    const [data, setData] = useState(null)
    
    return (
        <MainLayoutPage>
            <div className="bg-white h-full md:p-5 px-5 md:rounded-2xl">
                <div className="flex items-center md:justify-between w-full gap-5">
                    <button type="button" onClick={() => router.back()} className="md:w-fit w-1/2 px-3 py-2 rounded-lg flex items-center justify-center gap-3 bg-zinc-100 hover:bg-zinc-200">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-inherit" />
                        Kembali
                    </button>
                    <button type="button" onClick={() => router.back()} className="md:w-fit w-1/2 px-3 py-2 rounded-lg flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 focus:bg-green-600 text-white">
                        <FontAwesomeIcon icon={faSave} className="w-4 h-4 text-inherit" />
                        Simpan
                    </button>
                </div>
                <hr className="my-2 opacity-0" />
                <div className="collapse bg-zinc-50 hover:bg-white border border-zinc-500/0 hover:border-zinc-200 collapse-arrow hover:shadow-lg transition-all duration-300">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-xl font-medium">
                        Data Pribadi
                    </div>
                    <div className="collapse-content"> 
                        <p>hello</p>
                    </div>
                </div>
            </div>
        </MainLayoutPage>
    )
}