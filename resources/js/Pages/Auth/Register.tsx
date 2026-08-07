import { FormEventHandler, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { User, Lock, Mail, CreditCard, LogIn, UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        nim: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registrasi Akun Mahasiswa" />
            <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-950 font-sans">
                
                {/* 1. Glowing Radial Gradients (Mesh Background) */}
                <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-blue-600/25 to-cyan-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-600/20 to-purple-500/5 blur-[140px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

                {/* 2. Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

                {/* Main Content Container */}
                <div className="w-full max-w-[500px] space-y-6 relative z-10">
                    
                    {/* Portal Header */}
                    <div className="text-center space-y-3">
                        <div className="flex justify-center">
                            <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105">
                                <img src="/images/Logo UTM terbaru_berwarna (1).png" alt="Logo UTM" className="w-16 h-16 object-contain" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-100 tracking-tight sm:text-3xl">
                                Registrasi Mahasiswa
                            </h1>
                            <p className="text-xs text-blue-400 font-bold tracking-widest uppercase">
                                Sistem Informasi Kerja Praktik
                            </p>
                        </div>
                    </div>

                    {/* Register Card */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-100">
                        <div className="space-y-1.5 text-center mb-8">
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Buat Akun Baru</h2>
                            <p className="text-sm text-slate-400 font-semibold">Isi data diri Anda dengan benar</p>
                        </div>

                        <form className="space-y-4" onSubmit={submit}>
                            {/* Name Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="name">
                                    Nama Lengkap
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="name"
                                        name="name"
                                        placeholder="Contoh: Budi Santoso"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                                {errors.name && <p className="text-[11px] font-semibold text-red-500 mt-1 pl-1">{errors.name}</p>}
                            </div>

                            {/* NIM Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="nim">
                                    NIM (Nomor Induk Mahasiswa)
                                </label>
                                <div className="relative group">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.nim ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="nim"
                                        name="nim"
                                        placeholder="Contoh: 210411100xxx"
                                        value={data.nim}
                                        onChange={(e) => setData('nim', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.nim && <p className="text-[11px] font-semibold text-red-500 mt-1 pl-1">{errors.nim}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="email">
                                    Alamat Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="email@student.utm.ac.id"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && <p className="text-[11px] font-semibold text-red-500 mt-1 pl-1">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Minimal 8 karakter"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                {errors.password && <p className="text-[11px] font-semibold text-red-500 mt-1 pl-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="password_confirmation">
                                    Konfirmasi Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-350 ${errors.password_confirmation ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="Ketik ulang password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                {errors.password_confirmation && <p className="text-[11px] font-semibold text-red-500 mt-1 pl-1">{errors.password_confirmation}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-bold transition-all duration-150 active:scale-[0.98] shadow-md flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                                >
                                    <span>{processing ? 'Memproses...' : 'Daftar Sekarang'}</span>
                                    <UserPlus className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm font-semibold text-slate-500">
                                Sudah punya akun?{' '}
                                <Link href={route('login')} className="text-blue-600 hover:text-blue-700 hover:underline">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Details */}
                <footer className="mt-8 text-center space-y-1 relative z-10">
                    <p className="text-[10px] text-slate-500 font-semibold">
                        © 2026 Teknik Informatika, Universitas Trunojoyo Madura.
                    </p>
                </footer>
            </main>
        </>
    );
}
