import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CreateFarmForm from './partials/createFarmForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farm Management',
        href: '/management/farm',
    },
    {
        title: 'Create Farm',
        href: '/management/farm/create',
    },
];

type CreateFarmProps = {
    farmers: {
        id: number | string;
        first_name: string;
        middle_name: string;
        last_name: string;
    }[];
    provinces: {
        id: number | string;
        name: string;
        region_code: number | string;
    }[];
    municipalities: {
        id: number | string;
        name: string;
        province_id: number | string;
    }[];
    barangays: {
        id: number | string;
        name: string;
        municipality_id: number | string;
    }[];
};


export default function Create({ farmers, provinces, municipalities, barangays }: CreateFarmProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Farm" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="Create Farm" description="Create a new farm record." />
                    <CreateFarmForm farmers={farmers} provinces={provinces} municipalities={municipalities} barangays={barangays} />
                </div>
            </div>
        </AppLayout>
    );
}
