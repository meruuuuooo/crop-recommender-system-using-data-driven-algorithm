import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ViewFarmerCard from './partials/viewFarmerCard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: '/management/farmer',
    },
    {
        title: 'View Farmer',
        href: '/management/farmer/show',
    },
];

type Farmer = {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    contact_number: string;
    farming_experience: string | null;
    registration_date: string;
    location: {
        street: string;
        province: {
            id: number | string;
            name: string;
            region_code: string;
        },
        municipality: {
            id: number | string;
            name: string;
            province_id: number | string;
            region_code: string;
        };
        barangay: {
            id: number | string;
            name: string;
            municipality_id: number | string;
        }
    };
    user: {
        last_name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
}

export default function View({farmer}: { farmer: Farmer }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="View Farmer" description="View the farmer details." />
                    <ViewFarmerCard farmer={farmer} />
                </div>
            </div>
        </AppLayout>
    );
}
