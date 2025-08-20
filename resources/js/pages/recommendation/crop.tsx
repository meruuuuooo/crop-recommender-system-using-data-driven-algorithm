import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect, type SearchableSelectOption } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recommendation Crop',
        href: '/recommendation',
    },
];

// Sample data for searchable selects
const farmerOptions: SearchableSelectOption[] = [
    { value: 'mailem', label: 'Mailem' },
    { value: 'dano', label: 'Dano' },
    { value: 'pelin', label: 'Pelin' },
    { value: 'john', label: 'John Smith' },
    { value: 'jane', label: 'Jane Doe' },
    { value: 'mike', label: 'Mike Johnson' },
    { value: 'sarah', label: 'Sarah Williams' },
    { value: 'david', label: 'David Brown' },
];

export default function Crop() {
    const [selectedFarmer, setSelectedFarmer] = useState<string>('');
    const [soilType, setSoilType] = useState<string>('');
    const [nitrogen, setNitrogen] = useState<string>('');
    const [potassium, setPotassium] = useState<string>('');
    const [phosphorus, setPhosphorus] = useState<string>('');
    const [phLevel, setPhLevel] = useState<string>('');
    const [temperature, setTemperature] = useState<string>('');
    const [rainfall, setRainfall] = useState<string>('');
    const [humidity, setHumidity] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const handleGenerateRecommendation = () => {
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            setIsGenerating(false);
        }, 2000);
    };

    const handleFetchClimate = () => {
        // Simulate fetching climate data
        setTemperature('28');
        setRainfall('150');
        setHumidity('75');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crop Recommendation" />
            <main
                className="flex h-full flex-1 flex-col gap-4 sm:gap-6 overflow-x-auto p-4 sm:p-6 lg:p-8"
                style={{ backgroundColor: '#E6F4EA' }}
                role="main"
                aria-label="Crop recommendation system"
            >
                <div className="flex flex-col gap-4 sm:gap-6 rounded-lg border border-sidebar-border/70 bg-white p-4 sm:p-6 lg:p-8 dark:border-sidebar-border">
                    <Card className="border-[#D6E3D4]">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                                        Crop Recommendation System
                                    </CardTitle>
                                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                        Get intelligent crop recommendations based on soil factors and environmental conditions
                                    </p>
                                </div>
                                <div className="w-full sm:w-auto">
                                    <Label htmlFor="farmer-select" className="text-sm font-medium text-gray-700 block mb-2">
                                        Select Farmer <span className="text-red-500" aria-label="required">*</span>
                                    </Label>
                                    <SearchableSelect
                                        options={farmerOptions}
                                        value={selectedFarmer}
                                        onValueChange={setSelectedFarmer}
                                        placeholder="Select Farmer"
                                        searchPlaceholder="Search farmers..."
                                        className="w-full sm:w-[300px]"
                                        clearable
                                        aria-describedby="farmer-help"
                                        aria-invalid={!selectedFarmer ? "true" : "false"}
                                    />
                                    <div id="farmer-help" className="text-xs text-gray-500 mt-1">
                                        Choose the farmer for whom you want to generate crop recommendations
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                        <Card className="border-[#D6E3D4]" role="region" aria-labelledby="soil-test-heading">
                            <CardHeader>
                                <CardTitle id="soil-test-heading" className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                    Soil Test Information
                                </CardTitle>
                                <p className="text-sm text-gray-600">
                                    Provide your soil test details below for accurate recommendations.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="soil-type" className="text-sm font-medium text-gray-700">
                                            Soil Type <span className="text-red-500" aria-label="required">*</span>
                                        </Label>
                                        <Select
                                            onValueChange={setSoilType}
                                            value={soilType}
                                        >
                                            <SelectTrigger
                                                className="w-full border border-[#D6E3D4] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                                aria-describedby="soil-type-help"
                                                aria-invalid={!soilType ? "true" : "false"}
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
                                        <legend className="text-sm font-medium text-gray-700 mb-2">
                                            Soil Nutrients (mg/kg) <span className="text-red-500" aria-label="required">*</span>
                                        </legend>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="nitrogen" className="text-sm font-medium text-gray-700">
                                                    Nitrogen (N)
                                                </Label>
                                                <Input
                                                    id="nitrogen"
                                                    name="nitrogen"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                                    value={nitrogen}
                                                    onChange={(e) => setNitrogen(e.target.value)}
                                                    required
                                                    type="number"
                                                    min="0"
                                                    max="500"
                                                    autoComplete="off"
                                                    placeholder="0-500"
                                                    aria-describedby="nitrogen-help"
                                                    aria-invalid={!nitrogen ? "true" : "false"}
                                                />
                                                <div id="nitrogen-help" className="text-xs text-gray-500">
                                                    Nitrogen content in mg/kg
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="potassium" className="text-sm font-medium text-gray-700">
                                                    Potassium (K)
                                                </Label>
                                                <Input
                                                    id="potassium"
                                                    name="potassium"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                                    value={potassium}
                                                    onChange={(e) => setPotassium(e.target.value)}
                                                    required
                                                    type="number"
                                                    min="0"
                                                    max="1000"
                                                    autoComplete="off"
                                                    placeholder="0-1000"
                                                    aria-describedby="potassium-help"
                                                    aria-invalid={!potassium ? "true" : "false"}
                                                />
                                                <div id="potassium-help" className="text-xs text-gray-500">
                                                    Potassium content in mg/kg
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phosphorus" className="text-sm font-medium text-gray-700">
                                                    Phosphorus (P)
                                                </Label>
                                                <Input
                                                    id="phosphorus"
                                                    name="phosphorus"
                                                    className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                                    value={phosphorus}
                                                    onChange={(e) => setPhosphorus(e.target.value)}
                                                    required
                                                    type="number"
                                                    min="0"
                                                    max="200"
                                                    autoComplete="off"
                                                    placeholder="0-200"
                                                    aria-describedby="phosphorus-help"
                                                    aria-invalid={!phosphorus ? "true" : "false"}
                                                />
                                                <div id="phosphorus-help" className="text-xs text-gray-500">
                                                    Phosphorus content in mg/kg
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>

                                    <div className="space-y-2">
                                        <Label htmlFor="ph-level" className="text-sm font-medium text-gray-700">
                                            pH Level <span className="text-red-500" aria-label="required">*</span>
                                        </Label>
                                        <Input
                                            id="ph-level"
                                            name="ph_level"
                                            className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                            value={phLevel}
                                            onChange={(e) => setPhLevel(e.target.value)}
                                            required
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="14"
                                            autoComplete="off"
                                            placeholder="0.0 - 14.0"
                                            aria-describedby="ph-help"
                                            aria-invalid={!phLevel ? "true" : "false"}
                                        />
                                        <div id="ph-help" className="text-xs text-gray-500">
                                            Soil acidity/alkalinity level (0-14 scale)
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-[#D6E3D4]" role="region" aria-labelledby="climate-data-heading">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle id="climate-data-heading" className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                            Climate Data
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Fetch or enter climate details below for accurate recommendations.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleFetchClimate}
                                        className="bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors w-fit shrink-0"
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
                                            Temperature (°C) <span className="text-red-500" aria-label="required">*</span>
                                        </Label>
                                        <Input
                                            id="temperature"
                                            name="temperature"
                                            className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                            value={temperature}
                                            onChange={(e) => setTemperature(e.target.value)}
                                            required
                                            type="number"
                                            step="0.1"
                                            min="-10"
                                            max="50"
                                            autoComplete="off"
                                            placeholder="Average temperature"
                                            aria-describedby="temperature-help"
                                            aria-invalid={!temperature ? "true" : "false"}
                                        />
                                        <div id="temperature-help" className="text-xs text-gray-500">
                                            Average temperature in Celsius (-10°C to 50°C)
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rainfall" className="text-sm font-medium text-gray-700">
                                            Rainfall (mm) <span className="text-red-500" aria-label="required">*</span>
                                        </Label>
                                        <Input
                                            id="rainfall"
                                            name="rainfall"
                                            className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                            value={rainfall}
                                            onChange={(e) => setRainfall(e.target.value)}
                                            required
                                            type="number"
                                            min="0"
                                            max="1000"
                                            autoComplete="off"
                                            placeholder="Annual rainfall"
                                            aria-describedby="rainfall-help"
                                            aria-invalid={!rainfall ? "true" : "false"}
                                        />
                                        <div id="rainfall-help" className="text-xs text-gray-500">
                                            Annual rainfall in millimeters (0-1000mm)
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="humidity" className="text-sm font-medium text-gray-700">
                                            Humidity (%) <span className="text-red-500" aria-label="required">*</span>
                                        </Label>
                                        <Input
                                            id="humidity"
                                            name="humidity"
                                            className="w-full border border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:ring-2 focus:ring-[#619154] focus:border-transparent"
                                            value={humidity}
                                            onChange={(e) => setHumidity(e.target.value)}
                                            required
                                            type="number"
                                            min="0"
                                            max="100"
                                            autoComplete="off"
                                            placeholder="Relative humidity"
                                            aria-describedby="humidity-help"
                                            aria-invalid={!humidity ? "true" : "false"}
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
                            disabled={!selectedFarmer || !soilType || !nitrogen || !potassium || !phosphorus || !phLevel || !temperature || !rainfall || !humidity || isGenerating}
                            className="bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all px-8 py-3 text-lg font-medium"
                            type="button"
                            aria-describedby="generate-help"
                        >
                            {isGenerating ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                                    <span>Generating...</span>
                                </div>
                            ) : (
                                'Generate Recommendation'
                            )}
                        </Button>
                    </div>
                    <div id="generate-help" className="text-xs text-gray-500 text-center">
                        Complete all required fields to generate crop recommendations
                    </div>

                    <Card className="border-[#D6E3D4]" role="region" aria-labelledby="results-heading">
                        <CardHeader>
                            <CardTitle id="results-heading" className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                Recommendation Results
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                                Your personalized crop recommendations will appear here after generation.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-gray-500 py-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center" aria-hidden="true">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-base">Click "Generate Recommendation" to see your results</p>
                                <p className="text-sm text-gray-400 mt-1">All required fields must be completed first</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </AppLayout>
    );
}
