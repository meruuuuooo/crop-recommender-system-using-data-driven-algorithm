import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, ChevronLeft, ChevronRight, Edit, Eye, MapPin, Phone, Search, User, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { type Farmer } from '@/types/farmer';
interface FarmerTableProps {
    farmers: Farmer[];
    onEdit?: (farmer: Farmer) => void;
    onView?: (farmer: Farmer) => void;
    onDelete?: (farmer: Farmer) => void;
}

export default function FarmerTable({ farmers, onEdit, onView }: FarmerTableProps) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredFarmers = useMemo(() => {
        const safeFarmers = Array.isArray(farmers) ? farmers : [];

        if (!search) return safeFarmers;

        return safeFarmers.filter(
            (farmer) =>
                farmer.first_name?.toLowerCase().includes(search.toLowerCase()) ||
                farmer.last_name?.toLowerCase().includes(search.toLowerCase()) ||
                farmer.middle_name?.toLowerCase().includes(search.toLowerCase()) ||
                farmer.contact_number?.includes(search) ||
                farmer.location?.province.name?.toString().includes(search) ||
                farmer.location?.municipality.name?.toString().includes(search) ||
                farmer.location?.barangay.name?.toString().includes(search),
        );
    }, [farmers, search]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFarmers = filteredFarmers.slice(startIndex, endIndex);

    // Reset to first page when search changes
    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getFullName = (farmer: Farmer) => {
        return `${farmer.first_name} ${farmer.middle_name ? farmer.middle_name + ' ' : ''}${farmer.last_name}`;
    };

    const getFullAddress = (farmer: Farmer) => {
        return `${farmer.location.street}, ${farmer.location.barangay.name}, ${farmer.location.municipality.name}, ${farmer.location.province.name}`;
    };

    return (
        <Card className="border-[#D6E3D4]" role="region" aria-labelledby="farmers-table-heading">
            <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle id="farmers-table-heading" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                            <Users className="h-5 w-5 text-[#619154]" aria-hidden="true" />
                            Farmers Directory
                        </CardTitle>
                        <p className="mt-1 text-sm text-gray-600">Manage and view all registered farmers in the system</p>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-80">
                            <Label htmlFor="farmer-search" className="sr-only">
                                Search farmers
                            </Label>
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-[#619154]" aria-hidden="true" />
                            <Input
                                id="farmer-search"
                                placeholder="Search farmers..."
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="border-[#D6E3D4] pl-10 text-[#619154] placeholder:text-[#619154] focus:border-[#619154] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                aria-describedby="search-help"
                            />
                            <div id="search-help" className="sr-only">
                                Search by name, contact, or address
                            </div>
                        </div>
                        <div className="text-sm whitespace-nowrap text-[#619154]">
                            <span className="font-medium">{currentFarmers.length}</span> of{' '}
                            <span className="font-medium">{filteredFarmers.length}</span> farmers
                            {search && <span className="text-gray-500"> (filtered from {Array.isArray(farmers) ? farmers.length : 0} total)</span>}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {/* Mobile Cards View for smaller screens */}
                <div className="block space-y-4 p-4 lg:hidden">
                    {currentFarmers.length > 0 ? (
                        currentFarmers.map((farmer) => (
                            <Card key={farmer.id} className="border-[#D6E3D4] transition-shadow hover:shadow-md">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-[#619154]">{getFullName(farmer)}</h3>
                                                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="h-4 w-4" aria-hidden="true" />
                                                    <span>{farmer.contact_number}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {onView && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onView(farmer)}
                                                        className="h-8 w-8 cursor-pointer p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                        aria-label={`View details for ${getFullName(farmer)}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {onEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEdit(farmer)}
                                                        className="h-8 w-8 cursor-pointer p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                        aria-label={`Edit ${getFullName(farmer)}`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Badge variant="secondary" className="border-[#D6E3D4] bg-[#F0F7ED] text-[#619154]">
                                                    {farmer.farming_experience ? `${farmer.farming_experience} years` : 'Experience: N/A'}
                                                </Badge>
                                            </div>

                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                                                <span className="line-clamp-2">{getFullAddress(farmer)}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" aria-hidden="true" />
                                                <span>Registered: {formatDate(farmer.registration_date)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-500">
                            <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
                            <p className="text-lg font-medium">{search ? 'No farmers found matching your search.' : 'No farmers found.'}</p>
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
                                    <TableHead className="font-semibold text-white">Name</TableHead>
                                    <TableHead className="font-semibold text-white">Contact</TableHead>
                                    <TableHead className="font-semibold text-white">Experience</TableHead>
                                    <TableHead className="font-semibold text-white">Address</TableHead>
                                    <TableHead className="font-semibold text-white">Registration Date</TableHead>
                                    <TableHead className="text-center font-semibold text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentFarmers.length > 0 ? (
                                    currentFarmers.map((farmer) => (
                                        <TableRow key={farmer.id} className="border-b border-[#D6E3D4] transition-colors hover:bg-[#F0F7ED]">
                                            <TableCell className="font-medium text-[#619154]">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" aria-hidden="true" />
                                                    {getFullName(farmer)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[#619154]">{farmer.contact_number}</TableCell>
                                            <TableCell className="text-[#619154]">
                                                <Badge variant="secondary" className="border-[#D6E3D4] bg-[#F0F7ED] text-[#619154]">
                                                    {farmer.farming_experience ? `${farmer.farming_experience} years` : 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs text-[#619154]">
                                                <span title={getFullAddress(farmer)} className="block truncate">
                                                    {getFullAddress(farmer)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-[#619154]">{formatDate(farmer.registration_date)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center space-x-2">
                                                    {onView && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onView(farmer)}
                                                            className="h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                            aria-label={`View details for ${getFullName(farmer)}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {onEdit && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onEdit(farmer)}
                                                            className="h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                            aria-label={`Edit ${getFullName(farmer)}`}
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
                                        <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Users className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
                                                <p className="text-lg font-medium">
                                                    {search ? 'No farmers found matching your search.' : 'No farmers found.'}
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
