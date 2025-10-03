import { PaginatedResponse } from './index';

export type soilTestHistory = {
    farm_id: number;
    farm_name: string;
    owner_name: string;
    tests: tests[];
}

export type tests = {
    test_date: string;
    soil_type: string;
    ph: number;
    nitrogen_level: string;
    nitrogen: number;
    phosphorus_level: string;
    phosphorus: number;
    potassium_level: string;
    potassium: number;
}

export type PaginatedSoilTestHistory = PaginatedResponse<soilTestHistory>;
