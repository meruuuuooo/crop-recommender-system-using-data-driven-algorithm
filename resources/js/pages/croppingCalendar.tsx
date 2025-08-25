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
    if (!timeOfPlanting || timeOfPlanting.toLowerCase() === 'all season') {
        return Array.from({ length: 12 }, (_, i) => i + 1); // All months
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
                <CardTitle className="text-xl font-bold text-gray-800">{crop.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Month Headers */}
                    <div className="mb-2 grid grid-cols-12 gap-1">
                        {months.map((month) => (
                            <div key={month} className="py-2 text-center text-xs font-medium text-gray-700">
                                {month}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Bar */}
                    <div className="grid grid-cols-12 gap-1">
                        {months.map((month, index) => {
                            const status = getMonthStatus(index);
                            return (
                                <div
                                    key={month}
                                    className={`h-12 rounded border-2 transition-all duration-200 ${getMonthColor(status)}`}
                                    title={`${month}: ${status === 'planting' ? 'Planting Season' : 'Inactive'}`}
                                />
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded border border-[#619154] bg-[#619154]"></div>
                            <span className="text-sm text-gray-700">Planting Season</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded border border-gray-300 bg-gray-200"></div>
                            <span className="text-sm text-gray-700">Inactive Period</span>
                        </div>
                    </div>

                    {/* Calendar Info */}
                    <div className="rounded-lg border border-[#D6E3D4] bg-[#F8FAF8] p-4">
                        <div className="mb-3 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                                <span className="font-medium text-[#619154]">Planting Time:</span>
                                <span className="ml-2 text-gray-700">{crop.time_of_planting || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-[#619154]">Maturity Period:</span>
                                <span className="ml-2 text-gray-700">{crop.maturity || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="border-t border-[#D6E3D4]/50 pt-3">
                            <p className="text-xs text-gray-600 italic">
                                <span className="font-medium">Note:</span> DAP = Days after planting; DAT = Days after transplanting; DAS
                                = Days after sowing
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function CroppingCalendar({ crops, categories }: CroppingCalendarProps) {
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
