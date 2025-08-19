import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import FarmTable from './partials/farmTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farm Management',
        href: 'management/farm',
    },
];

type Farm = {
    id: number | string;
    name: string;
    total_area: number;
    prev_crops: string;
    location: {
        id: number;
        street: string;
        province: {
            id: number | string;
            name: string;
            region_code: string;
        },
        municipality: {
            id: number | string;
            province_id: number | string;
            name: string;
        },
        barangay: {
            id: number | string;
            municipality_id: number | string;
            name: string;
        }
    }
    farmer: {
        id: number | string;
        first_name: string;
        last_name: string;
        middle_name: string;
        contact_number: string;
    }
    created_at: string;
    updated_at: string;
};


export default function Farm({ farms }: { farms: { data: Farm[] } }) {

    const handleView = (farm: Farm) => {
        router.get(route('management.farm.show', farm.id))
    };

    const handleEdit = (farm: Farm) => {
        router.get(route('management.farm.edit', farm.id))
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Farm" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Farm Management" description="Manage farm details and information." />
                        <Link href={route('management.farm.create')}>
                            <Button className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43]">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Farm
                            </Button>
                        </Link>
                    </div>

                    <FarmTable
                        farms={farms.data} onView={handleView} onEdit={handleEdit}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
