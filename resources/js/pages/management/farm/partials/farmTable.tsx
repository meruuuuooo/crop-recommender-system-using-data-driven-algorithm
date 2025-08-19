import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Edit, Eye, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

type Farm = {
    id: number | string;
    name: string;
    total_area: number;
    prev_crops: string;
    location: {
        id: number;
        street: string;
        province: {
            id: number | string;
            name: string;
            region_code: string;
        },
        municipality: {
            id: number | string;
            province_id: number | string;
            name: string;
        },
        barangay: {
            id: number | string;
            municipality_id: number | string;
            name: string;
        }
    }
    farmer: {
        id: number | string;
        first_name: string;
        last_name: string;
        middle_name: string;
        contact_number: string;
    }
    created_at: string;
    updated_at: string;
};

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

        return safeFarms.filter((farm) =>
            farm.name?.toLowerCase().includes(search.toLowerCase()) ||
            farm.farmer?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
            farm.prev_crops?.toLowerCase().includes(search.toLowerCase()) ||
            farm.location?.province?.name?.toLowerCase().includes(search.toLowerCase()) ||
            farm.location?.municipality?.name?.toLowerCase().includes(search.toLowerCase()) ||
            farm.location?.barangay?.name?.toLowerCase().includes(search.toLowerCase())
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

        const addressParts = [street, barangay, municipality, province].filter(part => part.trim() !== '');
        return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#619154]" />
                    <Input
                        placeholder="Search farmers..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-[#619154] focus:ring-[#619154]"
                    />
                </div>
            </div>

            <div className="text-sm text-[#619154]">
                Showing {currentFarms.length} of {filteredFarms.length} farmers
                {search && ` (filtered from ${Array.isArray(farms) ? farms.length : 0} total)`}
            </div>

            <div className="rounded-md border border-[#D6E3D4] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#619154]">
                        <TableRow>
                            <TableHead className="text-white font-semibold">Farm Name</TableHead>
                            <TableHead className="text-white font-semibold">Total Area</TableHead>
                            <TableHead className="text-white font-semibold">Previous Crops Grown</TableHead>
                            <TableHead className="text-white font-semibold">Farm Location</TableHead>
                            <TableHead className="text-white font-semibold">Created At</TableHead>
                            <TableHead className="text-white font-semibold text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentFarms.length > 0 ? (
                            currentFarms.map((farm) => (
                                <TableRow
                                    key={farm.id}
                                    className="hover:bg-[#F0F7ED] border-b border-[#D6E3D4]"
                                >
                                    <TableCell className="font-medium text-[#619154]">
                                        {farm.name || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-[#619154]">
                                        {farm.total_area || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-[#619154]">
                                        {farm.prev_crops || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-[#619154] max-w-xs truncate">
                                        <span title={getFarmAddress(farm)}>
                                            {getFarmAddress(farm)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-[#619154]">
                                        {timeStampToDate(farm.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center space-x-2">
                                            {onView && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onView(farm)}
                                                    className="cursor-pointer h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43]"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {onEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEdit(farm)}
                                                    className="cursor-pointer h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43]"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {/* {onDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onDelete(farmer)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )} */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-8 text-[#619154]"
                                >
                                    {search ? 'No farms found matching your search.' : 'No farms found.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-[#619154]">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
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
                                        variant={currentPage === pageNumber ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={
                                            currentPage === pageNumber
                                                ? "bg-[#619154] text-white hover:bg-[#4F7A43]"
                                                : "border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43]"
                                        }
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
                            className="border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] disabled:opacity-50"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
