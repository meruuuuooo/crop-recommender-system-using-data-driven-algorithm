import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ShowCropCard from './partials/showCropCard';
import type { ShowCropProps } from '@/types/crop';


export default function Show({ crop }: ShowCropProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Crop Management',
            href: '/management/crop',
        },
        {
            title: 'View Crop',
            href: `/management/crop/${crop?.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${crop?.name || 'Crop'} Details`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall 
                        title={`${crop?.name || 'Crop'} Details`} 
                        description="View detailed information about this crop." 
                    />
                    <ShowCropCard crop={crop} />
                </div>
            </div>
        </AppLayout>
    );
}