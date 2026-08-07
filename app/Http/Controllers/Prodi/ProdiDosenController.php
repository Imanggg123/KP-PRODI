<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\KuotaDosen;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ProdiDosenController extends Controller
{
    /**
     * Menampilkan daftar dosen dan kuota bimbingannya.
     */
    public function index()
    {
        // Ambil semua user dengan role dosen
        $dosens = User::where('role', 'dosen')
            ->orderBy('name')
            ->get()
            ->map(function ($dosen) {
                // Ambil batas maksimal kuota (default 10 jika belum diatur)
                $kuotaMax = 10;
                $kuotaModel = KuotaDosen::where('dosen_id', $dosen->id)->first();
                if ($kuotaModel) {
                    $kuotaMax = $kuotaModel->kuota_max;
                }

                // Hitung mahasiswa yang sedang aktif dibimbing oleh dosen ini (tidak termasuk yang sudah selesai/lulus/batal)
                // Misalnya: pendaftaran yang disetujui tapi belum selesai
                $mahasiswaDibimbing = Pendaftaran::where('dosen_pembimbing_id', $dosen->id)
                    ->whereIn('status', ['diverifikasi', 'diterima_prodi', 'surat_terbit', 'diterima_instansi', 'aktif'])
                    ->count();

                return [
                    'id' => $dosen->id,
                    'name' => $dosen->name,
                    'email' => $dosen->email,
                    'kuota_max' => $kuotaMax,
                    'mahasiswa_dibimbing' => $mahasiswaDibimbing,
                ];
            });

        return Inertia::render('Prodi/QuotaManagement', [
            'dosens' => $dosens
        ]);
    }

    /**
     * Menampilkan daftar master data dosen untuk halaman LecturerDatabase.
     */
    public function lecturerDatabase()
    {
        $dosens = User::where('role', 'dosen')
            ->orderBy('name')
            ->get()
            ->map(function ($dosen) {
                $kuotaModel = KuotaDosen::where('dosen_id', $dosen->id)->first();
                $kuotaMax = $kuotaModel ? $kuotaModel->kuota_max : 10;
                $keahlian = $kuotaModel ? $kuotaModel->keahlian : 'Umum';

                // Hitung mahasiswa aktif
                $bimbinganAktif = Pendaftaran::where('dosen_pembimbing_id', $dosen->id)
                    ->whereIn('status', ['aktif', 'diterima_instansi', 'verifikasi_surat_balasan', 'plotting_dosen'])
                    ->count();
                    
                return [
                    'id' => substr($dosen->name, 0, 2), // generate simple ID for UI color coding
                    'name' => $dosen->name,
                    'nip' => $dosen->nip ?? 'NIP Belum Diatur',
                    'field' => $keahlian,
                    'quota' => $bimbinganAktif . ' / ' . $kuotaMax,
                    'status' => 'Aktif',
                    'statusStyle' => 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]',
                    'indicatorColor' => $bimbinganAktif >= $kuotaMax ? 'bg-error' : 'bg-primary'
                ];
            });

        return Inertia::render('Prodi/LecturerDatabase', [
            'lecturers' => $dosens
        ]);
    }

    /**
     * Memperbarui batas maksimal kuota dosen.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'kuota_max' => 'required|integer|min:1|max:50',
        ]);

        $dosen = User::where('role', 'dosen')->findOrFail($id);

        KuotaDosen::updateOrCreate(
            ['dosen_id' => $dosen->id],
            [
                'kuota_max' => $request->kuota_max,
                // Kolom lain seperti periode/keahlian bisa diset default jika required
                'periode' => date('Y'), 
            ]
        );

        return back()->with('success', 'Batas kuota bimbingan untuk ' . $dosen->name . ' berhasil diperbarui.');
    }
}
