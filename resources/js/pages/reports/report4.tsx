import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
       title: 'Reports',
       href: '/reports',
    },
    {
        title: 'Farms by Recommendation',
        href: '/reports/report4',
    },
];

interface Province {
    id: number;
    name: string;
}

interface Municipality {
    id: number;
    name: string;
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
        location?: {
            province?: { name: string };
            municipality?: { name: string };
            barangay?: { name: string };
        };
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

interface Report4Props {
    recommendations: PaginatedRecommendations;
    provinces: Province[];
    municipalities: Municipality[];
    filters: {
        search?: string;
        per_page?: number;
        province_id?: number;
        municipality_id?: number;
    };
}

// Define the data structure for our table rows
type RecommendationRow = {
    id: string;
    farmName: string;
    farmerName: string;
    cropName: string;
    location: string;
    confidenceScore: number;
    recommendationDate: string;
    formattedDate: string;
};

// Define table columns
const columns: ColumnDef<RecommendationRow>[] = [
    {
        accessorKey: "farmName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Farm Name" />
        ),
        cell: ({ row }) => (
            <div className="font-medium text-gray-900 dark:text-gray-100">
                {row.getValue("farmName")}
            </div>
        ),
    },
    {
        accessorKey: "farmerName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Farmer" />
        ),
        cell: ({ row }) => (
            <div className="text-gray-700 dark:text-gray-300">
                {row.getValue("farmerName")}
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
        accessorKey: "location",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Location" />
        ),
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {row.getValue("location")}
            </div>
        ),
    },
    {
        accessorKey: "confidenceScore",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Confidence Score" />
        ),
        cell: ({ row }) => {
            const score = row.getValue("confidenceScore") as number;
            const percentage = (score * 100).toFixed(1);
            const getScoreColor = (score: number) => {
                if (score < 0.5) return "text-red-600 dark:text-red-400";
                if (score < 0.7) return "text-yellow-600 dark:text-yellow-400";
                return "text-green-600 dark:text-green-400";
            };
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
                    <div className={`text-xs font-medium ${getScoreColor(score)}`}>
                        {percentage}%
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "formattedDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Recommendation Date" />
        ),
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {row.getValue("formattedDate")}
            </div>
        ),
    },
];

export default function Report4({ recommendations, provinces, municipalities, filters }: Report4Props) {
    console.log(recommendations, provinces, municipalities, filters);

    const handleProvinceChange = (provinceId: string) => {
        router.get('/reports/report4', {
            ...filters,
            province_id: provinceId === 'all' ? undefined : provinceId,
            municipality_id: undefined, // Reset municipality when province changes
        });
    };

    const handleMunicipalityChange = (municipalityId: string) => {
        router.get('/reports/report4', {
            ...filters,
            municipality_id: municipalityId === 'all' ? undefined : municipalityId,
        });
    };

    // Transform the data for the table
    const transformedData: RecommendationRow[] = recommendations.data.map((recommendation: Recommendation) => {
        const farmerName = recommendation.farmer
            ? `${recommendation.farmer.firstname} ${recommendation.farmer.middlename ? recommendation.farmer.middlename + ' ' : ''}${recommendation.farmer.lastname}`.trim()
            : 'Unknown Farmer';

        const location = recommendation.farm?.location
            ? [
                recommendation.farm.location.barangay?.name,
                recommendation.farm.location.municipality?.name,
                recommendation.farm.location.province?.name
              ].filter(Boolean).join(', ')
            : 'Unknown Location';

        return {
            id: recommendation.id.toString(),
            farmName: recommendation.farm?.name || 'Unknown Farm',
            farmerName,
            cropName: recommendation.crop?.name || 'Unknown Crop',
            location,
            confidenceScore: recommendation.confidence_score || 0,
            recommendationDate: recommendation.recommendation_date,
            formattedDate: recommendation.recommendation_date
                ? format(new Date(recommendation.recommendation_date), 'MMM dd, yyyy')
                : 'Unknown',
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports - Crop Recommendations by Location" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-8">
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border dark:bg-gray-900">
                    <div className="flex flex-col gap-4">
                        <HeadingSmall
                            title="Crop Recommendations by Location"
                            description="Lists crop recommendations for farms in a specific location."
                        />

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Province:</label>
                                <Select
                                    value={filters.province_id?.toString() || 'all'}
                                    onValueChange={handleProvinceChange}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Select province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Provinces</SelectItem>
                                        {provinces.map((province) => (
                                            <SelectItem key={province.id} value={province.id.toString()}>
                                                {province.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {filters.province_id && municipalities.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">Municipality:</label>
                                    <Select
                                        value={filters.municipality_id?.toString() || 'all'}
                                        onValueChange={handleMunicipalityChange}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Select municipality" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Municipalities</SelectItem>
                                            {municipalities.map((municipality) => (
                                                <SelectItem key={municipality.id} value={municipality.id.toString()}>
                                                    {municipality.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Total Recommendations: {transformedData.length}
                            </div>
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
                </div>
            </div>
        </AppLayout>
    );
}
