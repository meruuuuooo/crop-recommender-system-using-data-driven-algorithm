import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Props } from '@/types/farmer';
import { Head } from '@inertiajs/react';
import EditFormCard from './partials/editFarmerForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: '/management/farmer',
    },
    {
        title: 'Edit Farmer',
        href: '/management/farmer/edit',
    },
];

export default function Edit({ farmer, provinces, municipalities, barangays }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="Edit Farmer" description="Edit the farmer record." />
                    <EditFormCard provinces={provinces} municipalities={municipalities} barangays={barangays} farmer={farmer} />
                </div>
            </div>
        </AppLayout>
    );
}
