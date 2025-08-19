import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Edit, Eye, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

type Farmer = {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    contact_number: string;
    farming_experience: string | null;
    registration_date: string;
    location: {
        street: string;
        province: {
            id: number | string;
            name: string;
            region_code: string;
        },
        municipality: {
            id: number | string;
            name: string;
            province_id: number | string;
        };
        barangay: {
            id: number | string;
            name: string;
            municipality_id: number | string;
        }
    };
    user: {
        last_name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
};

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

        return safeFarmers.filter((farmer) =>
            farmer.first_name?.toLowerCase().includes(search.toLowerCase()) ||
            farmer.last_name?.toLowerCase().includes(search.toLowerCase()) ||
            farmer.middle_name?.toLowerCase().includes(search.toLowerCase()) ||
            farmer.contact_number?.includes(search) ||
            farmer.location?.province.name?.toString().includes(search) ||
            farmer.location?.municipality.name?.toString().includes(search) ||
            farmer.location?.barangay.name?.toString().includes(search)
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
                Showing {currentFarmers.length} of {filteredFarmers.length} farmers
                {search && ` (filtered from ${Array.isArray(farmers) ? farmers.length : 0} total)`}
            </div>

            <div className="rounded-md border border-[#D6E3D4] overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#619154]">
                        <TableRow>
                            <TableHead className="text-white font-semibold">Name</TableHead>
                            <TableHead className="text-white font-semibold">Contact</TableHead>
                            <TableHead className="text-white font-semibold">Experience</TableHead>
                            <TableHead className="text-white font-semibold">Address</TableHead>
                            <TableHead className="text-white font-semibold">Registration Date</TableHead>
                            <TableHead className="text-white font-semibold text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentFarmers.length > 0 ? (
                            currentFarmers.map((farmer) => (
                                <TableRow
                                    key={farmer.id}
                                    className="hover:bg-[#F0F7ED] border-b border-[#D6E3D4]"
                                >
                                    <TableCell className="font-medium text-[#619154]">
                                        {getFullName(farmer)}
                                    </TableCell>
                                    <TableCell className="text-[#619154]">
                                        {farmer.contact_number}
                                    </TableCell>
                                    <TableCell className="text-[#619154]">
                                        {farmer.farming_experience ? `${farmer.farming_experience} years` : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-[#619154] max-w-xs truncate">
                                        <span title={getFullAddress(farmer)}>
                                            {getFullAddress(farmer)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-[#619154]">
                                        {formatDate(farmer.registration_date)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center space-x-2">
                                            {onView && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onView(farmer)}
                                                    className="cursor-pointer h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43]"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {onEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEdit(farmer)}
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
                                    {search ? 'No farmers found matching your search.' : 'No farmers found.'}
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
