import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ViewCard from './partials/viewFarmerCard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: '/management/farmer',
    },
    {
        title: 'View Farmer',
        href: '/management/farmer/view',
    },
];

export default function View() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="View Farmer" description="View the farmer details." />
                    <ViewCard />
                </div>
            </div>
        </AppLayout>
    );
}
