<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\SuratPengantar;
use App\Models\NilaiAkhir;
use Inertia\Inertia;

class TUDashboardController extends Controller
{
    /**
     * Menampilkan dasbor untuk role TU dengan statistik nyata.
     */
    public function index()
    {
        // 1. Mahasiswa KP Aktif (Pendaftaran status 'aktif')
        $mahasiswaAktif = Pendaftaran::where('status', 'aktif')->count();

        // 2. Antrean Surat Pengantar
        // Bisa dihitung dari Pendaftaran yang statusnya 'diverifikasi' (siap dibuat suratnya)
        // atau yang berstatus 'diterima_prodi' tergantung workflow. Asumsikan 'diverifikasi'.
        $antreanSuratPengantar = Pendaftaran::where('status', 'diverifikasi')
            ->doesntHave('suratPengantar')
            ->count();
            
        // Atau jika surat pengantar sudah di-generate tapi menunggu persetujuan
        $suratMenunggu = SuratPengantar::whereNull('path_file')->count(); // atau kondisi lainnya

        // 3. Antrean Validasi Berita Acara (Lulus tapi Berita Acara belum disetujui)
        $antreanBeritaAcara = Pendaftaran::whereHas('nilaiAkhir', function($query) {
                $query->where('status', 'lulus');
            })
            ->whereDoesntHave('beritaAcara', function($query) {
                $query->where('status', 'disetujui');
            })
            ->count();

        return Inertia::render('TU/Dashboard', [
            'stats' => [
                'mahasiswa_aktif' => $mahasiswaAktif,
                'antrean_surat' => $antreanSuratPengantar + $suratMenunggu,
                'antrean_berita' => $antreanBeritaAcara,
            ]
        ]);
    }
}
