'use client'

import MainLayoutPage from "@/components/mainLayout";
import { date_getYear } from "@/libs/date";
import { M_Akun_getUserdata } from "@/libs/models/M_Akun";
import { M_Siswa_rekap } from "@/libs/models/M_Siswa";
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BarChart, LineChart, PieChart, barLabelClasses, pieArcLabelClasses } from "@mui/x-charts";
import { useEffect, useState } from "react";

const colors = ['#22c55e', '#92400e', '#2563eb', '#f97316', '#6b7280', '#e11d48'];

export default function Home() {

  const [rekapTahun, setRekapTahun] = useState(date_getYear())
  const [userdata, setUserdata] = useState(null)
  const [dataRekap, setDataRekap] = useState({})
  const [loadingFetch, setLoadingFetch] = useState('')

  const getUserdata = async () => {
    const response = await M_Akun_getUserdata()
    if(response.success) {
      setUserdata(response.data)
    }
  }

  const getDataRekap = async () => {
    setLoadingFetch('loading')
    const response = await M_Siswa_rekap()
    console.log(response)
    if(response.success) {
      setDataRekap(response.data)
      if(response.data !== null) {
        if(!Object.keys(response.data).includes(date_getYear())) {
          setRekapTahun(Object.keys(response.data)[0])
        }
      }
    }
    setLoadingFetch('fetched')
  }

  useEffect(() => {
    getUserdata()
    getDataRekap()
  }, [])

  const handleRekapTahun = (type, number) => {
    setRekapTahun(state => {

      if(type === 'add') {
        const jmlIndex = Object.keys(dataRekap).findIndex(value => value == (Number(state) + number))
        if(jmlIndex !== -1) {
          if(jmlIndex > Object.keys(dataRekap).length) {
            return Object.keys(dataRekap).reverse()[0]
          }else{
            return Object.keys(dataRekap)[jmlIndex]
          }
        }else{
          return state
        }
      }

      if(type === 'rem') {
        const jmlIndex = Object.keys(dataRekap).findIndex(value => value == (Number(state) - number))
        if(jmlIndex !== -1) {
          if(jmlIndex < Object.keys(dataRekap).length) {
            return Object.keys(dataRekap)[jmlIndex]
          }else{
            return state
          }
        }else{
          return state
        }
      }
    })
  }

  return (
    <MainLayoutPage>
      {loadingFetch !== 'fetched' && (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="loading loading-spinner loading-lg text-zinc-600"></div>
        </div>
      )}
      {loadingFetch === 'fetched' && dataRekap !== null && (
        <div className="m-5 md:m-0">
          <div className="w-full bg-white md:p-5 md:rounded-2xl">
            <h1 className="font-medium text-2xl">
              Rekapitulasi Data
            </h1>
            <hr className="my-3" />
            <div className="flex flex-col-reverse md:flex-row gap-5">
              <div className="w-full md:w-1/2">
              <BarChart
                xAxis={[{ scaleType: 'band', data: ['Siswa Terdaftar', 'Penerimaan Tahap 1', 'Penerimaan Tahap 2'] }]}
                series={[
                  
                  { 
                    data: [
                      dataRekap[rekapTahun]['total_terdaftar'] || 0,
                      dataRekap[rekapTahun]['total_terdaftar_tahap1'] || 0,
                      dataRekap[rekapTahun]['total_terdaftar_tahap2']
                    ],
                    label: "Total Pendaftar"
                  }, 
                  { 
                    data: [
                      dataRekap[rekapTahun]['total_daftarUlang'] || 0, 
                      dataRekap[rekapTahun]['total_daftarUlang_tahap1'] || 0, 
                      dataRekap[rekapTahun]['total_daftarUlang_tahap2'] || 0
                    ], 
                    label: "Sudah Daftar Ulang" 
                  }

                ]}
                height={300}
                className="w-full"
                borderRadius={10}
                barLabel={(item, context) => {
                  if((item.value ?? 0) > 5) {
                    return item.value
                  }
                }}

                sx={{
                  [`& .${barLabelClasses.root}`]: {
                    fill: 'white',
                    fontWeight: 'bold',
                  },
                }}
                
              />
              </div>
              <div className="w-full md:w-1/2 flex items-center">
                <div className="">
                  <p className="opacity-70">
                    Tahun
                  </p>
                  <div className="flex items-center gap-5">
                    {userdata && ['Admin'].includes(userdata.role_akun) && (
                      <>
                      <button type="button" onClick={() => handleRekapTahun('rem', 5)} className="w-10 h-10 rounded hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700">
                        <FontAwesomeIcon icon={faAnglesLeft} className="w-6 h-6 text-inherit" />
                      </button>
                      <button type="button" onClick={() => handleRekapTahun('rem', 1)} className="w-10 h-10 rounded hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700">
                        <FontAwesomeIcon icon={faAngleLeft} className="w-6 h-6 text-inherit" />
                      </button>
                      </>
                    )}
                    <h1 className="font-extrabold tracking-wide text-5xl text-zinc-500">
                      {rekapTahun}
                    </h1>
                    <button type="button" onClick={() => handleRekapTahun('add', 1)} className="w-10 h-10 rounded hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700">
                      <FontAwesomeIcon icon={faAngleRight} className="w-6 h-6 text-inherit" />
                    </button>
                    <button type="button" onClick={() => handleRekapTahun('add', 5)} className="w-10 h-10 rounded hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700">
                      <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-6 text-inherit" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-2 opacity-0" />
            <h1 className="px-3 py-2 rounded-full bg-zinc-200 text-zinc-700 font-medium w-fit">
              Data Jurusan
            </h1>
            <div className="w-full grid md:grid-cols-2 gap-2 pt-2">
              <div className="w-full flex flex-col items-center p-3 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
                <h1 className="font-semibold">
                  DATA TKJ
                </h1>
                <PieChart
                  
                // Use palette
                  series={[
                    {
                      arcLabel: (item) => item.value > 0 && `${item.value}`,
                      data: [
                        { value: dataRekap[rekapTahun]['total_daftarUlang_tkj'], color: 'green', label: 'Sudah Daftar Ulang' }, // Use color property
                        { value: dataRekap[rekapTahun]['total_terdaftar_tkj'], color: 'lightgrey', label: 'Belum Daftar Ulang' }, // Use color property
                        // ...
                      ],
                      innerRadius: 30,
                      outerRadius: 100,
                      cornerRadius: 10,
                      cx: 150,
                      cy: 150,
                    },
                  ]}

                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}

                  height={300}
                  className="w-full"
                />
              </div>
              <div className="w-full flex flex-col items-center p-3 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
                <h1 className="font-semibold">
                  DATA DPIB
                </h1>
                <PieChart
                  series={[
                    {
                      arcLabel: (item) => item.value > 0 && `${item.value}`,
                      data: [
                        { value: dataRekap[rekapTahun]['total_daftarUlang_dpib'], color: 'brown', label: 'Sudah Daftar Ulang' }, // Use color property
                        { value: dataRekap[rekapTahun]['total_terdaftar_dpib'], color: 'lightgrey', label: 'Belum Daftar Ulang' }, // Use color property
                        // ...
                      ],
                      innerRadius: 30,
                      outerRadius: 100,
                      cornerRadius: 10,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}

                  height={300}
                  className="w-full"
                />
              </div>
              <div className="w-full flex flex-col items-center p-3 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
                <h1 className="font-semibold">
                  DATA TKR
                </h1>
                <PieChart
                // Use palette
                  series={[
                    {
                      arcLabel: (item) => item.value > 0 && `${item.value}`,
                      data: [
                        { value: dataRekap[rekapTahun]['total_daftarUlang_tkr'], color: 'blue', label: 'Sudah Daftar Ulang' }, // Use color property
                        { value: dataRekap[rekapTahun]['total_terdaftar_tkr'], color: 'lightgrey', label: 'Belum Daftar Ulang' }, // Use color property
                        // ...
                      ],
                      innerRadius: 30,
                      outerRadius: 100,
                      cornerRadius: 10,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}

                  height={300}
                  className="w-full"
                />
              </div>
              <div className="w-full flex flex-col items-center p-3 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
                <h1 className="font-semibold">
                  DATA TPM
                </h1>
                <PieChart
                // Use palette
                  series={[
                    {
                      arcLabel: (item) => item.value > 0 && `${item.value}`,
                      data: [
                        { value: dataRekap[rekapTahun]['total_daftarUlang_tpm'], color: 'orange', label: 'Sudah Daftar Ulang' }, // Use color property
                        { value: dataRekap[rekapTahun]['total_terdaftar_tpm'], color: 'lightgrey', label: 'Belum Daftar Ulang' }, // Use color property
                        // ...
                      ],
                      innerRadius: 30,
                      outerRadius: 100,
                      cornerRadius: 10,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}

                  height={300}
                  className="w-full"
                />
              </div>
              <div className="w-full flex flex-col items-center p-3 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
                <h1 className="font-semibold">
                  DATA GEO
                </h1>
                <PieChart
                // Use palette
                  series={[
                    {
                      arcLabel: (item) => item.value > 0 && `${item.value}`,
                      data: [
                        { value: dataRekap[rekapTahun]['total_daftarUlang_geo'], color: 'red', label: 'Sudah Daftar Ulang' }, // Use color property
                        { value: dataRekap[rekapTahun]['total_terdaftar_geo'], color: 'lightgrey', label: 'Belum Daftar Ulang' }, // Use color property
                        // ...
                      ],
                      innerRadius: 30,
                      outerRadius: 100,
                      cornerRadius: 10,
                      cx: 150,
                      cy: 150,
                    },
                  ]}

                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}

                  height={300}
                  className="w-full"
                />
              </div>
              <div className="w-full flex flex-col items-center p-3 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
                <h1 className="font-semibold">
                  DATA TITL
                </h1>
                <PieChart
                // Use palette
                  series={[
                    {
                      arcLabel: (item) => item.value > 0 && `${item.value}`,
                      data: [
                        { value: dataRekap[rekapTahun]['total_daftarUlang_titl'], color: 'grey', label: 'Sudah Daftar Ulang' }, // Use color property
                        { value: dataRekap[rekapTahun]['total_terdaftar_titl'], color: 'lightgrey', label: 'Belum Daftar Ulang' }, // Use color property
                        // ...
                      ],
                      innerRadius: 30,
                      outerRadius: 100,
                      cornerRadius: 10,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}

                  height={300}
                  className="w-full"
                />
              </div>
              
            </div>
            <hr className="my-2 opacity-0" />
            <h1 className="px-3 py-2 rounded-full bg-zinc-200 text-zinc-700 font-medium w-fit">
              Data Kategori
            </h1>
            <div className="w-full">
              <BarChart
                slotProps={{
                  noDataOverlay: {
                    message: 'Data tidak ada!'
                  }
                }}
                xAxis={[{ scaleType: 'band', data: ['KETM', 'PRESTASI KEJUARAAN', 'RAPOR UNGGULAN', 'KATEGORI LAIN'] }]}
                series={[
                  { 
                    data: [
                      dataRekap[rekapTahun]['total_terdaftar_kategori_ketm'], 
                      dataRekap[rekapTahun]['total_terdaftar_kategori_kejuaraan'], 
                      dataRekap[rekapTahun]['total_terdaftar_kategori_rapor'], 
                      dataRekap[rekapTahun]['total_terdaftar_kategori_lain']
                    ]
                  }
                ]}
                height={300}
                className="w-full"
                borderRadius={10}
                barLabel={(item, context) => {
                  if((item.value ?? 0) > 5) {
                    return item.value
                  }
                }}

                sx={{
                  [`& .${barLabelClasses.root}`]: {
                    fill: 'white',
                    fontWeight: 'bold',
                  },
                }}
              />
            </div>
          </div>
          <hr className="my-3 opacity-0" />
          <div className="flex md:flex-row flex-col gap-5">
            <div className="p-5 bg-white rounded-2xl w-full md:w-1/2">
              <div className="flex items-center justify-between">
                <h1 className="font-medium text-2xl">Total Data Siswa</h1>
                
              </div>
              <hr className="my-3" />
              <LineChart
                slotProps={{
                  noDataOverlay: {
                    message: 'Data tidak ada!'
                  }
                }}
                series={[
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar']), label: 'Total Siswa' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_daftarUlang']), label: 'Daftar Ulang' },
                ]}
                xAxis={[{ scaleType: 'point', data: Object.keys(dataRekap).slice(0, 5) }]}
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
                slotProps={{
                  noDataOverlay: {
                    message: 'Data tidak ada!'
                  }
                }}
                series={[
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_tkj']), label: 'TKJ', color: '#22c55e' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_dpib']), label: 'DPIB', color: '#92400e' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_tkr']), label: 'TKR', color: '#2563eb' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_tpm']), label: 'TPM', color: '#f97316' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_titl']), label: 'TITL', color: '#6b7280' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_geo']), label: 'GEO', color: '#e11d48' }
                ]}
                xAxis={[{ scaleType: 'point', data: Object.keys(dataRekap) }]}
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
                slotProps={{
                  noDataOverlay: {
                    message: 'Data tidak ada!'
                  }
                }}
                series={[
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_jk_laki']), label: 'Laki - laki', color: 'red' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_jk_perempuan']), label: 'Perempuan', color: 'blue' },
                ]}
                xAxis={[{ scaleType: 'point', data: Object.keys(dataRekap).slice(0, 5) }]}
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
                slotProps={{
                  noDataOverlay: {
                    message: 'Data tidak ada!'
                  }
                }}
                series={[
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_tinggal_ortu']), label: 'Orang Tua' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_tinggal_wali']), label: 'Wali' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_tinggal_ortu']), label: 'Kos' },
                ]}
                xAxis={[{ scaleType: 'point', data: Object.keys(dataRekap).slice(0, 5) }]}
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
                slotProps={{
                  noDataOverlay: {
                    message: 'Data tidak ada!'
                  }
                }}
                series={[
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_transport_angkut']), label: 'Angkutan Umum' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_transport_antar']), label: 'Antar Jemput' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_transport_jalan']), label: 'Jalan Kaki' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_transport_motor']), label: 'Motor' },
                  { data: Object.keys(dataRekap).slice(0, 5).map(year => dataRekap[year]['total_terdaftar_transport_sepeda']), label: 'Sepeda' },
                ]}
                xAxis={[{ scaleType: 'point', data: Object.keys(dataRekap).slice(0, 5) }]}
                height={300}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
      {loadingFetch === 'fetched' && dataRekap === null && (
        <div className="p-5 w-full h-screen flex items-center justify-center">
          <div className="bg-white p-5 rounded-2xl w-fit flex flex-col items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-12 h-12 text-cyan-600" />
            <h1 className="font-bold text-3xl">Data tidak ditemukan!</h1>
            <hr className="my-3 opacity-0" />
            <p className="text-center">
              Hal ini dikarenakan Data yang di rekap tidak ada didalam Database, <br /> anda bisa menambahkan <b>Data Baru</b> ke dalam Daftar Calon Siswa.
            </p>
          </div>
        </div>
      )}
    </MainLayoutPage>
  );
}
