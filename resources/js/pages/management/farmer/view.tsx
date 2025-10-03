import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ViewFarmerCard from './partials/viewFarmerCard';
import { type Farmer } from '@/types/farmer';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: '/management/farmer',
    },
    {
        title: 'Farmer',
        href: '/management/farmer/show',
    },
];

export default function View({farmer}: { farmer: Farmer }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4"  >
                <Card className="flex flex-col gap-6 rounded-xl bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="View Farmer" description="View the farmer details." />
                    <ViewFarmerCard farmer={farmer} />
                </Card>
            </div>
        </AppLayout>
    );
}
