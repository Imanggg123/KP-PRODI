import React from "react";
import { Head, Link } from "@inertiajs/react";
import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import { Plus, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface Logbook {
    id: number;
    tanggal: string;
    jam_mulai: string | null;
    jam_selesai: string | null;
    deskripsi: string;
    status: "menunggu" | "disetujui" | "revisi";
    catatan_dosen?: string | null;
}

interface Props {
    pendaftaran: any;
    logbooks: Logbook[];
}

export default function Index({ pendaftaran, logbooks }: Props) {
    return (
        <>
            <Head title="Logbook Kerja Praktik" />

            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Logbook Kerja Praktik
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Catat seluruh aktivitas selama kerja praktik.
                        </p>
                    </div>

                    <Link
                        href="/mahasiswa/logbook/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90"
                    >
                        <Plus size={18} />
                        Tambah Logbook
                    </Link>
                </div>

                {/* Belum punya pendaftaran */}
                {!pendaftaran && (
                    <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-6">
                        <p className="font-semibold text-yellow-800">
                            Kamu belum memiliki data pendaftaran KP.
                        </p>

                        <p className="text-yellow-700 mt-2">
                            Silakan melakukan pendaftaran terlebih dahulu.
                        </p>
                    </div>
                )}

                {/* Sudah punya pendaftaran */}
                {pendaftaran && (
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

                        <table className="w-full">

                            <thead className="bg-gray-50">

                                <tr>
                                    <th className="px-5 py-3 text-left">Tanggal</th>
                                    <th className="px-5 py-3 text-left">Jam</th>
                                    <th className="px-5 py-3 text-left">Deskripsi</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                    <th className="px-5 py-3 text-left">Catatan Dosen</th>
                                </tr>

                            </thead>

                            <tbody>

                                {logbooks.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={5}
                                            className="text-center py-10 text-gray-500"
                                        >
                                            Belum ada logbook.
                                        </td>

                                    </tr>

                                ) : (

                                    logbooks.map((item) => (

                                        <tr
                                            key={item.id}
                                            className="border-t"
                                        >

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    {item.tanggal}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} />
                                                    {item.jam_mulai} - {item.jam_selesai}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                {item.deskripsi}
                                            </td>

                                            <td className="px-5 py-4">

                                                {item.status === "disetujui" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-700">
                                                        <CheckCircle2 size={16} />
                                                        Disetujui
                                                    </span>
                                                )}

                                                {item.status === "menunggu" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
                                                        <Clock size={16} />
                                                        Menunggu
                                                    </span>
                                                )}

                                                {item.status === "revisi" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-red-700">
                                                        <AlertCircle size={16} />
                                                        Revisi
                                                    </span>
                                                )}

                                            </td>

                                            <td className="px-5 py-4">
                                                {item.catatan_dosen ?? "-"}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <MahasiswaLayout>{page}</MahasiswaLayout>
);