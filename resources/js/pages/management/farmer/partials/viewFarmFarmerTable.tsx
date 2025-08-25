import HeadingSmall from '@/components/heading-small';
import { PaginationData } from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Farm, PaginatedFarms, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Calendar, MapPin, Search, Tractor } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FarmTableProps {
    farms: PaginatedFarms;
    filters: {
        search?: string;
        per_page?: number;
    };
}

export default function ViewFarmFarmerTable({ farms, filters }: FarmTableProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 5);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Farm Management',
            href: '/management/farm',
        },
        {
            title: 'Farmer',
            href: route('management.farmer.show', { id: farms.data[0]?.farmer_id || '' }),
        },
        {
            title: 'Farm',
            href: '/management/farmer/farm/show',
        },
    ];

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(
                route('management.farmer.farm.show', { id: farms.data[0]?.farmer_id || '' }),
                {
                    search: search,
                    per_page: perPage,
                    page: 1, // Reset to first page when searching
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }, 500);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // Handle per page change
    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);

        router.get(
            route('management.farmer.farm.show', { id: farms.data[0]?.farmer_id || '' }),
            {
                search,
                per_page: newPerPage,
                page: 1, // Reset to first page when changing per page
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Sync local state with props when they change
    useEffect(() => {
        setSearch(filters.search || '');
        setPerPage(filters.per_page || 10);
    }, [filters.search, filters.per_page]);

    // Handle pagination
    const handlePageChange = (page: number) => {
        router.get(
            route('management.farmer.farm.show', { id: farms.data[0]?.farmer_id || '' }),
            {
                search,
                per_page: perPage,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const timeStampToDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const truncateText = (text: string, maxLength: number = 50) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const getFarmAddress = (farm: Farm) => {
        if (!farm.location) return 'Address not available';

        const street = farm.location.street || '';
        const barangay = farm.location.barangay?.name || '';
        const municipality = farm.location.municipality?.name || '';
        const province = farm.location.province?.name || '';

        const addressParts = [street, barangay, municipality, province].filter((part) => part.trim() !== '');
        return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
    };

    const getFarmerName = (farm: Farm) => {
        if (!farm.farmer) return 'Unknown Farmer';
        return `${farm.farmer.firstname} ${farm.farmer.lastname}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Farm Details" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-6 rounded-sm border border-sidebar-border/70 bg-white p-8 dark:border-sidebar-border">
                    {/* Header Section */}
                    <div className="flex items-center justify-start">
                        <HeadingSmall title="Farm Table" description={`Show farms owned by: ${getFarmerName(farms.data[0])}.`} />
                    </div>

                    {/* Farm Table */}

                    <TooltipProvider>
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                        <div className="relative w-full sm:w-80">
                                            <Label htmlFor="farmer-search" className="sr-only">
                                                Search farmers
                                            </Label>
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                                            <Input
                                                id="farmer-search"
                                                placeholder="Search by name, contact, or address..."
                                                value={search}
                                                onChange={(e) => handleSearchChange(e.target.value)}
                                                className="border-[#D6E3D4] pl-10 focus:border-[#619154] focus:ring-[#619154]"
                                                aria-describedby="search-hint"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="per-page" className="text-sm text-gray-500">
                                                Show:
                                            </Label>
                                            <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                                                <SelectTrigger className="w-20 border-[#D6E3D4] focus:border-[#619154] focus:ring-[#619154]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="5">5</SelectItem>
                                                    <SelectItem value="10">10</SelectItem>
                                                    <SelectItem value="25">25</SelectItem>
                                                    <SelectItem value="100">100</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="text-sm whitespace-nowrap text-gray-500">
                                            Showing <span className="font-medium">{farms.from || 0}</span>-
                                            <span className="font-medium">{farms.to || 0}</span> of <span className="font-medium">{farms.total}</span>{' '}
                                            farms
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-[#619154]">
                                            <TableRow>
                                                <TableHead className="w-[200px] font-semibold text-white">Farm Name</TableHead>
                                                <TableHead className="w-[120px] font-semibold text-white">Area (ha)</TableHead>
                                                <TableHead className="w-[180px] font-semibold text-white">Previous Crops</TableHead>
                                                <TableHead className="w-[250px] font-semibold text-white">Location</TableHead>
                                                <TableHead className="w-[120px] font-semibold text-white">Created</TableHead>
                                                <TableHead className="w-[120px] font-semibold text-white">Updated</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {farms.data.map((farm, index) => (
                                                <TableRow key={farm.id} className="transition-colors hover:bg-[#F8FAF8]" aria-rowindex={index + 2}>
                                                    <TableCell className="font-medium">
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-semibold text-gray-900">{farm.name}</div>
                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                <Tractor className="h-3 w-3" />
                                                                Farm ID: {farm.id}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-xs text-blue-700">
                                                            <Calendar className="mr-1 h-3 w-3" />
                                                            {farm.total_area || 'N/A'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="flex cursor-help items-center gap-2">
                                                                    <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                                    <span className="text-sm text-gray-700">
                                                                        {truncateText(farm.prev_crops || 'No previous crops', 25)}
                                                                    </span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="max-w-xs">{farm.prev_crops || 'No previous crops recorded'}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="flex cursor-help items-center gap-2">
                                                                    <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                                    <span className="text-sm text-gray-700">
                                                                        {truncateText(getFarmAddress(farm), 30)}
                                                                    </span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="max-w-xs">{getFarmAddress(farm)}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-xs text-gray-700">{timeStampToDate(farm.created_at)}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-xs text-gray-700">{timeStampToDate(farm.updated_at)}</div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                {farms.last_page > 1 && (
                                    <div className="border-t border-[#D6E3D4] px-6 py-4">
                                        <PaginationData
                                            currentPage={farms.current_page}
                                            totalPages={farms.last_page}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TooltipProvider>
                </div>
            </div>
        </AppLayout>
    );
}
