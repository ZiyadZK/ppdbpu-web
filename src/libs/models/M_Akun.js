'use server'

import { cookies } from "next/headers"
import { urlDelete, urlGet, urlPost } from "../web_service"
import { decryptData } from "../cryptor"

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

        return {
            success: true,
            message: response.message
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: response.message
        }
    }
}

export const M_Akun_delete = async (id_akun) => {
    try {
        const response = await urlDelete('/v1/data/akun', {id_akun})

        console.log(response)
        
    } catch (error) {
        console.log(error)
        return {
            success: false
        }
    }
}