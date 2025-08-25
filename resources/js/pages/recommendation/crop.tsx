import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Farmer } from '@/types';
import { Head, useForm } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recommendation Crop',
        href: '/recommendation',
    },
];

export default function Crop({ farmers }: { farmers: Farmer[] }) {
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
    });


    const handleGenerateRecommendation = () => {

        post('/recommendation/crop', {
            onSuccess: () => {
                // Optionally reset the form or show a success message
            },
        });

    };

    const handleFetchClimate = () => {
        // Use setData to update the form state
        setData((prevData) => ({
            ...prevData,
            temperature: '28',
            rainfall: '150',
            humidity: '75',
        }));
    };

    const getNitrogenRange = (level: string) => {
        switch (level) {
            case 'very_low':
                return '<0.05%';
            case 'low':
                return '0.05-0.15%';
            case 'medium':
                return '>0.15-0.2%';
            case 'high':
                return '>0.2-0.3%';
            case 'very_high':
                return '>0.3%';
            default:
                return 'Total Nitrogen (%)';
        }
    };

    const getPotassiumRange = (level: string) => {
        switch (level) {
            case 'very_low':
                return '<0.3 cmol/kg';
            case 'low':
                return '0.3-1.0 cmol/kg';
            case 'medium':
                return '1.0-3.0 cmol/kg';
            case 'high':
                return '3.0-8.0 cmol/kg';
            case 'very_high':
                return '>8.0 cmol/kg';
            default:
                return 'Exchangeable K (cmol/kg)';
        }
    };

    const getPhosphorusRange = (level: string) => {
        // Bray or Olsen method is determined by pH
        const isBrayMethod = parseFloat(data.ph_level as unknown as string) <= 5.5;

        if (isBrayMethod) {
            switch (level) {
                case 'very_low':
                    return '<3 mg/kg (Bray)';
                case 'low':
                    return '3-10 mg/kg (Bray)';
                case 'medium':
                    return '>10-20 mg/kg (Bray)';
                case 'high':
                    return '>20-30 mg/kg (Bray)';
                case 'very_high':
                    return '>30 mg/kg (Bray)';
                default:
                    return 'Available P (Bray)';
            }
        } else {
            switch (level) {
                case 'very_low':
                    return '<3 mg/kg (Olsen)';
                case 'low':
                    return '0-7 mg/kg (Olsen)';
                case 'medium':
                    return '>7-25 mg/kg (Olsen)';
                case 'high':
                    return '>25-33 mg/kg (Olsen)';
                case 'very_high':
                    return '>33 mg/kg (Olsen)';
                default:
                    return 'Available P (Olsen)';
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crop Recommendation" />
            <main
                className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 sm:gap-6 sm:p-6 lg:p-8"
                style={{ backgroundColor: '#E6F4EA' }}
                role="main"
                aria-label="Crop recommendation system"
            >
                <div className="flex flex-col gap-4 rounded-lg border border-sidebar-border/70 bg-white p-4 sm:gap-6 sm:p-6 lg:p-8 dark:border-sidebar-border">
                    <Card className="border-[#D6E3D4]">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900 sm:text-2xl">Crop Recommendation System</CardTitle>
                                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                                        Get intelligent crop recommendations based on soil factors and environmental conditions
                                    </p>
                                </div>
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
                                        onValueChange={(value) => setData('farmer_id', value)}
                                        placeholder="Select Farmer"
                                        searchPlaceholder="Search farmers..."
                                        clearable
                                        aria-describedby={errors.farmer_id ? 'farmer-error' : 'farmer-help'}
                                        aria-invalid={errors.farmer_id ? 'true' : 'false'}
                                    />
                                    <div id="farmer-help" className="text-xs text-gray-500">
                                        Choose the farmer who will manage this farm
                                    </div>
                                    {/* <InputError message={errors.farmer_id} id="farmer-error" /> */}
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
                        <Card className="border-[#D6E3D4]" role="region" aria-labelledby="soil-test-heading">
                            <CardHeader>
                                <CardTitle id="soil-test-heading" className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                                    Soil Test Information
                                </CardTitle>
                                <p className="text-sm text-gray-600">Provide your soil test details below for accurate recommendations.</p>
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
                                            <SelectTrigger
                                                className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                aria-describedby="soil-type-help"
                                                aria-invalid={!data.soilType ? 'true' : 'false'}
                                            >
                                                <SelectValue placeholder="Select Soil Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sandy">Sandy</SelectItem>
                                                <SelectItem value="clay">Clay</SelectItem>
                                                <SelectItem value="loamy">Loamy</SelectItem>
                                                <SelectItem value="peaty">Peaty</SelectItem>
                                                <SelectItem value="silty">Silty</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div id="soil-type-help" className="text-xs text-gray-500">
                                            Select the primary soil type of your farm
                                        </div>
                                    </div>

                                    <fieldset className="space-y-4">
                                        <legend className="mb-2 text-sm font-medium text-gray-700">
                                            Soil Nutrients{' '}
                                            <span className="text-red-500" aria-label="required">
                                                *
                                            </span>
                                        </legend>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="nitrogen-level" className="text-sm font-medium text-gray-700">
                                                    Nitrogen (N)
                                                </Label>
                                                <Select onValueChange={(value) => setData('nitrogen_level', value)} value={data.nitrogen_level}>
                                                    <SelectTrigger className="w-full border border-[#D6E3D4] focus:border-transparent focus:ring-2 focus:ring-[#619154]">
                                                        <SelectValue placeholder="Select Level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="very_low">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-4 w-4 rounded-sm bg-red-600"></div>
                                                                Very Low
                                                            </div>
                                                        </SelectItem>
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
                                                        <SelectItem value="very_high">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-4 w-4 rounded-sm bg-green-900"></div>
                                                                Very High
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <div className="text-xs text-gray-500">{getNitrogenRange(data.nitrogen_level)}</div>
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
                                                        <SelectItem value="very_low">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-4 w-4 rounded-sm bg-red-600"></div>
                                                                Very Low
                                                            </div>
                                                        </SelectItem>
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
                                                        <SelectItem value="very_high">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-4 w-4 rounded-sm bg-yellow-400"></div>
                                                                Very High
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <div className="text-xs text-gray-500">{getPotassiumRange(data.potassium_level)}</div>
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
                                                        <SelectItem value="very_low">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-4 w-4 rounded-sm bg-blue-300"></div>
                                                                Very Low
                                                            </div>
                                                        </SelectItem>
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
                                                        <SelectItem value="very_high">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-4 w-4 rounded-sm bg-indigo-900"></div>
                                                                Very High
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <div className="text-xs text-gray-500">{getPhosphorusRange(data.phosphorus_level)}</div>
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
                                                className="w-full text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                                value={data.ph_level}
                                                onChange={(e) => setData('ph_level', Number(e.target.value))}
                                                required
                                                type="range"
                                                step="0.1"
                                                min="0"
                                                max="14"
                                                aria-describedby="ph-help"
                                                aria-invalid={!data.ph_level ? 'true' : 'false'}
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

                        <Card className="border-[#D6E3D4]" role="region" aria-labelledby="climate-data-heading">
                            <CardHeader>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                                        className="w-fit shrink-0 bg-blue-500 text-white transition-colors hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        type="button"
                                        aria-describedby="fetch-climate-help"
                                    >
                                        Fetch Climate Data
                                    </Button>
                                </div>
                                <div id="fetch-climate-help" className="text-xs text-gray-500">
                                    Automatically fetch current climate data for the selected location
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
                                            className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                            value={data.temperature}
                                            onChange={(e) => setData('temperature', e.target.value)}
                                            required
                                            type="number"
                                            step="0.1"
                                            min="-10"
                                            max="50"
                                            autoComplete="off"
                                            placeholder="Average temperature"
                                            aria-describedby="temperature-help"
                                            aria-invalid={!data.temperature ? 'true' : 'false'}
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
                                            className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                            value={data.rainfall}
                                            onChange={(e) => setData('rainfall', e.target.value)}
                                            required
                                            type="number"
                                            min="0"
                                            max="1000"
                                            autoComplete="off"
                                            placeholder="Annual rainfall"
                                            aria-describedby="rainfall-help"
                                            aria-invalid={!data.rainfall ? 'true' : 'false'}
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
                                            className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-transparent focus:ring-2 focus:ring-[#619154]"
                                            value={data.humidity}
                                            onChange={(e) => setData('humidity', e.target.value)}
                                            required
                                            type="number"
                                            min="0"
                                            max="100"
                                            autoComplete="off"
                                            placeholder="Relative humidity"
                                            aria-describedby="humidity-help"
                                            aria-invalid={!data.humidity ? 'true' : 'false'}
                                        />
                                        <div id="humidity-help" className="text-xs text-gray-500">
                                            Relative humidity percentage (0-100%)
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-center pt-6">
                        <Button
                            onClick={handleGenerateRecommendation}
                            disabled={
                                !data.farmer_id ||
                                !data.soilType ||
                                !data.nitrogen_level ||
                                !data.potassium_level ||
                                !data.phosphorus_level ||
                                !data.ph_level ||
                                !data.temperature ||
                                !data.rainfall ||
                                !data.humidity ||
                                processing
                            }
                            className="bg-green-500 px-8 py-3 text-lg font-medium text-white transition-all hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                            type="button"
                            aria-describedby="generate-help"
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
                        Complete all required fields to generate crop recommendations
                    </div>

                    <Card className="border-[#D6E3D4]" role="region" aria-labelledby="results-heading">
                        <CardHeader>
                            <CardTitle id="results-heading" className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                                Recommendation Results
                            </CardTitle>
                            <p className="text-sm text-gray-600">Your personalized crop recommendations will appear here after generation.</p>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>

                    <Card className="border-[#D6E3D4]" role="region" aria-labelledby="results-heading">
                        <CardHeader>
                            <CardTitle id="results-heading" className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                                Recent Recommendation Results
                            </CardTitle>
                            <p className="text-sm text-gray-600">Recent personalized crop recommendations will appear here.</p>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                </div>
            </main>
        </AppLayout>
    );
}
