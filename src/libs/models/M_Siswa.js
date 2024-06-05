'use server'

import { objToQueryURL } from "../query"
import { urlDelete, urlGet, urlPost, urlPut } from "../web_service"
import { M_Riwayat_create } from "./M_Riwayat"

export const M_Siswa_getAll = async (parameter) => {
    try {
        
        const response = await urlGet(`/v1/data/siswa${objToQueryURL(parameter)}`)
        
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.response.data
        }
    }
}

export const M_Siswa_get = async (nisn, parameter) => {
    try {

        const response = await urlGet(`/v1/data/siswa/nisn/${nisn}${objToQueryURL(parameter)}`)
        
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.response.data
        }
    }
}

export const M_Siswa_create = async (payload) => {
    try {
        await urlPost('/v1/data/siswa', payload)
        
        await M_Riwayat_create({
            aksi: 'Tambah',
            keterangan: `Menambah data ke dalam Data Siswa`,
            data: JSON.stringify(payload)
        })

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.response.data
        }
    }
}

export const M_Siswa_delete = async (nisn) => {
    try {
        
        await urlDelete('/v1/data/siswa', {nisn})

        await M_Riwayat_create({
            aksi: 'Hapus',
            keterangan: `Menghapus data dari Data Siswa`,
            data: JSON.stringify(nisn)
        })

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.response.data
        }
    }
}

export const M_Siswa_update = async (nisn, payload) => {
    try {
        await urlPut('/v1/data/siswa', {nisn, payload})

        await M_Riwayat_create({
            aksi: 'Ubah',
            keterangan: `Mengubah data dari Data Siswa`,
            data: JSON.stringify({nisn, payload})
        })
        
        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.response.data
        }
    }
}

export const M_Siswa_rekap = async () => {
    try {
        const response = await urlGet('/v1/dashboard/rekap')

        return {
            success: true,
            data: response.data
        }
        
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.response.data
        }
    }
}