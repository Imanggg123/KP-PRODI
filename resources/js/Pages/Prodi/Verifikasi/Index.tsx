import ProdiLayout from '@/Layouts/ProdiLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';

interface Mahasiswa {
    id: number;
    name: string;
    nim: string;
    program_studi: string;
    ipk: string;
    total_sks: number;
}

interface Instansi {
    id: number;
    nama: string;
}

interface Pendaftaran {
    id: number;
    mahasiswa: Mahasiswa;
    instansi: Instansi;
    status: string;
}

interface Props {
    pendaftarans: Pendaftaran[];
}

export default function Index({ pendaftarans }: Props) {
    const { post, processing } = useForm();
    const [rejectCatatan, setRejectCatatan] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const approve = (id: number) => {
        router.post(`/prodi/verification/${id}/approve`, {}, {
            preserveScroll: true,
            onError: (errors) => {
                console.error("Error dari backend:", errors);
                alert("Gagal menyetujui, cek console!");
            }
        });
    };

    const reject = (id: number) => {
        if (!rejectCatatan) {
            alert('Catatan perbaikan harus diisi!');
            return;
        }
        
        router.post(`/prodi/verification/${id}/reject`, {
            catatan_tu: rejectCatatan
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedId(null);
                setRejectCatatan('');
            }
        });
    };

    return (
        <div className="animate-in fade-in duration-300">
            <Head title="Verifikasi Pendaftaran KP" />
            
            <div className="mb-8">
                <h1 className="text-3xl font-display font-semibold text-on-surface mb-2">Verifikasi Pengajuan Kerja Praktik</h1>
                <p className="text-on-surface-variant">Daftar antrean mahasiswa yang mengajukan pendaftaran Kerja Praktik.</p>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="p-4 font-semibold text-on-surface text-sm">No</th>
                                <th className="p-4 font-semibold text-on-surface text-sm">Nama Lengkap</th>
                                <th className="p-4 font-semibold text-on-surface text-sm">NIM</th>
                                <th className="p-4 font-semibold text-on-surface text-sm">IPK / SKS</th>
                                <th className="p-4 font-semibold text-on-surface text-sm">Instansi Tujuan</th>
                                <th className="p-4 font-semibold text-on-surface text-sm text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendaftarans.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                                        Tidak ada pengajuan yang menunggu verifikasi.
                                    </td>
                                </tr>
                            ) : (
                                pendaftarans.map((p, index) => (
                                    <tr key={p.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                                        <td className="p-4 text-sm text-on-surface">{index + 1}</td>
                                        <td className="p-4 text-sm font-medium text-on-surface">{p.mahasiswa?.name}</td>
                                        <td className="p-4 text-sm text-on-surface-variant">{p.mahasiswa?.nim}</td>
                                        <td className="p-4 text-sm text-on-surface">
                                            {p.mahasiswa?.ipk || '-'} / {p.mahasiswa?.total_sks || '-'} SKS
                                        </td>
                                        <td className="p-4 text-sm text-on-surface">{p.instansi?.nama}</td>
                                        <td className="p-4 text-sm flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => approve(p.id)}
                                                disabled={processing}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium text-xs"
                                                title="Setujui"
                                            >
                                                <Check size={16} /> Setujui
                                            </button>
                                            <button 
                                                onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-error/10 text-error hover:bg-error hover:text-white rounded-lg transition-colors font-medium text-xs"
                                                title="Tolak / Kembalikan"
                                            >
                                                <X size={16} /> Tolak
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reject Modal / Inline form for selected row */}
            {selectedId && (
                <div className="mt-6 p-6 bg-error/5 border border-error/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <h3 className="text-lg font-semibold text-error mb-2">Penolakan / Revisi Pengajuan</h3>
                    <p className="text-sm text-on-surface-variant mb-4">Berikan catatan perbaikan agar mahasiswa dapat memperbaiki berkasnya.</p>
                    
                    <textarea 
                        className="w-full border border-error/30 rounded-lg p-3 text-sm focus:border-error focus:ring-1 focus:ring-error outline-none mb-4 bg-white" 
                        placeholder="Contoh: SKS kurang dari 100, transkrip nilai tidak terbaca, dll."
                        rows={3}
                        value={rejectCatatan}
                        onChange={e => setRejectCatatan(e.target.value)}
                    ></textarea>
                    
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => { setSelectedId(null); setRejectCatatan(''); }}
                            className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-sm font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={() => reject(selectedId)}
                            className="px-4 py-2 bg-error text-white hover:bg-error/90 rounded-lg text-sm font-bold transition-colors"
                        >
                            Kirim Catatan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
