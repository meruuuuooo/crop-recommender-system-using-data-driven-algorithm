import { Fertilizer, FertilizerRecommendation, FertilizerRecommendationDetails, NutrientType, FertilizerLevel, PaginatedResponse } from './index';

export type { Fertilizer, FertilizerRecommendation, FertilizerRecommendationDetails, NutrientType, FertilizerLevel };

export type PaginatedFertilizers = PaginatedResponse<Fertilizer>;

export type FertilizerIndexProps = {
    fertilizers: PaginatedFertilizers;
    filters: {
        search?: string;
        per_page?: number;
    };
};

export type FertilizerTableProps = {
    fertilizers: Fertilizer[];
    onEdit?: (fertilizer: Fertilizer) => void;
    onView?: (fertilizer: Fertilizer) => void;
};

export type CreateFertilizerProps = {
    nutrientTypes?: NutrientType[];
    fertilizerLevels?: FertilizerLevel[];
};

export type EditFertilizerProps = {
    fertilizer: Fertilizer;
    nutrientTypes?: NutrientType[];
    fertilizerLevels?: FertilizerLevel[];
};

// Legacy type names for backward compatibility
export type PaginationDataProps = PaginatedFertilizers;
