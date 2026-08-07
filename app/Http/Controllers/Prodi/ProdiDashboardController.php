<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Instansi;
use Inertia\Inertia;

class ProdiDashboardController extends Controller
{
    /**
     * Menampilkan dasbor untuk role Prodi dengan statistik global.
     */
    public function index()
    {
        // 1. Total Mahasiswa (Role 'mahasiswa')
        $totalMahasiswa = User::where('role', 'mahasiswa')->count();

        // 2. Total Dosen Pembimbing Aktif (Role 'dosen')
        $totalDosen = User::where('role', 'dosen')->count();

        // 3. Total Instansi Mitra
        $totalInstansi = Instansi::count();

        return Inertia::render('Prodi/Dashboard', [
            'stats' => [
                'total_mahasiswa' => $totalMahasiswa,
                'total_dosen' => $totalDosen,
                'total_instansi' => $totalInstansi,
            ]
        ]);
    }
}
