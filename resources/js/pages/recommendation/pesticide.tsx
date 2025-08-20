import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recommendation Pesticide',
        href: '/recommendation/pesticide',
    },
];

export default function Pesticide() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesticide" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Recommendation Pesticide" description="Manage pesticide recommendations." />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
