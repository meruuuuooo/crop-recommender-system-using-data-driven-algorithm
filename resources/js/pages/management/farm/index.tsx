import HeadingSmall from '@/components/heading-small';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Farm, FarmIndexProps } from '@/types/farm';
import { Head, router } from '@inertiajs/react';
import FarmTable from './partials/farmTable';
import CreateFarmFormDialog from './partials/createFarmFormDialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farm Management',
        href: 'management/farm',
    },
];

interface FarmProps extends FarmIndexProps {
    farmers: FarmIndexProps['farmers'];
    farms: FarmIndexProps['farms'];
    filters: FarmIndexProps['filters'];
}

export default function Farm({ farms, filters, farmers }: FarmProps) {
    const handleView = (farm: Farm) => {
        router.get(route('management.farm.show', farm.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Farm" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <Card className="flex flex-col gap-6 rounded-xl bg-white p-6 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Farm Management" description="Manage farm details and information." />
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                <CreateFarmFormDialog farmers={farmers} />
                            </div>
                        </div>
                    </div>

                    <FarmTable farms={farms} filters={filters} farmers={farmers} onView={handleView}/>
                </Card>
            </div>
        </AppLayout>
    );
}
