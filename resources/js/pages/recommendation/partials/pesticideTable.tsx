import { PaginationData } from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Pesticide } from '@/types/pesticide';
import {
    Building,
    Calendar,
    Eye,
    FileText,
    FlaskConical,
    Search,
    Shield,
    AlertTriangle,
    Clock,
    Bug,
    Activity
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    total: number;
    perPage: number;
    from: number;
    to: number;
}

interface PesticideTableProps {
    pesticides: Pesticide[];
    onView?: (pesticide: Pesticide) => void;
    onSearch?: (search: string) => void;
    searchValue?: string;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
}

export default function PesticideTable({
    pesticides,
    onView,
    onSearch,
    searchValue = '',
    pagination,
    onPageChange
}: PesticideTableProps) {
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

    const getToxicityColor = (category: string) => {
        const categoryLower = category?.toLowerCase() || '';
        switch (categoryLower) {
            case 'ia': // Extremely Hazardous
                return 'bg-red-100 text-red-800 border-red-200';
            case 'ib': // Highly Hazardous
                return 'bg-red-50 text-red-700 border-red-200';
            case 'ii': // Moderately Hazardous
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'iii': // Slightly Hazardous
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'u': // Unlikely to present hazard
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getFormulationColor = (formulation: string) => {
        const formulationLower = formulation?.toLowerCase() || '';
        switch (formulationLower) {
            case 'ec': // Emulsifiable Concentrate
            case 'emulsifiable concentrate':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'sc': // Suspension Concentrate
            case 'suspension concentrate':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'wp': // Wettable Powder
            case 'wettable powder':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'granules':
            case 'gr':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'dusts':
            case 'dust':
                return 'bg-gray-50 text-gray-700 border-gray-200';
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

    const formatConcentration = (concentration: string) => {
        if (!concentration) return 'N/A';
        return concentration.includes('%') ? concentration : `${concentration}%`;
    };

    const truncateText = (text: string, maxLength: number = 50) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <TooltipProvider>
            <Card className="border-[#D6E3D4]" role="region" aria-labelledby="pesticides-table-heading">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle id="pesticides-table-heading" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                                <Bug className="h-5 w-5 text-[#619154]" aria-hidden="true" />
                                Pesticide Directory
                            </CardTitle>
                            <p className="mt-1 text-sm text-gray-600">Manage and view all registered pesticides in the system</p>
                        </div>
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-80">
                                <Label htmlFor="pesticide-search" className="sr-only">
                                    Search pesticides
                                </Label>
                                <Search
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="pesticide-search"
                                    placeholder="Search by product name, company, active ingredient..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 border-[#D6E3D4] focus:border-[#619154] focus:ring-[#619154]"
                                    aria-describedby="search-hint"
                                />
                                <div id="search-hint" className="sr-only">
                                    Search through pesticide names, companies, and active ingredients
                                </div>
                            </div>
                            {pagination && (
                                <div className="text-sm text-gray-500">
                                    Showing {pagination.from}-{pagination.to} of {pagination.total} pesticides
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {pesticides.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                            <Bug className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No pesticides found</h3>
                            <p className="text-gray-500 max-w-md">
                                {search ?
                                    `No pesticides match your search "${search}". Try adjusting your search terms.` :
                                    'There are no pesticides registered in the system yet.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader >
                                    <TableRow className="bg-[#F8FAF8] hover:bg-[#F8FAF8]">
                                        <TableHead className="font-semibold text-gray-700 w-[200px]">Product Details</TableHead>
                                        <TableHead className="font-semibold text-gray-700 w-[150px]">Company</TableHead>
                                        <TableHead className="font-semibold text-gray-700 w-[180px]">Active Ingredient</TableHead>
                                        <TableHead className="font-semibold text-gray-700 w-[120px]">Formulation</TableHead>
                                        <TableHead className="font-semibold text-gray-700 w-[100px]">Toxicity</TableHead>
                                        <TableHead className="font-semibold text-gray-700 w-[150px]">Target Pests</TableHead>
                                        <TableHead className="font-semibold text-gray-700 w-[120px]">Safety Info</TableHead>
                                        <TableHead className="font-semibold text-gray-700 w-[120px]">Expiry</TableHead>
                                        <TableHead className="font-semibold text-gray-700 w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pesticides.map((pesticide, index) => (
                                        <TableRow
                                            key={pesticide.id}
                                            className="hover:bg-[#F8FAF8] transition-colors"
                                            aria-rowindex={index + 2}
                                        >
                                            <TableCell className="font-medium">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-gray-900 text-sm">
                                                        {pesticide.product_name}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <FileText className="h-3 w-3" />
                                                        {pesticide.registration_number}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {formatConcentration(pesticide.concentration)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm font-medium text-gray-700 truncate">
                                                        {pesticide.company}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex items-center gap-2 cursor-help">
                                                            <FlaskConical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700">
                                                                {truncateText(pesticide.active_ingredient, 25)}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">{pesticide.active_ingredient}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getFormulationColor(pesticide.formulation_type)}`}
                                                >
                                                    {pesticide.formulation_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs cursor-help ${getToxicityColor(pesticide.toxicity_category)}`}
                                                        >
                                                            <Shield className="h-3 w-3 mr-1" />
                                                            {pesticide.toxicity_category}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">WHO Toxicity Classification</p>
                                                            <p className="text-xs">{pesticide.toxicity_category}</p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex items-center gap-2 cursor-help">
                                                            <Bug className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700">
                                                                {truncateText(pesticide.pests || pesticide.weeds || pesticide.diseases, 25)}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="max-w-xs space-y-1">
                                                            <p className="font-medium">Target Pests/Weeds/Diseases:</p>
                                                            <p className="text-xs">{pesticide.pests || pesticide.weeds || pesticide.diseases}</p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-1 text-xs text-gray-600 cursor-help">
                                                                <Clock className="h-3 w-3" />
                                                                PHI: {pesticide.PHI}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Pre-Harvest Interval</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-1 text-xs text-gray-600 cursor-help">
                                                                <Activity className="h-3 w-3" />
                                                                REI: {pesticide.re_entry_period}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Re-entry Interval</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-gray-700">
                                                        {timeStampToDate(pesticide.expiry_date)}
                                                    </div>
                                                    {isExpired(pesticide.expiry_date) ? (
                                                        <Badge variant="destructive" className="text-xs">
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Expired
                                                        </Badge>
                                                    ) : isExpiringSoon(pesticide.expiry_date) ? (
                                                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Expiring Soon
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                            <Calendar className="h-3 w-3 mr-1" />
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
                                                                    onClick={() => onView(pesticide)}
                                                                    className="h-8 w-8 p-0 border-[#D6E3D4] hover:bg-[#F8FAF8] hover:border-[#619154]"
                                                                    aria-label={`View details for ${pesticide.product_name}`}
                                                                >
                                                                    <Eye className="h-4 w-4 text-[#619154]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>View pesticide details</p>
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
                        <div className="px-6 py-4 border-t border-[#D6E3D4]">
                            <PaginationData
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={onPageChange}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
