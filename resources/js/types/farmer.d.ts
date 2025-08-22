import { Farmer, User, Location, Province, Municipality, Barangay, PaginatedResponse } from './index';

export type { Farmer, User, Location, Province, Municipality, Barangay };

export type PaginatedFarmers = PaginatedResponse<Farmer>;

export type FarmerIndexProps = {
    farmers: PaginatedFarmers;
    filters: {
        search?: string;
        per_page?: number;
    };
};

export type FarmerShowProps = {
    farmer: Farmer;
    provinces: Province[];
    municipalities: Municipality[];
    barangays: Barangay[];
};

export type CreateFarmerProps = {
    provinces: Province[];
    municipalities: Municipality[];
    barangays: Barangay[];
};

export type EditFarmerProps = {
    farmer: Farmer;
    provinces: Province[];
    municipalities: Municipality[];
    barangays: Barangay[];
};

// Legacy type names for backward compatibility
export type Props = EditFarmerProps;
