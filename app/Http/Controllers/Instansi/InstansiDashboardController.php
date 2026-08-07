<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InstansiDashboardController extends Controller
{
    /**
     * Menampilkan dasbor instansi dengan statistik riil.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Pastikan user memiliki profil instansi
        $instansi = $user->instansi;

        if (!$instansi) {
            return Inertia::render('Instansi/Dashboard', [
                'stats' => [
                    'pendaftarBaru' => 0,
                    'aktif' => 0,
                    'selesai' => 0
                ]
            ])->with('error', 'Profil instansi belum diatur.');
        }

        // Hitung statistik dari tabel pendaftarans yang memilih instansi ini
        $pendaftarBaru = Pendaftaran::where('instansi_id', $instansi->id)
            ->where('status', 'surat_terbit') // Status menunggu konfirmasi instansi
            ->count();

        $aktif = Pendaftaran::where('instansi_id', $instansi->id)
            ->whereIn('status', ['diterima_instansi', 'verifikasi_surat_balasan', 'plotting_dosen', 'aktif'])
            ->count();

        $selesai = Pendaftaran::where('instansi_id', $instansi->id)
            ->where('status', 'selesai')
            ->count();

        return Inertia::render('Instansi/Dashboard', [
            'stats' => [
                'pendaftarBaru' => $pendaftarBaru,
                'aktif' => $aktif,
                'selesai' => $selesai
            ]
        ]);
    }
}
