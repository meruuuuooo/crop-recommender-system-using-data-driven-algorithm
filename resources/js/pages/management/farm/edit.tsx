import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import EditFarmForm from './partials/editFarmForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: '/management/farm',
    },
    {
        title: 'Edit Farm',
        href: '/management/farm/edit',
    },
];

type editFarmProps = {
    farm?: {
        id: number | string;
        name: string;
        total_area: number;
        prev_crops: string;
        location?: {
            id: number;
            street?: string;
            province?: {
                id: number | string;
                name: string;
                region_code: string;
            },
            municipality?: {
                id: number | string;
                province_id: number | string;
                name: string;
            },
            barangay?: {
                id: number | string;
                municipality_id: number | string;
                name: string;
            }
        }
        farmer?: {
            id: number | string;
            first_name: string;
            last_name: string;
            middle_name?: string;
            contact_number: string;
        }
        created_at: string;
        updated_at: string;
    }
    farmers?: {
        id: number | string;
        first_name: string;
        middle_name: string;
        last_name: string;
    }[];
    provinces?: { id: number | string; name: string }[];
    municipalities?: { id: number | string; name: string; province_id: number | string }[];
    barangays?: { id: number | string; name: string; municipality_id: number | string }[];
}

export default function Edit({ farm, farmers, provinces, municipalities, barangays }: editFarmProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Farm" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="Edit Farm" description="Edit the farm record." />
                    <EditFarmForm
                        farm={farm}
                        farmers={farmers}
                        provinces={provinces}
                        municipalities={municipalities}
                        barangays={barangays}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
