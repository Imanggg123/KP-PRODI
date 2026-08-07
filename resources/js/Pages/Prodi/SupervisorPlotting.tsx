import ProdiLayout from '@/Layouts/ProdiLayout';
import { useForm } from '@inertiajs/react';

interface Mahasiswa {
  id: number;
  name: string;
  nim: string;
}

interface Dosen {
  id: number;
  name: string;
  kuota_max: number;
  bimbingan_aktif: number;
}

interface Pendaftaran {
  id: number;
  mahasiswa: Mahasiswa;
  dosen_pembimbing?: Dosen;
}

interface Props {
  mahasiswaQueue: Pendaftaran[];
  dosenList: Dosen[];
  plottedHistory: Pendaftaran[];
}

export default function SupervisorPlotting({ mahasiswaQueue = [], dosenList = [], plottedHistory = [] }: Props) {
  const { data, setData, post, processing, reset } = useForm({
    pendaftaran_id: '',
    dosen_id: '',
  });

  const submitPlotting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.pendaftaran_id || !data.dosen_id) return;
    
    post(route('prodi.plotting.store'), {
      onSuccess: () => reset()
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Plotting Dosen Pembimbing</h1>
          <p className="text-on-surface-variant mt-1">Alokasikan dosen pembimbing untuk mahasiswa Kerja Praktik.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-surface-lowest rounded-2xl shadow-sm border border-outline-variant p-6 md:p-8">
        <form onSubmit={submitPlotting} className="space-y-6 flex flex-col">
          
          {/* Mahasiswa Dropdown */}
          <div className="flex flex-col">
            <span className="text-red-500 text-sm font-medium mb-1 italic">
              * nb : prodi tidak dapat menghapus atau menambah dosbing jika tgl pengajuan surat sudah lewat lebih dari 2 hari
            </span>
            <label className="text-on-surface font-semibold mb-2">Mahasiswa Kerja Praktek</label>
            <select
              value={data.pendaftaran_id}
              onChange={(e) => setData('pendaftaran_id', e.target.value)}
              className="border border-outline-variant rounded-lg p-3 bg-surface-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface"
              required
            >
              <option value="">-- Pilih Mahasiswa --</option>
              {mahasiswaQueue.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.mahasiswa.nim} - {p.mahasiswa.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dosen Dropdown */}
          <div className="flex flex-col">
            <span className="text-red-500 text-sm font-medium mb-1 italic">
              * nb : (batas angka) : dosen memiliki batas kuota
            </span>
            <label className="text-on-surface font-semibold mb-2">Dosen Pembimbing Kerja Praktek</label>
            <select
              value={data.dosen_id}
              onChange={(e) => setData('dosen_id', e.target.value)}
              className="border border-outline-variant rounded-lg p-3 bg-surface-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface"
              required
            >
              <option value="">-- Pilih Dosen Pembimbing --</option>
              {dosenList.map((d) => {
                const sisa = d.kuota_max - d.bimbingan_aktif;
                const disabled = sisa <= 0;
                return (
                  <option key={d.id} value={d.id} disabled={disabled}>
                    {d.name} ( Sisa Kuota: {sisa < 0 ? 0 : sisa} )
                  </option>
                );
              })}
            </select>
          </div>

          <button
            type="submit"
            disabled={processing || !data.pendaftaran_id || !data.dosen_id}
            className="self-start px-8 py-3 bg-primary hover:bg-primary/90 text-on-primary font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
          >
            {processing ? 'Menyimpan...' : 'Bagi'}
          </button>
        </form>
      </div>

      {/* History Table */}
      <div className="bg-surface-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="p-6 border-b border-outline-variant">
          <h3 className="text-lg font-display font-semibold text-on-surface">Riwayat Plotting Dosen Pembimbing</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-variant text-on-surface-variant text-sm border-b border-outline-variant">
                <th className="p-4 font-semibold w-32">NIM</th>
                <th className="p-4 font-semibold">Nama Mahasiswa</th>
                <th className="p-4 font-semibold">Dosen Pembimbing</th>
                <th className="p-4 font-semibold text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {plottedHistory && plottedHistory.length > 0 ? (
                plottedHistory.map((h, i) => (
                  <tr key={h.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 text-on-surface">{h.mahasiswa?.nim}</td>
                    <td className="p-4 text-on-surface font-medium">{h.mahasiswa?.name}</td>
                    <td className="p-4 text-on-surface">{h.dosen_pembimbing?.name || '-'}</td>
                    <td className="p-4 text-center">
                      <button className="text-primary hover:text-primary/80 font-medium text-sm px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                    Belum ada riwayat plotting.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

SupervisorPlotting.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
