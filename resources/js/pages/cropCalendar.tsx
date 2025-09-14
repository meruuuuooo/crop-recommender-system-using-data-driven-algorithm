import { useMemo, useState } from 'react';
import HeadingSmall from '@/components/heading-small';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Category, Crop } from '@/types/crop';
import { Head } from '@inertiajs/react';
import { Sprout } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cropping Calendar',
        href: '/crop/calendar',
    },
];

interface CroppingCalendarProps {
    crops: Crop[];
    categories: Category[];
}

const parseTimeOfPlanting = (timeOfPlanting: string) => {
    if (!timeOfPlanting ||
        timeOfPlanting.toLowerCase() === 'n/a' ||
        timeOfPlanting.trim() === '') {
        return []; // Return empty array for no planting months
    }

    // Handle "All season" crops - they can be planted year-round
    if (timeOfPlanting.toLowerCase() === 'all season') {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // All 12 months
    }

    const months: Record<string, number> = {
        jan: 1,
        january: 1,
        feb: 2,
        february: 2,
        mar: 3,
        march: 3,
        apr: 4,
        april: 4,
        may: 5,
        jun: 6,
        june: 6,
        jul: 7,
        july: 7,
        aug: 8,
        august: 8,
        sep: 9,
        september: 9,
        oct: 10,
        october: 10,
        nov: 11,
        november: 11,
        dec: 12,
        december: 12,
    };

    const plantingMonths: number[] = [];

    // Split by common separators and clean up
    const parts = timeOfPlanting
        .toLowerCase()
        .split(/[/,\s-]+/)
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // Direct month match
        if (months[part]) {
            plantingMonths.push(months[part]);
        }

        // Check for month ranges (e.g., "october march" or "october - march")
        if (i < parts.length - 1) {
            const nextPart = parts[i + 1];
            const startMonth = months[part];
            const endMonth = months[nextPart];

            if (startMonth && endMonth) {
                if (startMonth <= endMonth) {
                    // Same year range
                    for (let month = startMonth; month <= endMonth; month++) {
                        plantingMonths.push(month);
                    }
                } else {
                    // Year wrap (e.g., Oct-Mar)
                    for (let month = startMonth; month <= 12; month++) {
                        plantingMonths.push(month);
                    }
                    for (let month = 1; month <= endMonth; month++) {
                        plantingMonths.push(month);
                    }
                }
                i++; // Skip the next part since we've processed it
            }
        }
    }

    return [...new Set(plantingMonths)]; // Remove duplicates
};

