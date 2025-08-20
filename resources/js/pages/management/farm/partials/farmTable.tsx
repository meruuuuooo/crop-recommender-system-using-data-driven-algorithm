import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, ChevronLeft, ChevronRight, Edit, Eye, MapPin, Search, Sprout, Tractor, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import type {Farm} from '@/types/farm';

interface FarmTableProps {
    farms: Farm[];
    onEdit?: (farm: Farm) => void;
    onView?: (farm: Farm) => void;
    onDelete?: (farm: Farm) => void;
}

export default function FarmTable({ farms, onEdit, onView }: FarmTableProps) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredFarms = useMemo(() => {
        const safeFarms = Array.isArray(farms) ? farms : [];

        if (!search) return safeFarms;

        return safeFarms.filter(
            (farm) =>
                farm.name?.toLowerCase().includes(search.toLowerCase()) ||
                farm.farmer?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
                farm.prev_crops?.toLowerCase().includes(search.toLowerCase()) ||
                farm.location?.province?.name?.toLowerCase().includes(search.toLowerCase()) ||
                farm.location?.municipality?.name?.toLowerCase().includes(search.toLowerCase()) ||
                farm.location?.barangay?.name?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [farms, search]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredFarms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFarms = filteredFarms.slice(startIndex, endIndex);

    // Reset to first page when search changes
    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

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
                        <div className="text-sm whitespace-nowrap text-[#619154]">
                            <span className="font-medium">{currentFarms.length}</span> of <span className="font-medium">{filteredFarms.length}</span>{' '}
                            farms
                            {search && <span className="text-gray-500"> (filtered from {Array.isArray(farms) ? farms.length : 0} total)</span>}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {/* Mobile Cards View for smaller screens */}
                <div className="block space-y-4 p-4 lg:hidden">
                    {currentFarms.length > 0 ? (
                        currentFarms.map((farm) => (
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
                                                {farm.prev_crops && (
                                                    <Badge variant="secondary" className="border-green-200 bg-green-50 text-green-700">
                                                        <Sprout className="mr-1 h-3 w-3" aria-hidden="true" />
                                                        {farm.prev_crops}
                                                    </Badge>
                                                )}
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
                                {currentFarms.length > 0 ? (
                                    currentFarms.map((farm) => (
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
                {totalPages > 1 && (
                    <div className="border-t border-[#D6E3D4] p-4">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="order-2 text-sm text-[#619154] sm:order-1">
                                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                            </div>
                            <nav className="order-1 flex items-center space-x-2 sm:order-2" aria-label="Pagination">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2 disabled:opacity-50"
                                    aria-label="Go to previous page"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">Previous</span>
                                </Button>

                                {/* Page Numbers */}
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNumber;
                                        if (totalPages <= 5) {
                                            pageNumber = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNumber = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNumber = totalPages - 4 + i;
                                        } else {
                                            pageNumber = currentPage - 2 + i;
                                        }

                                        return (
                                            <Button
                                                key={pageNumber}
                                                variant={currentPage === pageNumber ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={
                                                    currentPage === pageNumber
                                                        ? 'bg-[#619154] text-white hover:bg-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2'
                                                        : 'border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2'
                                                }
                                                aria-label={`Go to page ${pageNumber}`}
                                                aria-current={currentPage === pageNumber ? 'page' : undefined}
                                            >
                                                {pageNumber}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2 disabled:opacity-50"
                                    aria-label="Go to next page"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </nav>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
