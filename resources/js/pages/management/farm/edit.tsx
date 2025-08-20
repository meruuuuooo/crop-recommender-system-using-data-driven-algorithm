import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import EditFarmForm from './partials/editFarmForm';
import type { EditFarmProps } from '@/types/farm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: '/management/farm',
    },
    {
        title: 'Edit Farm',
        href: '/management/farm/edit',
    },
];

export default function Edit({ farm, farmers, provinces, municipalities, barangays }: EditFarmProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Farm" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="Edit Farm" description="Edit the farm record." />
                    <EditFarmForm
                        farm={farm}
                        farmers={farmers}
                        provinces={provinces}
                        municipalities={municipalities}
                        barangays={barangays}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
