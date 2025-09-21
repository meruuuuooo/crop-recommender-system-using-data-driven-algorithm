import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { router } from '@inertiajs/react';
import { SearchableSelect } from '@/components/ui/searchable-select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports',
    },
    {
        title: 'Farms by Owner',
        href: '/reports/report3',
    },
];

// Extended Farm interface with location data
interface FarmWithLocation {
    id: number;
    name: string;
    total_area: number;
    cropping_system?: string;
    prev_crops?: string;
    farmer?: {
        id: number;
        firstname: string;
        middlename?: string;
        lastname: string;
    };
    location?: {
        province?: { name: string };
        municipality?: { name: string };
        barangay?: { name: string };
    };
}

interface Farmer {
    id: number;
    firstname: string;
    middlename?: string;
    lastname: string;
}

// Paginated response structure
interface PaginatedFarms {
    data: FarmWithLocation[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Report3Props {
    farms: PaginatedFarms;
    farmers: Farmer[];
    filters: {
        search?: string;
        per_page?: number;
        farmer_id?: number;
    };
}

// Define the data structure for our table rows
type FarmRow = {
    id: string;
    farmName: string;
    farmerName: string;
    location: string;
    totalArea: number;
    croppingSystem: string;
    previousCrops: string;
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
            <div className="text-gray-700 dark:text-gray-300">
                {row.getValue("farmerName")}
            </div>
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
        accessorKey: "totalArea",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total Area" />
        ),
        cell: ({ row }) => {
            const area = row.getValue("totalArea") as number;
            const getSizeCategory = (area: number) => {
                if (area < 1) return { variant: "secondary" as const, label: "Small" };
                if (area < 5) return { variant: "default" as const, label: "Medium" };
                return { variant: "destructive" as const, label: "Large" };
            };
            const category = getSizeCategory(area);
            return (
                <div className="space-y-1">
                    <Badge variant={category.variant} className="text-xs">
                        {category.label}
                    </Badge>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {area.toFixed(2)} hectares
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "croppingSystem",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cropping System" />
        ),
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.getValue("croppingSystem") || 'Not specified'}
            </Badge>
        ),
    },
    {
        accessorKey: "previousCrops",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Previous Crops" />
        ),
        cell: ({ row }) => {
            const crops = row.getValue("previousCrops") as string;
            return (
                <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {crops || 'Not specified'}
                </div>
            );
        },
    },
];

export default function Report3({ farms, farmers, filters }: Report3Props) {
    console.log(farms, farmers, filters);

    const handleFarmerChange = (farmerId: string) => {
        router.get('/reports/report3', {
            ...filters,
            farmer_id: farmerId === 'all' ? undefined : farmerId,
        });
    };

    // Transform the data for the table
    const transformedData: FarmRow[] = farms.data.map((farm: FarmWithLocation) => {
        const farmerName = farm.farmer
            ? `${farm.farmer.firstname} ${farm.farmer.middlename ? farm.farmer.middlename + ' ' : ''}${farm.farmer.lastname}`.trim()
            : 'Unknown Farmer';

        const location = farm.location
            ? [
                farm.location.barangay?.name,
                farm.location.municipality?.name,
                farm.location.province?.name
              ].filter(Boolean).join(', ')
            : 'Unknown Location';

        return {
            id: farm.id.toString(),
            farmName: farm.name,
            farmerName,
            location,
            totalArea: farm.total_area || 0,
            croppingSystem: farm.cropping_system || '',
            previousCrops: farm.prev_crops || '',
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports - Farms by Owner" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-8">
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border dark:bg-gray-900">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <HeadingSmall
                            title="Farms by Owner Report"
                            description="Shows all farms owned by a specific farmer, including location and size details."
                        />
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Filter by Farmer:</label>
                                <SearchableSelect
                                    options={farmers.map((farmer) => ({
                                        value: String(farmer.id),
                                        label: `${farmer.firstname} ${farmer.lastname}`,
                                    }))}
                                    onValueChange={(value) => {
                                        handleFarmerChange(value);
                                    }}
                                    placeholder="Select Farmer"
                                    searchPlaceholder="Search farmers..."
                                    clearable
                                />

                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Total Farms: {transformedData.length}
                            </div>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={transformedData}
                        searchKey="farmName"
                        searchPlaceholder="Search farms, farmers, or locations..."
                        enablePagination={true}
                        initialPageSize={10}
                        pageSizeOptions={[10, 25, 50, 100]}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
