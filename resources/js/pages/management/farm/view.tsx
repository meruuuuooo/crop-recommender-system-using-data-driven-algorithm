import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ViewFarmCard from './partials/viewFarmCard';
import type { viewFarmProps } from '@/types/farm';
import { Card } from '@/components/ui/card';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farm Management',
        href: '/management/farm',
    },
    {
        title: 'Show Farm',
        href: '/management/farm/show',
    },
];

export default function View({ farm }: viewFarmProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Farm" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <Card className="flex flex-col gap-6 rounded-xl bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="Show Farm" description="Show the farm details." />
                    <ViewFarmCard farm={farm} />
                </Card>
            </div>
        </AppLayout>
    );
}
