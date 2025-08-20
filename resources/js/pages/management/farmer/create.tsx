import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CreateFormCard from './partials/createFarmerForm';
import { type CreateFarmerProps } from '@/types/farmer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: '/management/farmer',
    },
    {
        title: 'Create Farmer',
        href: '/management/farmer/create',
    },
];

export default function Create({ provinces, municipalities, barangays }: CreateFarmerProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="Create Farmer" description="Create a new farmer record." />
                    <CreateFormCard provinces={provinces} municipalities={municipalities} barangays={barangays} />
                </div>
            </div>
        </AppLayout>
    );
}
