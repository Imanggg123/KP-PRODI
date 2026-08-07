import ProdiLayout from '@/Layouts/ProdiLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Settings, Search, Users, AlertCircle, TrendingUp, Edit2 } from 'lucide-react';
import Modal from '@/Components/Modal';

interface Dosen {
  id: number;
  name: string;
  email: string;
  kuota_max: number;
  mahasiswa_dibimbing: number;
}

interface Props {
  dosens: Dosen[];
}

export default function QuotaManagement({ dosens }: Props) {
  const [search, setSearch] = useState('');
  const [selectedDosen, setSelectedDosen] = useState<Dosen | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, put, processing, reset, errors } = useForm({
    kuota_max: 10,
  });

  const filteredDosens = dosens.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalKapasitas = dosens.reduce((acc, curr) => acc + curr.kuota_max, 0);
  const totalTerisi = dosens.reduce((acc, curr) => acc + curr.mahasiswa_dibimbing, 0);
  const persentaseGlobal = totalKapasitas > 0 ? (totalTerisi / totalKapasitas) * 100 : 0;

  const openModal = (dosen: Dosen) => {
    setSelectedDosen(dosen);
    setData('kuota_max', dosen.kuota_max);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedDosen(null);
      reset();
    }, 200);
  };

  const submitQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDosen) return;

    put(route('prodi.quota.update', selectedDosen.id), {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Manajemen Kuota Dosen</h1>
          <p className="text-on-surface-variant mt-1">Pantau dan atur batas maksimal bimbingan untuk setiap dosen pembimbing.</p>
        </div>
      </div>

      {/* Global Quota Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-lowest rounded-2xl border border-outline-variant shadow-sm p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-on-surface flex items-center gap-2"><TrendingUp size={18} className="text-primary"/> Tingkat Keterisian Global</h3>
            <span className="text-sm font-bold text-primary">{persentaseGlobal.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-surface-variant rounded-full h-4 mb-2 overflow-hidden">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ${
                persentaseGlobal > 90 ? 'bg-error' : persentaseGlobal > 75 ? 'bg-warning' : 'bg-primary'
              }`} 
              style={{ width: `${Math.min(persentaseGlobal, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>{totalTerisi} Mahasiswa Terploting</span>
            <span>Kapasitas Maks: {totalKapasitas}</span>
          </div>
        </div>

        <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 flex flex-col items-start justify-center">
          <div className="p-3 bg-on-primary-container/10 rounded-xl mb-3">
            <Users size={24} />
          </div>
          <div className="text-3xl font-display font-bold mb-1">{dosens.length}</div>
          <div className="text-sm font-medium opacity-90">Total Dosen Pembimbing Aktif</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input 
              type="text"
              placeholder="Cari nama dosen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant text-sm font-medium">
                <th className="py-4 px-5">Nama Dosen</th>
                <th className="py-4 px-5">Beban Bimbingan (Saat Ini)</th>
                <th className="py-4 px-5 text-center">Batas Kuota</th>
                <th className="py-4 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredDosens.map((dosen) => {
                const percentage = dosen.kuota_max > 0 ? (dosen.mahasiswa_dibimbing / dosen.kuota_max) * 100 : 0;
                const isOverloaded = percentage >= 100;
                const isWarning = percentage >= 80 && !isOverloaded;

                return (
                  <tr key={dosen.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="py-4 px-5 align-middle">
                      <div className="font-medium text-on-surface flex items-center gap-2">
                        {dosen.name}
                        {isOverloaded && <AlertCircle size={14} className="text-error" title="Kuota Penuh" />}
                      </div>
                      <div className="text-sm text-secondary">{dosen.email}</div>
                    </td>
                    <td className="py-4 px-5 align-middle w-1/3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-on-surface">{dosen.mahasiswa_dibimbing} Mahasiswa</span>
                        <span className="text-secondary">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-surface-variant rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            isOverloaded ? 'bg-error' : isWarning ? 'bg-warning' : 'bg-primary'
                          }`} 
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-4 px-5 align-middle text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-highest font-bold text-on-surface">
                        {dosen.kuota_max}
                      </div>
                    </td>
                    <td className="py-4 px-5 align-middle text-center">
                      <button 
                        onClick={() => openModal(dosen)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-outline text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <Edit2 size={16} /> Atur Kuota
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredDosens.length === 0 && (
             <div className="p-12 text-center text-secondary">
               Tidak ada dosen pembimbing yang ditemukan.
             </div>
          )}
        </div>
      </div>

      <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
        <form onSubmit={submitQuota} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-on-surface">Atur Kuota Dosen</h2>
          </div>

          {selectedDosen && (
            <div className="mb-6">
              <div className="text-sm text-secondary mb-1">Nama Dosen</div>
              <div className="font-medium text-on-surface bg-surface-container-lowest p-3 border border-outline-variant rounded-lg">
                {selectedDosen.name}
              </div>
            </div>
          )}

          <div className="mb-8">
            <label htmlFor="kuota_max" className="block text-sm font-semibold text-on-surface mb-2">
              Batas Maksimal Mahasiswa Bimbingan
            </label>
            <div className="flex items-center gap-4">
              <input
                id="kuota_max"
                type="number"
                min="1"
                max="50"
                value={data.kuota_max}
                onChange={(e) => setData('kuota_max', parseInt(e.target.value))}
                className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-lg text-center font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <div className="text-sm text-secondary whitespace-nowrap">
                Mahasiswa / Periode
              </div>
            </div>
            {errors.kuota_max && <p className="text-error text-xs mt-2">{errors.kuota_max}</p>}
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
              className="px-6 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <Settings size={16} /> {processing ? 'Menyimpan...' : 'Simpan Kuota'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

QuotaManagement.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
