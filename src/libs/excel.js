'use client'

import * as XLSX from 'xlsx'
import Papa from 'papaparse'

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

export const xlsx_export = async (type, dataArrs, fileName = 'Data', headers, sheetNames) => {
    if (type === 'xlsx') {
        const workbook = XLSX.utils.book_new();
        
        dataArrs.forEach((dataArr, index) => {
            const worksheet = XLSX.utils.json_to_sheet(dataArr);
            XLSX.utils.sheet_add_aoa(worksheet, [headers[index]], { origin: 'A1' });
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[index]);
        });

        return XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true });
    }

    if (type === 'csv') {
        // CSV export does not support multiple sheets, so handle it as per the original requirement
        let csvString = Papa.unparse({
            fields: headers[0], // Assume the first header set is used for CSV
            data: dataArrs[0].map(obj => Object.values(obj)) // Export only the first data array
        }, {
            quotes: true,
            delimiter: ",",
            header: true,
            quoteChar: `'`,
        });

        // Create a Blob from the CSV string
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};