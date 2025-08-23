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
    // Activity,
    AlertTriangle,
    Bug,
    Building,
    Calendar,
    // Clock,
    Eye,
    FileText,
    Filter,
    FlaskConical,
    Leaf,
    Search,
    Shield,
    Snail,
    Sprout,
    X,
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
    onFilterSearch?: (filterType: string, value: string) => void;
    searchValue?: string;
    filters?: {
        search: string;
        crop_search: string;
        pest_search: string;
        weed_search: string;
        disease_search: string;
        toxicity_search: string;
        per_page: number;
    };
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
}

export default function PesticideTable({
    pesticides,
    onView,
    onSearch,
    onFilterSearch,
    searchValue = '',
    filters,
    pagination,
    onPageChange,
}: PesticideTableProps) {
    const [search, setSearch] = useState(searchValue);
    const [cropSearch, setCropSearch] = useState(filters?.crop_search || '');
    const [pestSearch, setPestSearch] = useState(filters?.pest_search || '');
    const [weedSearch, setWeedSearch] = useState(filters?.weed_search || '');
    const [diseaseSearch, setDiseaseSearch] = useState(filters?.disease_search || '');
    const [toxicitySearch, setToxicitySearch] = useState(filters?.toxicity_search || '');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setSearch(searchValue);
    }, [searchValue]);

    useEffect(() => {
        if (filters) {
            setCropSearch(filters.crop_search || '');
            setPestSearch(filters.pest_search || '');
            setWeedSearch(filters.weed_search || '');
            setDiseaseSearch(filters.disease_search || '');
            setToxicitySearch(filters.toxicity_search || '');
        }
    }, [filters]);

    // Debounced search handlers
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onSearch && search !== searchValue) {
                onSearch(search);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, onSearch, searchValue]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && cropSearch !== (filters?.crop_search || '')) {
                onFilterSearch('crop_search', cropSearch);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [cropSearch, onFilterSearch, filters?.crop_search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && pestSearch !== (filters?.pest_search || '')) {
                onFilterSearch('pest_search', pestSearch);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [pestSearch, onFilterSearch, filters?.pest_search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && weedSearch !== (filters?.weed_search || '')) {
                onFilterSearch('weed_search', weedSearch);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [weedSearch, onFilterSearch, filters?.weed_search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && diseaseSearch !== (filters?.disease_search || '')) {
                onFilterSearch('disease_search', diseaseSearch);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [diseaseSearch, onFilterSearch, filters?.disease_search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && toxicitySearch !== (filters?.toxicity_search || '')) {
                onFilterSearch('toxicity_search', toxicitySearch);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [toxicitySearch, onFilterSearch, filters?.toxicity_search]);

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

    const getToxicityColor = (category: string) => {
        const categoryLower = category?.toLowerCase() || '';
        switch (categoryLower) {
            case '1': // Most severe hazard - Highly toxic
                return 'bg-red-100 text-red-800 border-red-200';
            case '2': // Moderately severe hazard - Moderately toxic
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case '3': // Slightly severe hazard - Slightly toxic
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case '4': // Least severe hazard - Practically non-toxic
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

    const clearAllFilters = () => {
        setSearch('');
        setCropSearch('');
        setPestSearch('');
        setWeedSearch('');
        setDiseaseSearch('');
        setToxicitySearch('');

        if (onSearch) onSearch('');
        if (onFilterSearch) {
            onFilterSearch('crop_search', '');
            onFilterSearch('pest_search', '');
            onFilterSearch('weed_search', '');
            onFilterSearch('disease_search', '');
            onFilterSearch('toxicity_search', '');
        }
    };

    const hasActiveFilters = () => {
        return search || cropSearch || pestSearch || weedSearch || diseaseSearch || toxicitySearch;
    };

    return (
        <TooltipProvider>
            <Card className="border-[#D6E3D4]" role="region" aria-labelledby="pesticides-table-heading">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle id="pesticides-table-heading" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                                    <Snail className="h-5 w-5 text-[#619154]" aria-hidden="true" />
                                    Pesticide Directory
                                </CardTitle>
                                <p className="mt-1 text-sm text-gray-600">Manage and view all registered pesticides in the Philippines </p>
                            </div>
                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                <div className="relative w-full sm:w-80">
                                    <Label htmlFor="pesticide-search" className="sr-only">
                                        Search pesticides
                                    </Label>
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                                    <Input
                                        id="pesticide-search"
                                        placeholder="Search by product name, company, active ingredient..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="border-[#D6E3D4] pl-10 focus:border-[#619154] focus:ring-[#619154]"
                                        aria-describedby="search-hint"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="border-[#D6E3D4] hover:border-[#619154] hover:bg-[#F8FAF8]"
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                    {hasActiveFilters() && (
                                        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                                            {[search, cropSearch, pestSearch, weedSearch, diseaseSearch, toxicitySearch].filter(Boolean).length}
                                        </Badge>
                                    )}
                                </Button>
                                {pagination && (
                                    <div className="text-sm text-gray-500">
                                        Showing {pagination.from}-{pagination.to} of {pagination.total} pesticides
                                    </div>
                                )}
                            </div>
                        </div>

                        {showFilters && (
                            <Card className="border-[#D6E3D4] bg-[#F8FAF8]">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">Advanced Filters</CardTitle>
                                        {hasActiveFilters() && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearAllFilters}
                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <X className="mr-1 h-4 w-4" />
                                                Clear All
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="crop-search" className="flex items-center gap-2 text-sm font-medium">
                                                <Sprout className="h-4 w-4 text-[#619154]" />
                                                Crops
                                            </Label>
                                            <Input
                                                id="crop-search"
                                                placeholder="Search by crop type..."
                                                value={cropSearch}
                                                onChange={(e) => setCropSearch(e.target.value)}
                                                className="border-[#D6E3D4] focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pest-search" className="flex items-center gap-2 text-sm font-medium">
                                                <Bug className="h-4 w-4 text-orange-600" />
                                                Pests
                                            </Label>
                                            <Input
                                                id="pest-search"
                                                placeholder="Search by pest type..."
                                                value={pestSearch}
                                                onChange={(e) => setPestSearch(e.target.value)}
                                                className="border-[#D6E3D4] focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="weed-search" className="flex items-center gap-2 text-sm font-medium">
                                                <Leaf className="h-4 w-4 text-green-600" />
                                                Weeds
                                            </Label>
                                            <Input
                                                id="weed-search"
                                                placeholder="Search by weed type..."
                                                value={weedSearch}
                                                onChange={(e) => setWeedSearch(e.target.value)}
                                                className="border-[#D6E3D4] focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="disease-search" className="flex items-center gap-2 text-sm font-medium">
                                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                                Diseases
                                            </Label>
                                            <Input
                                                id="disease-search"
                                                placeholder="Search by disease type..."
                                                value={diseaseSearch}
                                                onChange={(e) => setDiseaseSearch(e.target.value)}
                                                className="border-[#D6E3D4] focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="toxicity-search" className="flex items-center gap-2 text-sm font-medium">
                                                <Shield className="h-4 w-4 text-yellow-600" />
                                                Toxicity Category
                                            </Label>
                                            <Input
                                                id="toxicity-search"
                                                placeholder="Search by toxicity (1-4, where 1=most toxic, 4=least toxic)..."
                                                value={toxicitySearch}
                                                onChange={(e) => setToxicitySearch(e.target.value)}
                                                className="border-[#D6E3D4] focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {pesticides.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                            <Bug className="mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No pesticides found</h3>
                            <p className="max-w-md text-gray-500">
                                {hasActiveFilters()
                                    ? 'No pesticides match your search criteria. Try adjusting your filters.'
                                    : 'There are no pesticides registered in the system yet.'}
                            </p>
                            {hasActiveFilters() && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="mt-4 border-[#D6E3D4] hover:border-[#619154] hover:bg-[#F8FAF8]"
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className='bg-[#619154]'>
                                    <TableRow>
                                        <TableHead className="w-[200px] font-semibold text-white">Product Details</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-white">Company</TableHead>
                                        <TableHead className="w-[180px] font-semibold text-white">Active Ingredient</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-white">Formulation</TableHead>
                                        <TableHead className="w-[100px] font-semibold text-white">Toxicity</TableHead>
                                        <TableHead className="w-[100px] font-semibold text-white">Target Crop</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-white">Target Pests</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-white">Expiry</TableHead>
                                        <TableHead className="w-[80px] font-semibold text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pesticides.map((pesticide, index) => (
                                        <TableRow key={pesticide.id} className="transition-colors hover:bg-[#F8FAF8]" aria-rowindex={index + 2}>
                                            <TableCell className="font-medium">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-semibold text-gray-900">{pesticide.product_name}</div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <FileText className="h-3 w-3" />
                                                        {pesticide.registration_number}
                                                    </div>
                                                    <div className="text-xs text-gray-600">{formatConcentration(pesticide.concentration)}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                    <span className="truncate text-sm font-medium text-gray-700">{pesticide.company}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex cursor-help items-center gap-2">
                                                            <FlaskConical className="h-4 w-4 flex-shrink-0 text-gray-400" />
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
                                                <Badge variant="outline" className={`text-xs ${getFormulationColor(pesticide.formulation_type)}`}>
                                                    {pesticide.formulation_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge
                                                            variant="outline"
                                                            className={`cursor-help text-xs ${getToxicityColor(pesticide.toxicity_category)}`}
                                                        >
                                                            <Shield className="mr-1 h-3 w-3" />
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
                                                        <div className="flex cursor-help items-center gap-2">
                                                            <Sprout className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                            <span className="text-sm text-gray-700">
                                                                {truncateText(pesticide.crops, 25)}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">{pesticide.crops}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex cursor-help items-center gap-2">
                                                            <Bug className="h-4 w-4 flex-shrink-0 text-gray-400" />
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
                                                    <div className="text-xs text-gray-700">{timeStampToDate(pesticide.expiry_date)}</div>
                                                    {isExpired(pesticide.expiry_date) ? (
                                                        <Badge variant="destructive" className="text-xs">
                                                            <AlertTriangle className="mr-1 h-3 w-3" />
                                                            Expired
                                                        </Badge>
                                                    ) : isExpiringSoon(pesticide.expiry_date) ? (
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
                                                                    onClick={() => onView(pesticide)}
                                                                    className="h-8 w-8 border-[#D6E3D4] p-0 hover:border-[#619154] hover:bg-[#F8FAF8]"
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
                        <div className="border-t border-[#D6E3D4] px-6 py-4">
                            <PaginationData currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={onPageChange} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
