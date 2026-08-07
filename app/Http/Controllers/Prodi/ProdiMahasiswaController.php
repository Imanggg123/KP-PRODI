<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Inertia\Inertia;

class ProdiMahasiswaController extends Controller
{
    public function index()
    {
        $students = Pendaftaran::with('mahasiswa')
            ->where('status', '!=', 'draft')
            ->get()
            ->map(function ($p) {
                // Konversi status pendaftaran menjadi status tampilan (Sedang KP / Selesai KP)
                $statusTampil = ($p->status === 'selesai') ? 'Selesai KP' : 'Sedang KP';
                
                return [
                    'nim' => $p->mahasiswa->nim ?? '-',
                    'name' => $p->mahasiswa->name ?? 'Mahasiswa',
                    'semester' => 'Ganjil/Genap', // Bisa diambil dari konfigurasi periode jika ada
                    'status' => $statusTampil,
                ];
            });

        return Inertia::render('Prodi/Students', [
            'initialStudents' => $students
        ]);
    }
}
