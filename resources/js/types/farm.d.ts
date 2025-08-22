import { Farm, Farmer, Location, Province, Municipality, Barangay, PaginatedResponse } from './index';

export type { Farm, Farmer, Location, Province, Municipality, Barangay };

export type PaginatedFarms = PaginatedResponse<Farm>;

export type FarmIndexProps = {
    farms: PaginatedFarms;
    filters: {
        search?: string;
        per_page?: number;
    };
};

export type FarmShowProps = {
    farm: Farm;
};

export type CreateFarmProps = {
    farmers: Farmer[];
    provinces: Province[];
    municipalities: Municipality[];
    barangays: Barangay[];
};

export type EditFarmProps = {
    farm: Farm;
    farmers: Farmer[];
    provinces: Province[];
    municipalities: Municipality[];
    barangays: Barangay[];
};

// Legacy type names for backward compatibility
export type viewFarmProps = FarmShowProps;
