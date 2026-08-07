import DosenLayout from '@/Layouts/DosenLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FileText, Download, CheckCircle2, Edit3, Clock, X } from 'lucide-react';
import Modal from '@/Components/Modal';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Pendaftaran {
  mahasiswa: Mahasiswa;
}

interface Proposal {
  id: number;
  judul: string;
  abstrak: string | null;
  path_file: string | null;
  status: string;
  submitted_at: string | null;
  pendaftaran: Pendaftaran;
}

interface Props {
  proposals: Proposal[];
}

export default function ReviewProposalScreen({ proposals }: Props) {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, put, processing, reset, errors } = useForm({
    status: '',
    catatan: '',
  });

  const openReviewModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setData({
      status: '',
      catatan: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProposal(null);
      reset();
    }, 200);
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposal || !data.status) return;

    put(route('dosen.review.update', selectedProposal.id), {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'diajukan': return { label: 'Menunggu Review', color: 'bg-error-container text-error' };
      case 'revisi': return { label: 'Revisi', color: 'bg-tertiary-container text-on-tertiary-container' };
      case 'disetujui': return { label: 'Disetujui', color: 'bg-primary-container text-on-primary-container' };
      default: return { label: status, color: 'bg-surface-variant text-on-surface-variant' };
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Review Proposal</h1>
        <p className="text-sm text-on-surface-variant mt-1">Daftar proposal mahasiswa bimbingan yang membutuhkan persetujuan.</p>
      </div>

      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="overflow-x-auto">
          {proposals.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <FileText size={48} className="text-outline mb-4 opacity-50" />
              <p className="font-body-lg text-on-surface">Belum ada proposal masuk</p>
              <p className="font-body-md text-secondary mt-1">Mahasiswa bimbingan Anda belum ada yang mengajukan proposal.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium">
                  <th className="py-3 px-4 w-1/4">Mahasiswa</th>
                  <th className="py-3 px-4 w-1/3">Judul Proposal</th>
                  <th className="py-3 px-4">Tanggal Pengajuan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {proposals.map((proposal) => {
                  const statusUi = formatStatus(proposal.status);
                  
                  return (
                    <tr key={proposal.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <div className="font-medium text-on-surface">{proposal.pendaftaran.mahasiswa.name}</div>
                        <div className="text-sm text-secondary">{proposal.pendaftaran.mahasiswa.nim}</div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="text-sm font-medium text-on-surface line-clamp-2" title={proposal.judul}>
                          {proposal.judul}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="text-sm text-secondary flex items-center gap-1.5">
                          <Clock size={14} />
                          {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          }) : '-'}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top text-center">
                        <button 
                          onClick={() => openReviewModal(proposal)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            proposal.status === 'diajukan' 
                              ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm'
                              : 'border border-outline text-secondary hover:bg-surface-container'
                          }`}
                        >
                          {proposal.status === 'diajukan' ? (
                            <>Review</>
                          ) : (
                            <>Lihat Review</>
                          )}
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
            <h2 className="text-xl font-display font-semibold text-on-surface">Review Proposal</h2>
            <button onClick={closeModal} className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {selectedProposal && (
            <div className="space-y-6">
              {/* Proposal Summary */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs font-medium text-on-surface-variant mb-1">Nama Mahasiswa</div>
                    <div className="text-sm font-medium text-on-surface">{selectedProposal.pendaftaran.mahasiswa.name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-on-surface-variant mb-1">NIM</div>
                    <div className="text-sm font-medium text-on-surface">{selectedProposal.pendaftaran.mahasiswa.nim}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-on-surface-variant mb-1">Judul Proposal</div>
                  <div className="text-sm font-medium text-on-surface">{selectedProposal.judul}</div>
                </div>
                
                {selectedProposal.path_file && (
                  <div className="mt-4 pt-4 border-t border-outline-variant">
                    <a 
                      href={`/storage/${selectedProposal.path_file}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-medium hover:brightness-95 transition-all"
                    >
                      <Download size={16} />
                      Unduh Dokumen Proposal
                    </a>
                  </div>
                )}
              </div>

              {/* Review Form */}
              <form onSubmit={submitReview} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Keputusan Review <span className="text-error">*</span>
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
                        <span className="font-medium text-sm">Disetujui</span>
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
                    Catatan & Feedback <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="catatan"
                    rows={4}
                    value={data.catatan}
                    onChange={(e) => setData('catatan', e.target.value)}
                    placeholder="Berikan masukan, perbaikan, atau catatan persetujuan untuk mahasiswa..."
                    className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                  ></textarea>
                  {errors.catatan && <p className="text-error text-xs mt-1">{errors.catatan}</p>}
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
                    disabled={processing || !data.status || !data.catatan}
                    className="px-6 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {processing ? 'Menyimpan...' : 'Kirim Review'}
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

ReviewProposalScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
