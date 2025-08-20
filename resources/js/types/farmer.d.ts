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
