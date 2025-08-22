import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
            month: 'short',
            day: 'numeric',
        });
    };

    const truncateText = (text: string, maxLength: number = 50) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
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
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <TooltipProvider>
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
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                                <Input
                                    id="crop-search"
                                    placeholder="Search by crop name, season, description, category..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 border-[#D6E3D4] focus:border-[#619154] focus:ring-[#619154]"
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
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="text-sm text-gray-500 whitespace-nowrap">
                                Showing <span className="font-medium">{crops.from || 0}</span>-<span className="font-medium">{crops.to || 0}</span> of{' '}
                                <span className="font-medium">{crops.total}</span> crops
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {crops.data.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                            <Sprout className="mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No crops found</h3>
                            <p className="max-w-md text-gray-500">
                                {search
                                    ? 'No crops match your search criteria. Try adjusting your search terms.'
                                    : 'There are no crops registered in the system yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className='bg-[#619154]'>
                                    <TableRow>
                                        <TableHead className="w-[200px] font-semibold text-white">Crop Details</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-white">Category</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-white">Season</TableHead>
                                        <TableHead className="w-[250px] font-semibold text-white">Description</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-white">Created</TableHead>
                                        <TableHead className="w-[80px] font-semibold text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {crops.data.map((crop, index) => (
                                        <TableRow key={crop.id} className="transition-colors hover:bg-[#F8FAF8]" aria-rowindex={index + 2}>
                                            <TableCell className="font-medium">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-semibold text-gray-900">{crop.name}</div>
                                                    {crop.varieties && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <FileText className="h-3 w-3" />
                                                            Varieties: {truncateText(crop.varieties, 20)}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {crop.category?.name ? (
                                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                                                        <Tag className="mr-1 h-3 w-3" />
                                                        {crop.category.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-gray-500">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-xs ${getSeasonColor(crop.season)}`}>
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {crop.season || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex cursor-help items-center gap-2">
                                                            <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                            <span className="text-sm text-gray-700">
                                                                {truncateText(crop.description || 'No description', 30)}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">{crop.description || 'No description'}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs text-gray-700">{timeStampToDate(crop.created_at)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {onView && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => onView(crop)}
                                                                    className="h-8 w-8 border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8]"
                                                                    aria-label={`View details for ${crop.name}`}
                                                                >
                                                                    <Eye className="h-4 w-4 text-[#619154]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>View crop details</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    {onEdit && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => onEdit(crop)}
                                                                    className="h-8 w-8 border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8]"
                                                                    aria-label={`Edit ${crop.name}`}
                                                                >
                                                                    <Edit className="h-4 w-4 text-[#619154]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Edit crop</p>
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

                    {crops.last_page > 1 && (
                        <div className="border-t border-[#D6E3D4] px-6 py-4">
                            <PaginationData
                                currentPage={crops.current_page}
                                totalPages={crops.last_page}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
