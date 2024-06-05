export default function manifest() {
    return {
        name: 'SIPPDB SMK Pekerjaan Umum Negeri Bandung',
        short_name: 'PPDB SMK PU Negeri Bandung',
        description: 'This is an Official Sistem Informasi PPDB SMK Pekerjaan Umum Negeri Bandung',
        start_url: '/',
        display: 'standalone',
        icons: [
            {
              src: '/favicon.ico',
              sizes: 'any',
              type: 'image/x-icon',
            },
          ],
    }
}