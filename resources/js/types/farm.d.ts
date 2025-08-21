export type Farm = {
    id: number | string;
    name: string;
    total_area: number;
    prev_crops: string;
    location: {
        id: number;
        street: string;
        province: {
            id: number | string;
            name: string;
            region_code: string;
        },
        municipality: {
            id: number | string;
            province_id: number | string;
            name: string;
        },
        barangay: {
            id: number | string;
            municipality_id: number | string;
            name: string;
        }
    }
    farmer: {
        id: number | string;
        first_name: string;
        last_name: string;
        middle_name: string;
        contact_number: string;
    }
    created_at: string;
    updated_at: string;
};

type viewFarmProps = {
    farm: Farm;
}

type CreateFarmProps = {
    farmers: {
        id: number | string;
        first_name: string;
        middle_name: string;
        last_name: string;
    }[];
    provinces: {
        id: number | string;
        name: string;
        region_code: number | string;
    }[];
    municipalities: {
        id: number | string;
        name: string;
        province_id: number | string;
    }[];
    barangays: {
        id: number | string;
        name: string;
        municipality_id: number | string;
    }[];
};

export type EditFarmProps = {
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

export type PaginatedFarms = {
    data: Farm[];
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

export type FarmIndexProps = {
    farms: PaginatedFarms;
    filters: {
        search?: string;
        per_page?: number;
    };
};