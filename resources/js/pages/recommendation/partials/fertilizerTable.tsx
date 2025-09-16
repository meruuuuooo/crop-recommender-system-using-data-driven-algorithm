import { PaginationData } from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Fertilizer } from '@/types/fertilizer';
import { AlertTriangle, Building, Calendar, Eye, FileText, FlaskConical, Package, Search, Sprout } from 'lucide-react';
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
            month: 'short',
            day: 'numeric',
        });
    };

    const truncateText = (text: string, maxLength: number = 50) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
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
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const isExpiringSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(today.getMonth() + 6);
        return expiry <= sixMonthsFromNow;
    };

    const isExpired = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        return expiry < today;
    };

    return (
        <TooltipProvider>
            <Card className="border-[#D6E3D4]" role="region" aria-labelledby="fertilizers-table-heading">

                
            </Card>

            <Card className="border-[#D6E3D4]" role="region" aria-labelledby="fertilizers-table-heading">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-80">
                                <Label htmlFor="fertilizer-search" className="sr-only">
                                    Search fertilizers
                                </Label>
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                                <Input
                                    id="fertilizer-search"
                                    placeholder="Search by product name, company, type, target crops..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="border-[#D6E3D4] pl-10 focus:border-[#619154] focus:ring-[#619154]"
                                    aria-describedby="search-hint"
                                />
                            </div>
                            {pagination && (
                                <div className="text-sm text-gray-500">
                                    Showing {pagination.from}-{pagination.to} of {pagination.total} fertilizers
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {fertilizers.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                            <FlaskConical className="mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No fertilizers found</h3>
                            <p className="max-w-md text-gray-500">
                                {search
                                    ? 'No fertilizers match your search criteria. Try adjusting your search terms.'
                                    : 'There are no fertilizers registered in the system yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#619154]">
                                    <TableRow>
                                        <TableHead className="w-[200px] font-semibold text-white">Product Details</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-white">Company</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-white">Type</TableHead>
                                        <TableHead className="w-[180px] font-semibold text-white">Guaranteed Analysis</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-white">Target Crops</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-white">Expiry</TableHead>
                                        <TableHead className="w-[80px] font-semibold text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fertilizers.map((fertilizer, index) => (
                                        <TableRow key={fertilizer.id} className="transition-colors hover:bg-[#F8FAF8]" aria-rowindex={index + 2}>
                                            <TableCell className="font-medium">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-semibold text-gray-900">{fertilizer.product_name}</div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <FileText className="h-3 w-3" />
                                                        {fertilizer.registration_number}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                    <span className="truncate text-sm font-medium text-gray-700">{fertilizer.company}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getProductTypeColor(fertilizer.type_of_product || '')}`}
                                                >
                                                    <Package className="mr-1 h-3 w-3" />
                                                    {fertilizer.type_of_product || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex cursor-help items-center gap-2">
                                                            <FlaskConical className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                            <span className="text-sm text-gray-700">
                                                                {truncateText(fertilizer.guaranteed_analysis || 'No analysis available', 25)}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">{fertilizer.guaranteed_analysis}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex cursor-help items-center gap-2">
                                                            <Sprout className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                            <span className="text-sm text-gray-700">
                                                                {truncateText(fertilizer.target_crops || 'No target crops specified', 25)}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">{fertilizer.target_crops}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-gray-700">
                                                        {fertilizer.expiry_date ? timeStampToDate(fertilizer.expiry_date) : 'No expiry date'}
                                                    </div>
                                                    {fertilizer.expiry_date && isExpired(fertilizer.expiry_date) ? (
                                                        <Badge variant="destructive" className="text-xs">
                                                            <AlertTriangle className="mr-1 h-3 w-3" />
                                                            Expired
                                                        </Badge>
                                                    ) : fertilizer.expiry_date && isExpiringSoon(fertilizer.expiry_date) ? (
                                                        <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-xs text-yellow-700">
                                                            <AlertTriangle className="mr-1 h-3 w-3" />
                                                            Expiring Soon
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-green-200 bg-green-50 text-xs text-green-700">
                                                            <Calendar className="mr-1 h-3 w-3" />
                                                            Valid
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {onView && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => onView(fertilizer)}
                                                                    className="h-8 w-8 border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8]"
                                                                    aria-label={`View details for ${fertilizer.product_name}`}
                                                                >
                                                                    <Eye className="h-4 w-4 text-[#619154]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>View fertilizer details</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {pagination && pagination.totalPages > 1 && onPageChange && (
                        <div className="border-t border-[#D6E3D4] px-6 py-4">
                            <PaginationData currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={onPageChange} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
