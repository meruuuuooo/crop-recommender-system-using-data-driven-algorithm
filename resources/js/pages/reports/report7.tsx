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
        href: '/reports/report7',
    },
];

interface Farmer {
    id: number;
    firstname: string;
    middlename?: string;
    lastname: string;
}

interface Soil {
    id: number;
    soil_type: string;
    pH: number;
    test_date: string;
    phosphorus?: number;
    potassium?: number;
    nitrogen?: number;
}

interface Crop {
    id: number;
    name: string;
}

interface Recommendation {
    id: number;
    crop: Crop;
}

interface Farm {
    id: number;
    name: string;
    farmer: Farmer;
    soils: Soil[];
    recommendations: Recommendation[];
}

// Paginated response structure
interface PaginatedFarms {
    data: Farm[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Report7Props {
    farms: PaginatedFarms;
    soilTypes: string[];
    filters: {
        search?: string;
        per_page?: number;
        soil_type?: string;
    };
}

// Define the data structure for our table rows
type FarmRow = {
    id: string;
    farmName: string;
    farmerName: string;
    soilType: string;
    phLevel: string;
    lastTestDate: string;
    recommendedCrops: string;
    totalRecommendations: number;
};

// Define table columns
const columns: ColumnDef<FarmRow>[] = [
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
            <DataTableColumnHeader column={column} title="Farm Owner" />
        ),
        cell: ({ row }) => (
            <div className="text-sm text-gray-700 dark:text-gray-300">
                {row.getValue("farmerName")}
            </div>
        ),
    },
    {
        accessorKey: "soilType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Soil Type" />
        ),
        cell: ({ row }) => {
            const soilType = row.getValue("soilType") as string;
            const getSoilTypeBadge = (type: string) => {
                if (type.toLowerCase().includes('clay')) return "default";
                if (type.toLowerCase().includes('sandy')) return "secondary";
                if (type.toLowerCase().includes('loam')) return "outline";
                return "secondary";
            };
            return (
                <Badge variant={getSoilTypeBadge(soilType)} className="capitalize">
                    {soilType}
                </Badge>
            );
        },
    },
    {
        accessorKey: "phLevel",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="pH Level" />
        ),
        cell: ({ row }) => {
            const ph = parseFloat(row.getValue("phLevel") as string);
            const getPhBadge = (ph: number) => {
                if (ph < 6.0) return { variant: "destructive" as const, label: "Acidic" };
                if (ph > 8.0) return { variant: "default" as const, label: "Alkaline" };
                return { variant: "default" as const, label: "Neutral" };
            };
            const badge = getPhBadge(ph);
            return (
                <div className="space-y-1">
                    <div className="text-sm font-medium">{ph.toFixed(1)}</div>
                    <Badge variant={badge.variant} className="text-xs">
                        {badge.label}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "lastTestDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Test Date" />
        ),
        cell: ({ row }) => {
            const date = row.getValue("lastTestDate") as string;
            return (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(date).toLocaleDateString()}
                </div>
            );
        },
    },
    {
        accessorKey: "recommendedCrops",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Recommended Crops" />
        ),
        cell: ({ row }) => {
            const crops = row.getValue("recommendedCrops") as string;
            const totalRecommendations = row.getValue("totalRecommendations") as number;
            return (
                <div className="space-y-1">
                    <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                        <div className="truncate" title={crops}>
                            {crops || 'No recommendations'}
                        </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {totalRecommendations} crop{totalRecommendations !== 1 ? 's' : ''}
                    </Badge>
                </div>
            );
        },
    },
];

export default function Report7({ farms, soilTypes, filters }: Report7Props) {
    console.log(farms, filters);

    // Transform the data for the table
    const transformedData: FarmRow[] = farms.data.map((farm: Farm) => {
        const latestSoil = farm.soils[0]; // Assuming sorted by test_date desc
        const cropNames = farm.recommendations.map(rec => rec.crop.name).join(', ');
        
        return {
            id: farm.id.toString(),
            farmName: farm.name,
            farmerName: `${farm.farmer.firstname} ${farm.farmer.middlename ? farm.farmer.middlename + ' ' : ''}${farm.farmer.lastname}`,
            soilType: latestSoil?.soil_type || 'Unknown',
            phLevel: latestSoil?.pH?.toString() || '0',
            lastTestDate: latestSoil?.test_date || '',
            recommendedCrops: cropNames,
            totalRecommendations: farm.recommendations.length,
        };
    });

    // Get summary statistics
    const soilTypeStats: { [key: string]: number } = {};
    const phRanges = { acidic: 0, neutral: 0, alkaline: 0 };
    
    transformedData.forEach(farm => {
        soilTypeStats[farm.soilType] = (soilTypeStats[farm.soilType] || 0) + 1;
        const ph = parseFloat(farm.phLevel);
        if (ph < 6.0) phRanges.acidic++;
        else if (ph > 8.0) phRanges.alkaline++;
        else phRanges.neutral++;
    });

    const handleSoilTypeChange = (value: string) => {
        router.get('/reports/report7', {
            ...filters,
            soil_type: value === 'all' ? undefined : value,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports - Farms by Soil Types" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-8">
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border dark:bg-gray-900">
                    <div className="flex flex-col gap-4">
                        <HeadingSmall
                            title="Farms with Specific Soil Types and Recommended Crops"
                            description="Lists farms with specific soil types and their recommended crops based on soil conditions."
                        />
                        
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Filter by Soil Type:</span>
                                <Select
                                    value={filters.soil_type || 'all'}
                                    onValueChange={handleSoilTypeChange}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Select soil type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Soil Types</SelectItem>
                                        {soilTypes.map((type) => (
                                            <SelectItem key={type} value={type} className="capitalize">
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Farms</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {transformedData.length}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Acidic Soil</div>
                                <div className="text-2xl font-bold text-red-600">
                                    {phRanges.acidic}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Neutral Soil</div>
                                <div className="text-2xl font-bold text-green-600">
                                    {phRanges.neutral}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Alkaline Soil</div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {phRanges.alkaline}
                                </div>
                            </div>
                        </div>

                        {/* Top Soil Types */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Soil Types:</span>
                                {Object.entries(soilTypeStats)
                                    .sort(([,a], [,b]) => b - a)
                                    .slice(0, 5)
                                    .map(([type, count]) => (
                                    <Badge key={type} variant="outline" className="text-xs capitalize">
                                        {type} ({count})
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={transformedData}
                        searchKey="farmName"
                        searchPlaceholder="Search farms, owners, or soil types..."
                        enablePagination={true}
                        initialPageSize={15}
                        pageSizeOptions={[15, 25, 50, 100]}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
