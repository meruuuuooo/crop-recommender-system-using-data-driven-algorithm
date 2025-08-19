import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import FarmerTable from './partials/farmerTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: 'management/farmer',
    },
];

type Farmer = {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    contact_number: string;
    farming_experience: string | null;
    registration_date: string;
    location: {
        street: string;
        province: {
            id: number | string;
            name: string;
            region_code: string;
        };
        municipality: {
            id: number | string;
            name: string;
            province_id: number | string;
        };
        barangay: {
            id: number | string;
            name: string;
            municipality_id: number | string;
        };
    };
    user: {
        last_name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
};

export default function Farmer({ farmers }: { farmers: { data: Farmer[] } }) {
    const handleView = (farmer: Farmer) => {
        router.get(route('management.farmer.show', farmer.id))
    };

    const handleEdit = (farmer: Farmer) => {
        router.get(route('management.farmer.edit', farmer.id));
    };

    // const handleDelete = (farmer: Farmer) => {
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: `Do you want to delete ${farmer.first_name} ${farmer.last_name}? This action cannot be undone!`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#dc2626',
    //         cancelButtonColor: '#619154',
    //         confirmButtonText: 'Yes, delete!',
    //         cancelButtonText: 'Cancel',
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             router.delete(route('management.farmer.destroy', farmer.id), {
    //                 onSuccess: () => {
    //                     Swal.fire({
    //                         title: 'Deleted!',
    //                         text: 'Farmer has been deleted successfully.',
    //                         icon: 'success',
    //                         confirmButtonColor: '#619154',
    //                     });
    //                 },
    //                 onError: () => {
    //                     Swal.fire({
    //                         title: 'Error!',
    //                         text: 'Failed to delete farmer.',
    //                         icon: 'error',
    //                         confirmButtonColor: '#dc2626',
    //                     });
    //                 },
    //             });
    //         }
    //     });
    // };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Farmer Management" description="Manage farmer details and information." />
                        <Link href={route('management.farmer.create')}>
                            <Button className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43]">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Farmer
                            </Button>
                        </Link>
                    </div>

                    {/* Farmer Table */}
                    <FarmerTable farmers={farmers.data} onView={handleView} onEdit={handleEdit} />
                </div>
            </div>
        </AppLayout>
    );
}
