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
        title: 'Climate Data',
        href: '/reports/report2',
    },
];

// Define the climate data structure from database
interface ClimateData {
    id: number;
    farm_id: number;
    temperature: number;
    rainfall: number;
    humidity: number;
    climate_record_date: string;
    created_at: string;
    updated_at: string;
}

// Extended Farm interface with climate and location data
interface FarmWithClimate {
    id: number;
    name: string;
    total_area: number;
    farmer?: {
        id: number;
        firstname: string;
        middlename?: string;
        lastname: string;
    };
    location?: {
        id: number;
        street: string;
        province?: {
            id: number;
            name: string;
        };
        municipality?: {
            id: number;
            name: string;
        };
        barangay?: {
            id: number;
            name: string;
        };
    };
    climates?: ClimateData[];
}

// Paginated response structure
interface PaginatedFarms {
    data: FarmWithClimate[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Report2Props {
    farms: PaginatedFarms;
    filters: {
        search?: string;
        per_page?: number;
    };
}

// Define the data structure for our table rows
type ClimateReportRow = {
    id: string;
    farmName: string;
    farmerName: string;
    location: string;
    temperature: number;
    humidity: number;
    rainfall: number;
    recordDate: string;
    formattedRecordDate: string;
};

// Define table columns
const columns: ColumnDef<ClimateReportRow>[] = [
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
            <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                {row.getValue("location")}
            </div>
        ),
    },
    {
        accessorKey: "temperature",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Temperature" />
        ),
        cell: ({ row }) => {
            const temp = row.getValue("temperature") as number;
            const getTempColor = (temp: number) => {
                if (temp < 20) return "text-blue-600 dark:text-blue-400";
                if (temp > 35) return "text-red-600 dark:text-red-400";
                return "text-green-600 dark:text-green-400";
            };
            return (
                <div className="flex items-center gap-1">
                    <span className={`font-medium ${getTempColor(temp)}`}>
                        {temp.toFixed(1)}°C
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "humidity",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Humidity" />
        ),
        cell: ({ row }) => {
            const humidity = row.getValue("humidity") as number;
            const getHumidityColor = (humidity: number) => {
                if (humidity < 40) return "destructive";
                if (humidity > 80) return "secondary";
                return "default";
            };
            return (
                <div className="flex items-center gap-2">
                    <Badge variant={getHumidityColor(humidity)} className="text-xs">
                        {humidity.toFixed(1)}%
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "rainfall",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Rainfall" />
        ),
        cell: ({ row }) => {
            const rainfall = row.getValue("rainfall") as number;
            const getRainfallColor = (rainfall: number) => {
                if (rainfall < 50) return "text-orange-600 dark:text-orange-400";
                if (rainfall > 200) return "text-blue-600 dark:text-blue-400";
                return "text-green-600 dark:text-green-400";
            };
            return (
                <div className="flex items-center gap-1">
                    <span className={`font-medium ${getRainfallColor(rainfall)}`}>
                        {rainfall.toFixed(1)} mm
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "formattedRecordDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Record Date" />
        ),
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {row.getValue("formattedRecordDate")}
            </div>
        ),
    },
];

export default function Report2({ farms, filters }: Report2Props) {
    console.log(farms);
    console.log(filters);

    // Transform the data for the table
    const transformedData: ClimateReportRow[] = farms.data.flatMap((farm: FarmWithClimate) => {
        if (!farm.climates || farm.climates.length === 0) return [];

        return farm.climates.map((climate: ClimateData, index: number) => {
            const farmerName = farm.farmer
                ? `${farm.farmer.firstname} ${farm.farmer.middlename ? farm.farmer.middlename + ' ' : ''}${farm.farmer.lastname}`.trim()
                : 'Unknown Farmer';

            // Build location string
            const locationParts = [];
            if (farm.location?.barangay?.name) locationParts.push(`Brgy. ${farm.location.barangay.name}`);
            if (farm.location?.municipality?.name) locationParts.push(farm.location.municipality.name);
            if (farm.location?.province?.name) locationParts.push(farm.location.province.name);
            const location = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown Location';

            return {
                id: `${farm.id}-${climate.id}-${index}`,
                farmName: farm.name,
                farmerName,
                location,
                temperature: climate.temperature || 0,
                humidity: climate.humidity || 0,
                rainfall: climate.rainfall || 0,
                recordDate: climate.climate_record_date,
                formattedRecordDate: climate.climate_record_date
                    ? format(new Date(climate.climate_record_date), 'MMM dd, yyyy')
                    : 'Unknown',
            };
        });
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports - Climate Data" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto  p-4">
                <Card className="flex flex-col gap-4 rounded-xl border bg-white p-8 dark:border-sidebar-border dark:bg-gray-900">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <HeadingSmall
                            title="Climate Data Report"
                            description="Recent climate data recorded for each farm, including location, humidity, rainfall, and temperature."
                        />
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span>Cold (&lt;20°C)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>Normal (20-35°C)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span>Hot (&gt;35°C)</span>
                                </div>
                            </div>
                            <span>Total Records: {transformedData.length}</span>
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
                </Card>
            </div>
        </AppLayout>
    );
}
