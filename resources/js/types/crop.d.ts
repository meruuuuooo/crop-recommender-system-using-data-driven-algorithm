import { Crop, CropVariety, Category, PaginatedResponse } from './index';

export type { Crop, CropVariety, Category };

export type PaginatedCrops = PaginatedResponse<Crop>;

export type CropIndexProps = {
    crops: PaginatedCrops;
    filters: {
        search?: string;
        per_page?: number;
    };
};

export type ShowCropProps = {
    crop: Crop;
};

export type ShowCropCardProps = {
    crop: Crop;
};

export type CreateCropProps = {
    categories: Category[];
};

export type createCropProps = CreateCropProps; // Alias for backward compatibility

export type EditCropProps = {
    crop: Crop;
    categories: Category[];
};
