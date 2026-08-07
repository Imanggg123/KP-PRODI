<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\Logbook;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class InstansiLogbookController extends Controller
{
    /**
     * Menampilkan daftar entri logbook khusus untuk instansi.
     */
    public function index()
    {
        $user = Auth::user();
        $instansi = $user->instansi;

        if (!$instansi) {
            return Inertia::render('Instansi/Logbook', [
                'logbooks' => []
            ])->with('error', 'Profil instansi belum diatur.');
        }

        // Ambil ID pendaftaran mahasiswa yang magang di instansi ini dan status pendaftarannya sedang aktif atau selesai
        $pendaftaranIds = Pendaftaran::where('instansi_id', $instansi->id)
            ->whereIn('status', ['aktif', 'selesai'])
            ->pluck('id');

        // Ambil entri logbook dari pendaftaran tersebut
        $logbooks = Logbook::with(['pendaftaran.mahasiswa'])
            ->whereIn('pendaftaran_id', $pendaftaranIds)
            // Prioritaskan yang menunggu divalidasi instansi, lalu urutkan berdasarkan tanggal
            ->orderByRaw("FIELD(status_instansi, 'menunggu') DESC")
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(function ($logbook) {
                return [
                    'id' => $logbook->id,
                    'mahasiswa' => $logbook->pendaftaran->mahasiswa,
                    'tanggal' => $logbook->tanggal->format('Y-m-d'),
                    'jam_mulai' => $logbook->jam_mulai,
                    'jam_selesai' => $logbook->jam_selesai,
                    'deskripsi' => $logbook->deskripsi,
                    'path_foto' => $logbook->path_foto,
                    'status_instansi' => $logbook->status_instansi,
                    'catatan_instansi' => $logbook->catatan_instansi,
                ];
            });

        return Inertia::render('Instansi/Logbook', [
            'logbooks' => $logbooks
        ]);
    }

    /**
     * Memproses validasi logbook dari pembimbing lapangan.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'status_instansi' => 'required|in:disetujui,revisi',
            'catatan_instansi' => 'nullable|string',
        ]);

        $user = Auth::user();
        $instansi = $user->instansi;

        if (!$instansi) {
            return back()->with('error', 'Profil instansi belum diatur.');
        }

        $logbook = Logbook::whereHas('pendaftaran', function ($query) use ($instansi) {
            $query->where('instansi_id', $instansi->id);
        })->findOrFail($id);

        $logbook->update([
            'status_instansi' => $request->status_instansi,
            'catatan_instansi' => $request->catatan_instansi,
        ]);

        $message = $request->status_instansi === 'disetujui'
            ? 'Kegiatan harian berhasil disetujui.'
            : 'Kegiatan harian membutuhkan revisi.';

        return back()->with('success', $message);
    }
}
