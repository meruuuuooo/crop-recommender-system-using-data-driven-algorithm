import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import EditCropForm from './partials/editCropForm';
import type { EditCropProps } from '@/types/crop';

export default function Edit({ crop, categories }: EditCropProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Crop Management',
            href: '/management/crop',
        },
        {
            title: 'Edit Crop',
            href: `/management/crop/${crop?.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${crop?.name || 'Crop'}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall
                        title={`Edit ${crop?.name || 'Crop'}`}
                        description="Update the crop information and manage its varieties."
                    />
                    <EditCropForm crop={crop} categories={categories} />
                </div>
            </div>
        </AppLayout>
    );
}
