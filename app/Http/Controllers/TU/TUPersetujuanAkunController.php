<?php

namespace App\Http\Controllers\TU;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class TUPersetujuanAkunController extends Controller
{
    /**
     * Display a list of pending accounts (optional if TU has a UI for it).
     */
    public function index()
    {
        // This is a placeholder. If there's an Inertia page for this, it would return it.
        // For now, we are just returning the pending users as JSON or rendering a stub.
        $pendingUsers = User::where('status_akun', 'pending')->get();
        return response()->json($pendingUsers);
    }

    /**
     * Approve a pending account, changing status to 'aktif'.
     */
    public function approve(Request $request, User $user): RedirectResponse
    {
        if ($user->status_akun !== 'pending') {
            return back()->with('error', 'Akun ini tidak dalam status pending.');
        }

        $user->update([
            'status_akun' => 'aktif'
        ]);

        return back()->with('success', 'Akun berhasil disetujui (diaktifkan).');
    }
    
    /**
     * Reject a pending account.
     */
    public function reject(Request $request, User $user): RedirectResponse
    {
        if ($user->status_akun !== 'pending') {
            return back()->with('error', 'Akun ini tidak dalam status pending.');
        }

        $user->update([
            'status_akun' => 'ditolak'
        ]);

        return back()->with('success', 'Akun telah ditolak.');
    }
}
