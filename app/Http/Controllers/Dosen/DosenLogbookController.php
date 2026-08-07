<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Logbook;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class DosenLogbookController extends Controller
{
    /**
     * Menampilkan daftar logbook mahasiswa bimbingan.
     */
    public function index()
    {
        $dosenId = Auth::id();

        // Ambil logbook yang berelasi dengan pendaftaran di mana dosen pembimbingnya adalah dosen yang login
        $logbooks = Logbook::with(['pendaftaran.mahasiswa'])
            ->whereHas('pendaftaran', function ($query) use ($dosenId) {
                $query->where('dosen_pembimbing_id', $dosenId);
            })
            ->orderByRaw("FIELD(status, 'menunggu') DESC") // Prioritaskan yang 'menunggu' di atas
            ->orderBy('tanggal', 'desc') // Lalu urutkan berdasarkan tanggal terbaru
            ->get();

        return Inertia::render('Dosen/Logbook', [
            'logbooks' => $logbooks
        ]);
    }

    /**
     * Menyimpan hasil validasi logbook dari dosen.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:disetujui,revisi',
            'catatan_dosen' => 'nullable|string',
        ]);

        $logbook = Logbook::whereHas('pendaftaran', function ($query) {
            $query->where('dosen_pembimbing_id', Auth::id());
        })->findOrFail($id);

        $logbook->update([
            'status' => $request->status,
            'catatan_dosen' => $request->catatan_dosen,
            'divalidasi_oleh' => Auth::id(),
            'divalidasi_pada' => now(),
        ]);

        return back()->with('success', 'Validasi logbook berhasil disimpan.');
    }
}
