export interface Crop {
    id: number | string;
    name: string;
    season: string;
    description?: string;
    category_id?: number | string;
    category?: {
        id: number | string;
        name: string;
        description?: string;
    };
    nutrients?: {
        id: number | string;
        nitrogen?: number;
        phosphorus?: number;
        potassium?: number;
    };
    created_at: string;
    updated_at: string;
}

export type ShowCropProps = {
    crop: Crop;
};

export type ShowCropCardProps = {
    crop: Crop;
};

export type EditCropProps = {
    crop: {
        id: number | string;
        name: string;
        season: string;
        description?: string;
        category_id?: number | string;
        category?: {
            id: number | string;
            name: string;
            description?: string;
        };
        created_at: string;
        updated_at: string;
    };
    categories: {
        id: number | string;
        name: string;
        description?: string;
    }[];
};

export type EditCropProps ={
    editCropProps: EditCropProps;
}

type createCropProps = {
    categories: { id: number | string; name: string; description?: string }[];
}

export type PaginatedCrops = {
    data: Crop[];
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

export type CropIndexProps = {
    crops: PaginatedCrops;
    filters: {
        search?: string;
        per_page?: number;
    };
};
