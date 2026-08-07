import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import DosenLayout from '@/Layouts/DosenLayout';
import InstansiLayout from '@/Layouts/InstansiLayout';
import TULayout from '@/Layouts/TULayout';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { ComponentType, PropsWithChildren } from 'react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    let Layout: ComponentType<PropsWithChildren<any>> = AuthenticatedLayout;
    
    if (user.role === 'mahasiswa') {
        Layout = MahasiswaLayout;
    } else if (user.role === 'dosen') {
        Layout = DosenLayout;
    } else if (user.role === 'instansi') {
        Layout = InstansiLayout;
    } else if (user.role === 'tu') {
        Layout = TULayout;
    } else if (user.role === 'prodi') {
        Layout = ProdiLayout;
    }

    const RoleSpecificInfo = () => {
        if (!user.role) return null;
        
        return (
            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 border border-outline-variant">
                <section>
                    <header>
                        <h2 className="text-lg font-medium text-gray-900 capitalize">Informasi Peran ({user.role})</h2>
                        <p className="mt-1 text-sm text-gray-600">Data spesifik yang terkait dengan akun Anda di sistem.</p>
                    </header>
                    <div className="mt-6 space-y-4">
                        {user.role === 'mahasiswa' && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Nomor Induk Mahasiswa (NIM)</p>
                                <p className="text-base text-gray-900 font-semibold">{user.nim || '-'}</p>
                            </div>
                        )}
                        {(user.role === 'dosen' || user.role === 'prodi' || user.role === 'tu') && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">NIP</p>
                                <p className="text-base text-gray-900 font-semibold">{user.nip || '-'}</p>
                            </div>
                        )}
                        {user.role === 'instansi' && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">ID Instansi</p>
                                <p className="text-base text-gray-900 font-semibold">{user.id}</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        );
    };

    const content = (
        <>
            <Head title="Profil Saya" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <RoleSpecificInfo />
                    
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 border border-outline-variant">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 border border-outline-variant">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 border border-error/20">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </>
    );

    if (Layout === AuthenticatedLayout) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Profil Saya
                    </h2>
                }
            >
                {content}
            </AuthenticatedLayout>
        );
    }

    return <Layout>{content}</Layout>;
}
