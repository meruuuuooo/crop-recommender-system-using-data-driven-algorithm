import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CreateCropForm from './partials/createCropForm';
import type { createCropProps } from '@/types/crop';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crop Management',
        href: '/management/crop',
    },
    {
        title: 'Create Crop',
        href: '/management/crop/create',
    },
];

export default function Create({ categories }: createCropProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Crop" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="Create Crop" description="Create a new crop record." />
                    <CreateCropForm categories={categories} />
                </div>
            </div>
        </AppLayout>
    );
}
