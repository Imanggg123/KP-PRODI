import ProdiLayout from '@/Layouts/ProdiLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, Printer, FileText, CheckCircle, Clock } from 'lucide-react';

interface LaporanData {
  id: number;
  nama_mahasiswa: string;
  nim_mahasiswa: string;
  nama_instansi: string;
  nama_dosen: string;
  status: string;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  nilai_total: number | null;
  nilai_huruf: string;
  status_kelulusan: string;
}

interface Props {
  laporan: LaporanData[];
  filters: {
    status: string;
  };
}

export default function LaporanReports({ laporan, filters }: Props) {
  const [search, setSearch] = useState('');

  const filteredLaporan = laporan.filter(l => 
    l.nama_mahasiswa.toLowerCase().includes(search.toLowerCase()) ||
    l.nim_mahasiswa.toLowerCase().includes(search.toLowerCase())
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.get(route('prodi.reports'), { status: e.target.value }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header - Disembunyikan saat di-print */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Laporan & Rekapitulasi</h1>
          <p className="text-on-surface-variant mt-1">Rekapitulasi komprehensif data pelaksanaan Kerja Praktik Mahasiswa.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-surface rounded-lg border border-outline-variant text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface"
          >
            <option value="selesai">Mahasiswa Selesai / Lulus</option>
            <option value="berjalan">Sedang Berjalan</option>
            <option value="semua">Semua Status</option>
          </select>
          <button 
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Printer size={18} /> Cetak PDF
          </button>
        </div>
      </div>

      {/* Kop Surat Khusus Print */}
      <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-2xl font-bold uppercase">Laporan Rekapitulasi Kerja Praktik</h1>
        <h2 className="text-lg font-semibold uppercase">Program Studi Teknik Informatika</h2>
        <p className="text-sm mt-1">Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
        <p className="text-sm mt-1">Filter Status: {filters.status.toUpperCase()}</p>
      </div>

      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col print:border-none print:shadow-none print:rounded-none">
        
        {/* Search Bar - Disembunyikan saat print */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center print:hidden">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input 
              type="text"
              placeholder="Cari nama atau NIM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Tabel Laporan */}
        <div className="overflow-x-auto print:overflow-visible">
          {filteredLaporan.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center print:hidden">
              <FileText size={48} className="text-outline mb-4 opacity-50" />
              <p className="font-body-lg text-on-surface">Data Kosong</p>
              <p className="font-body-md text-secondary mt-1">Tidak ada data rekapitulasi untuk filter yang dipilih.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse print:text-sm">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium print:bg-transparent print:border-black print:text-black">
                  <th className="py-4 px-4 print:py-2">No</th>
                  <th className="py-4 px-4 print:py-2">Mahasiswa</th>
                  <th className="py-4 px-4 print:py-2">Instansi Magang</th>
                  <th className="py-4 px-4 print:py-2">Dosen Pembimbing</th>
                  <th className="py-4 px-4 print:py-2 text-center">Status KP</th>
                  <th className="py-4 px-4 print:py-2 text-center">Nilai & Mutu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant print:divide-black">
                {filteredLaporan.map((item, index) => (
                  <tr key={item.id} className="hover:bg-surface-container-lowest/50 transition-colors print:break-inside-avoid">
                    <td className="py-3 px-4 align-top print:py-2">
                      <div className="text-sm text-on-surface">{index + 1}</div>
                    </td>
                    <td className="py-3 px-4 align-top print:py-2">
                      <div className="font-medium text-on-surface">{item.nama_mahasiswa}</div>
                      <div className="text-sm text-secondary">{item.nim_mahasiswa}</div>
                    </td>
                    <td className="py-3 px-4 align-top print:py-2">
                      <div className="text-sm text-on-surface">{item.nama_instansi}</div>
                      <div className="text-xs text-secondary mt-0.5">
                        {item.tanggal_mulai ? `${item.tanggal_mulai} s/d ${item.tanggal_selesai}` : '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4 align-top print:py-2">
                      <div className="text-sm text-on-surface">{item.nama_dosen}</div>
                    </td>
                    <td className="py-3 px-4 align-top text-center print:py-2">
                       <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold uppercase ${
                         item.status === 'selesai' || item.status === 'lulus' ? 'bg-green-100 text-green-700 print:bg-transparent print:text-black' : 
                         'bg-blue-100 text-blue-700 print:bg-transparent print:text-black'
                       }`}>
                         {item.status}
                       </span>
                    </td>
                    <td className="py-3 px-4 align-top text-center print:py-2">
                      {item.nilai_total !== null ? (
                        <>
                          <div className="text-sm font-bold text-on-surface">{Number(item.nilai_total).toFixed(1)}</div>
                          <div className={`text-xs font-bold px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                            item.nilai_huruf === 'A' ? 'bg-green-100 text-green-700 print:bg-transparent print:text-black' :
                            item.nilai_huruf === 'B' ? 'bg-blue-100 text-blue-700 print:bg-transparent print:text-black' :
                            item.nilai_huruf === 'C' ? 'bg-yellow-100 text-yellow-700 print:bg-transparent print:text-black' :
                            'bg-red-100 text-red-700 print:bg-transparent print:text-black'
                          }`}>
                            {item.nilai_huruf}
                          </div>
                        </>
                      ) : (
                         <div className="text-xs text-secondary italic">Menunggu</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Styles khusus pencetakan */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white;
            color: black;
          }
          /* Sembunyikan navigasi bawaan layout */
          nav, aside, header {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black !important;
          }
          @page {
            margin: 1.5cm;
            size: landscape;
          }
        }
      `}} />
    </div>
  );
}

LaporanReports.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
