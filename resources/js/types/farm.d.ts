
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