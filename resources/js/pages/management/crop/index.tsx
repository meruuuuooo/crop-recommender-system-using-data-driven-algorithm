import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import CropTable from './partials/cropTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { Crop, CropIndexProps } from '@/types/crop';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crop Management',
        href: '/management/crop',
    },
];

export default function Crop({ crops, filters }: CropIndexProps) {


    const handleView = (crop: Crop) => {
        router.get(route('management.crop.show', crop.id));
    }

    const handleEdit = (crop: Crop) => {
        router.get(route('management.crop.edit', crop.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crop" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Crop Management" description="Manage crop information." />
                        <Link href={route('management.crop.create')}>
                            <Button className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43]">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Crop
                            </Button>
                        </Link>
                    </div>
                    <CropTable crops={crops} filters={filters} onView={handleView} onEdit={handleEdit} />
                </div>
            </div>
        </AppLayout>
    );
}
