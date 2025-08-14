import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect, type SearchableSelectOption } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recommendation',
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

export default function Recommendation() {
    const [selectedFarmer, setSelectedFarmer] = useState<string>('');
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recommendation" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="w-full">
                        <HeadingSmall title="Recommendation" description="Crop Recommendation based on soil factors and Environmental conditions" />
                        <div className="mt-4">
                            <SearchableSelect
                                options={farmerOptions}
                                value={selectedFarmer}
                                onValueChange={setSelectedFarmer}
                                placeholder="Select Farmer"
                                searchPlaceholder="Search farmers..."
                                className="w-[300px]"
                                clearable
                            />
                        </div>
                    </div>

                    {/* Main Content - Soil Test and Climate Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Soil Test Section */}
                        <div className="rounded-lg bg-gray-50 p-6">
                            <HeadingSmall title="Soil Test" description="Provide your soil test details below." />

                            <div className="mt-4 space-y-4">
                                <Select>
                                    <SelectTrigger className="w-full">
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

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Input
                                        id="Nitrogen"
                                        className="block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                                        required
                                        type="number"
                                        autoComplete="off"
                                        placeholder="Nitrogen (N)"
                                    />
                                    <Input
                                        id="Potassium"
                                        className="block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                                        required
                                        type="number"
                                        autoComplete="off"
                                        placeholder="Potassium (K)"
                                    />
                                    <Input
                                        id="Phosphorus"
                                        className="block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                                        required
                                        type="number"
                                        autoComplete="off"
                                        placeholder="Phosphorus (P)"
                                    />
                                </div>

                                <Input
                                    id="pHLevel"
                                    className="block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                                    required
                                    type="number"
                                    step="0.01"
                                    autoComplete="off"
                                    placeholder="pH Level"
                                />
                            </div>
                        </div>

                        {/* Climate Data Section */}
                        <div className="rounded-lg bg-gray-50 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <HeadingSmall title="Climate Data" description="Fetch or enter climate details below." />
                                <Button className="bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-600 w-fit" type="button">
                                    Fetch Climate
                                </Button>
                            </div>

                            <div className="mt-4 space-y-4">
                                <Input
                                    id="temperature"
                                    className="block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                                    required
                                    type="number"
                                    autoComplete="off"
                                    placeholder="Temperature (°C)"
                                />
                                <Input
                                    id="rainfall"
                                    className="block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                                    required
                                    type="number"
                                    autoComplete="off"
                                    placeholder="Rainfall (mm)"
                                />
                                <Input
                                    id="humidity"
                                    className="block w-full border !border-[#D6E3D4] !text-[#619154] placeholder:!text-[#619154]"
                                    required
                                    type="number"
                                    autoComplete="off"
                                    placeholder="Humidity (%)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center pt-4">
                        <Button className="bg-green-500 text-white hover:cursor-pointer hover:bg-green-600 px-8 py-3 text-lg" type="button">
                            Generate Recommendation
                        </Button>
                    </div>

                    {/* Results Section (placeholder) */}
                    <div className="mt-6 rounded-lg bg-gray-50 p-6">
                        <HeadingSmall title="Recommendation Results" description="Your crop recommendations will appear here." />
                        <div className="mt-4 text-center text-gray-500">
                            Click "Generate Recommendation" to see results
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
