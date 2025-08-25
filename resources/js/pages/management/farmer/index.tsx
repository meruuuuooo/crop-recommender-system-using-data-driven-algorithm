import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import FarmerTable from './partials/farmerTable';
import { type Farmer, type FarmerIndexProps } from '@/types/farmer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: 'management/farmer',
    },
];

export default function Farmer({ farmers, filters }: FarmerIndexProps) {
    const handleView = (farmer: Farmer) => {
        router.get(route('management.farmer.show', farmer.id))
    };

    const handleEdit = (farmer: Farmer) => {
        router.get(route('management.farmer.edit', farmer.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8">
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="flex items-center justify-start">
                        <HeadingSmall title="Farmer Management" description="Manage farmer details and information." />
                    </div>

                    {/* Farmer Table */}
                    <FarmerTable
                        farmers={farmers}
                        filters={filters}
                        onView={handleView}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
