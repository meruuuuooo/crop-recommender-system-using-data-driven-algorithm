import { Soil, farm, PaginatedResponse  } from './index';

export type { Soil, farm };

export type PaginatedSoils = PaginatedResponse<Soil>;

export type SoilIndexProps = {
    soils: PaginatedSoils;
    filters: {
        search?: string;
        per_page?: number;
    };
};

export type ShowSoilProps = {
    soil: Soil;
};

export type ShowSoilCardProps = {
    soil: Soil;
};

export type CreateSoilProps = {
    farms: farm[];
};

export type createSoilProps = CreateSoilProps; // Alias for backward compatibility

export type EditSoilProps = {
    soil: Soil;
    farms: farm[];
};
