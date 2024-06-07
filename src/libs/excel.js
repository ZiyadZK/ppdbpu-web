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

export const xlsx_export = async (type, dataArr, fileName = 'Data', { header, sheetName = 'Data'}) => {
    if(type === 'xlsx') {
        const worksheet = XLSX.utils.json_to_sheet(dataArr)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' })
    
        return XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true })
    }

    if(type === 'csv') {
        const worksheet = XLSX.utils.json_to_sheet(dataArr);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });

        // Convert worksheet to CSV string
        let csvString = XLSX.utils.sheet_to_csv(worksheet);

        // Replace default quote and escape characters
        const quoteChar = `'`;
        const escapeChar = `'`;

        // Replace the double quotes with the custom quote character
        csvString = csvString.replace(/"/g, quoteChar);

        // Replace occurrences of the custom quote character within values with the escape character
        const escapedQuoteChar = new RegExp(quoteChar, 'g');
        csvString = csvString.replace(escapedQuoteChar, escapeChar + quoteChar);

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
}