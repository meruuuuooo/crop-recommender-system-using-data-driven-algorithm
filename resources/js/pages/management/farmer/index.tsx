import HeadingSmall from '@/components/heading-small';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Farmer, type FarmerIndexProps } from '@/types/farmer';
import { Head, router } from '@inertiajs/react';
import CreateFormDialog from './partials/createFarmerFormDialog';
import FarmerTable from './partials/farmerTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: 'management/farmer',
    },
];

interface FarmerIndexPropsExtended extends FarmerIndexProps {
    farmers: FarmerIndexProps['farmers'];
    filters: FarmerIndexProps['filters'];
}

export default function Farmer({ farmers, filters }: FarmerIndexPropsExtended) {
    const handleView = (farmer: Farmer) => {
        router.get(route('management.farmer.show', farmer.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <Card className="flex flex-col gap-6 rounded-xl bg-white p-6 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Farmer Management" description="Manage farmer details and information." />
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                <CreateFormDialog />
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <FarmerTable
                        farmers={farmers}
                        filters={filters}
                        onView={handleView}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}
