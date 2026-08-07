import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { Award, Clock, GraduationCap, XCircle, Info, Building2, UserCircle2 } from 'lucide-react';

interface KomponenNilai {
  komponen: string;
  bobot: number;
  nilai: number;
}

interface Rapor {
  status_kp: string;
  dosen_pembimbing: string;
  instansi: string;
  agregat_dosen: number | null;
  agregat_instansi: number | null;
  agregat_ujian: number | null;
  nilai_total: number | null;
  nilai_huruf: string;
  status_lulus: string;
  catatan: string | null;
  rincian_dosen: KomponenNilai[];
  rincian_instansi: KomponenNilai[];
}

interface Props {
  hasData: boolean;
  message?: string;
  rapor?: Rapor;
}

export default function PenilaianAkhirScreen({ hasData, message, rapor }: Props) {
  // Kondisi 1: Belum ada data sama sekali
  if (!hasData || !rapor) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-2">
          <Info size={40} className="text-secondary" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-on-surface">Belum Ada Riwayat</h2>
        <p className="text-secondary text-center max-w-md">{message || 'Data pendaftaran belum tersedia.'}</p>
      </div>
    );
  }

  const isProses = rapor.status_lulus === 'proses' || !rapor.nilai_total;
  const isLulus = rapor.status_lulus === 'lulus';

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Rapor Kerja Praktik</h1>
        <p className="text-sm text-on-surface-variant mt-1">Laporan rekapitulasi penilaian dari Dosen Pembimbing dan Instansi/Mitra.</p>
      </div>

      {/* Kondisi 2: Data ada, tapi nilai belum lengkap */}
      {isProses ? (
        <div className="bg-surface-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col items-center justify-center py-24 px-6 text-center mt-4">
          <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Clock size={48} className="text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold text-on-surface mb-3">Penilaian Sedang Diproses</h2>
          <p className="text-on-surface-variant max-w-lg mb-8 leading-relaxed">
            Dosen Pembimbing atau Instansi tempat Anda magang saat ini belum melengkapi seluruh komponen penilaian. 
            Hasil akhir akan muncul di halaman ini setelah semua pihak mengirimkan nilainya.
          </p>

          <div className="flex flex-wrap justify-center gap-4 w-full max-w-xl">
            <div className={`flex-1 min-w-[200px] p-4 rounded-xl border ${rapor.agregat_dosen !== null ? 'bg-primary/5 border-primary/20' : 'bg-surface border-outline-variant'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface-variant">Dosen Pembimbing</span>
                {rapor.agregat_dosen !== null ? (
                  <span className="text-xs bg-primary text-on-primary px-2 py-0.5 rounded font-bold">SUDAH DINILAI</span>
                ) : (
                  <span className="text-xs bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded font-bold">MENUNGGU</span>
                )}
              </div>
              <p className="text-xs text-secondary truncate">{rapor.dosen_pembimbing}</p>
            </div>

            <div className={`flex-1 min-w-[200px] p-4 rounded-xl border ${rapor.agregat_instansi !== null ? 'bg-primary/5 border-primary/20' : 'bg-surface border-outline-variant'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-on-surface-variant">Instansi (Mitra)</span>
                {rapor.agregat_instansi !== null ? (
                  <span className="text-xs bg-primary text-on-primary px-2 py-0.5 rounded font-bold">SUDAH DINILAI</span>
                ) : (
                  <span className="text-xs bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded font-bold">MENUNGGU</span>
                )}
              </div>
              <p className="text-xs text-secondary truncate">{rapor.instansi}</p>
            </div>
          </div>
        </div>
      ) : (
        /* Kondisi 3: Nilai sudah lengkap (Lulus / Tidak Lulus) */
        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          
          {/* Sisi Kiri: Badge Besar Kelulusan */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-surface-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden p-8 flex flex-col items-center justify-center text-center">
              <div className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">Huruf Mutu</div>
              
              <div className={`text-[120px] font-display font-black leading-none tracking-tighter mb-6
                ${rapor.nilai_huruf === 'A' ? 'text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 
                  rapor.nilai_huruf === 'B' ? 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 
                  rapor.nilai_huruf === 'C' ? 'text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 
                  'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]'}
              `}>
                {rapor.nilai_huruf}
              </div>

              {isLulus ? (
                <div className="flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-2 rounded-full font-bold">
                  <Award size={20} /> LULUS KERJA PRAKTIK
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-500/10 text-red-700 dark:text-red-400 px-4 py-2 rounded-full font-bold">
                  <XCircle size={20} /> TIDAK LULUS
                </div>
              )}

              <div className="mt-8 w-full">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-secondary">Nilai Total Keseluruhan</span>
                  <span className="text-2xl font-display font-bold text-on-surface">{Number(rapor.nilai_total).toFixed(2)}</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full ${isLulus ? 'bg-primary' : 'bg-error'}`} 
                    style={{ width: `${rapor.nilai_total}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {rapor.catatan && (
              <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
                <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <Info size={16} /> Catatan Tambahan Penilai
                </h3>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap italic">
                  "{rapor.catatan}"
                </p>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Rincian Rapor */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            
            {/* Panel Rincian Instansi */}
            <div className="bg-surface-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-high rounded-lg text-secondary">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-on-surface">Penilaian Instansi</h3>
                    <p className="text-xs text-secondary mt-0.5">{rapor.instansi}</p>
                  </div>
                </div>
                <div className="text-xl font-display font-bold text-on-surface">{Number(rapor.agregat_instansi).toFixed(1)}</div>
              </div>
              <div className="p-6">
                {rapor.rincian_instansi.length > 0 ? (
                  <div className="space-y-4">
                    {rapor.rincian_instansi.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-outline-variant pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-on-surface capitalize">{item.komponen.replace('_', ' ')}</p>
                          <p className="text-xs text-secondary mt-0.5">Bobot: {item.bobot}%</p>
                        </div>
                        <span className="font-semibold text-on-surface-variant">{item.nilai}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary italic">Rincian nilai instansi tidak tersedia.</p>
                )}
              </div>
            </div>

            {/* Panel Rincian Dosen */}
            <div className="bg-surface-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-high rounded-lg text-secondary">
                    <UserCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-on-surface">Penilaian Dosen Pembimbing</h3>
                    <p className="text-xs text-secondary mt-0.5">{rapor.dosen_pembimbing}</p>
                  </div>
                </div>
                <div className="text-xl font-display font-bold text-on-surface">{Number(rapor.agregat_dosen).toFixed(1)}</div>
              </div>
              <div className="p-6">
                {rapor.rincian_dosen.length > 0 ? (
                  <div className="space-y-4">
                    {rapor.rincian_dosen.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-outline-variant pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-on-surface capitalize">{item.komponen.replace('_', ' ')}</p>
                          <p className="text-xs text-secondary mt-0.5">Bobot: {item.bobot}%</p>
                        </div>
                        <span className="font-semibold text-on-surface-variant">{item.nilai}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary italic">Rincian nilai dosen tidak tersedia.</p>
                )}
              </div>
            </div>

            {/* Panel Ujian (Jika ada) */}
            {rapor.agregat_ujian !== null && (
              <div className="bg-surface-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-high rounded-lg text-secondary">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="font-display font-semibold text-on-surface">Nilai Ujian / Seminar KP</h3>
                </div>
                <div className="text-xl font-display font-bold text-on-surface">{Number(rapor.agregat_ujian).toFixed(1)}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

PenilaianAkhirScreen.layout = (page: React.ReactNode) => <MahasiswaLayout>{page}</MahasiswaLayout>;
