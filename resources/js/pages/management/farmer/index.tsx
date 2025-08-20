import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import FarmerTable from './partials/farmerTable';
import { type Farmer } from '@/types/farmer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: 'management/farmer',
    },
];

export default function Farmer({ farmers }: { farmers: { data: Farmer[] } }) {
    const handleView = (farmer: Farmer) => {
        router.get(route('management.farmer.show', farmer.id))
    };

    const handleEdit = (farmer: Farmer) => {
        router.get(route('management.farmer.edit', farmer.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Farmer Management" description="Manage farmer details and information." />
                        <Link href={route('management.farmer.create')}>
                            <Button className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43]">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Farmer
                            </Button>
                        </Link>
                    </div>

                    {/* Farmer Table */}
                    <FarmerTable farmers={farmers.data} onView={handleView} onEdit={handleEdit} />
                </div>
            </div>
        </AppLayout>
    );
}
