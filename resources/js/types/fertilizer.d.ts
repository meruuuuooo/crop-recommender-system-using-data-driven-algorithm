export interface Fertilizer {
    id: number | string;
    company: string;
    product_name: string;
    type_of_product: string;
    guaranteed_analysis: string;
    target_crops: string;
    registration_number: string;
    expiry_date: string;
    created_at: string;
    updated_at: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationDataProps {
    current_page: number;
    data: Fertilizer[];
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

export type FertilizerTableProps = {
    fertilizers: Fertilizer[];
    onEdit?: (fertilizer: Fertilizer) => void;
    onView?: (fertilizer: Fertilizer) => void;
};
