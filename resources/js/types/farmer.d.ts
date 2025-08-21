export type Farmer = {
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
        };
        municipality: {
            id: number | string;
            name: string;
            province_id: number | string;
        };
        barangay: {
            id: number | string;
            name: string;
            municipality_id: number | string;
        };
    };
    user: {
        last_name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
};

export type PaginatedFarmers = {
    data: Farmer[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

export type FarmerIndexProps = {
    farmers: PaginatedFarmers;
    filters: {
        search?: string;
        per_page?: number;
    };
};

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
type CreateFarmerProps = {
    provinces: { id: number | string; name: string }[];
    municipalities: { id: number | string; name: string; province_id: number | string }[];
    barangays: { id: number | string; name: string; municipality_id: number | string }[];
};
