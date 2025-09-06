import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { type ShowCropCardProps } from '@/types/crop';
import { BarChart3, Calendar, Clock, Info, Layers, MapPin, Sprout, Tag, Timer } from 'lucide-react';

export default function ViewCropCard({ crop }: ShowCropCardProps) {
    console.log('Crop data:', crop);

    if (!crop) {
        return (
            <div className="w-full p-4 sm:p-6 lg:p-8">
                <Card className="border-[#D6E3D4]">
                    <CardContent className="p-6">
                        <div className="text-center text-gray-500">
                            <Sprout className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p className="text-lg font-medium">No crop data available</p>
                            <p className="mt-2 text-sm">Crop information could not be loaded.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const InfoField = ({
        icon: Icon,
        label,
        value,
        fullWidth = false,
        highlight = false,
    }: {
        icon?: React.ComponentType<{ className?: string }>;
        label: string;
        value: string | number | null | undefined;
        fullWidth?: boolean;
        highlight?: boolean;
    }) => (
        <div className={`space-y-3 ${fullWidth ? 'col-span-full' : ''}`}>
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-[#619154]" />}
                <Label className="text-sm font-medium text-[#619154]">{label}</Label>
            </div>
            <div
                className={`flex min-h-[42px] items-center rounded-lg border px-4 py-3 transition-colors ${
                    highlight ? 'border-[#619154]/30 bg-[#619154]/5 font-medium text-[#619154]' : 'border-gray-200 bg-gray-50 text-gray-900'
                }`}
            >
                {value || 'N/A'}
            </div>
        </div>
    );

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

    const CropCalendar = () => {
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

        return (
             <Card className="border-[#D6E3D4]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Calendar className="h-5 w-5 text-[#619154]" />
                        Crop Calendar
                    </CardTitle>
                   <p className="text-sm text-gray-600">Visual timeline showing planting seasons</p>
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
                        <div className="text-center py-12">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-500 mb-2">No Planting Schedule Available</h3>
                            <p className="text-sm text-gray-400 max-w-md mx-auto">
                                Planting time information is not specified for this crop. The calendar will be available once planting timing is defined.
                            </p>
                        </div>
                    )}

                    {/* Calendar Summary Info */}
                    <div className="mt-6 rounded-lg border border-[#D6E3D4] bg-gradient-to-r from-[#F8FAF8] to-white p-6">
                        <h4 className="mb-4 text-sm font-semibold text-[#619154] uppercase tracking-wide">Crop Timeline Summary</h4>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Clock className="mt-0.5 h-4 w-4 text-[#619154] flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-900">Planting Time:</span>
                                    <div className="mt-1 text-gray-700">{crop.time_of_planting || 'Not specified'}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Timer className="mt-0.5 h-4 w-4 text-[#619154] flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-900">Maturity Period:</span>
                                    <div className="mt-1 text-gray-700">{crop.maturity || 'Not specified'}</div>
                                </div>
                            </div>
                        </div>
                        {hasPlantingData && (
                            <div className="mt-4 border-t border-[#D6E3D4]/50 pt-4">
                                <p className="text-xs text-gray-600 italic leading-relaxed">
                                    <span className="font-medium text-gray-700">Agricultural Terms:</span> DAP = Days after planting;
                                    DAT = Days after transplanting; DAS = Days after sowing. Green months indicate optimal planting periods.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="w-full space-y-6 sm:p-4 lg:p-6">
            {/* Hero Header Section */}
            <Card className="border-[#D6E3D4] bg-gradient-to-r from-[#F8FAF8] to-white">
                <CardHeader className="pb-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#619154]/20 bg-[#619154]/10">
                                <Sprout className="h-8 w-8 text-[#619154]" />
                            </div>
                            <div>
                                <CardTitle className="mb-2 text-3xl font-bold text-gray-900">{crop.name}</CardTitle>
                                <p className="text-sm text-gray-600">Agricultural Crop Information</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="border-[#619154]/20 bg-[#619154]/10 px-3 py-1 text-[#619154]">
                                <Info className="mr-1 h-3 w-3" />
                                ID: {crop.id}
                            </Badge>
                            {crop.category && (
                                <Badge variant="outline" className="border-gray-300 px-3 py-1">
                                    <Tag className="mr-1 h-3 w-3" />
                                    {crop.category.name}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Main Information Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Basic Information */}
                <Card className="border-[#D6E3D4]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Layers className="h-5 w-5 text-[#619154]" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoField icon={Sprout} label="Crop Name" value={crop.name} highlight />
                        {crop.category && <InfoField icon={Tag} label="Category" value={crop.category.name} />}
                        <InfoField icon={MapPin} label="Preferred Soil Type" value={crop.soil_type} />
                    </CardContent>
                </Card>

                {/* Growth & Yield Information */}
                <Card className="border-[#D6E3D4]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <BarChart3 className="h-5 w-5 text-[#619154]" />
                            Growth & Yield
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoField icon={Clock} label="Time of Planting" value={crop.time_of_planting} highlight />
                        <InfoField icon={Timer} label="Maturity Period" value={crop.maturity} />
                    </CardContent>
                </Card>
            </div>

            {/* Crop Calendar Infographic */}
            <CropCalendar />

            {/* System Information */}
            <Card className="border-[#D6E3D4]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Info className="h-5 w-5 text-[#619154]" />
                        System Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InfoField icon={Calendar} label="Date Created" value={formatDate(crop.created_at)} />
                        <InfoField icon={Calendar} label="Last Updated" value={formatDate(crop.updated_at)} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
