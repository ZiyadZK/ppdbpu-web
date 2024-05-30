'use client'

import * as XLSX from 'xlsx'

export const xlsx_getSheets = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, {type: 'array'})
            resolve(workbook.Sheets)
        }

        reader.onerror = reject;

        reader.readAsArrayBuffer(file)
    })
}