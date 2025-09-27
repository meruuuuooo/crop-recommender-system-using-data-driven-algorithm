import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Farmer, Fertilizer_recommendations, Recommendation, RecommendationResult } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Download, Eye, Loader2 } from 'lucide-react';
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
            description: `Using soil test data from ${new Date(latestSoilTest.created_at).toLocaleDateString()} at ${new Date(latestSoilTest.created_at).toLocaleTimeString()}`,
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
            <main className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <Card className="rounded-xl px-6 py-2">
                    <div className="flex flex-col ">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900">Farmer & Farm Selection</CardTitle>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
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
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <Card className="rounded-xl">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle
                                        id="climate-data-heading"
                                        className="border-b border-gray-200 pb-1 text-lg font-semibold text-gray-900"
                                    >
                                        Soil Test Information
                                    </CardTitle>
                                    <p className="text-sm text-gray-600">Provide your soil test details below for accurate recommendations.</p>
                                </div>
                                <Button
                                    onClick={handleRetrieveSoilTest}
                                    className="shrink-0 bg-green-500 hover:bg-green-600"
                                    type="button"
                                    disabled={isRetrievingSoilTest || !data.farmer_id || !data.farm_id}
                                >
                                    {isRetrievingSoilTest ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Retrieving...
                                        </>
                                    ) : (
                                        'Retrieve Farm Soil Test'
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="soil-type" className="text-sm font-medium text-gray-700">
                                        Soil Type{' '}
                                        <span className="text-red-500" aria-label="required">
                                            *
                                        </span>
                                    </Label>
                                    <Select onValueChange={(value) => setData('soilType', value)} value={data.soilType}>
                                        <SelectTrigger className="border-[#005a23] focus:ring-2 focus:ring-[#619154]">
                                            <SelectValue placeholder="Select Soil Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* <SelectItem value="sandy">Sand</SelectItem>
                                                <SelectItem value="sandy_loam">Sandy Loam</SelectItem>
                                                <SelectItem value="loam">Loam</SelectItem>
                                                <SelectItem value="silt_loam">Silt Loam</SelectItem>
                                                <SelectItem value="clay_loam">Clay Loam</SelectItem>
                                                <SelectItem value="clay">Clay</SelectItem> */}
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
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="nitrogen-level" className="text-sm font-medium text-gray-700">
                                                Nitrogen (N)
                                            </Label>
                                            <Select onValueChange={(value) => setData('nitrogen_level', value)} value={data.nitrogen_level}>
                                                <SelectTrigger className="border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
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
                                                <SelectTrigger className="border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
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
                                                <SelectTrigger className="border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
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

                                <div className="space-y-2">
                                    <Label htmlFor="ph-level" className="text-sm font-medium text-gray-700">
                                        pH Level{' '}
                                        <span className="text-red-500" aria-label="required">
                                            *
                                        </span>
                                    </Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="ph-level"
                                            name="ph_level"
                                            className="text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                            value={data.ph_level}
                                            onChange={(e) => setData('ph_level', Number(e.target.value))}
                                            required
                                            type="range"
                                            step="0.1"
                                            min="0"
                                            max="14"
                                        />
                                        <span className="w-12 text-center text-lg font-bold text-gray-900">{Number(data.ph_level).toFixed(1)}</span>
                                    </div>
                                    <div id="ph-help" className="text-xs text-gray-500">
                                        Soil acidity/alkalinity level (0-14 scale)
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle
                                        id="climate-data-heading"
                                        className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900"
                                    >
                                        Climate Data
                                    </CardTitle>
                                    <p className="text-sm text-gray-600">Fetch or enter climate details below for accurate recommendations.</p>
                                </div>
                                <Button
                                    onClick={handleFetchClimate}
                                    className="shrink-0 bg-blue-500 hover:bg-blue-600"
                                    type="button"
                                    disabled={isFetchingClimate}
                                >
                                    {isFetchingClimate ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Fetching...
                                        </>
                                    ) : (
                                        'Fetch Climate Data'
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="temperature" className="text-sm font-medium text-gray-700">
                                        Temperature (°C){' '}
                                        <span className="text-red-500" aria-label="required">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="temperature"
                                        name="temperature"
                                        className="text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                        value={data.temperature}
                                        onChange={(e) => setData('temperature', e.target.value)}
                                        required
                                        type="number"
                                        step="0.1"
                                        autoComplete="off"
                                        placeholder="Average temperature"
                                    />
                                    <div id="temperature-help" className="text-xs text-gray-500">
                                        Average temperature in Celsius (-10°C to 50°C)
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rainfall" className="text-sm font-medium text-gray-700">
                                        Rainfall (mm){' '}
                                        <span className="text-red-500" aria-label="required">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="rainfall"
                                        name="rainfall"
                                        className=" text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                        value={data.rainfall}
                                        onChange={(e) => setData('rainfall', e.target.value)}
                                        required
                                        type="number"
                                        autoComplete="off"
                                        placeholder="Annual rainfall"
                                    />
                                    <div id="rainfall-help" className="text-xs text-gray-500">
                                        Annual rainfall in millimeters (0-1000mm)
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="humidity" className="text-sm font-medium text-gray-700">
                                        Humidity (%){' '}
                                        <span className="text-red-500" aria-label="required">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="humidity"
                                        name="humidity"
                                        className=" text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                        value={data.humidity}
                                        onChange={(e) => setData('humidity', e.target.value)}
                                        required
                                        type="number"
                                        autoComplete="off"
                                        placeholder="Relative humidity"
                                    />
                                    <div id="humidity-help" className="text-xs text-gray-500">
                                        Relative humidity percentage (0-100%)
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="rounded-xl">
                    <CardHeader>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-1 lg:grid-cols-1">
                            <div className="flex justify-center">
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
                                    className="bg-green-500 px-4 py-4 text-lg font-medium hover:bg-green-600 disabled:bg-gray-400"
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
                                        'Generate Recommendation'
                                    )}
                                </Button>
                            </div>
                            <div id="generate-help" className="text-center text-xs text-gray-500">
                                Complete all required fields including farmer and farm selection to generate crop recommendations
                            </div>
                        </div>
                        <Separator/>
                        <p className="text-sm text-gray-600">Your personalized crop recommendations will appear here after generation.</p>
                    </CardHeader>
                    <CardContent>
                        {recommendationResult.length === 0 ? (
                            <div className="text-center text-gray-500">
                                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100" aria-hidden="true">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm">Click "Generate Recommendation" to see your results</p>
                                <p className="mt-1 text-xs text-gray-400">All required fields must be completed first</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 font-semibold text-gray-700">Crop Name</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Fertilizer Rate</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Confidence Score</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recommendationResult.map((item, idx) => (
                                            <tr key={idx} className="border-b last:border-0">
                                                <td className="px-4 py-2 font-medium">{item.crop_name}</td>
                                                <td className="px-4 py-2">{getCropFertilizerRate(item.fertilizer_recommendations)}</td>
                                                <td className="px-4 py-2">
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                        {item.confidence_score}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    onClick={() => handleDownloadPdf(item.recommendation_id)}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 w-8 border-[#D6E3D4] p-0 hover:border-[#619154]"
                                                                >
                                                                    <Download className="h-4 w-4 text-[#619154]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Download</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    onClick={() => handlePreviewPdf(item.recommendation_id)}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 w-8 border-[#D6E3D4] p-0 hover:border-[#619154]"
                                                                >
                                                                    <Eye className="h-4 w-4 text-[#619154]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Preview</p>
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

                {/* <Card className='rounded-xl' >
                    <CardHeader>
                        <CardTitle id="recent-results-heading" className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                            Recent Recommendation Results
                        </CardTitle>
                        <p className="text-sm text-gray-600">Recent personalized crop recommendations will appear here.</p>
                    </CardHeader>
                    <CardContent>
                        {recent_recommendations.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100" aria-hidden="true">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-base">Click "Generate Recommendation" to see your results</p>
                                <p className="mt-1 text-sm text-gray-400">All required fields must be completed first</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 font-semibold text-gray-700">Farmer</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Crop</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Score</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Time</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Date</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recent_recommendations.map((item, idx) => (
                                            <tr key={idx} className="border-b last:border-0">
                                                <td className="px-4 py-2">{item.farmer?.lastname}</td>
                                                <td className="px-4 py-2">{item.crop?.name}</td>
                                                <td className="px-4 py-2">
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                        {item.confidence_score.toFixed(2)}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {new Date(item.created_at).toLocaleTimeString('en-US', {
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        second: 'numeric',
                                                    })}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {new Date(item.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    onClick={() => handleDownloadPdf(item.id)}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 w-8 border-[#D6E3D4] p-0 hover:border-[#619154]"
                                                                >
                                                                    <Download className="h-4 w-4 text-[#619154]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>View</p>
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
                </Card> */}
            </main>
        </AppLayout>
    );
}
