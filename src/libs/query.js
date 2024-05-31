export const objToQueryURL = (params) => {
    const queryString = Object.entries(params).map(([key, value]) => {
        if(Array.isArray(value)) {
            return value.map(v => `filters[${key}]=${encodeURIComponent(v)}`).join('&')
        }

        return `filters[${key}]=${encodeURIComponent(value)}`;
    }).join('&');
    
    return '?' + queryString;
}