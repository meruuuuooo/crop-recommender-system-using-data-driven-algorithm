import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farm',
        href: 'management/farm',
    },
];

// Define the farm data type
type Farm = {
    id: string;
    owner: string; // farmer name
    farmName: string;
    province: string;
    municipality: string;
    barangay: string;
};

// Sample data for demonstration
const sampleFarms: Farm[] = [
    {
        id: '1',
        owner: 'John Smith',
        farmName: 'Green Valley Farm',
        province: 'California',
        municipality: 'Los Angeles',
        barangay: 'Barangay 1',
    },
    {
        id: '2',
        owner: 'Maria Garcia',
        farmName: 'Sunrise Acres',
        province: 'Texas',
        municipality: 'Houston',
        barangay: 'Barangay 2',
    },
    {
        id: '3',
        owner: 'David Johnson',
        farmName: 'Johnson Fields',
        province: 'Iowa',
        municipality: 'Des Moines',
        barangay: 'Barangay 3',
    },
    {
        id: '4',
        owner: 'Sarah Wilson',
        farmName: 'Wilson Ranch',
        province: 'Nebraska',
        municipality: 'Omaha',
        barangay: 'Barangay 4',
    },
    {
        id: '5',
        owner: 'Michael Brown',
        farmName: 'Brown Family Farm',
        province: 'Kansas',
        municipality: 'Wichita',
        barangay: 'Barangay 5',
    },
    {
        id: '6',
        owner: 'Emily Davis',
        farmName: 'Davis Orchard',
        province: 'North Dakota',
        municipality: 'Fargo',
        barangay: 'Barangay 6',
    },
    {
        id: '7',
        owner: 'Robert Miller',
        farmName: 'Miller Pastures',
        province: 'Minnesota',
        municipality: 'Minneapolis',
        barangay: 'Barangay 7',
    },
    {
        id: '8',
        owner: 'Jennifer Taylor',
        farmName: 'Taylor Gardens',
        province: 'Wisconsin',
        municipality: 'Madison',
        barangay: 'Barangay 8',
    },
];

export const columns: ColumnDef<Farm>[] = [
    {
        accessorKey: 'farmName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Farm Name" />,
        cell: ({ row }) => (
            <span className="font-medium">{row.getValue('farmName')}</span>
        ),
    },
    {
        accessorKey: 'owner',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Owner" />,
        cell: ({ row }) => (
            <span>{row.getValue('owner')}</span>
        ),
    },
    {
        accessorKey: 'province',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Province" />,
    },
    {
        accessorKey: 'municipality',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Municipality" />,
    },
    {
        accessorKey: 'barangay',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Barangay" />,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: () => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={route('management.farm.view')}>
                            <DropdownMenuItem>View farm details</DropdownMenuItem>
                        </Link>
                        <Link href={route('management.farm.edit')}>
                            <DropdownMenuItem>Edit farm</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-destructive">Delete farm</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function Farm() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Farm" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Farm Management" description="Manage farm details and information." />
                        <Link href={route('management.farm.create')}>
                            <Button className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43]">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Farm
                            </Button>
                        </Link>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={sampleFarms}
                        searchKey="farmName"
                        searchPlaceholder="Search farms..."
                        initialPageSize={5}
                        pageSizeOptions={[5, 10, 20, 50]}
                        enablePagination={true}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
