'use server'

import axios from "axios"
import { urlGet } from "../web_service"

export const M_Pegawai_getAll = async () => {
    try {
        const response = await axios.get('https://api.smkpunegerijabar.sch.id/simak/v1/data/pegawai', {
            headers: {
                'x-api-key': `${process.env.API_KEY}`
            }
        })
        const data = response.data.data
        return {
            success: true,
            data
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.response.data
        }
    }
}