import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import { ArrowLeft, Save } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        tanggal: "",
        jam_mulai: "",
        jam_selesai: "",
        deskripsi: "",
        foto: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("mahasiswa.logbook.store"));
    };

    return (
        <>
            <Head title="Tambah Logbook" />

            <div className="max-w-4xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Tambah Logbook
                        </h1>

                        <p className="text-gray-500">
                            Tambahkan aktivitas harian Kerja Praktik.
                        </p>
                    </div>

                    <Link
                        href={route("mahasiswa.logbook")}
                        className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100"
                    >
                        <ArrowLeft size={18}/>
                        Kembali
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl border shadow-sm p-6 space-y-6"
                >

                    <div>
                        <label className="block font-medium mb-2">
                            Tanggal
                        </label>

                        <input
                            type="date"
                            value={data.tanggal}
                            onChange={(e)=>setData("tanggal",e.target.value)}
                            className="w-full border rounded-lg p-3"
                        />

                        <p className="text-red-500 text-sm">
                            {errors.tanggal}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="block font-medium mb-2">
                                Jam Mulai
                            </label>

                            <input
                                type="time"
                                value={data.jam_mulai}
                                onChange={(e)=>setData("jam_mulai",e.target.value)}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-2">
                                Jam Selesai
                            </label>

                            <input
                                type="time"
                                value={data.jam_selesai}
                                onChange={(e)=>setData("jam_selesai",e.target.value)}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                    </div>

                    <div>

                        <label className="block font-medium mb-2">
                            Deskripsi Kegiatan
                        </label>

                        <textarea
                            rows={6}
                            value={data.deskripsi}
                            onChange={(e)=>setData("deskripsi",e.target.value)}
                            className="w-full border rounded-lg p-3"
                        />

                        <p className="text-red-500 text-sm">
                            {errors.deskripsi}
                        </p>

                    </div>

                    <div>

                        <label className="block font-medium mb-2">
                            Dokumentasi
                        </label>

                        <input
                            type="file"
                            onChange={(e)=>
                                setData(
                                    "foto",
                                    e.target.files
                                        ? e.target.files[0]
                                        : null
                                )
                            }
                        />

                    </div>

                    <div className="flex justify-end">

                        <button
                            disabled={processing}
                            className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2"
                        >
                            <Save size={18}/>
                            Simpan
                        </button>

                    </div>

                </form>

            </div>

        </>
    );
}

Create.layout = (page: React.ReactNode) => (
    <MahasiswaLayout>{page}</MahasiswaLayout>
);