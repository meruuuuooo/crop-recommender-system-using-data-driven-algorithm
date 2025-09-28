import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports',
    },
    {
        title: 'Detailed Crop Recommendations',
        href: '/reports/report5',
    },
];

interface SoilData {
    id: number;
    soil_type: string;
    pH: number;
    nitrogen_level: string;
    phosphorus_level: string;
    potassium_level: string;
    test_date: string;
}

interface ClimateData {
    id: number;
    temperature: number;
    rainfall: number;
    humidity: number;
    climate_record_date: string;
}

interface Recommendation {
    id: number;
    confidence_score: number;
    recommendation_date: string;
    farmer?: {
        id: number;
        firstname: string;
        middlename?: string;
        lastname: string;
    };
    crop?: {
        id: number;
        name: string;
    };
    farm?: {
        id: number;
        name: string;
        soils?: SoilData[];
        climates?: ClimateData[];
    };
}

// Paginated response structure
interface PaginatedRecommendations {
    data: Recommendation[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Report5Props {
    recommendations: PaginatedRecommendations;
    filters: {
        search?: string;
        per_page?: number;
    };
}

// Define the data structure for our table rows
type DetailedRecommendationRow = {
    id: string;
    farmName: string;
    farmerName: string;
    cropName: string;
    confidenceScore: number;
    soilType: string;
    pH: number;
    nitrogenLevel: string;
    temperature: number;
    rainfall: number;
    humidity: number;
    recommendationDate: string;
    formattedDate: string;
};

// Define table columns
const columns: ColumnDef<DetailedRecommendationRow>[] = [
    {
        accessorKey: "farmName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Farm" />
        ),
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                    {row.getValue("farmName")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {row.original.farmerName}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "cropName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Recommended Crop" />
        ),
        cell: ({ row }) => (
            <Badge variant="default" className="font-medium">
                {row.getValue("cropName")}
            </Badge>
        ),
    },
    {
        accessorKey: "confidenceScore",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Confidence" />
        ),
        cell: ({ row }) => {
            const score = row.getValue("confidenceScore") as number;
            const percentage = (score * 100).toFixed(1);
            const getScoreBadge = (score: number) => {
                if (score < 0.5) return { variant: "destructive" as const, label: "Low" };
                if (score < 0.7) return { variant: "secondary" as const, label: "Medium" };
                return { variant: "default" as const, label: "High" };
            };
            const badge = getScoreBadge(score);
            return (
                <div className="space-y-1">
                    <Badge variant={badge.variant} className="text-xs">
                        {badge.label}
                    </Badge>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {percentage}%
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "soilType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Soil Conditions" />
        ),
        cell: ({ row }) => {
            const soilType = row.getValue("soilType") as string;
            const pH = row.original.pH;
            const nitrogenLevel = row.original.nitrogenLevel;

            const getPhColor = (pH: number) => {
                if (pH < 5.5) return "text-red-600 dark:text-red-400";
                if (pH > 8.0) return "text-blue-600 dark:text-blue-400";
                return "text-green-600 dark:text-green-400";
            };

            return (
                <div className="space-y-1">
                    <Badge variant="outline" className="text-xs capitalize">
                        {soilType}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs">
                        <span className={`font-medium ${getPhColor(pH)}`}>
                            pH: {pH.toFixed(1)}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600 dark:text-gray-400">
                            N: {nitrogenLevel}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "temperature",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Climate Conditions" />
        ),
        cell: ({ row }) => {
            const temp = row.getValue("temperature") as number;
            const rainfall = row.original.rainfall;
            const humidity = row.original.humidity;

            return (
                <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs">
                        <span className="font-medium text-orange-600 dark:text-orange-400">
                            {temp.toFixed(1)}°C
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span>{rainfall.toFixed(0)}mm</span>
                        <span>•</span>
                        <span>{humidity.toFixed(0)}%</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "formattedDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {row.getValue("formattedDate")}
            </div>
        ),
    },
];

export default function Report5({ recommendations, filters }: Report5Props) {
    console.log(recommendations, filters);

    // Transform the data for the table
    const transformedData: DetailedRecommendationRow[] = recommendations.data.map((recommendation: Recommendation) => {
        const farmerName = recommendation.farmer
            ? `${recommendation.farmer.firstname} ${recommendation.farmer.middlename ? recommendation.farmer.middlename + ' ' : ''}${recommendation.farmer.lastname}`.trim()
            : 'Unknown Farmer';

        // Get latest soil data
        const latestSoil = recommendation.farm?.soils?.[0];
        // Get latest climate data
        const latestClimate = recommendation.farm?.climates?.[0];

        return {
            id: recommendation.id.toString(),
            farmName: recommendation.farm?.name || 'Unknown Farm',
            farmerName,
            cropName: recommendation.crop?.name || 'Unknown Crop',
            confidenceScore: recommendation.confidence_score || 0,
            soilType: latestSoil?.soil_type || 'Unknown',
            pH: latestSoil?.pH || 0,
            nitrogenLevel: latestSoil?.nitrogen_level || 'Unknown',
            temperature: latestClimate?.temperature || 0,
            rainfall: latestClimate?.rainfall || 0,
            humidity: latestClimate?.humidity || 0,
            recommendationDate: recommendation.recommendation_date,
            formattedDate: recommendation.recommendation_date
                ? format(new Date(recommendation.recommendation_date), 'MMM dd, yyyy')
                : 'Unknown',
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports - Detailed Crop Recommendations" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <Card className="flex flex-col gap-4 rounded-sm bg-white p-8 dark:border-sidebar-border dark:bg-gray-900">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <HeadingSmall
                            title="Detailed Crop Recommendations"
                            description="Details crop recommendations tailored to soil and climate conditions on farms, including test results and environmental factors."
                        />
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Total Recommendations: {transformedData.length}</span>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={transformedData}
                        searchKey="cropName"
                        searchPlaceholder="Search crops, farms, or farmers..."
                        enablePagination={true}
                        initialPageSize={10}
                        pageSizeOptions={[10, 25, 50, 100]}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}
