import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Fertilizer } from '@/types/fertilizer';
import { Head, router } from '@inertiajs/react';
import FertilizerTable from './partials/fertilizerTable';
import type { PaginationDataProps } from '@/types/fertilizer';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recommendation Fertilizer',
        href: '/recommendation/fertilizer',
    },
];

interface FertilizerRecommendation {
    nitrogen?: {
        level: string;
        crop_fertilizer: Array<{
            id: number;
            crop_name: string;
            growth_stage: string;
            soil_type: string;
            nitrogen_level: string;
            nitrogen_rate: number;
            unit_of_measure: string;
        }>;
    };
    phosphorus?: {
        level: string;
        crop_fertilizer: Array<{
            id: number;
            crop_name: string;
            growth_stage: string;
            soil_type: string;
            phosphorus_level: string;
            phosphorus_rate: number;
            unit_of_measure: string;
        }>;
    };
    potassium?: {
        level: string;
        crop_fertilizer: Array<{
            id: number;
            crop_name: string;
            growth_stage: string;
            soil_type: string;
            potassium_level: string;
            potassium_rate: number;
            unit_of_measure: string;
        }>;
    };
}

interface FertilizerPageProps {
    fertilizers: PaginationDataProps;
    filters: {
        search: string;
        per_page: number;
    };
    crops: string[];
    cropSpecificData: Record<string, {
        growth_stages: string[];
        soil_types: string[];
    }>;
    fertilizerRecommendations: FertilizerRecommendation | null;
    selectedFilters: {
        crop_type: string | null;
        growth_stage: string | null;
        soil_type: string | null;
        nitrogen_level: string | null;
        phosphorus_level: string | null;
        potassium_level: string | null;
    };
}

