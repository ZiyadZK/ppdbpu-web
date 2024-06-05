import { date_getDay, date_getMonth, date_getTime, date_getYear } from "../date"
import { urlDelete, urlGet, urlPost } from "../web_service"
import { M_Akun_getUserdata } from "./M_Akun"

export const M_Riwayat_create = async (payload) => {
    try {
        const userdata = await M_Akun_getUserdata()
        await urlPost('/v1/data/riwayat', {
            ...payload,
            nama_akun: userdata.data.nama_akun,
            email_akun: userdata.data.email_akun,
            id_akun: userdata.data.id_akun, 
            tanggal: `${date_getYear()}-${date_getMonth()}-${date_getDay()}`,
            waktu: `${date_getTime('hour')}:${date_getTime('minutes')}`
        })
        
        return {
            success: true
        }
        
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        }
    }
}

export const M_Riwayat_getAll = async () => {
    try {
        const response = await urlGet('/v1/data/riwayat')
        
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        }
    }
}

export const M_Riwayat_delete = async (id_riwayat) => {
    try {
        await urlDelete('/v1/data/riwayat', id_riwayat)

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        }
    }
}