import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Fertilizer, PaginationDataProps } from '@/types/fertilizer';
import { Head, router, useForm } from '@inertiajs/react';
import { Loader2, Printer } from 'lucide-react';
import FertilizerTable from './partials/fertilizerTable';

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
    cropSpecificData: Record<
        string,
        {
            growth_stages: string[];
            soil_types: string[];
        }
    >;
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
    selectedFilters,
}: FertilizerPageProps) {
    const currentPage = fertilizers?.current_page || 1;
    const totalPages = fertilizers?.last_page || 1;
    const fertilizerData = fertilizers?.data || [];

    const { data, setData, post, processing, errors } = useForm({
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

        setData((prevData) => ({
            ...prevData,
            crop_type: cropType,
            // Reset growth stage if it's not available for the new crop
            growth_stage: prevData.growth_stage && newCropData?.growth_stages?.includes(prevData.growth_stage) ? prevData.growth_stage : '',
            // Reset soil type if it's not available for the new crop
            soil_type: prevData.soil_type && newCropData?.soil_types?.includes(prevData.soil_type) ? prevData.soil_type : '',
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

    const handlePrintPdf = () => {
        if (!data.crop_type || !data.nitrogen_level || !data.phosphorus_level || !data.potassium_level) {
            return;
        }

        const params = new URLSearchParams({
            crop_type: data.crop_type,
            nitrogen_level: data.nitrogen_level,
            phosphorus_level: data.phosphorus_level,
            potassium_level: data.potassium_level,
        });

        if (data.growth_stage) {
            params.append('growth_stage', data.growth_stage);
        }

        if (data.soil_type) {
            params.append('soil_type', data.soil_type);
        }

        window.open(route('recommendation.downloadFertilizerRatePdf') + '?' + params.toString(), '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fertilizer" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <Card className="rounded-xl px-6" role="region" aria-labelledby="fertilizers-form-heading">
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div>
                            <h3 id="fertilizers-form-heading" className="text-lg font-semibold text-gray-900">
                                Generate Fertilizer Recommendations
                            </h3>
                            <p className="mb-2 text-sm text-gray-600">
                                Select crop criteria and soil nutrient levels to get fertilizer rate recommendations.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* CROP */}
                            <div className="space-y-2">
                                <Label htmlFor="crop-filter" className="text-sm font-medium text-gray-700">
                                    Crop
                                </Label>
                                <SearchableSelect
                                    options={crops.map((crop) => ({ label: crop, value: crop }))}
                                    value={data.crop_type}
                                    onValueChange={handleCropChange}
                                    placeholder="Select Crop Type"
                                    disabled={crops.length === 0}
                                    loading={crops.length === 0}
                                    clearable
                                />
                                <div className="text-xs text-gray-500">Choose the crop you are planning to grow</div>
                                <InputError message={errors.crop_type} className="mt-1" />
                            </div>

                            {/* GROWTH STAGE */}
                            <div className="space-y-2">
                                <Label htmlFor="growth-stage-filter" className="text-sm font-medium text-gray-700">
                                    Variety/Growth Stage
                                </Label>
                                <Select
                                    onValueChange={(value) => setData('growth_stage', value)}
                                    value={data.growth_stage}
                                    disabled={!data.crop_type || availableGrowthStages.length === 0}
                                >
                                    <SelectTrigger
                                        id="growth-stage-filter"
                                        className="border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <SelectValue
                                            placeholder={
                                                !data.crop_type
                                                    ? 'Select a crop first'
                                                    : availableGrowthStages.length === 0
                                                        ? 'No growth stages available'
                                                        : 'Select Growth Stage (Optional)'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableGrowthStages.map((stage) => (
                                            <SelectItem key={stage} value={stage}>
                                                {stage}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="text-xs text-gray-500">Choose the growth stage of the crop</div>
                                <InputError message={errors.growth_stage} className="mt-1" />
                            </div>

                            {/* SOIL TYPE */}
                            <div className="space-y-2">
                                <Label htmlFor="soil-type-filter" className="text-sm font-medium text-gray-700">
                                    Soil Type
                                </Label>
                                <Select
                                    onValueChange={(value) => setData('soil_type', value)}
                                    value={data.soil_type}
                                    disabled={!data.crop_type || availableSoilTypes.length === 0}
                                >
                                    <SelectTrigger
                                        id="soil-type-filter"
                                        className="border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <SelectValue
                                            placeholder={
                                                !data.crop_type
                                                    ? 'Select a crop first'
                                                    : availableSoilTypes.length === 0
                                                        ? 'No soil types available'
                                                        : 'Select Soil Type (Optional)'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSoilTypes.map((soilType) => (
                                            <SelectItem key={soilType} value={soilType}>
                                                {soilType}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="text-xs text-gray-500">Choose the soil type of the field</div>
                                <InputError message={errors.soil_type} className="mt-1" />
                            </div>
                        </div>

                        {/* NPK LEVELS */}
                        <fieldset className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                                {/* NITROGEN LEVEL */}
                                <div className="space-y-2">
                                    <Label htmlFor="nitrogen-level" className="text-sm font-medium text-gray-700">
                                        Nitrogen (N)
                                    </Label>
                                    <Select onValueChange={(value) => setData('nitrogen_level', value)} value={data.nitrogen_level}>
                                        <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-green-600">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded-sm bg-green-200"></div>
                                                    Low
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded-sm bg-green-500"></div>
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
                                    <div className="text-xs text-gray-500">Choose the nitrogen level in the soil</div>
                                    <InputError message={errors.nitrogen_level} className="mt-1" />
                                </div>

                                {/* PHOSPHORUS LEVEL */}
                                <div className="space-y-2">
                                    <Label htmlFor="phosphorus-level" className="text-sm font-medium text-gray-700">
                                        Phosphorus (P)
                                    </Label>
                                    <Select onValueChange={(value) => setData('phosphorus_level', value)} value={data.phosphorus_level}>
                                        <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-blue-600">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded-sm bg-blue-200"></div>
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
                                                    <div className="h-4 w-4 rounded-sm bg-blue-800"></div>
                                                    High
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="text-xs text-gray-500">Choose the phosphorus level in the soil</div>
                                    <InputError message={errors.phosphorus_level} className="mt-1" />
                                </div>

                                {/* POTASSIUM LEVEL */}
                                <div className="space-y-2">
                                    <Label htmlFor="potassium-level" className="text-sm font-medium text-gray-700">
                                        Potassium (K)
                                    </Label>
                                    <Select onValueChange={(value) => setData('potassium_level', value)} value={data.potassium_level}>
                                        <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-orange-600">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded-sm bg-orange-200"></div>
                                                    Low
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded-sm bg-orange-500"></div>
                                                    Medium
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="high">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded-sm bg-orange-800"></div>
                                                    High
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="text-xs text-gray-500">Choose the potassium level in the soil</div>
                                    <InputError message={errors.potassium_level} className="mt-1" />
                                </div>
                            </div>
                        </fieldset>

                        <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-4">
                            <Button type="button" onClick={handleReset} variant="outline" className="border-[#D6E3D4] text-gray-700 hover:bg-gray-50">
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    processing ||
                                    !data.nitrogen_level ||
                                    !data.phosphorus_level ||
                                    !data.potassium_level ||
                                    !data.crop_type
                                }
                                className="rounded-md bg-[#619154] px-6 py-2 text-white hover:bg-[#4a7041] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Recommendations'
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Recommendations */}
                {fertilizerRecommendations &&
                    fertilizerRecommendations.nitrogen &&
                    fertilizerRecommendations.phosphorus &&
                    fertilizerRecommendations.potassium && (
                        <Card className="rounded-xl p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Fertilizer Rate Recommendations</h3>
                                <Button
                                    onClick={handlePrintPdf}
                                    variant="outline"
                                    className="flex items-center gap-2 border-[#619154] text-[#619154] hover:bg-[#619154] hover:text-white"
                                >
                                    <Printer className="h-4 w-4" />
                                    Download PDF
                                </Button>
                            </div>
                            <div className="grid gap-6 md:grid-cols-3">
                                {/* Nitrogen Recommendations */}
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 font-medium text-green-700">
                                        <div className="h-4 w-4 rounded-sm bg-green-500"></div>
                                        Nitrogen ({fertilizerRecommendations.nitrogen.level} Level)
                                    </h4>
                                    {fertilizerRecommendations.nitrogen.crop_fertilizer &&
                                    fertilizerRecommendations.nitrogen.crop_fertilizer.length > 0 ? (
                                        <div className="space-y-2">
                                            {fertilizerRecommendations.nitrogen.crop_fertilizer.map((item) => (
                                                <div key={item.id} className="rounded-lg border border-green-200 bg-green-50 p-3">
                                                    <div className="text-sm font-medium">{item.crop_name}</div>
                                                    {item.growth_stage && item.growth_stage !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Stage: {item.growth_stage}</div>
                                                    )}
                                                    {item.soil_type && item.soil_type !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Soil: {item.soil_type}</div>
                                                    )}
                                                    <div className="mt-1 text-lg font-bold text-green-700">
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
                                    <h4 className="flex items-center gap-2 font-medium text-blue-700">
                                        <div className="h-4 w-4 rounded-sm bg-blue-500"></div>
                                        Phosphorus ({fertilizerRecommendations.phosphorus.level} Level)
                                    </h4>
                                    {fertilizerRecommendations.phosphorus.crop_fertilizer &&
                                    fertilizerRecommendations.phosphorus.crop_fertilizer.length > 0 ? (
                                        <div className="space-y-2">
                                            {fertilizerRecommendations.phosphorus.crop_fertilizer.map((item) => (
                                                <div key={item.id} className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                                                    <div className="text-sm font-medium">{item.crop_name}</div>
                                                    {item.growth_stage && item.growth_stage !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Stage: {item.growth_stage}</div>
                                                    )}
                                                    {item.soil_type && item.soil_type !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Soil: {item.soil_type}</div>
                                                    )}
                                                    <div className="mt-1 text-lg font-bold text-blue-700">
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
                                    <h4 className="flex items-center gap-2 font-medium text-orange-700">
                                        <div className="h-4 w-4 rounded-sm bg-orange-500"></div>
                                        Potassium ({fertilizerRecommendations.potassium.level} Level)
                                    </h4>
                                    {fertilizerRecommendations.potassium.crop_fertilizer &&
                                    fertilizerRecommendations.potassium.crop_fertilizer.length > 0 ? (
                                        <div className="space-y-2">
                                            {fertilizerRecommendations.potassium.crop_fertilizer.map((item) => (
                                                <div key={item.id} className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                                                    <div className="text-sm font-medium">{item.crop_name}</div>
                                                    {item.growth_stage && item.growth_stage !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Stage: {item.growth_stage}</div>
                                                    )}
                                                    {item.soil_type && item.soil_type !== 'N/A' && (
                                                        <div className="text-xs text-gray-600">Soil: {item.soil_type}</div>
                                                    )}
                                                    <div className="mt-1 text-lg font-bold text-orange-700">
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

                {/* Table */}
                <Card className="rounded-xl p-6" role="region" aria-labelledby="fertilizers-table-heading">
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
                </Card>
            </div>
        </AppLayout>
    );
}
