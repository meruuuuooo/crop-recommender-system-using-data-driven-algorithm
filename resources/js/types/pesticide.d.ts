export interface Pesticide {
    id: number | string;
    company: string;
    active_ingredient: string;
    product_name: string;
    concentration: string;
    formulation_type: string;
    uses: string;
    toxicity_category: string;
    registration_number: string;
    expiry_date: string;
    mode_of_entry: string;
    crops: string;
    pests: string; // Pests
    weeds: string; // Weeds
    diseases: string; // Diseases
    recommended_rate: string;
    MRL: string; // Maximum Residue Limit
    PHI: string; // Pre-Harvest Interval
    re_entry_period: string;
    created_at: string;
    updated_at: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PesticidePaginationDataProps {
    current_page: number;
    data: Pesticide[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLinks[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export type PesticideTableProps = {
    pesticides: Pesticide[];
    onEdit?: (pesticide: Pesticide) => void;
    onView?: (pesticide: Pesticide) => void;
    onSearch?: (search: string) => void;
    searchValue?: string;
    pagination?: {
        currentPage: number;
        totalPages: number;
        total: number;
        perPage: number;
        from: number;
        to: number;
    };
    onPageChange?: (page: number) => void;
};
