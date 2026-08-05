<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Logbook;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MahasiswaLogbookController extends Controller
{
    public function index()
    {
        $pendaftaran = Pendaftaran::where('mahasiswa_id', Auth::id())
            ->latest()
            ->first();

        $logbooks = collect();

        if ($pendaftaran) {
            $logbooks = Logbook::where('pendaftaran_id', $pendaftaran->id)
                ->latest('tanggal')
                ->get();
        }

        return Inertia::render('Mahasiswa/Logbook/Index', [
            'pendaftaran' => $pendaftaran,
            'logbooks' => $logbooks,
        ]);
    }
    
    public function create()
    {
        return Inertia::render('Mahasiswa/Logbook/Create');
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => ['required', 'date'],
            'jam_mulai' => ['nullable'],
            'jam_selesai' => ['nullable'],
            'deskripsi' => ['required', 'string'],
            'foto' => ['nullable', 'image', 'max:2048'],
        ]);

        $pendaftaran = Pendaftaran::where('mahasiswa_id', Auth::id())
            ->latest()
            ->first();

        if (!$pendaftaran) {
            return back()->with('error', 'Data pendaftaran tidak ditemukan.');
        }

        $pathFoto = null;

        if ($request->hasFile('foto')) {
            $pathFoto = $request->file('foto')->store('logbook', 'public');
        }

        Logbook::create([
            'pendaftaran_id' => $pendaftaran->id,
            'tanggal' => $request->tanggal,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'deskripsi' => $request->deskripsi,
            'path_foto' => $pathFoto,
            'status' => 'menunggu',
        ]);

        return redirect()
            ->route('mahasiswa.logbook')
            ->with('success', 'Logbook berhasil ditambahkan.');
    }
}