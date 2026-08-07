import InstansiLayout from '@/Layouts/InstansiLayout';
import { Users, FileText, CheckCircle2, Building2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface Stats {
  pendaftarBaru: number;
  aktif: number;
  selesai: number;
}

interface Props {
  stats: Stats;
  error?: string;
}

export default function DashboardScreen({ stats, error }: Props) {
  const { props } = usePage();
  const user = (props as any).auth?.user;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Building2 size={64} className="text-error" />
        <h2 className="text-xl font-display font-semibold text-on-surface">Profil Instansi Belum Diatur</h2>
        <p className="text-secondary text-center max-w-md">Akun Anda belum dikaitkan dengan profil instansi. Harap hubungi administrator untuk menghubungkan akun ini dengan data perusahaan Anda.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-on-surface">Dasbor Mitra Instansi</h1>
          <p className="text-sm text-on-surface-variant mt-1">Selamat datang kembali, {user?.name}. Berikut ringkasan program Kerja Praktik di instansi Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-lowest p-6 rounded-xl border border-error-container shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Users size={100} />
          </div>
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-bold text-error uppercase tracking-wider">Menunggu Persetujuan</span>
            <div className="p-2 bg-error-container text-error rounded-lg">
              <FileText size={20} />
            </div>
          </div>
          <span className="text-4xl font-display text-on-surface font-bold mt-2 z-10">{stats.pendaftarBaru}</span>
          <span className="text-xs text-on-surface-variant mt-2 font-medium z-10">Pendaftar Baru</span>
        </div>

        <div className="bg-surface-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Users size={100} />
          </div>
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Sedang Berlangsung</span>
            <div className="p-2 bg-primary-container text-primary rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <span className="text-4xl font-display text-on-surface font-bold mt-2 z-10">{stats.aktif}</span>
          <span className="text-xs text-on-surface-variant mt-2 font-medium z-10">Mahasiswa Magang Aktif</span>
        </div>

        <div className="bg-surface-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <CheckCircle2 size={100} />
          </div>
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Telah Selesai</span>
            <div className="p-2 bg-tertiary-container text-tertiary rounded-lg">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <span className="text-4xl font-display text-on-surface font-bold mt-2 z-10">{stats.selesai}</span>
          <span className="text-xs text-on-surface-variant mt-2 font-medium z-10">Mahasiswa Selesai Magang</span>
        </div>
      </div>
    </div>
  );
}

DashboardScreen.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
