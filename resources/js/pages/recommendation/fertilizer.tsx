import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Fertilizer } from '@/types/fertilizer';
import { Head, router } from '@inertiajs/react';
import FertilizerTable from './partials/fertilizerTable';
import type { PaginationDataProps } from '@/types/fertilizer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recommendation Fertilizer',
        href: '/recommendation/fertilizer',
    },
];

interface FertilizerPageProps {
    fertilizers: PaginationDataProps;
    filters: {
        search: string;
        per_page: number;
    };
}

export default function Fertilizer({ fertilizers, filters }: FertilizerPageProps) {
    const currentPage = fertilizers?.current_page || 1;
    const totalPages = fertilizers?.last_page || 1;
    const fertilizerData = fertilizers?.data || [];

    const handleView = (fertilizer: Fertilizer) => {
        router.get(route('recommendation.showFertilizer', fertilizer.id), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('recommendation.fertilizer'), {
            ...filters,
            page,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (search: string) => {
        router.get(route('recommendation.fertilizer'), {
            ...filters,
            search,
            page: 1,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fertilizer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Recommendation Fertilizer" description="Manage fertilizer recommendations." />
                    </div>

                    <FertilizerTable
                        fertilizers={fertilizerData}
                        onView={handleView}
                        onSearch={handleSearch}
                        searchValue={filters?.search || ''}
                        pagination={{
                            currentPage,
                            totalPages,
                            total: fertilizers?.total || 0,
                            perPage: fertilizers?.per_page || 10,
                            from: fertilizers?.from || 0,
                            to: fertilizers?.to || 0,
                        }}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
