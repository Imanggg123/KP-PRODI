<?php

namespace App\Http\Controllers\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProdiVerifikasiController extends Controller
{
    public function index(): Response
    {
        $pendaftarans = Pendaftaran::with([
            'mahasiswa',
            'instansi',
            'dokumenPendaftarans',
        ])
        // ->whereIn('status', ['diajukan', 'menunggu_verifikasi', 'pending'])
        ->where('status', '!=', 'draft') // Menangkap semua status kecuali draft
        ->latest()
        ->get();

        return Inertia::render('Prodi/Verifikasi/Index', [
            'pendaftarans' => $pendaftarans,
        ]);
    }

    public function approve(Pendaftaran $pendaftaran)
    {
        $pendaftaran->update([
            'status' => 'plotting_dosen', // Langsung dilempar ke antrean dosen pembimbing
            'diverifikasi_oleh' => auth()->id(),
            'diverifikasi_pada' => now(),
        ]);

        return back()->with(
            'success',
            'Pendaftaran berhasil disetujui dan masuk antrean pembagian Dosbing.'
        );
    }

    public function reject(Request $request, Pendaftaran $pendaftaran)
    {
        $request->validate([
            'catatan_tu' => 'required' // Still saving to catatan_tu to avoid migration, or we can use it as general notes. Wait, I should use catatan_tu as is.
        ]);

        $pendaftaran->update([
            'status' => 'perlu_perbaikan',
            'catatan_tu' => $request->catatan_tu,
        ]);

        return back()->with(
            'success',
            'Pengajuan dikembalikan.'
        );
    }
}