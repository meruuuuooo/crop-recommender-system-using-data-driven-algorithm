import { PaginationData } from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Farm, FarmIndexProps, PaginatedFarms } from '@/types/farm';
import { router } from '@inertiajs/react';
import { Calendar, MapPin, Search, Tractor, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import EditFarmSheet from './editFarmSheet';

interface FarmTableProps {
    farms: PaginatedFarms;
    filters: {
        search?: string;
        per_page?: number;
    };
    farmers: FarmIndexProps['farmers'];
    onView?: (farm: Farm) => void;
}

export default function FarmTable({ farms, filters, farmers, onView }: FarmTableProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 6);

    // Update search and navigate to new URL
    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(
                route('management.farm.index'),
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
        }, 300);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // Handle per page change
    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);

        router.get(
            route('management.farm.index'),
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

    // Handle pagination
    const handlePageChange = (page: number) => {
        router.get(
            route('management.farm.index'),
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

    // Sync local state with props when they change
    useEffect(() => {
        setSearch(filters.search || '');
        setPerPage(filters.per_page || 10);
    }, [filters.search, filters.per_page]);

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
        <TooltipProvider>
            <Card className="rounded-sm" aria-labelledby="farms-table-heading">
                <CardHeader className="flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-80">
                                <Label htmlFor="farm-search" className="sr-only">
                                    Search farms
                                </Label>
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                                <Input
                                    id="farm-search"
                                    placeholder="Search by farm name, owner, crops, or location..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 focus:border-[#619154] focus:ring-[#619154]"
                                    aria-describedby="search-hint"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="per-page" className="text-sm text-gray-500">
                                    Show:
                                </Label>
                                <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="w-20 border-[#D6E3D4] focus:border-[#619154] focus:ring-[#619154]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6">6</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="text-sm whitespace-nowrap text-gray-500">
                                Showing <span className="font-medium">{farms.from || 0}</span>-<span className="font-medium">{farms.to || 0}</span> of{' '}
                                <span className="font-medium">{farms.total}</span> farms
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {farms.data.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                            <Tractor className="mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No farms found</h3>
                            <p className="max-w-md text-gray-500">
                                {search
                                    ? 'No farms match your search criteria. Try adjusting your search terms.'
                                    : 'There are no farms registered in the system yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#619154]">
                                    <TableRow>
                                        <TableHead className="w-[200px] font-semibold text-white">Farm Details</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-white">Owner</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-white">Area (ha)</TableHead>
                                        <TableHead className="w-[180px] font-semibold text-white">Previous Crops</TableHead>
                                        <TableHead className="w-[250px] font-semibold text-white">Location</TableHead>
                                        <TableHead className="w-[80px] font-semibold text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {farms.data.map((farm, index) => (
                                        <TableRow
                                            key={farm.id}
                                            aria-rowindex={index + 2}
                                            className="cursor-pointer transition-colors hover:bg-[#F0F4F0]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onView?.(farm);
                                            }}
                                        >
                                            <TableCell className="font-medium">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Tractor className="h-3 w-3" />
                                                        <div className="text-sm font-semibold text-gray-900">{farm.name}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">{getFarmerName(farm)}</span>
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
                                                            <span className="text-sm text-gray-700">{truncateText(getFarmAddress(farm), 30)}</span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">{getFarmAddress(farm)}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <EditFarmSheet farm={farm} farmers={farmers} />
                                                            </div>
                                                        </TooltipTrigger>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {farms.last_page > 1 && (
                        <div className="border-t border-[#D6E3D4] px-6 py-4">
                            <PaginationData currentPage={farms.current_page} totalPages={farms.last_page} onPageChange={handlePageChange} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
