import TULayout from '@/Layouts/TULayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FileSignature, CheckCircle, X, Search, FileDown } from 'lucide-react';
import Modal from '@/Components/Modal';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Instansi {
  nama: string;
}

interface BeritaAcara {
  status: string;
  path_file: string;
}

interface Pendaftaran {
  id: number;
  mahasiswa: Mahasiswa;
  instansi: Instansi;
  nilai_total: number;
  nilai_huruf: string;
  berita_acara: BeritaAcara | null;
  status_kp: string;
}

interface Props {
  pendaftarans: Pendaftaran[];
}

export default function ValidasiBeritaScreen({ pendaftarans }: Props) {
  const [search, setSearch] = useState('');
  const [selectedPendaftaran, setSelectedPendaftaran] = useState<Pendaftaran | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, put, processing, reset, errors } = useForm({
    catatan: '',
  });

  const filteredPendaftarans = pendaftarans.filter(p => 
    p.mahasiswa.name.toLowerCase().includes(search.toLowerCase()) ||
    p.mahasiswa.nim.toLowerCase().includes(search.toLowerCase())
  );

  const openValidationModal = (pendaftaran: Pendaftaran) => {
    setSelectedPendaftaran(pendaftaran);
    setData('catatan', '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPendaftaran(null);
      reset();
    }, 200);
  };

  const submitValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPendaftaran) return;

    put(route('tu.validasi.update', selectedPendaftaran.id), {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Validasi & Penerbitan Berita Acara</h1>
        <p className="text-sm text-on-surface-variant mt-1">Daftar mahasiswa yang telah lulus penilaian dan menunggu penerbitan Berita Acara Kelulusan Kerja Praktik.</p>
      </div>

      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
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

        <div className="overflow-x-auto">
          {filteredPendaftarans.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <FileSignature size={48} className="text-outline mb-4 opacity-50" />
              <p className="font-body-lg text-on-surface">Antrean Kosong</p>
              <p className="font-body-md text-secondary mt-1">Tidak ada mahasiswa lulus yang menunggu Berita Acara saat ini.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium">
                  <th className="py-4 px-5">Mahasiswa</th>
                  <th className="py-4 px-5">Instansi Magang</th>
                  <th className="py-4 px-5 text-center">Nilai & Huruf</th>
                  <th className="py-4 px-5 text-center">Status BA</th>
                  <th className="py-4 px-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredPendaftarans.map((p) => {
                  const isTerbit = p.berita_acara?.status === 'disetujui';

                  return (
                    <tr key={p.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-4 px-5 align-top">
                        <div className="font-medium text-on-surface">{p.mahasiswa.name}</div>
                        <div className="text-sm text-secondary">{p.mahasiswa.nim}</div>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <div className="text-sm text-on-surface">{p.instansi.nama}</div>
                      </td>
                      <td className="py-4 px-5 align-top text-center">
                        <div className="text-lg font-display font-bold text-on-surface">{Number(p.nilai_total).toFixed(1)}</div>
                        <div className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-1 ${
                          p.nilai_huruf === 'A' ? 'bg-green-100 text-green-700' :
                          p.nilai_huruf === 'B' ? 'bg-blue-100 text-blue-700' :
                          p.nilai_huruf === 'C' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {p.nilai_huruf}
                        </div>
                      </td>
                      <td className="py-4 px-5 align-top text-center">
                        {isTerbit ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-container text-on-primary-container rounded-full text-[11px] font-semibold">
                            <CheckCircle size={14} /> TERBIT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-variant text-on-surface-variant rounded-full text-[11px] font-semibold">
                            MENUNGGU
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 align-top text-center">
                        {!isTerbit ? (
                          <button 
                            onClick={() => openValidationModal(p)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm"
                          >
                            <FileSignature size={16} /> Terbitkan BA
                          </button>
                        ) : (
                          <button 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-outline text-secondary hover:bg-surface-container transition-colors"
                          >
                            <FileDown size={16} /> Unduh
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
        <div className="p-0">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-on-surface">Penerbitan Berita Acara</h2>
            <button onClick={closeModal} className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={submitValidation} className="p-6">
            {selectedPendaftaran && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-6">
                <h3 className="text-sm font-semibold text-on-surface-variant mb-4">Informasi Mahasiswa</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-outline-variant pb-2">
                    <span className="text-sm text-secondary">Nama</span>
                    <span className="text-sm font-medium text-on-surface">{selectedPendaftaran.mahasiswa.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant pb-2">
                    <span className="text-sm text-secondary">NIM</span>
                    <span className="text-sm font-medium text-on-surface">{selectedPendaftaran.mahasiswa.nim}</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant pb-2">
                    <span className="text-sm text-secondary">Instansi Magang</span>
                    <span className="text-sm font-medium text-on-surface text-right w-1/2 line-clamp-1">{selectedPendaftaran.instansi.nama}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-sm text-secondary">Nilai Akhir</span>
                    <span className="text-sm font-bold text-primary">
                      {Number(selectedPendaftaran.nilai_total).toFixed(2)} ({selectedPendaftaran.nilai_huruf})
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="catatan" className="block text-sm font-semibold text-on-surface mb-2">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                id="catatan"
                rows={3}
                value={data.catatan}
                onChange={(e) => setData('catatan', e.target.value)}
                placeholder="Catatan administratif untuk Berita Acara (jika ada)..."
                className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
              ></textarea>
              {errors.catatan && <p className="text-error text-xs mt-1">{errors.catatan}</p>}
            </div>

            <div className="flex items-start gap-3 bg-primary-container/30 border border-primary-container p-4 rounded-xl mb-6">
              <CheckCircle className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs text-on-surface-variant leading-relaxed">
                <strong className="block text-on-surface mb-0.5">Konfirmasi Penerbitan</strong>
                Dengan menerbitkan dokumen ini, status pendaftaran mahasiswa akan diubah menjadi <b>SELESAI</b> dan dokumen Berita Acara final akan dihasilkan ke akun mahasiswa yang bersangkutan.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-outline text-secondary text-sm font-medium rounded-lg hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
              >
                {processing ? 'Menerbitkan...' : 'Validasi & Terbitkan'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

ValidasiBeritaScreen.layout = (page: React.ReactNode) => <TULayout>{page}</TULayout>;