const CropCalendarView = ({ crop }: { crop: Crop }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const plantingMonths = parseTimeOfPlanting(crop.time_of_planting || '');
    const hasPlantingData = plantingMonths.length > 0;

    const getMonthStatus = (monthIndex: number) => {
        const month = monthIndex + 1;
        const isPlanting = plantingMonths.includes(month);

        if (isPlanting) return 'planting';
        return 'inactive';
    };

    const getMonthColor = (status: string) => {
        switch (status) {
            case 'planting':
                return 'bg-[#619154] border-[#619154]'; // Green for planting
            default:
                return 'bg-gray-200 border-gray-300'; // Gray for inactive
        }
    };

    return(
        <Card className="border-[#D6E3D4]">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#619154]/10">
                        <Sprout className="h-5 w-5 text-[#619154]" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-800">{crop.name}</div>
                        {crop.category && (
                            <div className="text-sm text-gray-500">{crop.category.name}</div>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {hasPlantingData ? (
                    <div className="space-y-6">
                        {/* Calendar Grid */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[600px]">
                                {/* Month Headers */}
                                <div className="mb-3 grid grid-cols-12 gap-2">
                                    {months.map((month) => (
                                        <div key={month} className="text-center">
                                            <div className="rounded-lg bg-gray-50 py-2 text-xs font-semibold text-gray-700">
                                                {month}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Bars */}
                                <div className="grid grid-cols-12 gap-2">
                                    {months.map((month, index) => {
                                        const status = getMonthStatus(index);
                                        const isPlanting = status === 'planting';
                                        return (
                                            <div key={month} className="relative">
                                                <div
                                                    className={`h-16 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${getMonthColor(status)} ${
                                                        isPlanting ? 'shadow-md' : ''
                                                    }`}
                                                    title={`${month}: ${isPlanting ? 'Planting Season' : 'Inactive Period'}`}
                                                >
                                                    {isPlanting && (
                                                        <div className="flex h-full items-center justify-center">
                                                            <Sprout className="h-4 w-4 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-6 rounded-lg bg-gray-50 p-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded border border-[#619154] bg-[#619154]">
                                    <Sprout className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Planting Season</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded border border-gray-300 bg-gray-200"></div>
                                <span className="text-sm font-medium text-gray-700">Inactive Period</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <Sprout className="h-6 w-6 text-gray-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">No Planting Schedule</h4>
                        <p className="text-xs text-gray-400">Planting time not specified</p>
                    </div>
                )}

                {/* Calendar Summary Info */}
                <div className="mt-6 rounded-lg border border-[#D6E3D4] bg-gradient-to-r from-[#F8FAF8] to-white p-4">
                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                        <div>
                            <span className="font-medium text-[#619154]">Planting Time:</span>
                            <div className="mt-1 text-gray-700">{crop.time_of_planting || 'Not specified'}</div>
                        </div>
                        <div>
                            <span className="font-medium text-[#619154]">Maturity Period:</span>
                            <div className="mt-1 text-gray-700">{crop.maturity || 'Not specified'}</div>
                        </div>
                        <div>
                            <span className="font-medium text-[#619154]">Soil Type:</span>
                            <div className="mt-1 text-gray-700">{crop.soil_type || 'Not specified'}</div>
                        </div>
                    </div>
                    {hasPlantingData && (
                        <div className="mt-3 border-t border-[#D6E3D4]/50 pt-3">
                            <p className="text-xs text-gray-600 italic">
                                <span className="font-medium">Note:</span> Green months indicate optimal planting periods for this crop.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function CropCalendar({ crops, categories }: CroppingCalendarProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [selectedCropId, setSelectedCropId] = useState('all');

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        setSelectedCropId('all'); // Reset crop selection when category changes
    };

    const handleCropChange = (cropId: string) => {
        setSelectedCropId(cropId);
    };

    const cropsForDropdown = useMemo(() => {
        if (!crops || selectedCategoryId === 'all') {
            return [];
        }
        return crops.filter((crop) => crop.category?.id.toString() === selectedCategoryId);
    }, [crops, selectedCategoryId]);

    const filteredCrops = useMemo(() => {
        if (!crops) {
            return [];
        }

        const byCategory =
            selectedCategoryId === 'all'
                ? crops
                : crops.filter((c) => c.category?.id.toString() === selectedCategoryId);

        const byCrop =
            selectedCropId === 'all' ? byCategory : byCategory.filter((c) => c.id.toString() === selectedCropId);

        return byCrop;
    }, [crops, selectedCategoryId, selectedCropId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crop Calendar" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <HeadingSmall title="Crop Calendar" description="Visual timeline showing planting seasons for all crops" />
                    </div>

                    {/* Filter Section */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="grid w-full max-w-xs items-center gap-1.5">
                            <Label htmlFor="category-filter">Category</Label>
                            <Select onValueChange={handleCategoryChange} value={selectedCategoryId}>
                                <SelectTrigger id="category-filter">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-1.5">
                            <Label htmlFor="crop-filter">Crop</Label>
                            <Select onValueChange={handleCropChange} value={selectedCropId} disabled={selectedCategoryId === 'all'}>
                                <SelectTrigger id="crop-filter">
                                    <SelectValue placeholder="Select a crop" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Crops</SelectItem>
                                    {cropsForDropdown.map((crop) => (
                                        <SelectItem key={crop.id} value={crop.id.toString()}>
                                            {crop.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {filteredCrops.length > 0 ? (
                        <div className="space-y-6">
                            {filteredCrops.map((crop) => (
                                <CropCalendarView key={crop.id} crop={crop} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                            <Sprout className="mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No Crops Found</h3>
                            <p className="max-w-md text-gray-500">
                                There are no crops with planting information for the selected filters.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
