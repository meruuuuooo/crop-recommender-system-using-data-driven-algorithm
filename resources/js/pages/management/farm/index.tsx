import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import FarmTable from './partials/farmTable';
import type { Farm, FarmIndexProps } from '@/types/farm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farm Management',
        href: 'management/farm',
    },
];

export default function Farm({ farms, filters }: FarmIndexProps) {

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
                    </div>

                    <FarmTable
                        farms={farms}
                        filters={filters}
                        onView={handleView}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
