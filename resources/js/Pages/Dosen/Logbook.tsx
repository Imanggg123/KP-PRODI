import DosenLayout from '@/Layouts/DosenLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Clock, CheckCircle2, X, Edit3, Image as ImageIcon } from 'lucide-react';
import Modal from '@/Components/Modal';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Pendaftaran {
  mahasiswa: Mahasiswa;
}

interface LogbookEntry {
  id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  deskripsi: string;
  path_foto: string | null;
  status: string;
  catatan_dosen: string | null;
  pendaftaran: Pendaftaran;
}

interface Props {
  logbooks: LogbookEntry[];
}

export default function LogbookScreen({ logbooks }: Props) {
  const [selectedEntry, setSelectedEntry] = useState<LogbookEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, put, processing, reset, errors } = useForm({
    status: '',
    catatan_dosen: '',
  });

  const openValidationModal = (entry: LogbookEntry) => {
    setSelectedEntry(entry);
    setData({
      status: entry.status === 'menunggu' ? '' : entry.status,
      catatan_dosen: entry.catatan_dosen || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedEntry(null);
      reset();
    }, 200);
  };

  const submitValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntry || !data.status) return;

    put(route('dosen.logbook.update', selectedEntry.id), {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'menunggu': return { label: 'Menunggu', color: 'bg-error-container text-error' };
      case 'revisi': return { label: 'Revisi', color: 'bg-tertiary-container text-on-tertiary-container' };
      case 'disetujui': return { label: 'Disetujui', color: 'bg-primary-container text-on-primary-container' };
      default: return { label: status, color: 'bg-surface-variant text-on-surface-variant' };
    }
  };

  const pendingCount = logbooks.filter(l => l.status === 'menunggu').length;
  const approvedCount = logbooks.filter(l => l.status === 'disetujui').length;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Monitoring Kegiatan</h1>
          <p className="text-sm text-on-surface-variant mt-1">Daftar kegiatan harian mahasiswa bimbingan yang membutuhkan validasi.</p>
        </div>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Total Entri</span>
          <span className="text-4xl font-display text-on-surface font-bold">{logbooks.length}</span>
        </div>
        <div className="bg-surface-lowest p-6 rounded-xl border border-error-container shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-error mb-1 uppercase tracking-wider">Menunggu Validasi</span>
          <span className="text-4xl font-display text-error font-bold">{pendingCount}</span>
        </div>
        <div className="bg-surface-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Tervalidasi</span>
          <span className="text-4xl font-display text-primary font-bold">{approvedCount}</span>
        </div>
      </div>

      {/* Logbook List */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="overflow-x-auto">
          {logbooks.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Clock size={48} className="text-outline mb-4 opacity-50" />
              <p className="font-body-lg text-on-surface">Belum ada logbook</p>
              <p className="font-body-md text-secondary mt-1">Mahasiswa bimbingan Anda belum mengisi catatan kegiatan harian.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium">
                  <th className="py-3 px-4 w-1/4">Mahasiswa</th>
                  <th className="py-3 px-4 w-1/5">Waktu Kegiatan</th>
                  <th className="py-3 px-4 w-1/3">Deskripsi Singkat</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {logbooks.map((entry) => {
                  const statusUi = formatStatus(entry.status);
                  
                  return (
                    <tr key={entry.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <div className="font-medium text-on-surface">{entry.pendaftaran.mahasiswa.name}</div>
                        <div className="text-sm text-secondary">{entry.pendaftaran.mahasiswa.nim}</div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="text-sm font-medium text-on-surface">
                          {new Date(entry.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-secondary mt-0.5">
                          {entry.jam_mulai?.substring(0, 5)} - {entry.jam_selesai?.substring(0, 5)}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="text-sm text-on-surface line-clamp-2" title={entry.deskripsi}>
                          {entry.deskripsi}
                        </div>
                        {entry.path_foto && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-primary font-medium">
                            <ImageIcon size={12} /> Ada Lampiran Foto
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top text-center">
                        <button 
                          onClick={() => openValidationModal(entry)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            entry.status === 'menunggu' 
                              ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm'
                              : 'border border-outline text-secondary hover:bg-surface-container'
                          }`}
                        >
                          {entry.status === 'menunggu' ? 'Validasi' : 'Detail'}
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
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-display font-semibold text-on-surface">Validasi Kegiatan Harian</h2>
            <button onClick={closeModal} className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {selectedEntry && (
            <div className="space-y-6">
              {/* Entry Summary */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="text-xs font-medium text-on-surface-variant mb-1">Mahasiswa</div>
                      <div className="text-sm font-medium text-on-surface">{selectedEntry.pendaftaran.mahasiswa.name} ({selectedEntry.pendaftaran.mahasiswa.nim})</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium text-on-surface-variant mb-1">Tanggal</div>
                        <div className="text-sm text-on-surface">{new Date(selectedEntry.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-on-surface-variant mb-1">Waktu</div>
                        <div className="text-sm text-on-surface">{selectedEntry.jam_mulai?.substring(0, 5)} - {selectedEntry.jam_selesai?.substring(0, 5)}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-on-surface-variant mb-1">Deskripsi Kegiatan</div>
                      <div className="text-sm text-on-surface whitespace-pre-wrap bg-surface p-3 rounded-lg border border-outline-variant">{selectedEntry.deskripsi}</div>
                    </div>
                  </div>
                  
                  {/* Photo Attachment */}
                  {selectedEntry.path_foto && (
                    <div className="md:w-1/3 shrink-0">
                      <div className="text-xs font-medium text-on-surface-variant mb-1">Bukti Kegiatan</div>
                      <div className="rounded-lg overflow-hidden border border-outline-variant bg-surface aspect-square flex items-center justify-center">
                        <img 
                          src={`/storage/${selectedEntry.path_foto}`} 
                          alt="Bukti kegiatan" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Foto+Tidak+Ditemukan';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Validation Form */}
              <form onSubmit={submitValidation} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Keputusan Validasi <span className="text-error">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="relative cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="disetujui" 
                        className="peer sr-only"
                        checked={data.status === 'disetujui'}
                        onChange={(e) => setData('status', e.target.value)}
                      />
                      <div className="p-3 text-center rounded-lg border-2 border-outline-variant hover:bg-surface-container peer-checked:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container transition-all flex items-center justify-center gap-2">
                        <CheckCircle2 size={18} className={data.status === 'disetujui' ? 'text-primary' : 'text-outline'} />
                        <span className="font-medium text-sm">Valid / Setuju</span>
                      </div>
                    </label>
                    <label className="relative cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="revisi" 
                        className="peer sr-only"
                        checked={data.status === 'revisi'}
                        onChange={(e) => setData('status', e.target.value)}
                      />
                      <div className="p-3 text-center rounded-lg border-2 border-outline-variant hover:bg-surface-container peer-checked:border-tertiary peer-checked:bg-tertiary-container peer-checked:text-on-tertiary-container transition-all flex items-center justify-center gap-2">
                        <Edit3 size={18} className={data.status === 'revisi' ? 'text-tertiary' : 'text-outline'} />
                        <span className="font-medium text-sm">Perlu Revisi</span>
                      </div>
                    </label>
                  </div>
                  {errors.status && <p className="text-error text-xs mt-1">{errors.status}</p>}
                </div>

                <div>
                  <label htmlFor="catatan" className="block text-sm font-medium text-on-surface mb-2">
                    Catatan Dosen (Opsional)
                  </label>
                  <textarea
                    id="catatan"
                    rows={3}
                    value={data.catatan_dosen}
                    onChange={(e) => setData('catatan_dosen', e.target.value)}
                    placeholder="Berikan catatan, arahan, atau alasan revisi..."
                    className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                  ></textarea>
                  {errors.catatan_dosen && <p className="text-error text-xs mt-1">{errors.catatan_dosen}</p>}
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
                    disabled={processing || !data.status}
                    className="px-6 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {processing ? 'Menyimpan...' : 'Simpan Validasi'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

LogbookScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
