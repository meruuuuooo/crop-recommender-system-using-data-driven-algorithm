import { PaginationData } from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Farmer, type FarmerIndexProps } from '@/types/farmer';
import { router } from '@inertiajs/react';
import { Calendar, MapPin, Phone, Search, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
// import EditFarmerFormDialog from './editFarmerFormDialog';
import EditFarmerSheet from './editFarmerSheet';

export interface FarmerTableProps {
    farmers: FarmerIndexProps['farmers'];
    filters: FarmerIndexProps['filters'];
    onView: (farmer: Farmer) => void;
}

export default function FarmerTable({ farmers, filters, onView }: FarmerTableProps) {

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
                route('management.farmer.index'),
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
    }, [search]); // Handle per page change
    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);

        router.get(
            route('management.farmer.index'),
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
            route('management.farmer.index'),
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const truncateText = (text: string, maxLength: number = 50) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const getFullName = (farmer: Farmer) => {
        return `${farmer.firstname} ${farmer.middlename ? farmer.middlename + ' ' : ''}${farmer.lastname}`;
    };

    const getFullAddress = (farmer: Farmer) => {
        if (!farmer.location) return 'N/A';
        return `${farmer.location.street || 'N/A'}, ${farmer.location.barangay?.name || 'N/A'}, ${farmer.location.municipality?.name || 'N/A'}, ${farmer.location.province?.name || 'N/A'}`;
    };

    return (
        <TooltipProvider>
            <Card role="region" aria-labelledby="farmers-table-heading" className="rounded-sm">
                <CardHeader className="flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
                                Showing <span className="font-medium">{farmers.from || 0}</span>-
                                <span className="font-medium">{farmers.to || 0}</span> of <span className="font-medium">{farmers.total}</span> farmers
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {farmers.data.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                            <Users className="mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No farmers found</h3>
                            <p className="max-w-md text-gray-500">
                                {search
                                    ? 'No farmers match your search criteria. Try adjusting your search terms.'
                                    : 'There are no farmers registered in the system yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#619154]">
                                    <TableRow>
                                        <TableHead className="w-[200px] font-semibold text-white">Farmer Details</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-white">Contact</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-white">Experience</TableHead>
                                        <TableHead className="w-[250px] font-semibold text-white">Address</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-white">Registered</TableHead>
                                        <TableHead className="w-[80px] font-semibold text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {farmers.data.map((farmer, index) => (
                                        <TableRow
                                            key={farmer.id}
                                            aria-rowindex={index + 2}
                                            className="cursor-pointer transition-colors hover:bg-[#F0F4F0]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onView(farmer);
                                            }}
                                        >
                                            <TableCell className="font-medium">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <User className="h-3 w-3" />
                                                        <div className="text-sm font-semibold text-gray-900">{getFullName(farmer)}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">{farmer.contact_number}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-green-200 bg-green-50 text-xs text-green-700">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {farmer.farming_experience ? `${farmer.farming_experience} years` : 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex cursor-help items-center gap-2">
                                                            <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                            <span className="text-sm text-gray-700">{truncateText(getFullAddress(farmer), 30)}</span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">{getFullAddress(farmer)}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs text-gray-700">{formatDate(farmer.registration_date)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">


                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                {/* <EditFarmerFormDialog
                                                                    farmer={farmer}
                                                                /> */}
                                                                <EditFarmerSheet farmer={farmer} asMenuItem={false} />
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

                    {farmers.last_page > 1 && (
                        <div className="border-t border-[#D6E3D4] px-6 py-4">
                            <PaginationData currentPage={farmers.current_page} totalPages={farmers.last_page} onPageChange={handlePageChange} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
