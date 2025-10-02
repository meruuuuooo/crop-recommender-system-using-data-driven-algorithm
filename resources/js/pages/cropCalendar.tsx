import { useMemo, useState, useEffect } from 'react';
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

const parseTimeOfPlanting = (plantingSeason: string): number[] => {
    if (!plantingSeason ||
        plantingSeason.toLowerCase() === 'n/a' ||
        plantingSeason.toLowerCase() === 'none' ||
        plantingSeason.trim() === '') {
        return []; // Return empty array for no planting months
    }

    // Handle "Year round" crops - they can be planted year-round
    if (plantingSeason.toLowerCase().includes('year round') ||
        plantingSeason.toLowerCase().includes('all season')) {
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

    // Extract months from parentheses (e.g., "Start of rainy season (May-June)")
    const parenthesesMatch = plantingSeason.match(/\(([^)]+)\)/);
    if (parenthesesMatch) {
        const extractedPart = parenthesesMatch[1];
        const extractedMonths = parseTimeOfPlanting(extractedPart);
        if (extractedMonths.length > 0) {
            return extractedMonths;
        }
    }

    const plantingMonths: number[] = [];

    // Split by common separators and clean up
    const parts = plantingSeason
        .toLowerCase()
        .split(/[/,\s-]+/)
        .map((part: string) => part.trim())
        .filter((part: string) => part.length > 0);

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

    const plantingMonths = parseTimeOfPlanting(crop.planting_season_primary || '');
    const hasPlantingData = plantingMonths.length > 0;

    // Parse growing duration to calculate harvest months
    const getGrowingDurationDays = (): number | null => {
        if (!crop.growing_duration_days ||
            crop.growing_duration_days.toLowerCase() === 'none' ||
            crop.growing_duration_days.toLowerCase() === 'n/a' ||
            crop.growing_duration_days.toLowerCase() === 'perennial') {
            return null;
        }

        const durationStr = crop.growing_duration_days.replace(/[^\d-]/g, '');
        const rangeMatch = durationStr.match(/(\d+)-(\d+)/);

        if (rangeMatch) {
            const min = parseInt(rangeMatch[1]);
            const max = parseInt(rangeMatch[2]);
            return Math.round((min + max) / 2);
        }

        const singleMatch = durationStr.match(/(\d+)/);
        return singleMatch ? parseInt(singleMatch[1]) : null;
    };

    const growingDurationDays = getGrowingDurationDays();

    // Calculate harvest month from planting month
    const getHarvestMonth = (plantMonth: number): number => {
        if (!growingDurationDays) return plantMonth;

        const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let remainingDays = growingDurationDays;
        let currentMonth = plantMonth;

        while (remainingDays > 0) {
            const daysInCurrentMonth = daysInMonths[(currentMonth - 1) % 12];
            remainingDays -= daysInCurrentMonth;
            if (remainingDays > 0) {
                currentMonth = (currentMonth % 12) + 1;
            }
        }

        return currentMonth;
    };

    // Get all harvest months based on planting months + growing duration
    const harvestMonths = growingDurationDays && plantingMonths.length > 0
        ? [...new Set(plantingMonths.map(pm => getHarvestMonth(pm)))]
        : [];

    const hasHarvestData = harvestMonths.length > 0;

    const getMonthStatus = (monthIndex: number) => {
        const month = monthIndex + 1;
        const isPlanting = plantingMonths.includes(month);
        const isHarvesting = harvestMonths.includes(month);

        if (isPlanting && isHarvesting) return 'both';
        if (isPlanting) return 'planting';
        if (isHarvesting) return 'harvesting';
        return 'inactive';
    };

    const getMonthColor = (status: string) => {
        switch (status) {
            case 'planting':
                return 'bg-[#619154] border-[#619154]'; // Green for planting
            case 'harvesting':
                return 'bg-[#d4a017] border-[#d4a017]'; // Gold for harvesting
            case 'both':
                return 'bg-gradient-to-br from-[#619154] to-[#d4a017] border-[#619154]'; // Gradient for both
            default:
                return 'bg-gray-200 border-gray-300'; // Gray for inactive
        }
    };

    return(
        <Card className="rounded-xl">
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
                                            <div className="rounded-lg !bg-[#d7eec8] py-2 text-xs font-semibold text-gray-700">
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
                                        const isHarvesting = status === 'harvesting';
                                        const isBoth = status === 'both';

                                        return (
                                            <div key={month} className="relative">
                                                <div
                                                    className={`h-16 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${getMonthColor(status)} ${
                                                        status !== 'inactive' ? 'shadow-md' : ''
                                                    }`}
                                                    title={`${month}: ${
                                                        isBoth
                                                            ? 'Planting & Harvesting Season'
                                                            : isPlanting
                                                            ? 'Planting Season'
                                                            : isHarvesting
                                                            ? 'Harvesting Season'
                                                            : 'Inactive Period'
                                                    }`}
                                                >
                                                    {isBoth ? (
                                                        <div className="flex h-full flex-col items-center justify-center gap-0.5">
                                                            <Sprout className="h-3 w-3 text-white" />
                                                            <div className="text-[8px] font-bold text-white">BOTH</div>
                                                        </div>
                                                    ) : isPlanting ? (
                                                        <div className="flex h-full flex-col items-center justify-center">
                                                            <Sprout className="h-4 w-4 text-white" />
                                                            <div className="mt-0.5 text-[8px] font-semibold text-white/90">PLANT</div>
                                                        </div>
                                                    ) : isHarvesting ? (
                                                        <div className="flex h-full flex-col items-center justify-center">
                                                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
                                                            </svg>
                                                            <div className="mt-0.5 text-[8px] font-semibold text-white/90">HARVEST</div>
                                                        </div>
                                                    ) : null}
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
                            {hasHarvestData && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded border border-[#d4a017] bg-[#d4a017]">
                                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Harvesting Season</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded border border-[#619154] bg-gradient-to-br from-[#619154] to-[#d4a017]"></div>
                                        <span className="text-sm font-medium text-gray-700">Plant & Harvest</span>
                                    </div>
                                </>
                            )}
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
                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <span className="font-medium text-[#619154]">Planting Season:</span>
                            <div className="mt-1 text-gray-700">
                                {crop.planting_season_primary &&
                                 crop.planting_season_primary.toLowerCase() !== 'none' &&
                                 crop.planting_season_primary.toLowerCase() !== 'n/a'
                                    ? crop.planting_season_primary
                                    : 'Not specified'}
                            </div>
                        </div>
                        <div>
                            <span className="font-medium text-[#619154]">Harvesting Period:</span>
                            <div className="mt-1 text-gray-700">
                                {crop.harvesting_period &&
                                 crop.harvesting_period.toLowerCase() !== 'none' &&
                                 crop.harvesting_period.toLowerCase() !== 'n/a'
                                    ? crop.harvesting_period
                                    : 'Not specified'}
                            </div>
                        </div>
                        <div>
                            <span className="font-medium text-[#619154]">Growth Duration:</span>
                            <div className="mt-1 text-gray-700">
                                {crop.growing_duration_days &&
                                 crop.growing_duration_days.toLowerCase() !== 'none' &&
                                 crop.growing_duration_days.toLowerCase() !== 'n/a'
                                    ? `${crop.growing_duration_days} days`
                                    : 'Not specified'}
                            </div>
                        </div>
                        <div>
                            <span className="font-medium text-[#619154]">pH Preference:</span>
                            <div className="mt-1 text-gray-700">
                                {crop.ph_preference &&
                                 crop.ph_preference.toLowerCase() !== 'none' &&
                                 crop.ph_preference.toLowerCase() !== 'n/a'
                                    ? crop.ph_preference
                                    : 'Not specified'}
                            </div>
                        </div>
                        <div className="md:col-span-2 lg:col-span-4">
                            <span className="font-medium text-[#619154]">Soil Requirement:</span>
                            <div className="mt-1 text-gray-700">
                                {crop.soil_requirement &&
                                 crop.soil_requirement.toLowerCase() !== 'none' &&
                                 crop.soil_requirement.toLowerCase() !== 'n/a'
                                    ? crop.soil_requirement
                                    : 'Not specified'}
                            </div>
                        </div>
                    </div>
                    {hasPlantingData && (
                        <div className="mt-3 border-t border-[#D6E3D4]/50 pt-3">
                            <p className="text-xs text-gray-600 italic">
                                <span className="font-medium">Note:</span> Green months indicate optimal planting periods for this crop.
                                {hasHarvestData && (
                                    <> Gold months show the harvesting season for this crop.</>
                                )}
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
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Simulate initial load animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCategoryChange = (categoryId: string) => {
        setIsLoading(true);
        setSelectedCategoryId(categoryId);
        setSelectedCropId('all'); // Reset crop selection when category changes
        setTimeout(() => setIsLoading(false), 300);
    };

    const handleCropChange = (cropId: string) => {
        setIsLoading(true);
        setSelectedCropId(cropId);
        setTimeout(() => setIsLoading(false), 300);
    };

    // Get current month (1-12)
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

    // Find crops that can be planted in the current month
    const cropsForCurrentMonth = useMemo(() => {
        if (!crops) return [];

        return crops.filter((crop) => {
            const plantingMonths = parseTimeOfPlanting(crop.planting_season_primary || '');
            return plantingMonths.includes(currentMonth);
        });
    }, [crops, currentMonth]);

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
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                {/* Best Crops for Current Month Section - Horizontal Scrollable */}
                {cropsForCurrentMonth.length > 0 && (
                    <div className={`rounded-xl border-2 border-[#619154] bg-gradient-to-r from-[#F8FAF8] to-white p-4 shadow-sm transition-all duration-500 ${
                        isInitialLoad ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}>
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#619154] animate-pulse">
                                    <Sprout className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">
                                        Best to Plant in {currentMonthName}
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        {cropsForCurrentMonth.length} crop{cropsForCurrentMonth.length !== 1 ? 's' : ''} recommended
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="overflow-x-auto pb-2">
                                <div className="flex gap-3" style={{ minWidth: 'min-content' }}>
                                    {cropsForCurrentMonth.map((crop, index) => (
                                        <button
                                            key={crop.id}
                                            onClick={() => {
                                                // Set the category filter to the crop's category
                                                if (crop.category) {
                                                    setSelectedCategoryId(crop.category.id.toString());
                                                }
                                                // Set the crop filter to this specific crop
                                                setSelectedCropId(crop.id.toString());
                                                // Scroll to the calendar section
                                                setTimeout(() => {
                                                    const calendarSection = document.querySelector('#calendar-section');
                                                    if (calendarSection) {
                                                        calendarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    }
                                                }, 100);
                                            }}
                                            className={`group flex-shrink-0 w-48 rounded-lg border border-[#D6E3D4] bg-white p-3 text-left transition-all hover:border-[#619154] hover:shadow-md hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#619154] focus:ring-offset-2 ${
                                                isInitialLoad ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                                            }`}
                                            style={{ transitionDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-[#619154]/10 group-hover:bg-[#619154] transition-colors">
                                                    <Sprout className="h-4 w-4 text-[#619154] group-hover:text-white transition-colors" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-semibold text-gray-900 group-hover:text-[#619154]" title={crop.name}>
                                                        {crop.name}
                                                    </h4>
                                                    {crop.category && (
                                                        <p className="truncate text-xs text-gray-500" title={crop.category.name}>
                                                            {crop.category.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {crop.growing_duration_days &&
                                             crop.growing_duration_days.toLowerCase() !== 'none' &&
                                             crop.growing_duration_days.toLowerCase() !== 'n/a' && (
                                                <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                                                    <span className="font-medium">Duration:</span>
                                                    <span>{crop.growing_duration_days} days</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Scroll indicator */}
                            {cropsForCurrentMonth.length > 4 && (
                                <div className="mt-1 text-center text-xs text-gray-500">
                                    ← Scroll to see more crops →
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <Card id="calendar-section" className="flex flex-col gap-6 rounded-xl bg-white p-8 dark:border-sidebar-border">
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

                    {isLoading ? (
                        <div className="space-y-6">
                            {/* Loading skeletons */}
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="rounded-xl">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
                                                <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-12 gap-2">
                                                {Array.from({ length: 12 }).map((_, index) => (
                                                    <div key={index} className="h-16 animate-pulse rounded-lg bg-gray-200"></div>
                                                ))}
                                            </div>
                                            <div className="h-32 animate-pulse rounded-lg bg-gray-100"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredCrops.length > 0 ? (
                        <div className="space-y-6">
                            {filteredCrops.map((crop, index) => (
                                <div
                                    key={crop.id}
                                    className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                                >
                                    <CropCalendarView crop={crop} />
                                </div>
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
                </Card>
            </div>
        </AppLayout>
    );
}
