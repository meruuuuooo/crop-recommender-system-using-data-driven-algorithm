import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Farmer, Fertilizer_recommendations, Recommendation, RecommendationResult } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Download, Eye, Info, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
// import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crop Recommendation',
        href: '/recommendation',
    },
];

export default function Crop({
    farmers,
    // recent_recommendations,
    recommendationResult,
}: {
    farmers: Farmer[];
    recent_recommendations: Recommendation[];
    recommendationResult: RecommendationResult[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        soilType: '',
        nitrogen_level: '',
        potassium_level: '',
        phosphorus_level: '',
        ph_level: 7.0,
        temperature: '',
        rainfall: '',
        humidity: '',
        farmer_id: '',
        farm_id: '',
    });

    const [isFetchingClimate, setIsFetchingClimate] = useState(false);
    const [isRetrievingSoilTest, setIsRetrievingSoilTest] = useState(false);

    // Get farms for the selected farmer
    const selectedFarmer = farmers.find((farmer) => farmer.id === Number(data.farmer_id));
    const availableFarms = selectedFarmer?.farms || [];

    // Reset farm_id when farmer changes
    const handleFarmerChange = (farmerId: string) => {
        setData((prevData) => ({
            ...prevData,
            farmer_id: farmerId,
            farm_id: '',
        }));
    };

    // const handleViewRecommendation = (recommendationId: number) => {
    //     console.log('Viewing recommendation ID:', recommendationId);

    //     router.get(route('recommendation.showCropRecommendation', { recommendation: recommendationId }));
    // };
    const getCropFertilizerRate = (fertilizer_recommendations: Fertilizer_recommendations): string => {
        console.log('Fertilizer Recommendations:', fertilizer_recommendations);

        try {
            if (!fertilizer_recommendations) {
                return 'N/A';
            }

            const nitrogen = fertilizer_recommendations.nitrogen?.crop_fertilizer?.[0]?.nitrogen_rate || '0';
            const phosphorus = fertilizer_recommendations.phosphorus?.crop_fertilizer?.[0]?.phosphorus_rate || '0';
            const potassium = fertilizer_recommendations.potassium?.crop_fertilizer?.[0]?.potassium_rate || '0';

            const unit_of_measure = fertilizer_recommendations.nitrogen?.crop_fertilizer?.[0]?.unit_of_measure || '';

            return `${nitrogen}-${phosphorus}-${potassium} ${unit_of_measure}`;
        } catch (error) {
            console.error('Error parsing fertilizer rate:', error);
            return 'N/A';
        }
    };

    const handleDownloadPdf = (recommendationId: number) => {
        toast.promise(
            new Promise((resolve) => {
                window.open(route('recommendation.downloadRecommendationPdf', { recommendation: recommendationId }));
                setTimeout(() => resolve('Success'), 1000);
            }),
            {
                loading: 'Preparing PDF download...',
                success: 'PDF download started!',
                error: 'Failed to download PDF',
            },
        );
    };

    const handlePreviewPdf = (recommendationId: number) => {
        window.open(route('recommendation.showCropRecommendation', { recommendation: recommendationId }), '_blank');
    };

    const handleGenerateRecommendation = () => {
        post('/recommendation/crop', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Recommendation Generated', {
                    description: 'The crop recommendation has been successfully generated.',
                });
            },
            onError: (errors) => {
                console.error('Recommendation generation failed:', errors);
                // Display user-friendly error messages
                const errorMessages = Object.values(errors).flat();
                if (errorMessages.length > 0) {
                    toast.error('Failed to generate recommendation', {
                        description: errorMessages.join(', '),
                    });
                } else {
                    toast.error('Failed to generate recommendation', {
                        description: 'Please check your inputs and try again.',
                    });
                }
            },
        });
    };

    const handleFetchClimate = async () => {
        setIsFetchingClimate(true);

        try {
            // Simulate API call - replace this with actual climate data fetching
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Use setData to update form state with random climate values
            setData((prevData) => ({
                ...prevData,
                temperature: (Math.random() * 30 + 15).toFixed(1), // Random temp between 15-45°C
                rainfall: Math.floor(Math.random() * 500 + 50).toString(), // Random rainfall 50-550mm
                humidity: Math.floor(Math.random() * 40 + 40).toString(), // Random humidity 40-80%
            }));

            toast.success('Climate Data Fetched', {
                description: 'Climate data has been successfully fetched.',
            });
        } catch (error) {
            console.error('Error fetching climate data:', error);
            toast.error('Failed to fetch climate data', {
                description: 'Please try again.',
            });
        } finally {
            setIsFetchingClimate(false);
        }
    };

    const getSoilTest = (farmer_id: string, farm_id: string) => {
        const farmer = farmers.find((farmer) => farmer.id === Number(farmer_id));
        if (!farmer) {
            console.log('Farmer not found');
            setIsRetrievingSoilTest(false);
            return;
        }

        const farm = farmer.farms?.find((farm) => farm.id === Number(farm_id));
        if (!farm || !farm.soils || farm.soils.length === 0) {
            console.log('Farm or soil data not found');
            toast.error('No soil test data found', {
                description: 'No soil test records found for this farm.',
            });
            setIsRetrievingSoilTest(false);
            return;
        }

        // Sort soils by created_at (latest first) and get the most recent one
        const latestSoilTest = farm.soils.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

        // Update form data with the latest soil test results
        setData((prevData) => ({
            ...prevData,
            soilType: latestSoilTest.soil_type || '',
            nitrogen_level: latestSoilTest.nitrogen_level || '',
            phosphorus_level: latestSoilTest.phosphorus_level || '',
            potassium_level: latestSoilTest.potassium_level || '',
            ph_level: latestSoilTest.pH || 7.0,
        }));

        toast.success('Soil test data retrieved', {
            description: `Using soil test data from ${new Date(latestSoilTest.created_at).toLocaleDateString()} at ${new Date(
                latestSoilTest.created_at,
            ).toLocaleTimeString()}`,
        });

        setIsRetrievingSoilTest(false);
    };

    const handleRetrieveSoilTest = () => {
        setIsRetrievingSoilTest(true);
        getSoilTest(data.farmer_id, data.farm_id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crop Recommendation" />
            {/* Wrap the main content with TooltipProvider for tooltips to work */}
            <TooltipProvider>
                <main className="flex h-full flex-1 flex-col gap-4 p-3 sm:p-4 md:p-6">
                    <Card className="rounded-xl shadow-sm">
                        <CardHeader className="space-y-1 p-4 sm:p-6">
                            <CardTitle className="text-lg font-bold text-gray-900 sm:text-xl">Farmer & Farm Selection</CardTitle>
                            <p className="text-xs text-gray-600 sm:text-sm">Select the farmer and their farm to generate recommendations</p>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="farmer" className="text-sm font-medium text-gray-700">
                                        Select Farmer{' '}
                                        <span className="text-red-500" aria-label="required">
                                            *
                                        </span>
                                    </Label>
                                    <SearchableSelect
                                        options={farmers.map((farmer) => ({
                                            value: String(farmer.id),
                                            label: `${farmer.firstname} ${farmer.lastname}`,
                                        }))}
                                        value={data.farmer_id}
                                        onValueChange={handleFarmerChange}
                                        placeholder="Select Farmer"
                                        searchPlaceholder="Search farmers..."
                                        clearable
                                    />
                                    {errors.farmer_id && (
                                        <div id="farmer-error" className="text-xs text-red-600">
                                            {errors.farmer_id}
                                        </div>
                                    )}
                                    <div id="farmer-help" className="text-xs text-gray-500">
                                        Choose the farmer to associate with this recommendation
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="farm" className="text-sm font-medium text-gray-700">
                                        Select Farm{' '}
                                        <span className="text-red-500" aria-label="required">
                                            *
                                        </span>
                                    </Label>
                                    <SearchableSelect
                                        options={availableFarms.map((farm) => ({
                                            value: String(farm.id),
                                            label: `${farm.name} (${farm.total_area} ha)`,
                                        }))}
                                        value={data.farm_id}
                                        onValueChange={(value) => setData('farm_id', value)}
                                        placeholder={data.farmer_id ? 'Select Farm' : 'Select a farmer first'}
                                        searchPlaceholder="Search farms..."
                                        disabled={!data.farmer_id || availableFarms.length === 0}
                                        clearable
                                    />
                                    {errors.farm_id && (
                                        <div id="farm-error" className="text-xs text-red-600">
                                            {errors.farm_id}
                                        </div>
                                    )}
                                    <div id="farm-help" className="text-xs text-gray-500">
                                        {data.farmer_id
                                            ? availableFarms.length === 0
                                                ? 'This farmer has no farms registered'
                                                : 'Choose the farm to associate with this recommendation'
                                            : 'Select a farmer first to see available farms'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <Card className="rounded-xl shadow-sm">
                            <CardHeader className="space-y-3 p-4 sm:p-6">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                        <CardTitle
                                            id="soil-data-heading"
                                            className="text-base font-semibold text-gray-900 sm:text-lg"
                                        >
                                            Soil Test Information
                                        </CardTitle>
                                        <p className="text-xs text-gray-600 sm:text-sm">Provide your soil test details below for accurate recommendations.</p>
                                    </div>
                                    <Button
                                        onClick={handleRetrieveSoilTest}
                                        className="w-full shrink-0 bg-green-500 text-sm hover:bg-green-600 sm:w-auto"
                                        type="button"
                                        size="sm"
                                        disabled={isRetrievingSoilTest || !data.farmer_id || !data.farm_id}
                                    >
                                        {isRetrievingSoilTest ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Retrieving...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                                Retrieve Soil Test
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="soil-type" className="text-sm font-medium text-gray-700">
                                            Soil Type{' '}
                                            <span className="text-red-500" aria-label="required">
                                                *
                                            </span>
                                        </Label>
                                        <Select onValueChange={(value) => setData('soilType', value)} value={data.soilType}>
                                            <SelectTrigger className="h-10 border-[#005a23] focus:ring-2 focus:ring-[#619154]">
                                                <SelectValue placeholder="Select Soil Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Clay">Clay</SelectItem>
                                                <SelectItem value="Loamy">Loamy</SelectItem>
                                                <SelectItem value="Peaty">Peaty</SelectItem>
                                                <SelectItem value="Saline">Saline</SelectItem>
                                                <SelectItem value="Sandy">Sandy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div id="soil-type-help" className="text-xs text-gray-500">
                                            Select the primary soil type of your farm
                                        </div>
                                    </div>

                                    <fieldset className="space-y-4">
                                        <legend className="sr-only">Nutrient Levels</legend>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            {/* --- Nitrogen with Tooltip --- */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor="nitrogen-level" className="text-xs font-medium text-gray-700 sm:text-sm">
                                                        Nitrogen (N)
                                                    </Label>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-3.5 w-3.5 cursor-help text-gray-500 sm:h-4 sm:w-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="max-w-xs text-xs">Aids in vegetative growth (leaves, stems) and is a core component of chlorophyll.</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                                <Select onValueChange={(value) => setData('nitrogen_level', value)} value={data.nitrogen_level}>
                                                    <SelectTrigger className="h-10 border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                                        <SelectValue placeholder="Select Level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-sm bg-yellow-400 sm:h-4 sm:w-4"></div>
                                                                <span className="text-xs sm:text-sm">Low</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="medium">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-sm bg-lime-500 sm:h-4 sm:w-4"></div>
                                                                <span className="text-xs sm:text-sm">Medium</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="high">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-sm bg-green-800 sm:h-4 sm:w-4"></div>
                                                                <span className="text-xs sm:text-sm">High</span>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* --- Phosphorus with Tooltip --- */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor="phosphorus-level" className="text-xs font-medium text-gray-700 sm:text-sm">
                                                        Phosphorus (P)
                                                    </Label>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-3.5 w-3.5 cursor-help text-gray-500 sm:h-4 sm:w-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="max-w-xs text-xs">Promotes root development, accelerates crop maturation, and increases the grain/fruit-to-stalk ratio.</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                                <Select onValueChange={(value) => setData('phosphorus_level', value)} value={data.phosphorus_level}>
                                                    <SelectTrigger className="h-10 border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                                        <SelectValue placeholder="Select Level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-sm bg-blue-100 sm:h-4 sm:w-4"></div>
                                                                <span className="text-xs sm:text-sm">Low</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="medium">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-sm bg-blue-500 sm:h-4 sm:w-4"></div>
                                                                <span className="text-xs sm:text-sm">Medium</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="high">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-sm bg-blue-900 sm:h-4 sm:w-4"></div>
                                                                <span className="text-xs sm:text-sm">High</span>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* --- Potassium with Tooltip --- */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor="potassium-level" className="text-xs font-medium text-gray-700 sm:text-sm">
                                                        Potassium (K)
                                                    </Label>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-3.5 w-3.5 cursor-help text-gray-500 sm:h-4 sm:w-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="max-w-xs text-xs">Enhances produce quality (flavor, color, size), boosts disease resistance, and improves drought tolerance.</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                                <Select onValueChange={(value) => setData('potassium_level', value)} value={data.potassium_level}>
                                                    <SelectTrigger className="h-10 border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                                        <SelectValue placeholder="Select Level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-sm bg-red-800 sm:h-4 sm:w-4"></div>
                                                                <span className="text-xs sm:text-sm">Low</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="medium">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-sm bg-amber-800 sm:h-4 sm:w-4"></div>
                                                                <span className="text-xs sm:text-sm">Medium</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="high">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-sm bg-amber-400 sm:h-4 sm:w-4"></div>
                                                                <span className="text-xs sm:text-sm">High</span>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </fieldset>

                                    <div className="space-y-2">
                                        <Label htmlFor="ph-level" className="text-sm font-medium text-gray-700">
                                            pH Level{' '}
                                            <span className="text-red-500" aria-label="required">
                                                *
                                            </span>
                                        </Label>
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <Input
                                                id="ph-level"
                                                name="ph_level"
                                                className="flex-1 text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                value={data.ph_level}
                                                onChange={(e) => setData('ph_level', Number(e.target.value))}
                                                required
                                                type="range"
                                                step="0.1"
                                                min="0"
                                                max="14"
                                            />
                                            <span className="w-10 shrink-0 text-center text-base font-bold text-gray-900 sm:w-12 sm:text-lg">{Number(data.ph_level).toFixed(1)}</span>
                                        </div>
                                        <div id="ph-help" className="text-xs text-gray-500">
                                            Soil acidity/alkalinity level (0-14 scale)
                                        </div>
                                    </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-xl shadow-sm">
                            <CardHeader className="space-y-3 p-4 sm:p-6">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                        <CardTitle
                                            id="climate-data-heading"
                                            className="text-base font-semibold text-gray-900 sm:text-lg"
                                        >
                                            Climate Data
                                        </CardTitle>
                                        <p className="text-xs text-gray-600 sm:text-sm">Fetch or enter climate details below for accurate recommendations.</p>
                                    </div>
                                    <Button
                                        onClick={handleFetchClimate}
                                        className="w-full shrink-0 bg-blue-500 text-sm hover:bg-blue-600 sm:w-auto"
                                        type="button"
                                        size="sm"
                                        disabled={isFetchingClimate}
                                    >
                                        {isFetchingClimate ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Fetching...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                                </svg>
                                                Fetch Climate Data
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
                                    {/* --- Temperature with Tooltip --- */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="temperature" className="text-xs font-medium text-gray-700 sm:text-sm">
                                                Temperature (°C){' '}
                                                <span className="text-red-500" aria-label="required">
                                                    *
                                                </span>
                                            </Label>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-3.5 w-3.5 cursor-help text-gray-500 sm:h-4 sm:w-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs text-xs">
                                                        Regulates key processes like germination and flowering. Each crop has an optimal temperature range.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <Input
                                            id="temperature"
                                            name="temperature"
                                            className="h-10 text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                            value={data.temperature}
                                            onChange={(e) => setData('temperature', e.target.value)}
                                            required
                                            type="number"
                                            step="0.1"
                                            autoComplete="off"
                                            placeholder="Average temperature"
                                        />
                                        <div id="temperature-help" className="text-xs text-gray-500">
                                            Enter the average temperature in Celsius for the growing season.
                                        </div>
                                    </div>

                                    {/* --- Rainfall with Tooltip --- */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="rainfall" className="text-xs font-medium text-gray-700 sm:text-sm">
                                                Rainfall (mm){' '}
                                                <span className="text-red-500" aria-label="required">
                                                    *
                                                </span>
                                            </Label>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-3.5 w-3.5 cursor-help text-gray-500 sm:h-4 sm:w-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs text-xs">
                                                        Insufficient rain causes drought, while excessive rain can lead to flooding and crop damage.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <Input
                                            id="rainfall"
                                            name="rainfall"
                                            className="h-10 text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                            value={data.rainfall}
                                            onChange={(e) => setData('rainfall', e.target.value)}
                                            required
                                            type="number"
                                            autoComplete="off"
                                            placeholder="Annual rainfall"
                                        />
                                        <div id="rainfall-help" className="text-xs text-gray-500">
                                            Enter the average annual rainfall in millimeters.
                                        </div>
                                    </div>

                                    {/* --- Humidity with Tooltip --- */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="humidity" className="text-xs font-medium text-gray-700 sm:text-sm">
                                                Humidity (%){' '}
                                                <span className="text-red-500" aria-label="required">
                                                    *
                                                </span>
                                            </Label>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-3.5 w-3.5 cursor-help text-gray-500 sm:h-4 sm:w-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs text-xs">Most plants thrive in 40-80% humidity. High levels can promote disease.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <Input
                                            id="humidity"
                                            name="humidity"
                                            className="h-10 text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                            value={data.humidity}
                                            onChange={(e) => setData('humidity', e.target.value)}
                                            required
                                            type="number"
                                            autoComplete="off"
                                            placeholder="Relative humidity"
                                        />
                                        <div id="humidity-help" className="text-xs text-gray-500">
                                            Enter the average relative humidity as a percentage.
                                        </div>
                                    </div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="rounded-xl shadow-sm">
                        <CardHeader className="space-y-3 p-4 sm:p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                                <Button
                                    onClick={handleGenerateRecommendation}
                                    disabled={
                                        processing ||
                                        !data.farmer_id ||
                                        !data.farm_id ||
                                        !data.soilType ||
                                        !data.nitrogen_level ||
                                        !data.potassium_level ||
                                        !data.phosphorus_level ||
                                        !data.ph_level ||
                                        !data.temperature ||
                                        !data.rainfall ||
                                        !data.humidity
                                    }
                                    className="w-full bg-green-500 px-6 py-5 text-base font-medium hover:bg-green-600 disabled:bg-gray-400 sm:w-auto sm:text-lg"
                                    type="button"
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                                                aria-hidden="true"
                                            ></div>
                                            <span>Generating...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="mr-2 inline-block h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                            Generate Recommendation
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div id="generate-help" className="text-center text-xs text-gray-500 sm:text-sm">
                                Complete all required fields including farmer and farm selection to generate crop recommendations
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-3">
                                <p className="text-xs text-gray-600 sm:text-sm">Your personalized crop recommendations will appear here after generation.</p>

                                {/* Confidence Score Guideline Accordion */}
                                <div className="rounded-lg border border-blue-200 bg-blue-50 transition-all duration-300 hover:shadow-md">
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="score-guideline" className="border-none">
                                            <AccordionTrigger className="px-3 py-3 transition-all duration-200 hover:no-underline sm:px-4 [&[data-state=open]>div>svg]:rotate-180">
                                                <div className="flex items-center gap-2 text-blue-900">
                                                    <Info className="h-4 w-4 flex-shrink-0 text-blue-600 transition-transform duration-200 sm:h-5 sm:w-5" />
                                                    <span className="text-xs font-semibold sm:text-sm">How Confidence Score is Determined</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-3 pb-4 animate-in fade-in-50 slide-in-from-top-2 duration-300 sm:px-4">
                                                <div className="space-y-2">
                                                    <p className="text-xs text-blue-800">
                                                        The confidence score represents how well your farm conditions match each crop's requirements. It is calculated based on:
                                                    </p>
                                                    <ul className="ml-4 space-y-1 text-xs text-blue-800">
                                                        <li className="flex items-start gap-2 animate-in fade-in-50 slide-in-from-left-2 duration-300" style={{ animationDelay: '100ms' }}>
                                                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                                                            <span><strong>Soil Type Match:</strong> Compatibility with the crop's preferred soil type</span>
                                                        </li>
                                                        <li className="flex items-start gap-2 animate-in fade-in-50 slide-in-from-left-2 duration-300" style={{ animationDelay: '200ms' }}>
                                                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                                                            <span><strong>Nutrient Levels:</strong> Nitrogen, Phosphorus, and Potassium alignment with crop needs</span>
                                                        </li>
                                                        <li className="flex items-start gap-2 animate-in fade-in-50 slide-in-from-left-2 duration-300" style={{ animationDelay: '300ms' }}>
                                                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                                                            <span><strong>pH Level:</strong> How close your soil pH is to the crop's optimal range</span>
                                                        </li>
                                                        <li className="flex items-start gap-2 animate-in fade-in-50 slide-in-from-left-2 duration-300" style={{ animationDelay: '400ms' }}>
                                                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                                                            <span><strong>Climate Conditions:</strong> Temperature, rainfall, and humidity match with crop requirements</span>
                                                        </li>
                                                    </ul>
                                                    <div className="mt-3 grid grid-cols-1 gap-2 text-xs animate-in fade-in-50 slide-in-from-bottom-2 duration-300 sm:grid-cols-2 lg:flex lg:flex-wrap" style={{ animationDelay: '500ms' }}>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="h-3 w-3 rounded-sm bg-green-600"></div>
                                                            <span className="text-blue-800"><strong>90-100%:</strong> Excellent match</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="h-3 w-3 rounded-sm bg-green-500"></div>
                                                            <span className="text-blue-800"><strong>80-89%:</strong> Very good match</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="h-3 w-3 rounded-sm bg-yellow-500"></div>
                                                            <span className="text-blue-800"><strong>70-79%:</strong> Good match</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="h-3 w-3 rounded-sm bg-orange-500"></div>
                                                            <span className="text-blue-800"><strong>Below 70%:</strong> May need adjustments</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                            {recommendationResult.length === 0 ? (
                                <div className="py-8 text-center text-gray-500 sm:py-12">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16" aria-hidden="true">
                                        <svg className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium sm:text-base">Click "Generate Recommendation" to see your results</p>
                                    <p className="mt-2 text-xs text-gray-400 sm:text-sm">All required fields must be completed first</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-xs sm:text-sm">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-3 py-2 font-semibold text-gray-700 sm:px-4">Crop Name</th>
                                                <th className="px-3 py-2 font-semibold text-gray-700 sm:px-4">Fertilizer Rate</th>
                                                <th className="px-3 py-2 font-semibold text-gray-700 sm:px-4">Confidence</th>
                                                <th className="px-3 py-2 font-semibold text-gray-700 sm:px-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recommendationResult.map((item, idx) => (
                                                <tr key={idx} className="border-b transition-colors hover:bg-gray-50 last:border-0">
                                                    <td className="px-3 py-3 font-medium sm:px-4">{item.crop_name}</td>
                                                    <td className="px-3 py-3 sm:px-4">
                                                        <span className="text-xs sm:text-sm">{getCropFertilizerRate(item.fertilizer_recommendations)}</span>
                                                    </td>
                                                    <td className="px-3 py-3 sm:px-4">
                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 sm:px-2.5">
                                                            {item.confidence_score}%
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-3 sm:px-4">
                                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        onClick={() => handleDownloadPdf(item.recommendation_id)}
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-7 w-7 border-[#D6E3D4] p-0 hover:border-[#619154] sm:h-8 sm:w-8"
                                                                    >
                                                                        <Download className="h-3.5 w-3.5 text-[#619154] sm:h-4 sm:w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs">Download PDF</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        onClick={() => handlePreviewPdf(item.recommendation_id)}
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-7 w-7 border-[#D6E3D4] p-0 hover:border-[#619154] sm:h-8 sm:w-8"
                                                                    >
                                                                        <Eye className="h-3.5 w-3.5 text-[#619154] sm:h-4 sm:w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs">Preview PDF</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </TooltipProvider>
        </AppLayout>
    );
}
