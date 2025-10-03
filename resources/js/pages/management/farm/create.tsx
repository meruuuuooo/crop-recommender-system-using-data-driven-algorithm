import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CreateFarmForm from './partials/createFarmForm';
import type { CreateFarmProps } from '@/types/farm';

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

export default function Create({ farmers, provinces, municipalities, barangays, crops }: CreateFarmProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Farm" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="Create Farm" description="Create a new farm record." />
                    <CreateFarmForm farmers={farmers} provinces={provinces} municipalities={municipalities} barangays={barangays} crops={crops} />
                </div>
            </div>
        </AppLayout>
    );
}
