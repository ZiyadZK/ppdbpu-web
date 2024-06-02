'use server'

import { objToQueryURL } from "../query"
import { urlDelete, urlGet, urlPost, urlPut } from "../web_service"

export const M_Siswa_getAll = async (parameter) => {
    try {

        console.log(objToQueryURL(parameter))
        
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