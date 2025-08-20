

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