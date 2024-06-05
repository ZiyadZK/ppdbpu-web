'use server'

import { cookies } from "next/headers"
import { urlDelete, urlGet, urlPost, urlPut } from "../web_service"
import { decryptData } from "../cryptor"
import { M_Riwayat_create } from "./M_Riwayat"
import { date_getDay, date_getMonth, date_getTime, date_getYear } from "../date"

export const M_Akun_login = async (email_akun, password_akun, duration) => {
    try {
        const response = await urlPost('/v1/userdata', {email_akun, password_akun})
        if(response.data !== null) {
            cookies().set('userdata', response.data, {
                secure: true,
                maxAge: duration
            })
            return {
                success: true
            }
        }else{
            return {
                success: false,
                message: 'Email dan Password tidak ditemukan!'
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Terdapat Error disaat memproses data, silahkan hubungi Administrator!'
        }
    }
}

export const M_Akun_logout = async () => {
    try {
        cookies().delete('userdata')

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Terdapat Error disaat memproses data, silahkan hubungi Administrator!'
        }
    }
}

export const M_Akun_getUserdata = async () => {
    try {
        const token = cookies().get('userdata')

        const data = await decryptData(token)
        
        return {
            success: true,
            data
        }
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
}

export const M_Akun_getAll = async () => {
    try {
        const response = await urlGet('/v1/data/akun')

        return {
            success: true,
            data: response.data
        }
        
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
}

export const M_Akun_create = async (payload) => {
    try {
        const response = await urlPost('/v1/data/akun', payload)

        await M_Riwayat_create({
            aksi: 'Tambah',
            keterangan: `Menambahkan data ke dalam Data Akun`,
            data: JSON.stringify(payload)
        })

        return {
            success: true,
            message: response.message
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.response.data.message
        }
    }
}

export const M_Akun_delete = async (id_akun) => {
    try {
        const response = await urlDelete('/v1/data/akun', {id_akun})

        await M_Riwayat_create({
            aksi: 'Hapus',
            keterangan: `Menghapus data dari Data Akun`,
            data: JSON.stringify(id_akun)
        })

        return {
            success: true,
            message: response.message
        }
        
    } catch (error) {
        console.log(error.response)
        return {
            success: false,
            message: error.response.data.message
        }
    }
}

export const M_Akun_update = async (id_akun, payload) => {
    try {
        const response = await urlPut('/v1/data/akun', {id_akun, payload})

        await M_Riwayat_create({
            aksi: 'Ubah',
            keterangan: `Mengubah data dari Data Akun`,
            data: JSON.stringify({id_akun, payload})
        })

        return {
            success: true,
            message: response.message
        }
    } catch (error) {
        console.log(error.response)
        return {
            success: false,
            message: error.response.data.message
        }
    }
}