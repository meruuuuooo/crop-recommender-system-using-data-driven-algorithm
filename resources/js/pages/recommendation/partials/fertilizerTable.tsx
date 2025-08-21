import { PaginationData } from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Fertilizer } from '@/types/fertilizer';
import { Building, Calendar, Eye, FileText, FlaskConical, Package, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    total: number;
    perPage: number;
    from: number;
    to: number;
}

interface FertilizerTableProps {
    fertilizers: Fertilizer[];
    onView?: (fertilizer: Fertilizer) => void;
    onSearch?: (search: string) => void;
    searchValue?: string;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
}

export default function FertilizerTable({ fertilizers, onView, onSearch, searchValue = '', pagination, onPageChange }: FertilizerTableProps) {
    const [search, setSearch] = useState(searchValue);

    useEffect(() => {
        setSearch(searchValue);
    }, [searchValue]);

    // Debounced search handler
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onSearch && search !== searchValue) {
                onSearch(search);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, onSearch, searchValue]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const timeStampToDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getProductTypeColor = (type: string) => {
        const typeLower = type?.toLowerCase() || '';
        switch (typeLower) {
            case 'organic':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'inorganic':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'liquid':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'granular':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const isExpiringSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(today.getMonth() + 3);

        return expiry <= threeMonthsFromNow;
    };

    return (
        <Card className="border-[#D6E3D4]" role="region" aria-labelledby="fertilizers-table-heading">
            <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle id="fertilizers-table-heading" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                            <FlaskConical className="h-5 w-5 text-[#619154]" aria-hidden="true" />
                            Fertilizer Directory
                        </CardTitle>
                        <p className="mt-1 text-sm text-gray-600">Manage and view all registered fertilizers in the system</p>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-80">
                            <Label htmlFor="fertilizer-search" className="sr-only">
                                Search fertilizers
                            </Label>
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-[#619154]" aria-hidden="true" />
                            <Input
                                id="fertilizer-search"
                                placeholder="Search fertilizers..."
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="border-[#D6E3D4] pl-10 text-[#619154] placeholder:text-[#619154] focus:border-[#619154] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                aria-describedby="search-help"
                            />
                            <div id="search-help" className="sr-only">
                                Search by product name, company, type, target crops, or registration number
                            </div>
                        </div>
                        <div className="text-sm whitespace-nowrap text-[#619154]">
                            <span className="font-medium">{fertilizers.length}</span> of{' '}
                            <span className="font-medium">{pagination?.total || fertilizers.length}</span> fertilizers
                            {search && <span className="text-gray-500"> (filtered from {pagination?.total || fertilizers.length} total)</span>}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {/* Mobile Cards View for smaller screens */}
                <div className="block space-y-4 p-4 lg:hidden">
                    {fertilizers.length > 0 ? (
                        fertilizers.map((fertilizer: Fertilizer) => (
                            <Card key={fertilizer.id} className="border-[#D6E3D4] transition-shadow hover:shadow-md">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-[#619154]">{fertilizer.product_name || 'N/A'}</h3>
                                                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                                    <Building className="h-4 w-4" aria-hidden="true" />
                                                    <span>Company: {fertilizer.company || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {onView && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onView(fertilizer)}
                                                        className="h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                        aria-label={`View details for ${fertilizer.product_name}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Package className="h-4 w-4" aria-hidden="true" />
                                                <span>Type: {fertilizer.type_of_product || 'N/A'}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FileText className="h-4 w-4" aria-hidden="true" />
                                                <span>Target Crops: {fertilizer.target_crops || 'N/A'}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" aria-hidden="true" />
                                                <span>Expires: {timeStampToDate(fertilizer.expiry_date)}</span>
                                                {isExpiringSoon(fertilizer.expiry_date) && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Expiring Soon
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-500">
                            <FlaskConical className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
                            <p className="text-lg font-medium">{search ? 'No fertilizers found matching your search.' : 'No fertilizers found.'}</p>
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
                                    <TableHead className="font-semibold text-white">Product Name</TableHead>
                                    <TableHead className="font-semibold text-white">Company</TableHead>
                                    <TableHead className="font-semibold text-white">Type</TableHead>
                                    <TableHead className="font-semibold text-white">Target Crops</TableHead>
                                    <TableHead className="font-semibold text-white">Registration #</TableHead>
                                    <TableHead className="font-semibold text-white">Expiry Date</TableHead>
                                    <TableHead className="text-center font-semibold text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fertilizers.length > 0 ? (
                                    fertilizers.map((fertilizer: Fertilizer) => (
                                        <TableRow key={fertilizer.id} className="border-b border-[#D6E3D4] transition-colors hover:bg-[#F0F7ED]">
                                            <TableCell className="font-medium text-[#619154]">
                                                <div className="flex items-center gap-2">
                                                    <FlaskConical className="h-4 w-4 text-[#619154]" aria-hidden="true" />
                                                    {fertilizer.product_name || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[#619154]">
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4 text-[#619154]" aria-hidden="true" />
                                                    {fertilizer.company || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[#619154]">
                                                <Badge variant="secondary" className={getProductTypeColor(fertilizer.type_of_product)}>
                                                    <Package className="mr-1 h-3 w-3" aria-hidden="true" />
                                                    {fertilizer.type_of_product || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs text-[#619154]">
                                                <span title={fertilizer.target_crops || 'No target crops specified'} className="block truncate">
                                                    {fertilizer.target_crops || 'No target crops specified'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm text-[#619154]">
                                                {fertilizer.registration_number || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-[#619154]">
                                                <div className="flex items-center gap-2">
                                                    {timeStampToDate(fertilizer.expiry_date)}
                                                    {isExpiringSoon(fertilizer.expiry_date) && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Expiring Soon
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center space-x-2">
                                                    {onView && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onView(fertilizer)}
                                                            className="h-8 w-8 cursor-pointer p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                            aria-label={`View details for ${fertilizer.product_name}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
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
                                                <FlaskConical className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
                                                <p className="text-lg font-medium">
                                                    {search ? 'No fertilizers found matching your search.' : 'No fertilizers found.'}
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
                {pagination && pagination.totalPages > 1 && onPageChange && (
                    <div className="mt-6 px-4 pb-4">
                        <PaginationData
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={onPageChange}
                            maxVisiblePages={7}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
