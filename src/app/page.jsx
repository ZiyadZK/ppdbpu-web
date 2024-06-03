'use client'

import MainLayoutPage from "@/components/mainLayout";
import { BarChart, LineChart } from "@mui/x-charts";

const option = {
  chart: {
    id: 'apexchart-example'
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
  }
}

const series = [{
  name: 'series-1',
  data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
}]
export default function Home() {


  return (
    <MainLayoutPage>
      <div className="m-5 md:m-0">
        <div className="flex md:flex-row flex-col gap-5">
          <div className="p-5 bg-white rounded-2xl w-full md:w-1/2">
            <div className="flex items-center justify-between">
              <h1 className="font-medium text-2xl">Total Data Siswa</h1>
              
            </div>
            <hr className="my-3" />
            <LineChart
              series={[
                { data: [310, 343, 544, 123, 432], label: 'Total Siswa' },
                { data: [323, 313, 300, 341, 323], label: 'Daftar Ulang' },
              ]}
              xAxis={[{ scaleType: 'point', data: ['2020', '2021', '2022', '2023', '2024'] }]}
              height={300}
              className="w-full"
            />
          </div>
          <div className="p-5 bg-white rounded-2xl w-full md:w-1/2">
            <div className="flex items-center justify-between">
              <h1 className="font-medium text-2xl">Total Data Siswa</h1>
              <p className="px-3 py-2 rounded-full bg-zinc-100 text-zinc-700 font-medium">
                JURUSAN
              </p>
            </div>
            <hr className="my-3" />
            <LineChart
              series={[
                { data: [310, 143, 544, 123, 432], label: 'TKJ', color: '#22c55e' },
                { data: [310, 243, 544, 123, 432], label: 'DPIB', color: '#92400e' },
                { data: [310, 443, 544, 123, 432], label: 'TKR', color: '#2563eb' },
                { data: [310, 123, 544, 123, 432], label: 'TPM', color: '#f97316' },
                { data: [310, 243, 544, 123, 432], label: 'TITL', color: '#6b7280' },
                { data: [310, 343, 544, 123, 432], label: 'GEO', color: '#e11d48' }
              ]}
              xAxis={[{ scaleType: 'point', data: ['2020', '2021', '2022', '2023', '2024'] }]}
              height={300}
              className="w-full"
            />
          </div>
        </div>
        <hr className="my-3 opacity-0" />
        <div className="flex md:flex-row flex-col gap-5">
          <div className="p-5 bg-white rounded-2xl w-full md:w-1/2">
            <div className="flex items-center justify-between">
              <h1 className="font-medium text-2xl">Total Data Siswa</h1>
              <p className="px-3 py-2 rounded-full bg-zinc-100 text-zinc-700 font-medium">
                JENIS KELAMIN
              </p>
            </div>
            <hr className="my-3" />
            <LineChart
              series={[
                { data: [310, 343, 544, 123, 432], label: 'Laki - laki' },
                { data: [323, 313, 300, 341, 323], label: 'Perempuan' },
              ]}
              xAxis={[{ scaleType: 'point', data: ['2020', '2021', '2022', '2023', '2024'] }]}
              height={300}
              className="w-full"
            />
          </div>
          <div className="p-5 bg-white rounded-2xl w-full md:w-1/2">
            <div className="flex items-center justify-between">
              <h1 className="font-medium text-2xl">Total Data Siswa</h1>
              <p className="px-3 py-2 rounded-full bg-zinc-100 text-zinc-700 font-medium">
                TINGGAL BERSAMA
              </p>
            </div>
            <hr className="my-3" />
            <LineChart
              series={[
                { data: [310, 343, 544, 123, 432], label: 'Orang Tua' },
                { data: [323, 313, 300, 341, 323], label: 'Wali' },
                { data: [323, 113, 400, 241, 323], label: 'Kos' },
              ]}
              xAxis={[{ scaleType: 'point', data: ['2020', '2021', '2022', '2023', '2024'] }]}
              height={300}
              className="w-full"
            />
          </div>
        </div>
        <hr className="my-3 opacity-0" />
        <div className="flex md:flex-row flex-col gap-5">
          <div className="p-5 bg-white rounded-2xl w-full md:w-1/2">
            <div className="flex items-center justify-between">
              <h1 className="font-medium text-2xl">Total Data Siswa</h1>
              <p className="px-3 py-2 rounded-full bg-zinc-100 text-zinc-700 font-medium">
                ALAT TRANSPORTASI
              </p>
            </div>
            <hr className="my-3" />
            <LineChart
              series={[
                { data: [310, 343, 544, 123, 432], label: 'Angkutan Umum' },
                { data: [310, 343, 544, 123, 432], label: 'Antar Jemput' },
                { data: [310, 343, 544, 123, 432], label: 'Jalan Kaki' },
                { data: [310, 343, 544, 123, 432], label: 'Motor' },
                { data: [323, 313, 300, 341, 323], label: 'Sepeda' },
              ]}
              xAxis={[{ scaleType: 'point', data: ['2020', '2021', '2022', '2023', '2024'] }]}
              height={300}
              className="w-full"
            />
          </div>
          <div className="p-5 bg-white rounded-2xl w-full md:w-1/2">
            <div className="flex items-center justify-between">
              <h1 className="font-medium text-2xl">Total Data Siswa</h1>
              <p className="px-3 py-2 rounded-full bg-zinc-100 text-zinc-700 font-medium">
                TINGGAL BERSAMA
              </p>
            </div>
            <hr className="my-3" />
            <LineChart
              series={[
                { data: [310, 343, 544, 123, 432], label: 'Orang Tua' },
                { data: [323, 313, 300, 341, 323], label: 'Wali' },
                { data: [323, 113, 400, 241, 323], label: 'Kos' },
              ]}
              xAxis={[{ scaleType: 'point', data: ['2020', '2021', '2022', '2023', '2024'] }]}
              height={300}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </MainLayoutPage>
  );
}
