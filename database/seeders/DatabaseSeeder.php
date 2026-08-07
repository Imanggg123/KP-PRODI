<?php

namespace Database\Seeders;

use App\Models\ProgramStudi;
use App\Models\User;
use App\Models\PeriodeKp;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Setup Program Studi
        $prodiData = [
            ['nama' => 'Teknik Informatika', 'kode' => 'TI', 'fakultas' => 'Fakultas Ilmu Komputer'],
            ['nama' => 'Sistem Informasi', 'kode' => 'SI', 'fakultas' => 'Fakultas Ilmu Komputer'],
            ['nama' => 'Teknik Elektro', 'kode' => 'TE', 'fakultas' => 'Fakultas Teknik'],
            ['nama' => 'Teknik Industri', 'kode' => 'TIN', 'fakultas' => 'Fakultas Teknik'],
            ['nama' => 'Manajemen Informatika', 'kode' => 'MI', 'fakultas' => 'Fakultas Ilmu Komputer'],
        ];

        foreach ($prodiData as $p) {
            ProgramStudi::create($p);
        }

        $prodiId = ProgramStudi::where('kode', 'TI')->first()->id ?? 1;

        // 2. Setup Periode KP
        PeriodeKp::create([
            'semester' => 'Gasal 2026/2027',
            'tanggal_pendaftaran' => '2026-07-26',
            'tanggal_batas_pendaftaran' => '2026-12-01',
            'tanggal_batas_pengajuan_surat' => '2026-12-01',
        ]);

        // 3. Setup Hardcoded Users (TU & Dosen)
        $password = Hash::make('password');

        // Admin TU
        User::create([
            'name' => 'Admin TU',
            'email' => 'tu@admin.com',
            'password' => $password,
            'role' => 'tu',
            'status_akun' => 'aktif',
            'nip' => '198501012010',
        ]);

        // Dosen Pembimbing 1
        User::create([
            'name' => 'Rika Yunitarini',
            'email' => 'rika@dosen.com',
            'password' => $password,
            'role' => 'dosen',
            'status_akun' => 'aktif',
            'nip' => '198002022001',
            'program_studi_id' => $prodiId,
        ]);

        // Dosen Pembimbing 2
        User::create([
            'name' => 'Fifin',
            'email' => 'fifin@dosen.com',
            'password' => $password,
            'role' => 'dosen',
            'status_akun' => 'aktif',
            'nip' => '198203032002',
            'program_studi_id' => $prodiId,
        ]);

        // Koordinator Prodi
        User::create([
            'name' => 'Koordinator Prodi',
            'email' => 'prodi@sikp.test',
            'password' => $password,
            'role' => 'prodi',
            'status_akun' => 'aktif',
            'nip' => '197801012005',
            'program_studi_id' => $prodiId,
        ]);

        $this->command->info('✅ Database berhasil di-seed!');
        $this->command->info('- Program Studi & Periode KP (Created)');
        $this->command->info('- Tabel Mahasiswa (Kosong - Siap untuk uji coba pendaftaran real)');
        $this->command->info('- 1 Akun Admin TU (tu@admin.com) (Aktif)');
        $this->command->info('- 2 Akun Dosen (rika@dosen.com, fifin@dosen.com) (Aktif)');
    }
}
