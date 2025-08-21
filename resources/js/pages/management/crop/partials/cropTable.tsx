import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Search, Sprout, Calendar, Tag, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import type { Crop, PaginatedCrops } from '@/types/crop';
import { PaginationData } from '@/components/paginationData';

interface CropTableProps {
    crops: PaginatedCrops;
    filters: {
        search?: string;
        per_page?: number;
    };
    onEdit?: (crop: Crop) => void;
    onView?: (crop: Crop) => void;
}

export default function CropTable({ crops, filters, onEdit, onView }: CropTableProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    // Update search and navigate to new URL
    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('management.crop.index'), {
                search: search,
                per_page: perPage,
                page: 1 // Reset to first page when searching
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // Handle per page change
    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);

        router.get(route('management.crop.index'), {
            search,
            per_page: newPerPage,
            page: 1
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        router.get(route('management.crop.index'), {
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

    const getSeasonColor = (season: string) => {
        const seasonLower = season?.toLowerCase() || '';
        switch (seasonLower) {
            case 'wet':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'dry':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'all':
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <Card className="border-[#D6E3D4]" role="region" aria-labelledby="crops-table-heading">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle id="crops-table-heading" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Sprout className="w-5 h-5 text-[#619154]" aria-hidden="true" />
                            Crops Directory
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage and view all registered crops in the system
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="relative w-full sm:w-80">
                            <Label htmlFor="crop-search" className="sr-only">
                                Search crops
                            </Label>
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#619154]" aria-hidden="true" />
                            <Input
                                id="crop-search"
                                placeholder="Search crops..."
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10 border-[#D6E3D4] text-[#619154] placeholder:text-[#619154] focus:border-[#619154] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                aria-describedby="search-help"
                            />
                            <div id="search-help" className="sr-only">
                                Search by crop name, season, description, or category
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
                        <div className="text-sm text-[#619154] whitespace-nowrap">
                            <span className="font-medium">{crops.from || 0}</span>-<span className="font-medium">{crops.to || 0}</span> of{' '}
                            <span className="font-medium">{crops.total}</span> crops
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {/* Mobile Cards View for smaller screens */}
                <div className="block lg:hidden space-y-4 p-4">
                    {crops.data.length > 0 ? (
                        crops.data.map((crop: Crop) => (
                            <Card key={crop.id} className="border-[#D6E3D4] hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-[#619154] text-lg">
                                                    {crop.name || 'N/A'}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                    <Tag className="w-4 h-4" aria-hidden="true" />
                                                    <span>Category: {crop.category?.name || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {onView && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onView(crop)}
                                                        className="h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                        aria-label={`View details for ${crop.name}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {onEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEdit(crop)}
                                                        className="h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                        aria-label={`Edit ${crop.name}`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">

                                            {crop.description && (
                                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                                    <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                                                    <span className="line-clamp-2">{crop.description}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4" aria-hidden="true" />
                                                <span>Created: {timeStampToDate(crop.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Sprout className="w-12 h-12 mx-auto text-gray-300 mb-4" aria-hidden="true" />
                            <p className="text-lg font-medium">
                                {search ? 'No crops found matching your search.' : 'No crops found.'}
                            </p>
                            {search && (
                                <p className="text-sm mt-1">Try adjusting your search terms</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#619154]">
                                <TableRow>
                                    <TableHead className="text-white font-semibold">Crop Name</TableHead>
                                    <TableHead className="text-white font-semibold">Category</TableHead>
                                    <TableHead className="text-white font-semibold">Season</TableHead>
                                    <TableHead className="text-white font-semibold">Description</TableHead>
                                    <TableHead className="text-white font-semibold">Created At</TableHead>
                                    <TableHead className="text-white font-semibold text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {crops.data.length > 0 ? (
                                    crops.data.map((crop: Crop) => (
                                        <TableRow
                                            key={crop.id}
                                            className="hover:bg-[#F0F7ED] border-b border-[#D6E3D4] transition-colors"
                                        >
                                            <TableCell className="font-medium text-[#619154]">
                                                <div className="flex items-center gap-2">
                                                    <Sprout className="w-4 h-4 text-[#619154]" aria-hidden="true" />
                                                    {crop.name || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[#619154]">
                                                {crop.category?.name ? (
                                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                                        <Tag className="w-3 h-3 mr-1" aria-hidden="true" />
                                                        {crop.category.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-500">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-[#619154]">
                                                <Badge variant="secondary" className={getSeasonColor(crop.season)}>
                                                    {crop.season || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[#619154] max-w-xs">
                                                <span
                                                    title={crop.description || 'No description'}
                                                    className="block truncate"
                                                >
                                                    {crop.description || 'No description'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-[#619154]">
                                                {timeStampToDate(crop.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center space-x-2">
                                                    {onView && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onView(crop)}
                                                            className="cursor-pointer h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                            aria-label={`View details for ${crop.name}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {onEdit && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onEdit(crop)}
                                                            className="cursor-pointer h-8 w-8 p-0 text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2"
                                                            aria-label={`Edit ${crop.name}`}
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
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-12 text-gray-500"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Sprout className="w-12 h-12 text-gray-300 mb-4" aria-hidden="true" />
                                                <p className="text-lg font-medium">
                                                    {search ? 'No crops found matching your search.' : 'No crops found.'}
                                                </p>
                                                {search && (
                                                    <p className="text-sm mt-1">Try adjusting your search terms</p>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
                {crops.last_page > 1 && (
                    <div className="border-t border-[#D6E3D4] p-4">
                        <PaginationData
                            currentPage={crops.current_page}
                            totalPages={crops.last_page}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
