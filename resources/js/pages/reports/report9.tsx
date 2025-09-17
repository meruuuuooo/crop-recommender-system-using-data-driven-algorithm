import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports/report9',
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

interface Location {
    id: number;
    province: Province;
    municipality: Municipality;
}

interface Farm {
    id: number;
    name: string;
    location: Location;
}

interface Crop {
    id: number;
    name: string;
}

interface CropRecommendation {
    crop_id: number;
    avg_confidence_score: number;
    recommendation_count: number;
    crop: Crop;
    farm: Farm;
}

// Paginated response structure
interface PaginatedCropRecommendations {
    data: CropRecommendation[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Report9Props {
    cropRecommendations: PaginatedCropRecommendations;
    municipalities: Municipality[];
    filters: {
        search?: string;
        per_page?: number;
        municipality_id?: string;
    };
}

// Define the data structure for our table rows
type CropRecommendationRow = {
    id: string;
    cropName: string;
    avgConfidenceScore: number;
    recommendationCount: number;
    suitabilityRating: string;
    confidenceLevel: string;
};

// Define table columns
const columns: ColumnDef<CropRecommendationRow>[] = [
    {
        accessorKey: "cropName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Crop Name" />
        ),
        cell: ({ row }) => (
            <div className="font-medium text-gray-900 dark:text-gray-100">
                {row.getValue("cropName")}
            </div>
        ),
    },
    {
        accessorKey: "avgConfidenceScore",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Avg Confidence Score" />
        ),
        cell: ({ row }) => {
            const score = row.getValue("avgConfidenceScore") as number;
            const getScoreColor = (score: number) => {
                if (score >= 0.8) return "text-green-600";
                if (score >= 0.6) return "text-yellow-600";
                return "text-red-600";
            };
            const getScoreBg = (score: number) => {
                if (score >= 0.8) return "bg-green-100 dark:bg-green-900/20";
                if (score >= 0.6) return "bg-yellow-100 dark:bg-yellow-900/20";
                return "bg-red-100 dark:bg-red-900/20";
            };
            return (
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(score)} ${getScoreBg(score)}`}>
                    {(score * 100).toFixed(1)}%
                </div>
            );
        },
    },
    {
        accessorKey: "recommendationCount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total Recommendations" />
        ),
        cell: ({ row }) => {
            const count = row.getValue("recommendationCount") as number;
            const getCountBadge = (count: number) => {
                if (count >= 20) return "default";
                if (count >= 10) return "secondary";
                return "outline";
            };
            return (
                <Badge variant={getCountBadge(count)} className="text-sm">
                    {count} recommendation{count !== 1 ? 's' : ''}
                </Badge>
            );
        },
    },
    {
        accessorKey: "suitabilityRating",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Suitability Rating" />
        ),
        cell: ({ row }) => {
            const rating = row.getValue("suitabilityRating") as string;
            const getRatingBadge = (rating: string) => {
                if (rating === 'Excellent') return { variant: "default" as const, color: "bg-green-600" };
                if (rating === 'Good') return { variant: "secondary" as const, color: "bg-yellow-600" };
                if (rating === 'Fair') return { variant: "outline" as const, color: "bg-orange-600" };
                return { variant: "destructive" as const, color: "bg-red-600" };
            };
            const badge = getRatingBadge(rating);
            return (
                <Badge variant={badge.variant} className="text-sm">
                    {rating}
                </Badge>
            );
        },
    },
    {
        accessorKey: "confidenceLevel",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Confidence Level" />
        ),
        cell: ({ row }) => {
            const level = row.getValue("confidenceLevel") as string;
            const score = row.getValue("avgConfidenceScore") as number;
            const width = Math.round(score * 100);
            
            return (
                <div className="space-y-1">
                    <div className="text-xs text-gray-600 dark:text-gray-400">{level}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                                score >= 0.8 ? 'bg-green-600' : 
                                score >= 0.6 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${width}%` }}
                        ></div>
                    </div>
                </div>
            );
        },
    },
];

export default function Report9({ cropRecommendations, municipalities, filters }: Report9Props) {
    console.log(cropRecommendations, filters);

    // Transform the data for the table
    const transformedData: CropRecommendationRow[] = cropRecommendations.data.map((recommendation: CropRecommendation) => {
        const score = recommendation.avg_confidence_score;
        
        // Determine suitability rating based on confidence score
        const getSuitabilityRating = (score: number) => {
            if (score >= 0.8) return 'Excellent';
            if (score >= 0.6) return 'Good';
            if (score >= 0.4) return 'Fair';
            return 'Poor';
        };

        // Determine confidence level
        const getConfidenceLevel = (score: number) => {
            if (score >= 0.8) return 'High Confidence';
            if (score >= 0.6) return 'Medium Confidence';
            return 'Low Confidence';
        };
        
        return {
            id: recommendation.crop_id.toString(),
            cropName: recommendation.crop.name,
            avgConfidenceScore: score,
            recommendationCount: recommendation.recommendation_count,
            suitabilityRating: getSuitabilityRating(score),
            confidenceLevel: getConfidenceLevel(score),
        };
    });

    // Get summary statistics
    const excellentCrops = transformedData.filter(crop => crop.suitabilityRating === 'Excellent').length;
    const goodCrops = transformedData.filter(crop => crop.suitabilityRating === 'Good').length;
    const averageConfidence = transformedData.length > 0 
        ? transformedData.reduce((sum, crop) => sum + crop.avgConfidenceScore, 0) / transformedData.length 
        : 0;

    const handleMunicipalityChange = (value: string) => {
        router.get('/reports/report9', {
            ...filters,
            municipality_id: value === 'all' ? undefined : value,
        });
    };

    // Get top performing crops
    const topCrops = transformedData
        .sort((a, b) => b.avgConfidenceScore - a.avgConfidenceScore)
        .slice(0, 5);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports - Most Recommended Crops by Location" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-8">
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border dark:bg-gray-900">
                    <div className="flex flex-col gap-4">
                        <HeadingSmall
                            title="Most Recommended Crops for Specific Locations"
                            description="Shows the most recommended crops based on suitability scores and environmental data for specific locations."
                        />
                        
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Filter by Municipality:</span>
                                <Select
                                    value={filters.municipality_id || 'all'}
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
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Crops</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {transformedData.length}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Excellent Rating</div>
                                <div className="text-2xl font-bold text-green-600">
                                    {excellentCrops}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Good Rating</div>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {goodCrops}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {(averageConfidence * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        {/* Top Performing Crops */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Top Performing Crops:</span>
                                {topCrops.map((crop) => (
                                    <Badge key={crop.id} variant="default" className="text-xs">
                                        {crop.cropName} ({(crop.avgConfidenceScore * 100).toFixed(0)}%)
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Confidence Distribution */}
                        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-medium mb-2">Confidence Score Distribution</div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                    <span>High (80%+): {transformedData.filter(c => c.avgConfidenceScore >= 0.8).length}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                                    <span>Medium (60-79%): {transformedData.filter(c => c.avgConfidenceScore >= 0.6 && c.avgConfidenceScore < 0.8).length}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                    <span>Low (&lt;60%): {transformedData.filter(c => c.avgConfidenceScore < 0.6).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={transformedData}
                        searchKey="cropName"
                        searchPlaceholder="Search crops by name..."
                        enablePagination={true}
                        initialPageSize={15}
                        pageSizeOptions={[15, 25, 50, 100]}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
