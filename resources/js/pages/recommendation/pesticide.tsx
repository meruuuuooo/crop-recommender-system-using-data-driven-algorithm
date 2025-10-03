import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Pesticide, PesticidePaginationDataProps } from '@/types/pesticide';
import { Head, router } from '@inertiajs/react';
import PesticideCardTable from './partials/pesticideCardTable';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recommendation Pesticide',
        href: '/recommendation/pesticide',
    },
];

interface PesticidePageProps {
    pesticides: PesticidePaginationDataProps;
    peste?: {
        pests: string[];
        weeds: string[];
        diseases: string[];
    };
    crops: string[];
    filters?: {
        search: string;
        crop_search: string;
        pest_search: string;
        weed_search: string;
        disease_search: string;
        toxicity_search: string;
        pesticide_search: string;
        per_page: number;
    };
}

export default function Pesticide({ pesticides, peste, crops, filters }: PesticidePageProps) {
    const currentPage = pesticides?.current_page || 1;
    const totalPages = pesticides?.last_page || 1;
    const pesticideData = pesticides?.data || [];
    const cropOptions = crops || [];


    const handleView = (pesticide: Pesticide) => {
        router.get(
            route('recommendation.pesticide.show', pesticide.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('recommendation.pesticide'),
            {
                ...filters,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearch = (search: string) => {
        router.get(
            route('recommendation.pesticide'),
            {
                ...filters,
                search,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleFilterSearch = (filterType: string, value: string) => {
        router.get(
            route('recommendation.pesticide'),
            {
                ...filters,
                [filterType]: value,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesticide" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <Card className="flex flex-col gap-6 rounded-xl bg-white p-8 dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <HeadingSmall
                            title="Pesticide Management"
                            description="View all registered pesticides in the philippines."
                        />
                    </div>

                    <PesticideCardTable
                        pesticides={pesticideData}
                        peste={peste}
                        cropOptions={cropOptions}
                        onView={handleView}
                        onSearch={handleSearch}
                        onFilterSearch={handleFilterSearch}
                        searchValue={filters?.search || ''}
                        filters={filters}
                        pagination={{
                            currentPage,
                            totalPages,
                            total: pesticides?.total || 0,
                            perPage: pesticides?.per_page || 10,
                            from: pesticides?.from || 0,
                            to: pesticides?.to || 0,
                        }}
                        onPageChange={handlePageChange}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}
