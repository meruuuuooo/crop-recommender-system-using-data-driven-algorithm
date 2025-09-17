import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

// Extended Soil interface to match database schema
interface SoilData {
    id: number;
    farm_id: number;
    soil_type: string;
    nitrogen_level: string;
    phosphorus_level: string;
    potassium_level: string;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    pH: number;
    test_date: string;
    created_at: string;
    updated_at: string;
}

// Extended Farm interface with soils
interface FarmWithSoils {
    id: number;
    name: string;
    total_area: number;
    farmer?: {
        id: number;
        firstname: string;
        middlename?: string;
        lastname: string;
    };
    soils?: SoilData[];
}

// Paginated response structure
interface PaginatedFarms {
    data: FarmWithSoils[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Report1Props {
    farms: PaginatedFarms;
    filters: {
        search?: string;
        per_page?: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports/report1',
    },
];

// Define the data structure for our table rows
type SoilTestRow = {
    id: string;
    farmName: string;
    farmerName: string;
    soilType: string;
    ph: number;
    nitrogenLevel: string;
    phosphorusLevel: string;
    potassiumLevel: string;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    testDate: string;
    formattedTestDate: string;
};

// Define table columns
const columns: ColumnDef<SoilTestRow>[] = [
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
        accessorKey: "soilType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Soil Type" />
        ),
        cell: ({ row }) => {
            const soilType = row.getValue("soilType") as string;
            return (
                <Badge variant="outline" className="capitalize">
                    {soilType}
                </Badge>
            );
        },
    },
    {
        accessorKey: "ph",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="pH Level" />
        ),
        cell: ({ row }) => {
            const ph = row.getValue("ph") as number;
            const getPhColor = (ph: number) => {
                if (ph < 5.5) return "text-red-600 dark:text-red-400";
                if (ph > 8.0) return "text-blue-600 dark:text-blue-400";
                return "text-green-600 dark:text-green-400";
            };
            return (
                <span className={`font-medium ${getPhColor(ph)}`}>
                    {ph.toFixed(1)}
                </span>
            );
        },
    },
    {
        accessorKey: "nitrogenLevel",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nitrogen" />
        ),
        cell: ({ row }) => {
            const level = row.getValue("nitrogenLevel") as string;
            const nitrogen = row.original.nitrogen;
            const getLevelColor = (level: string) => {
                switch (level.toLowerCase()) {
                    case 'very low':
                    case 'low':
                        return "destructive";
                    case 'medium':
                        return "secondary";
                    case 'high':
                    case 'very high':
                        return "default";
                    default:
                        return "outline";
                }
            };
            return (
                <div className="space-y-1">
                    <Badge variant={getLevelColor(level)} className="text-xs">
                        {level}
                    </Badge>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {nitrogen.toFixed(1)} ppm
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "phosphorusLevel",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phosphorus" />
        ),
        cell: ({ row }) => {
            const level = row.getValue("phosphorusLevel") as string;
            const phosphorus = row.original.phosphorus;
            const getLevelColor = (level: string) => {
                switch (level.toLowerCase()) {
                    case 'very low':
                    case 'low':
                        return "destructive";
                    case 'medium':
                        return "secondary";
                    case 'high':
                    case 'very high':
                        return "default";
                    default:
                        return "outline";
                }
            };
            return (
                <div className="space-y-1">
                    <Badge variant={getLevelColor(level)} className="text-xs">
                        {level}
                    </Badge>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {phosphorus.toFixed(1)} ppm
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "potassiumLevel",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Potassium" />
        ),
        cell: ({ row }) => {
            const level = row.getValue("potassiumLevel") as string;
            const potassium = row.original.potassium;
            const getLevelColor = (level: string) => {
                switch (level.toLowerCase()) {
                    case 'very low':
                    case 'low':
                        return "destructive";
                    case 'medium':
                        return "secondary";
                    case 'high':
                    case 'very high':
                        return "default";
                    default:
                        return "outline";
                }
            };
            return (
                <div className="space-y-1">
                    <Badge variant={getLevelColor(level)} className="text-xs">
                        {level}
                    </Badge>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {potassium.toFixed(1)} ppm
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "formattedTestDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Test Date" />
        ),
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {row.getValue("formattedTestDate")}
            </div>
        ),
    },
];

export default function Report1({ farms, filters }: Report1Props) {
    console.log(farms);
    console.log(filters);

    // Transform the data for the table
    const transformedData: SoilTestRow[] = farms.data.flatMap((farm: FarmWithSoils) => {
        if (!farm.soils || farm.soils.length === 0) return [];
        
        return farm.soils.map((soil: SoilData, index: number) => {
            const farmerName = farm.farmer 
                ? `${farm.farmer.firstname} ${farm.farmer.middlename ? farm.farmer.middlename + ' ' : ''}${farm.farmer.lastname}`.trim()
                : 'Unknown Farmer';
            
            return {
                id: `${farm.id}-${soil.id}-${index}`,
                farmName: farm.name,
                farmerName,
                soilType: soil.soil_type || 'Unknown',
                ph: soil.pH || 0,
                nitrogenLevel: soil.nitrogen_level || 'Unknown',
                phosphorusLevel: soil.phosphorus_level || 'Unknown',
                potassiumLevel: soil.potassium_level || 'Unknown',
                nitrogen: soil.nitrogen || 0,
                phosphorus: soil.phosphorus || 0,
                potassium: soil.potassium || 0,
                testDate: soil.test_date,
                formattedTestDate: soil.test_date ? format(new Date(soil.test_date), 'MMM dd, yyyy') : 'Unknown',
            };
        });
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports - Soil Test Results" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-8">
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border dark:bg-gray-900">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <HeadingSmall
                            title="Soil Test Results Report"
                            description="Tracks soil test results and their history for each farm, including farm owner's name and test dates."
                        />
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Total Records: {transformedData.length}</span>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={transformedData}
                        searchKey="farmName"
                        searchPlaceholder="Search farms or farmers..."
                        enablePagination={true}
                        initialPageSize={10}
                        pageSizeOptions={[10, 25, 50, 100]}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
