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
                        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                            <div className="min-w-[600px]">
                                {/* Month Headers */}
                                <div className="mb-2 grid grid-cols-12 gap-1 sm:mb-3 sm:gap-2">
                                    {months.map((month) => (
                                        <div key={month} className="text-center">
                                            <div className="rounded-lg !bg-[#d7eec8] py-1.5 text-[10px] font-semibold text-gray-700 sm:py-2 sm:text-xs">
                                                {month}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Bars */}
                                <div className="grid grid-cols-12 gap-1 sm:gap-2">
                                    {months.map((month, index) => {
                                        const status = getMonthStatus(index);
                                        const isPlanting = status === 'planting';
                                        const isHarvesting = status === 'harvesting';
                                        const isBoth = status === 'both';

                                        return (
                                            <div key={month} className="relative">
                                                <div
                                                    className={`h-12 rounded-lg border-2 transition-all duration-300 active:scale-95 sm:h-16 sm:hover:scale-105 ${getMonthColor(status)} ${
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
                                                            <Sprout className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
                                                            <div className="text-[7px] font-bold text-white sm:text-[8px]">BOTH</div>
                                                        </div>
                                                    ) : isPlanting ? (
                                                        <div className="flex h-full flex-col items-center justify-center">
                                                            <Sprout className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                                                            <div className="mt-0.5 text-[7px] font-semibold text-white/90 sm:text-[8px]">PLANT</div>
                                                        </div>
                                                    ) : isHarvesting ? (
                                                        <div className="flex h-full flex-col items-center justify-center">
                                                            <svg className="h-3 w-3 text-white sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
                                                            </svg>
                                                            <div className="mt-0.5 text-[7px] font-semibold text-white/90 sm:text-[8px]">HARVEST</div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Scroll hint for mobile */}
                            <div className="mt-2 text-center text-[10px] text-gray-500 sm:hidden">
                                ← Swipe to view all months →
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-3 rounded-lg bg-gray-50 p-3 sm:gap-6 sm:p-4">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="flex h-5 w-5 items-center justify-center rounded border border-[#619154] bg-[#619154] sm:h-6 sm:w-6">
                                    <Sprout className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
                                </div>
                                <span className="text-xs font-medium text-gray-700 sm:text-sm">Planting Season</span>
                            </div>
                            {hasHarvestData && (
                                <>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className="flex h-5 w-5 items-center justify-center rounded border border-[#d4a017] bg-[#d4a017] sm:h-6 sm:w-6">
                                            <svg className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-medium text-gray-700 sm:text-sm">Harvesting Season</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className="h-5 w-5 rounded border border-[#619154] bg-gradient-to-br from-[#619154] to-[#d4a017] sm:h-6 sm:w-6"></div>
                                        <span className="text-xs font-medium text-gray-700 sm:text-sm">Plant & Harvest</span>
                                    </div>
                                </>
                            )}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="h-5 w-5 rounded border border-gray-300 bg-gray-200 sm:h-6 sm:w-6"></div>
                                <span className="text-xs font-medium text-gray-700 sm:text-sm">Inactive Period</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 text-center sm:py-8">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 sm:mb-4 sm:h-12 sm:w-12">
                            <Sprout className="h-5 w-5 text-gray-400 sm:h-6 sm:w-6" />
                        </div>
                        <h4 className="mb-1 text-xs font-medium text-gray-500 sm:text-sm">No Planting Schedule</h4>
                        <p className="text-[10px] text-gray-400 sm:text-xs">Planting time not specified</p>
                    </div>
                )}

                {/* Calendar Summary Info */}
                <div className="mt-4 rounded-lg border border-[#D6E3D4] bg-gradient-to-r from-[#F8FAF8] to-white p-3 sm:mt-6 sm:p-4">
                    <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:gap-3 sm:text-sm lg:grid-cols-4">
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
                        <div className="sm:col-span-2 lg:col-span-4">
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
                        <div className="mt-2 border-t border-[#D6E3D4]/50 pt-2 sm:mt-3 sm:pt-3">
                            <p className="text-[10px] italic text-gray-600 sm:text-xs">
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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-3 sm:gap-6 sm:p-4">
                {/* Best Crops for Current Month Section - Horizontal Scrollable */}
                {cropsForCurrentMonth.length > 0 && (
                    <div className={`rounded-xl border-2 border-[#619154] bg-gradient-to-r from-[#F8FAF8] to-white p-3 shadow-sm transition-all duration-500 sm:p-4 ${
                        isInitialLoad ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
                    }`}>
                        <div className="mb-2 flex items-center justify-between sm:mb-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 animate-pulse items-center justify-center rounded-lg bg-[#619154] sm:h-8 sm:w-8">
                                    <Sprout className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-800 sm:text-sm">
                                        Best to Plant in {currentMonthName}
                                    </h3>
                                    <p className="text-[10px] text-gray-600 sm:text-xs">
                                        {cropsForCurrentMonth.length} crop{cropsForCurrentMonth.length !== 1 ? 's' : ''} recommended
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="overflow-x-auto pb-2">
                                <div className="flex gap-2 sm:gap-3" style={{ minWidth: 'min-content' }}>
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
                                            className={`group w-40 flex-shrink-0 rounded-lg border border-[#D6E3D4] bg-white p-2.5 text-left transition-all hover:border-[#619154] hover:cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#619154] focus:ring-offset-2 active:scale-95 sm:w-48 sm:p-3 ${
                                                isInitialLoad ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'
                                            }`}
                                            style={{ transitionDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex items-start gap-1.5 sm:gap-2">
                                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-[#619154]/10 transition-colors group-hover:bg-[#619154] sm:h-8 sm:w-8">
                                                    <Sprout className="h-3.5 w-3.5 text-[#619154] transition-colors group-hover:text-white sm:h-4 sm:w-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-xs font-semibold text-gray-900 group-hover:text-[#619154] sm:text-sm" title={crop.name}>
                                                        {crop.name}
                                                    </h4>
                                                    {crop.category && (
                                                        <p className="truncate text-[10px] text-gray-500 sm:text-xs" title={crop.category.name}>
                                                            {crop.category.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {crop.growing_duration_days &&
                                             crop.growing_duration_days.toLowerCase() !== 'none' &&
                                             crop.growing_duration_days.toLowerCase() !== 'n/a' && (
                                                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-600 sm:mt-2 sm:text-xs">
                                                    <span className="font-medium">Duration:</span>
                                                    <span>{crop.growing_duration_days} days</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Scroll indicator */}
                            {cropsForCurrentMonth.length > 2 && (
                                <div className="mt-1 text-center text-[10px] text-gray-500">
                                    ← Scroll to see more crops →
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <Card id="calendar-section" className="flex flex-col gap-4 rounded-xl bg-white p-4 dark:border-sidebar-border sm:gap-6 sm:p-8">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <HeadingSmall title="Crop Calendar" description="Visual timeline showing planting seasons for all crops" />
                    </div>

                    {/* Filter Section */}
                    <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end">
                        <div className="grid w-full items-center gap-1.5 sm:max-w-xs">
                            <Label htmlFor="category-filter" className="text-xs sm:text-sm">Category</Label>
                            <Select onValueChange={handleCategoryChange} value={selectedCategoryId}>
                                <SelectTrigger id="category-filter" className="h-9 text-xs sm:h-10 sm:text-sm">
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
                        <div className="grid w-full items-center gap-1.5 sm:max-w-xs">
                            <Label htmlFor="crop-filter" className="text-xs sm:text-sm">Crop</Label>
                            <Select onValueChange={handleCropChange} value={selectedCropId} disabled={selectedCategoryId === 'all'}>
                                <SelectTrigger id="crop-filter" className="h-9 text-xs sm:h-10 sm:text-sm">
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
                        <div className="space-y-4 sm:space-y-6">
                            {/* Loading skeletons */}
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="rounded-xl">
                                    <CardHeader>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200 sm:h-10 sm:w-10"></div>
                                            <div className="flex-1 space-y-1.5 sm:space-y-2">
                                                <div className="h-5 w-36 animate-pulse rounded bg-gray-200 sm:h-6 sm:w-48"></div>
                                                <div className="h-3.5 w-24 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-32"></div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="grid grid-cols-12 gap-1 sm:gap-2">
                                                {Array.from({ length: 12 }).map((_, index) => (
                                                    <div key={index} className="h-12 animate-pulse rounded-lg bg-gray-200 sm:h-16"></div>
                                                ))}
                                            </div>
                                            <div className="h-24 animate-pulse rounded-lg bg-gray-100 sm:h-32"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredCrops.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
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
                        <div className="flex h-48 flex-col items-center justify-center text-center sm:h-64">
                            <Sprout className="mb-3 h-10 w-10 text-gray-300 sm:mb-4 sm:h-12 sm:w-12" />
                            <h3 className="mb-1.5 text-base font-medium text-gray-900 sm:mb-2 sm:text-lg">No Crops Found</h3>
                            <p className="max-w-md px-4 text-xs text-gray-500 sm:text-sm">
                                There are no crops with planting information for the selected filters.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
