import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import EditFormCard from './partials/editFarmerForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Management',
        href: '/management/farmer',
    },
    {
        title: 'Edit Farmer',
        href: '/management/farmer/edit',
    },
];

type Props = {
    farmer: {
        id: number;
        first_name: string;
        middle_name: string;
        last_name: string;
        contact_number: string;
        farming_experience: string | null;
        registration_date: string;
        location: {
            street: string;
            province_id: number | string;
            municipality_id: number | string;
            barangay_id: number | string;
        };
        user: {
            last_name: string;
            email: string;
        };
        created_at: string;
        updated_at: string;
    };
    provinces: { id: number | string; name: string }[];
    municipalities: { id: number | string; name: string; province_id: number | string }[];
    barangays: { id: number | string; name: string; municipality_id: number | string }[];
};

export default function Edit( { farmer, provinces, municipalities, barangays }: Props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <HeadingSmall title="Edit Farmer" description="Edit the farmer record." />
                    <EditFormCard provinces={provinces} municipalities={municipalities} barangays={barangays} farmer={farmer} />
                </div>
            </div>
        </AppLayout>
    );
}
