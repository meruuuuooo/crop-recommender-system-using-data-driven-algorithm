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

export interface Recommendation {
    id: number;
    name: string;
    farmer_id: number;
    crop_variety_id: number;
    farm_id: number;
    created_at: string;
    updated_at: string;
    farmer?: Farmer;
    cropVariety?: CropVariety;
    farm?: Farm;
    fertilizers?: FertilizerRecommendation[];
    pesticides?: PesticideRecommendation[];
}

export interface Crop {
    id: number;
    name: string;
    soil_type: string;
    crop_season: string;
    time_of_planting: string;
    plant_population_per_hectare: string;
    maturity: string;
    volume_of_production: string;
    distance_of_planting_hills: string;
    distance_of_planting_rows: string;
    yield_per_hectare: string;
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
    ph_level: number;
    nitrogen_content: number;
    phosphorus_content: number;
    potassium_content: number;
    organic_matter: number;
    soil_type_id: number;
    farm_id: number;
    created_at: string;
    updated_at: string;
    soilType?: SoilType;
    farm?: Farm;
}

export interface SoilType {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
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

export interface Season {
    id: number;
    name: string;
    start_month: number;
    end_month: number;
    created_at: string;
    updated_at: string;
}

export interface FertilizerRecommendation {
    id: number;
    recommendation_id: number;
    fertilizer_id: number;
    application_rate: number;
    application_timing: string;
    created_at: string;
    updated_at: string;
    recommendation?: Recommendation;
    fertilizer?: Fertilizer;
    details?: FertilizerRecommendationDetails[];
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

export interface FertilizerRecommendationDetails {
    id: number;
    fertilizer_recommendation_id: number;
    nutrient_type_id: number;
    fertilizer_level_id: number;
    amount: number;
    created_at: string;
    updated_at: string;
    fertilizerRecommendation?: FertilizerRecommendation;
    nutrientType?: NutrientType;
    fertilizerLevel?: FertilizerLevel;
}

export interface NutrientType {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface FertilizerLevel {
    id: number;
    level: string;
    min_value: number;
    max_value: number;
    created_at: string;
    updated_at: string;
}

export interface PesticideRecommendation {
    id: number;
    recommendation_id: number;
    pesticide_id: number;
    application_rate: number;
    application_timing: string;
    created_at: string;
    updated_at: string;
    recommendation?: Recommendation;
    pesticide?: Pesticide;
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