export default function Fertilizer({ 
    fertilizers, 
    filters,
    crops,
    cropSpecificData,
    fertilizerRecommendations,
    selectedFilters
}: FertilizerPageProps) {
    const currentPage = fertilizers?.current_page || 1;
    const totalPages = fertilizers?.last_page || 1;
    const fertilizerData = fertilizers?.data || [];

    const { data, setData, post, processing } = useForm({
        crop_type: selectedFilters?.crop_type || '',
        growth_stage: selectedFilters?.growth_stage || '',
        soil_type: selectedFilters?.soil_type || '',
        nitrogen_level: selectedFilters?.nitrogen_level || '',
        phosphorus_level: selectedFilters?.phosphorus_level || '',
        potassium_level: selectedFilters?.potassium_level || '',
    });

    // Get available growth stages and soil types for the selected crop
    const selectedCropData = data.crop_type && cropSpecificData ? cropSpecificData[data.crop_type] : null;
    const availableGrowthStages = selectedCropData?.growth_stages || [];
    const availableSoilTypes = selectedCropData?.soil_types || [];


    const handleCropChange = (cropType: string) => {
        const newCropData = cropSpecificData && cropSpecificData[cropType] ? cropSpecificData[cropType] : null;
        
        setData(prevData => ({
            ...prevData,
            crop_type: cropType,
            // Reset growth stage if it's not available for the new crop
            growth_stage: prevData.growth_stage && newCropData?.growth_stages?.includes(prevData.growth_stage) 
                ? prevData.growth_stage 
                : '',
            // Reset soil type if it's not available for the new crop
            soil_type: prevData.soil_type && newCropData?.soil_types?.includes(prevData.soil_type) 
                ? prevData.soil_type 
                : '',
        }));
    };

    const handleView = (fertilizer: Fertilizer) => {
        router.get(
            route('recommendation.showFertilizer', fertilizer.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('recommendation.fertilizer'),
            {
                ...filters,
                page,
                // Preserve the current form data to maintain recommendations
                crop_type: data.crop_type,
                growth_stage: data.growth_stage,
                soil_type: data.soil_type,
                nitrogen_level: data.nitrogen_level,
                phosphorus_level: data.phosphorus_level,
                potassium_level: data.potassium_level,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearch = (search: string) => {
        router.get(
            route('recommendation.fertilizer'),
            {
                ...filters,
                search,
                page: 1,
                // Preserve the current form data to maintain recommendations
                crop_type: data.crop_type,
                growth_stage: data.growth_stage,
                soil_type: data.soil_type,
                nitrogen_level: data.nitrogen_level,
                phosphorus_level: data.phosphorus_level,
                potassium_level: data.potassium_level,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('recommendation.fertilizer.recommend'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleReset = () => {
        setData({
            crop_type: '',
            growth_stage: '',
            soil_type: '',
            nitrogen_level: '',
            phosphorus_level: '',
            potassium_level: '',
        });
        
        router.get(route('recommendation.fertilizer'), {
            search: filters.search,
            per_page: filters.per_page,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fertilizer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Fertilizer Management" description="View all registered fertilizers in the philippines" />
                    </div>

                    <Card className="border-[#D6E3D4] p-6" role="region" aria-labelledby="fertilizers-form-heading">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h3 id="fertilizers-form-heading" className="text-lg font-semibold text-gray-900 mb-4">
                                    Generate Fertilizer Recommendations
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Select crop criteria and soil nutrient levels to get fertilizer rate recommendations.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="crop-filter" className="text-sm font-medium text-gray-700">
                                        Crop Type
                                    </Label>
                                    <SearchableSelect
                                        options={crops.map(crop => ({ label: crop, value: crop }))}
                                        value={data.crop_type}
                                        onValueChange={handleCropChange}
                                        placeholder="Select Crop Type"
                                        disabled={crops.length === 0}
                                        loading={crops.length === 0}
                                        clearable
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="growth-stage-filter" className="text-sm font-medium text-gray-700">
                                        Growth Stage
                                    </Label>
                                    <Select 
                                        onValueChange={(value) => setData('growth_stage', value)} 
                                        value={data.growth_stage}
                                        disabled={!data.crop_type || availableGrowthStages.length === 0}
                                    >
                                        <SelectTrigger id="growth-stage-filter" className="border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154] disabled:opacity-50 disabled:cursor-not-allowed">
                                            <SelectValue placeholder={
                                                !data.crop_type 
                                                    ? "Select a crop first" 
                                                    : availableGrowthStages.length === 0 
                                                        ? "No growth stages available" 
                                                        : "Select Growth Stage (Optional)"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableGrowthStages.map((stage) => (
                                                <SelectItem key={stage} value={stage}>
                                                    {stage}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="soil-type-filter" className="text-sm font-medium text-gray-700">
                                        Soil Type
                                    </Label>
                                    <Select 
                                        onValueChange={(value) => setData('soil_type', value)} 
                                        value={data.soil_type}
                                        disabled={!data.crop_type || availableSoilTypes.length === 0}
                                    >
                                        <SelectTrigger id="soil-type-filter" className="border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154] disabled:opacity-50 disabled:cursor-not-allowed">
                                            <SelectValue placeholder={
                                                !data.crop_type 
                                                    ? "Select a crop first" 
                                                    : availableSoilTypes.length === 0 
                                                        ? "No soil types available" 
                                                        : "Select Soil Type (Optional)"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableSoilTypes.map((soilType) => (
                                                <SelectItem key={soilType} value={soilType}>
                                                    {soilType}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <fieldset className="space-y-4">
                                 <div>
                                <h3 id="fertilizers-form-heading" className="text-lg font-semibold text-gray-900 mb-4">
                                    Soil Nutrients
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Please fill in all nutrient levels to get accurate recommendations.
                                </p>
                            </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="nitrogen-level" className="text-sm font-medium text-gray-700">
                                            Nitrogen (N)
                                        </Label>
                                        <Select onValueChange={(value) => setData('nitrogen_level', value)} value={data.nitrogen_level}>
                                            <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                                <SelectValue placeholder="Select Level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded-sm bg-yellow-400"></div>
                                                        Low
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded-sm bg-lime-500"></div>
                                                        Medium
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded-sm bg-green-800"></div>
                                                        High
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phosphorus-level" className="text-sm font-medium text-gray-700">
                                            Phosphorus (P)
                                        </Label>
                                        <Select onValueChange={(value) => setData('phosphorus_level', value)} value={data.phosphorus_level}>
                                            <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                                <SelectValue placeholder="Select Level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded-sm bg-blue-100"></div>
                                                        Low
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded-sm bg-blue-500"></div>
                                                        Medium
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded-sm bg-blue-900"></div>
                                                        High
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="potassium-level" className="text-sm font-medium text-gray-700">
                                            Potassium (K)
                                        </Label>
                                        <Select onValueChange={(value) => setData('potassium_level', value)} value={data.potassium_level}>
                                            <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                                <SelectValue placeholder="Select Level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded-sm bg-red-800"></div>
                                                        Low
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded-sm bg-amber-800"></div>
                                                        Medium
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded-sm bg-amber-400"></div>
                                                        High
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </fieldset>

                            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                                <Button
                                    type="submit"
                                    disabled={processing || !data.nitrogen_level || !data.phosphorus_level || !data.potassium_level || !data.crop_type}
                                    className="bg-[#619154] hover:bg-[#4a7041] text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Recommendations'
                                    )}
                                </Button>
                                
                                <Button
                                    type="button"
                                    onClick={handleReset}
                                    variant="outline"
                                    className="border-[#D6E3D4] text-gray-700 hover:bg-gray-50"
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {fertilizerRecommendations && fertilizerRecommendations.nitrogen && fertilizerRecommendations.phosphorus && fertilizerRecommendations.potassium && (
                        <Card className="border-[#D6E3D4] p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Fertilizer Rate Recommendations
                            </h3>
                            <div className="grid gap-6 md:grid-cols-3">
                                {/* Nitrogen Recommendations */}
                                <div className="space-y-3">
                                    <h4 className="font-medium text-yellow-700 flex items-center gap-2">
                                        <div className="h-4 w-4 rounded-sm bg-yellow-400"></div>
                                        Nitrogen ({fertilizerRecommendations.nitrogen.level} Level)
                                    </h4>
                                    {fertilizerRecommendations.nitrogen.crop_fertilizer && fertilizerRecommendations.nitrogen.crop_fertilizer.length > 0 ? (
                                        <div className="space-y-2">
                                            {fertilizerRecommendations.nitrogen.crop_fertilizer.map((item) => (
                                                <div key={item.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                    <div className="font-medium text-sm">{item.crop_name}</div>
                                                    {item.growth_stage && item.growth_stage !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Stage: {item.growth_stage}</div>
                                                    )}
                                                    {item.soil_type && item.soil_type !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Soil: {item.soil_type}</div>
                                                    )}
                                                    <div className="text-lg font-bold text-yellow-700 mt-1">
                                                        {item.nitrogen_rate} {item.unit_of_measure}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic">No recommendations available</div>
                                    )}
                                </div>

                                {/* Phosphorus Recommendations */}
                                <div className="space-y-3">
                                    <h4 className="font-medium text-blue-700 flex items-center gap-2">
                                        <div className="h-4 w-4 rounded-sm bg-blue-500"></div>
                                        Phosphorus ({fertilizerRecommendations.phosphorus.level} Level)
                                    </h4>
                                    {fertilizerRecommendations.phosphorus.crop_fertilizer && fertilizerRecommendations.phosphorus.crop_fertilizer.length > 0 ? (
                                        <div className="space-y-2">
                                            {fertilizerRecommendations.phosphorus.crop_fertilizer.map((item) => (
                                                <div key={item.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <div className="font-medium text-sm">{item.crop_name}</div>
                                                    {item.growth_stage && item.growth_stage !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Stage: {item.growth_stage}</div>
                                                    )}
                                                    {item.soil_type && item.soil_type !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Soil: {item.soil_type}</div>
                                                    )}
                                                    <div className="text-lg font-bold text-blue-700 mt-1">
                                                        {item.phosphorus_rate} {item.unit_of_measure}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic">No recommendations available</div>
                                    )}
                                </div>

                                {/* Potassium Recommendations */}
                                <div className="space-y-3">
                                    <h4 className="font-medium text-amber-700 flex items-center gap-2">
                                        <div className="h-4 w-4 rounded-sm bg-amber-400"></div>
                                        Potassium ({fertilizerRecommendations.potassium.level} Level)
                                    </h4>
                                    {fertilizerRecommendations.potassium.crop_fertilizer && fertilizerRecommendations.potassium.crop_fertilizer.length > 0 ? (
                                        <div className="space-y-2">
                                            {fertilizerRecommendations.potassium.crop_fertilizer.map((item) => (
                                                <div key={item.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                                    <div className="font-medium text-sm">{item.crop_name}</div>
                                                    {item.growth_stage && item.growth_stage !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Stage: {item.growth_stage}</div>
                                                    )}
                                                    {item.soil_type && item.soil_type !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Soil: {item.soil_type}</div>
                                                    )}
                                                    <div className="text-lg font-bold text-amber-700 mt-1">
                                                        {item.potassium_rate} {item.unit_of_measure}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic">No recommendations available</div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    <FertilizerTable
                        fertilizers={fertilizerData}
                        onView={handleView}
                        onSearch={handleSearch}
                        searchValue={filters?.search || ''}
                        pagination={{
                            currentPage,
                            totalPages,
                            total: fertilizers?.total || 0,
                            perPage: fertilizers?.per_page || 10,
                            from: fertilizers?.from || 0,
                            to: fertilizers?.to || 0,
                        }}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
