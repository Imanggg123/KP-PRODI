import InstansiLayout from '@/Layouts/InstansiLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { CheckCircle2, XCircle, FileText, ImageIcon, X, AlertCircle } from 'lucide-react';
import Modal from '@/Components/Modal';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Logbook {
  id: number;
  mahasiswa: Mahasiswa;
  tanggal: string;
  jam_mulai: string | null;
  jam_selesai: string | null;
  deskripsi: string;
  path_foto: string | null;
  status_instansi: string;
  catatan_instansi: string | null;
}

interface Props {
  logbooks: Logbook[];
  error?: string;
}

export default function InstansiLogbookScreen({ logbooks, error }: Props) {
  const [selectedLogbook, setSelectedLogbook] = useState<Logbook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, put, processing, reset, errors } = useForm({
    status_instansi: 'disetujui',
    catatan_instansi: '',
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <AlertCircle size={64} className="text-error" />
        <h2 className="text-xl font-display font-semibold text-on-surface">Akses Ditolak</h2>
        <p className="text-secondary text-center max-w-md">{error}</p>
      </div>
    );
  }

  const openValidationModal = (logbook: Logbook) => {
    setSelectedLogbook(logbook);
    setData({
      status_instansi: logbook.status_instansi === 'menunggu' ? 'disetujui' : logbook.status_instansi,
      catatan_instansi: logbook.catatan_instansi || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedLogbook(null);
      reset();
    }, 200);
  };

  const submitValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLogbook) return;

    put(route('instansi.logbook.update', selectedLogbook.id), {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'menunggu': return { label: 'Menunggu', color: 'bg-surface-variant text-on-surface-variant border-outline-variant' };
      case 'disetujui': return { label: 'Disetujui', color: 'bg-primary-container text-on-primary-container border-primary-container' };
      case 'revisi': return { label: 'Revisi', color: 'bg-error-container text-on-error-container border-error-container' };
      default: return { label: status, color: 'bg-surface text-on-surface border-outline' };
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Monitoring Kegiatan</h1>
        <p className="text-sm text-on-surface-variant mt-1">Pantau dan validasi catatan aktivitas harian mahasiswa magang di instansi Anda.</p>
      </div>

      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="overflow-x-auto">
          {logbooks.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <FileText size={48} className="text-outline mb-4 opacity-50" />
              <p className="font-body-lg text-on-surface">Belum ada aktivitas</p>
              <p className="font-body-md text-secondary mt-1">Mahasiswa belum mengunggah kegiatan harian mereka.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium">
                  <th className="py-4 px-5 w-1/4">Mahasiswa</th>
                  <th className="py-4 px-5 w-1/4">Waktu</th>
                  <th className="py-4 px-5">Ringkasan Kegiatan</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {logbooks.map((log) => {
                  const statusUi = formatStatus(log.status_instansi);
                  
                  return (
                    <tr key={log.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-4 px-5 align-top">
                        <div className="font-medium text-on-surface">{log.mahasiswa.name}</div>
                        <div className="text-sm text-secondary">{log.mahasiswa.nim}</div>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <div className="font-medium text-on-surface">{log.tanggal}</div>
                        <div className="text-xs text-secondary mt-1">
                          {log.jam_mulai?.substring(0,5)} - {log.jam_selesai?.substring(0,5)}
                        </div>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <p className="text-sm text-on-surface line-clamp-2">{log.deskripsi}</p>
                        {log.path_foto && (
                          <div className="inline-flex items-center gap-1 mt-2 text-xs text-primary bg-primary-container px-2 py-0.5 rounded-full">
                            <ImageIcon size={12} /> Ada Lampiran Foto
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5 align-top text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 align-top text-center">
                        <button 
                          onClick={() => openValidationModal(log)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            log.status_instansi === 'menunggu'
                              ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
                              : 'border border-outline-variant text-secondary hover:bg-surface-container'
                          }`}
                        >
                          {log.status_instansi === 'menunggu' ? 'Validasi' : 'Ubah Data'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
        <div className="p-0">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-on-surface">Validasi Kegiatan Harian</h2>
            <button onClick={closeModal} className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={submitValidation} className="p-6">
            {selectedLogbook && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-on-surface-variant mb-2">Informasi Kegiatan</h3>
                  <div className="bg-surface-lowest border border-outline-variant rounded-lg p-4 space-y-3">
                    <div>
                      <div className="text-xs text-secondary">Pelaksana</div>
                      <div className="text-sm font-medium">{selectedLogbook.mahasiswa.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-secondary">Waktu Pelaksanaan</div>
                      <div className="text-sm font-medium">{selectedLogbook.tanggal} ({selectedLogbook.jam_mulai?.substring(0,5)} - {selectedLogbook.jam_selesai?.substring(0,5)})</div>
                    </div>
                    <div>
                      <div className="text-xs text-secondary mb-1">Deskripsi Kegiatan</div>
                      <p className="text-sm leading-relaxed text-on-surface bg-surface-container-lowest p-2 border border-outline-variant rounded">
                        {selectedLogbook.deskripsi}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-on-surface-variant mb-2">Bukti Lampiran</h3>
                  <div className="bg-surface-lowest border border-outline-variant rounded-lg p-2 h-[200px] flex items-center justify-center overflow-hidden">
                    {selectedLogbook.path_foto ? (
                      <img 
                        src={`/storage/${selectedLogbook.path_foto}`} 
                        alt="Bukti Logbook" 
                        className="object-cover w-full h-full rounded"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-secondary opacity-60">
                        <ImageIcon size={32} className="mb-2" />
                        <span className="text-sm">Tidak ada lampiran foto</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-6">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-3">Keputusan Pembimbing Lapangan</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status_instansi"
                      value="disetujui"
                      checked={data.status_instansi === 'disetujui'}
                      onChange={(e) => setData('status_instansi', e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary border-outline"
                    />
                    <span className="text-sm text-on-surface flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={16} className="text-green-600" /> Disetujui
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status_instansi"
                      value="revisi"
                      checked={data.status_instansi === 'revisi'}
                      onChange={(e) => setData('status_instansi', e.target.value)}
                      className="w-4 h-4 text-error focus:ring-error border-outline"
                    />
                    <span className="text-sm text-on-surface flex items-center gap-1.5 font-medium">
                      <XCircle size={16} className="text-error" /> Perlu Direvisi
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="catatan_instansi" className="block text-sm font-semibold text-on-surface mb-2">
                  Catatan / Masukan (Opsional)
                </label>
                <textarea
                  id="catatan_instansi"
                  rows={3}
                  value={data.catatan_instansi}
                  onChange={(e) => setData('catatan_instansi', e.target.value)}
                  placeholder="Berikan saran atau instruksi jika mahasiswa perlu memperbaiki kegiatan..."
                  className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                ></textarea>
                {errors.catatan_instansi && <p className="text-error text-xs mt-1">{errors.catatan_instansi}</p>}
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
                {processing ? 'Menyimpan...' : 'Simpan Validasi'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

InstansiLogbookScreen.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
