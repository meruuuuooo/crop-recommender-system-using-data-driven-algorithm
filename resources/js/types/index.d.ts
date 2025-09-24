import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    firstname: string;
    middlename?: string;
    lastname: string;
    contact_number: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    farmer?: Farmer;
    [key: string]: unknown; // This allows for additional properties and routing...
}

export interface SelectFarmers {
    id: number;
    firstname: string;
    lastname: string;
}

export interface Farmer {
    id: number;
    firstname: string;
    middlename?: string;
    lastname: string;
    contact_number: string;
    farming_experience: number;
    registration_date: string;
    location_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    user?: User;
    location?: Location;
    farms?: Farm[];
    recommendations?: Recommendation[];
    // Legacy field names for backward compatibility
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    [key: string]: unknown; // This allows for additional properties and routing...
}

export interface Location {
    id: number;
    street: string;
    province_id: number;
    municipality_id: number;
    barangay_id: number;
    created_at: string;
    updated_at: string;
    province?: Province;
    municipality?: Municipality;
    barangay?: Barangay;
}

export interface Province {
    id: number;
    name: string;
    region_code: string;
    created_at: string;
    updated_at: string;
}

export interface Municipality {
    id: number;
    name: string;
    province_id: number;
    created_at: string;
    updated_at: string;
    province?: Province;
}

export interface Barangay {
    id: number;
    name: string;
    municipality_id: number;
    created_at: string;
    updated_at: string;
    municipality?: Municipality;
}

export interface Farm {
    id: number;
    name: string;
    total_area: number;
    cropping_system?: string;
    prev_crops?: string;
    farmer_id: number;
    location_id: number;
    created_at: string;
    updated_at: string;
    farmer?: Farmer;
    location?: Location;
    soils?: Soil[];
    climates?: Climate[];
    recommendations?: Recommendation[];
    [key: string]: unknown; // This allows for additional properties and routing...
}

export interface Fertilizer_recommendations{
    nitrogen: {
        crop_fertilizer?: CropFertilizer[];
        level?: string | null;
    };
    phosphorus: {
        crop_fertilizer?: CropFertilizer[];
        level?: string | null;
    };
    potassium: {
        crop_fertilizer?: CropFertilizer[];
        level?: string | null;
    };
    [key: string]: unknown; // This allows for additional properties and routing...
}

export interface CropFertilizer {
    id?: number;
    crop_name: string;
    growth_stage: string;
    soil_type: string;
    nitrogen_level: string | null;
    nitrogen_rate: number | null;
    phosphorus_level: string | null;
    phosphorus_rate: number | null;
    potassium_level: string | null;
    potassium_rate: number | null;
    unit_of_measure: string | null;
    [key: string]: unknown; // This allows for additional properties and routing...
}

export interface RecommendationResult {
    recommendation_id: number;
    farmer_id: number;
    crop_name: string;
    fertilizer_recommendations: Fertilizer_recommendations;
    confidence_score: number;
}

export interface Recommendation {
    id: number;
    farmer_id: number;
    farm_id: number;
    crop_id: number;
    soil_id: number;
    climate_id: number;
    confidence_score: number;
    recommendation_date: string;
    created_at: string;
    updated_at: string;
    farmer?: Farmer;
    farm?: Farm;
    crop?: Crop;
}

export interface Crop {
    id: number;
    name: string;
    planting_season_primary: string;
    harvesting_period: string;
    growing_duration_days: string;
    ph_preference: string;
    soil_requirement: string;
    category_id: number;
    created_at: string;
    updated_at: string;
    category?: Category;
    [key: string]: unknown; // This allows for additional properties and routing...
}

export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    // Legacy fields for backward compatibility
    description?: string;
    [key: string]: unknown; // This allows for additional properties and routing...
}

export interface Soil {
    id: number;
    pH: number;
    nitrogen_level: string;
    phosphorus_level: string;
    potassium_level: string;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organic_matter: number;
    farm_id: number;
    created_at: string;
    updated_at: string;
    soilType?: SoilType;
    soil_type?: string;
    farm?: Farm;
}

export interface Climate {
    id: number;
    temperature: number;
    humidity: number;
    rainfall: number;
    season_id: number;
    farm_id: number;
    created_at: string;
    updated_at: string;
    season?: Season;
    farm?: Farm;
}


export interface Fertilizer {
    id: number;
    name: string;
    type: string;
    composition: string;
    created_at: string;
    updated_at: string;
    // Legacy fields for backward compatibility
    company?: string;
    product_name?: string;
    type_of_product?: string;
    guaranteed_analysis?: string;
    target_crops?: string;
    registration_number?: string;
    expiry_date?: string;
    [key: string]: unknown; // This allows for additional properties and routing...
}


export interface Pesticide {
    id: number;
    name: string;
    type: string;
    active_ingredient: string;
    created_at: string;
    updated_at: string;
}

// Paginated response types
export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export type PaginatedFarmers = PaginatedResponse<Farmer>;
export type PaginatedFarms = PaginatedResponse<Farm>;
export type PaginatedCrops = PaginatedResponse<Crop>;
export type PaginatedRecommendations = PaginatedResponse<Recommendation>;
