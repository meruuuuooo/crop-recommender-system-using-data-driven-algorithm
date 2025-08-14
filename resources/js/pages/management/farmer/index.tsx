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
        title: 'Farmer',
        href: 'management/farmer',
    },
];

// Define the farmer data type
type Farmer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    farmSize: number;
    registeredDate: string;
};

// Sample data for demonstration
const sampleFarmers: Farmer[] = [
    {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 234 567 8900',
        location: 'California, USA',
        farmSize: 50,
        registeredDate: '2023-01-15',
    },
    {
        id: '2',
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1 234 567 8901',
        location: 'Texas, USA',
        farmSize: 75,
        registeredDate: '2023-02-20',
    },
    {
        id: '3',
        name: 'David Johnson',
        email: 'david.johnson@email.com',
        phone: '+1 234 567 8902',
        location: 'Iowa, USA',
        farmSize: 120,
        registeredDate: '2023-03-10',
    },
    {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        phone: '+1 234 567 8903',
        location: 'Nebraska, USA',
        farmSize: 90,
        registeredDate: '2022-12-05',
    },
    {
        id: '5',
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '+1 234 567 8904',
        location: 'Kansas, USA',
        farmSize: 200,
        registeredDate: '2023-01-30',
    },
    {
        id: '6',
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1 234 567 8905',
        location: 'North Dakota, USA',
        farmSize: 85,
        registeredDate: '2023-04-15',
    },
    {
        id: '7',
        name: 'Robert Miller',
        email: 'robert.miller@email.com',
        phone: '+1 234 567 8906',
        location: 'Minnesota, USA',
        farmSize: 145,
        registeredDate: '2023-05-22',
    },
    {
        id: '8',
        name: 'Jennifer Taylor',
        email: 'jennifer.taylor@email.com',
        phone: '+1 234 567 8907',
        location: 'Wisconsin, USA',
        farmSize: 65,
        registeredDate: '2023-06-10',
    },
];

export const columns: ColumnDef<Farmer>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{row.getValue('name')}</span>
                    <span className="text-sm text-muted-foreground">{row.original.email}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    },
    {
        accessorKey: 'location',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    },
    {
        accessorKey: 'farmSize',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Farm Size (acres)" />,
        cell: ({ row }) => {
            return <span>{row.getValue('farmSize')} acres</span>;
        },
    },
    {
        accessorKey: 'registeredDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Registered Date" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('registeredDate'));
            return <span>{date.toDateString()}</span>;
        },
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
                        <Link href={route('management.farmer.view')}>
                            <DropdownMenuItem>View farmer details</DropdownMenuItem>
                        </Link>
                        <Link href={route('management.farmer.edit')}>
                            <DropdownMenuItem>Edit farmer</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>View farm</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete farmer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function Farmer() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Farmer" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-8" style={{ backgroundColor: '#E6F4EA' }}>
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Farmer Management" description="Manage farmer details and information." />
                        <Link href={route('management.farmer.create')}>
                            <Button className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43]">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Farmer
                            </Button>
                        </Link>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={sampleFarmers}
                        searchKey="name"
                        searchPlaceholder="Search farmers..."
                        initialPageSize={5}
                        pageSizeOptions={[5, 10, 20, 50]}
                        enablePagination={true}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
