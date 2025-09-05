import { Recommendation, Farmer, Farm, Crop, PaginatedResponse } from './index';

export type { Recommendation, Farmer, Farm, Crop };

export type PaginatedRecommendations = PaginatedResponse<Recommendation>;

export type RecommendationIndexProps = {
    recommendations: PaginatedRecommendations;
    filters: {
        search?: string;
        per_page?: number;
        farmer_id?: number;
        farm_id?: number;
        crop_id?: number;
    };
};

export type RecommendationShowProps = {
    recommendation: Recommendation;
};

export type CreateRecommendationProps = {
    farmers: Farmer[];
    farms: Farm[];
    crops: Crop[];
};

export type EditRecommendationProps = {
    recommendation: Recommendation;
    farmers: Farmer[];
    farms: Farm[];
    crops: Crop[];
};

export type RecommendationFormData = {
    farmer_id: number;
    farm_id: number;
    crop_id: number;
    confidence_score: number;
    recommendation_date: string;
};

export type RecommendationCardProps = {
    recommendation: Recommendation;
    showActions?: boolean;
};

// Legacy type names for backward compatibility
export type Props = EditRecommendationProps;