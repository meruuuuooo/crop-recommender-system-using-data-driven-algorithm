import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ViewFarmCard from './partials/viewFarmCard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farm Management',
        href: '/management/farm',
    },
    {
        title: 'View Farm',
        href: '/management/farm/view',
    },
];

export default function View() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Farm" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="View Farm" description="View the farm details." />
                    <ViewFarmCard />
                </div>
            </div>
        </AppLayout>
    );
}
