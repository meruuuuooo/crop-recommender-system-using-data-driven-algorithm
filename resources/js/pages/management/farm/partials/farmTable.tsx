import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Edit, Eye, MapPin, Search, Tractor, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import type { Farm, PaginatedFarms } from '@/types/farm';
import { PaginationData } from '@/components/paginationData';

interface FarmTableProps {
    farms: PaginatedFarms;
    filters: {
        search?: string;
        per_page?: number;
    };
    onEdit?: (farm: Farm) => void;
    onView?: (farm: Farm) => void;
    onDelete?: (farm: Farm) => void;
}

export default function FarmTable({ farms, filters, onEdit, onView }: FarmTableProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    // Update search and navigate to new URL
    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('management.farm.index'), {
                search: search,
                per_page: perPage,
                page: 1 // Reset to first page when searching
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);    // Handle per page change
    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);

        router.get(route('management.farm.index'), {
            search,
            per_page: newPerPage,
            page: 1 // Reset to first page when changing per page
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        router.get(route('management.farm.index'), {
            search,
            per_page: perPage,
            page
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Sync local state with props when they change
    useEffect(() => {
        setSearch(filters.search || '');
        setPerPage(filters.per_page || 10);
    }, [filters.search, filters.per_page]);

    const timeStampToDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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

    return (
        <Card className="border-[#D6E3D4]" role="region" aria-labelledby="farms-table-heading">
            <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle id="farms-table-heading" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                            <Tractor className="h-5 w-5 text-[#619154]" aria-hidden="true" />
                            Farms Directory
                        </CardTitle>
                        <p className="mt-1 text-sm text-gray-600">Manage and view all registered farms in the system</p>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-80">
                            <Label htmlFor="farm-search" className="sr-only">
                                Search farms
                            </Label>
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-[#619154]" aria-hidden="true" />
                            <Input
                                id="farm-search"
                                placeholder="Search farms..."
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="border-[#D6E3D4] pl-10 text-[#619154] placeholder:text-[#619154] focus:border-[#619154] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                aria-describedby="search-help"
                            />
                            <div id="search-help" className="sr-only">
                                Search by farm name, owner, crops, or location
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="per-page" className="text-sm text-[#619154]">
                                Show:
                            </Label>
                            <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                                <SelectTrigger className="w-20 border-[#D6E3D4] text-[#619154] focus:border-[#619154] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-sm whitespace-nowrap text-[#619154]">
                            <span className="font-medium">{farms.from || 0}</span>-<span className="font-medium">{farms.to || 0}</span> of{' '}
                            <span className="font-medium">{farms.total}</span> farms
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {/* Mobile Cards View for smaller screens */}
                <div className="block space-y-4 p-4 lg:hidden">
                    {farms.data.length > 0 ? (
                        farms.data.map((farm: Farm) => (
                            <Card key={farm.id} className="border-[#D6E3D4] transition-shadow hover:shadow-md">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-[#619154]">{farm.name || 'N/A'}</h3>
                                                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                                    <User className="h-4 w-4" aria-hidden="true" />
                                                    <span>Owner: {farm.farmer?.last_name || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {onView && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onView(farm)}
                                                        className="h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                        aria-label={`View details for ${farm.name}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {onEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEdit(farm)}
                                                        className="h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                        aria-label={`Edit ${farm.name}`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Badge variant="secondary" className="border-blue-200 bg-blue-50 text-blue-700">
                                                    {farm.total_area || 'N/A'} area
                                                </Badge>

                                            </div>

                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                                                <span className="line-clamp-2">{getFarmAddress(farm)}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" aria-hidden="true" />
                                                <span>Created: {timeStampToDate(farm.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-500">
                            <Tractor className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
                            <p className="text-lg font-medium">{search ? 'No farms found matching your search.' : 'No farms found.'}</p>
                            {search && <p className="mt-1 text-sm">Try adjusting your search terms</p>}
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#619154]">
                                <TableRow>
                                    <TableHead className="font-semibold text-white">Farm Name</TableHead>
                                    <TableHead className="font-semibold text-white">Farm Owner</TableHead>
                                    <TableHead className="font-semibold text-white">Total Area (ha)</TableHead>
                                    {/* <TableHead className="text-white font-semibold">Previous Crops</TableHead> */}
                                    <TableHead className="font-semibold text-white">Location</TableHead>
                                    <TableHead className="font-semibold text-white">Created At</TableHead>
                                    <TableHead className="text-center font-semibold text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {farms.data.length > 0 ? (
                                    farms.data.map((farm: Farm) => (
                                        <TableRow key={farm.id} className="border-b border-[#D6E3D4] transition-colors hover:bg-[#F0F7ED]">
                                            <TableCell className="font-medium text-[#619154]">
                                                <div className="flex items-center gap-2">
                                                    <Tractor className="h-4 w-4 text-[#619154]" aria-hidden="true" />
                                                    {farm.name || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-[#619154]">{farm.farmer?.last_name || 'N/A'}</TableCell>
                                            <TableCell className="text-[#619154]">
                                                <Badge variant="secondary" className="border-blue-200 bg-blue-50 text-blue-700">
                                                    {farm.total_area || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            {/* <TableCell className="text-[#619154]">
                                                {farm.prev_crops ? (
                                                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                                                        <Sprout className="w-3 h-3 mr-1" aria-hidden="true" />
                                                        {farm.prev_crops}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-500">N/A</span>
                                                )}
                                            </TableCell> */}
                                            <TableCell className="max-w-xs text-[#619154]">
                                                <span title={getFarmAddress(farm)} className="block truncate">
                                                    {getFarmAddress(farm)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-[#619154]">{timeStampToDate(farm.created_at)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center space-x-2">
                                                    {onView && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onView(farm)}
                                                            className="h-8 w-8 cursor-pointer p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                            aria-label={`View details for ${farm.name}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {onEdit && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onEdit(farm)}
                                                            className="h-8 w-8 cursor-pointer p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                            aria-label={`Edit ${farm.name}`}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Tractor className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
                                                <p className="text-lg font-medium">
                                                    {search ? 'No farms found matching your search.' : 'No farms found.'}
                                                </p>
                                                {search && <p className="mt-1 text-sm">Try adjusting your search terms</p>}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
                {farms.last_page > 1 && (
                    <div className="border-t border-[#D6E3D4] p-4">
                        <PaginationData
                            currentPage={farms.current_page}
                            totalPages={farms.last_page}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
