import DosenLayout from '@/Layouts/DosenLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { BarChart2, ScanLine, X, FileSignature, CheckCircle2, FileText, Upload } from 'lucide-react';
import Modal from '@/Components/Modal';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Pendaftaran {
  id: number;
  mahasiswa: Mahasiswa;
  status_kp: string;
  is_dinilai: boolean;
  nilai_pembimbing: string | number | null;
  komponen_nilai: Record<string, string | number> | null;
}

interface Props {
  pendaftarans: Pendaftaran[];
}

export default function GradingScreen({ pendaftarans }: Props) {
  const [selectedPendaftaran, setSelectedPendaftaran] = useState<Pendaftaran | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, post, processing, reset, errors } = useForm({
    sistematika: '',
    kedalaman: '',
    penguasaan: '',
    presentasi: '',
    catatan: '',
  });

  const openGradingModal = (pendaftaran: Pendaftaran) => {
    setSelectedPendaftaran(pendaftaran);
    if (pendaftaran.komponen_nilai) {
      setData({
        sistematika: pendaftaran.komponen_nilai.sistematika?.toString() || '',
        kedalaman: pendaftaran.komponen_nilai.kedalaman?.toString() || '',
        penguasaan: pendaftaran.komponen_nilai.penguasaan?.toString() || '',
        presentasi: pendaftaran.komponen_nilai.presentasi?.toString() || '',
        catatan: '', // We don't pull existing catatan easily unless we parse it, so let's leave blank or handle it
      });
    } else {
      setData({
        sistematika: '',
        kedalaman: '',
        penguasaan: '',
        presentasi: '',
        catatan: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPendaftaran(null);
      reset();
    }, 200);
  };

  const handleScoreChange = (field: keyof typeof data, value: string) => {
    if (field === 'catatan') {
      setData(field, value);
      return;
    }
    
    let num = parseInt(value, 10);
    if (isNaN(num)) {
      setData(field, '');
      return;
    }
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    setData(field, num.toString());
  };

  const submitGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPendaftaran) return;

    post(route('dosen.grading.store', selectedPendaftaran.id), {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  // Helper to calculate runtime total for preview
  const sys = parseFloat(data.sistematika) || 0;
  const depth = parseFloat(data.kedalaman) || 0;
  const master = parseFloat(data.penguasaan) || 0;
  const pres = parseFloat(data.presentasi) || 0;
  const totalPreview = (sys * 0.2) + (depth * 0.3) + (master * 0.3) + (pres * 0.2);

  let grade = 'E';
  if (totalPreview >= 85) grade = 'A';
  else if (totalPreview >= 70) grade = 'B';
  else if (totalPreview >= 55) grade = 'C';
  else if (totalPreview >= 40) grade = 'D';

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Penilaian Pembimbing</h1>
        <p className="text-sm text-on-surface-variant mt-1">Daftar evaluasi dan pemberian nilai akhir bagi mahasiswa bimbingan.</p>
      </div>

      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="overflow-x-auto">
          {pendaftarans.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <FileSignature size={48} className="text-outline mb-4 opacity-50" />
              <p className="font-body-lg text-on-surface">Belum ada data mahasiswa</p>
              <p className="font-body-md text-secondary mt-1">Belum ada mahasiswa bimbingan yang siap untuk dievaluasi.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium">
                  <th className="py-3 px-4 w-1/4">Mahasiswa</th>
                  <th className="py-3 px-4">Status KP</th>
                  <th className="py-3 px-4 text-center">Status Penilaian</th>
                  <th className="py-3 px-4 text-center">Nilai Pembimbing</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {pendaftarans.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <div className="font-medium text-on-surface">{p.mahasiswa.name}</div>
                        <div className="text-sm text-secondary">{p.mahasiswa.nim}</div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className="inline-block px-2.5 py-1 bg-surface-high text-on-surface rounded text-[10px] font-bold uppercase tracking-wider border border-outline-variant">
                          {p.status_kp.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top text-center">
                        {p.is_dinilai ? (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                            <CheckCircle2 size={16} /> Sudah Dinilai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-secondary">
                            Belum Dinilai
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 align-top text-center">
                        {p.nilai_pembimbing !== null ? (
                          <div className="text-xl font-display font-bold text-on-surface">
                            {Number(p.nilai_pembimbing).toFixed(1)}
                          </div>
                        ) : (
                          <span className="text-outline">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 align-top text-center">
                        <button 
                          onClick={() => openGradingModal(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            !p.is_dinilai 
                              ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm'
                              : 'border border-outline text-secondary hover:bg-surface-container'
                          }`}
                        >
                          {!p.is_dinilai ? 'Beri Nilai' : 'Ubah Nilai'}
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
            <div>
              <h2 className="text-xl font-display font-semibold text-on-surface">Evaluasi Akhir</h2>
              {selectedPendaftaran && (
                <p className="text-sm text-on-surface-variant mt-1">
                  {selectedPendaftaran.mahasiswa.name} ({selectedPendaftaran.mahasiswa.nim})
                </p>
              )}
            </div>
            <button onClick={closeModal} className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={submitGrading} className="p-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-6">
              <h3 className="text-sm font-display font-semibold text-on-surface mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                Parameter Penilaian Dosen Pembimbing (0-100)
              </h3>
              
              <div className="space-y-4">
                {[
                  { id: 'sistematika', label: 'Sistematika Laporan (20%)', error: errors.sistematika },
                  { id: 'kedalaman', label: 'Kedalaman Materi & Analisis (30%)', error: errors.kedalaman },
                  { id: 'penguasaan', label: 'Penguasaan Konsep Teoritis (30%)', error: errors.penguasaan },
                  { id: 'presentasi', label: 'Kualitas Presentasi & Sikap (20%)', error: errors.presentasi }
                ].map((param) => (
                  <div key={param.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-sm font-medium text-on-surface-variant sm:w-2/3">{param.label}</label>
                    <div className="sm:w-1/3 flex flex-col">
                      <input 
                        type="number" 
                        min="0" max="100" 
                        value={data[param.id as keyof typeof data]}
                        onChange={(e) => handleScoreChange(param.id as keyof typeof data, e.target.value)}
                        placeholder="0 - 100"
                        className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-sm text-center font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                      />
                      {param.error && <span className="text-[10px] text-error mt-1">{param.error}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-5 mt-5 border-t border-outline-variant">
                <div className="flex justify-between items-center bg-surface-low p-4 rounded-xl border border-outline-variant">
                  <span className="text-sm font-display font-semibold text-on-surface">Agregasi Nilai Pembimbing</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-display font-bold text-primary">{totalPreview.toFixed(1)}</span>
                    <span className={`text-lg font-display font-bold mb-0.5 ${
                      grade === 'A' || grade === 'B' ? 'text-green-600' :
                      grade === 'C' ? 'text-yellow-600' : 'text-error'
                    }`}>({grade})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="catatan" className="block text-sm font-medium text-on-surface mb-2">
                Catatan Evaluasi Akhir (Opsional)
              </label>
              <textarea
                id="catatan"
                rows={3}
                value={data.catatan}
                onChange={(e) => handleScoreChange('catatan', e.target.value)}
                placeholder="Berikan masukan menyeluruh atas hasil kerja praktik mahasiswa..."
                className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
              ></textarea>
              {errors.catatan && <p className="text-error text-xs mt-1">{errors.catatan}</p>}
            </div>

            <div className="flex items-center gap-3 bg-secondary-container/30 border border-secondary-container p-4 rounded-xl mb-6">
              <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center shrink-0">
                <ScanLine className="w-5 h-5" />
              </div>
              <div className="text-xs text-on-surface-variant leading-relaxed">
                <span className="font-semibold block text-on-surface">Otentikasi Digital</span>
                Dengan menyimpan penilaian ini, saya sebagai dosen pembimbing yang sah memberikan keputusan nilai secara final dan dapat dipertanggungjawabkan.
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
                disabled={processing || data.sistematika === '' || data.kedalaman === '' || data.penguasaan === '' || data.presentasi === ''}
                className="px-6 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <Upload size={16} />
                {processing ? 'Menyimpan...' : 'Simpan Nilai'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

GradingScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;
