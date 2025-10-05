import { PaginationData } from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Pesticide } from '@/types/pesticide';
import { Biohazard, Download } from 'lucide-react';
import Swal from 'sweetalert2';

import {
    // Activity,
    AlertTriangle,
    Bug,
    Calendar,
    // Clock,
    Eye,
    FileText,
    Filter,
    Leaf,
    Search,
    Shield,
    Sprout,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
    peste?: {
        pests: string[];
        weeds: string[];
        diseases: string[];
    };
    cropOptions: string[];
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
        pesticide_search: string;
        per_page: number;
    };
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
    loading?: boolean;
}

export default function PesticideTable({
    pesticides,
    peste,
    cropOptions,
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
    const [pesticideSearch, setPesticideSearch] = useState(filters?.pesticide_search || '');
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search.trim() === '') return;

            if (onSearch && search !== searchValue) {
                if (!Swal.isVisible()) {
                    Swal.fire({
                        title: 'Searching...',
                        text: 'Please wait while we fetch results.',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });
                }
                onSearch(search);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [search, onSearch, searchValue]);

    // Filters debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!cropSearch && !pestSearch && !weedSearch && !diseaseSearch && !toxicitySearch && !pesticideSearch) return;

            const changed =
                cropSearch !== (filters?.crop_search || '') ||
                pestSearch !== (filters?.pest_search || '') ||
                weedSearch !== (filters?.weed_search || '') ||
                diseaseSearch !== (filters?.disease_search || '') ||
                toxicitySearch !== (filters?.toxicity_search || '') ||
                pesticideSearch !== (filters?.pesticide_search || '');

            if (onFilterSearch && changed) {
                if (!Swal.isVisible()) {
                    Swal.fire({
                        title: 'Filtering...',
                        text: 'Applying filters, please wait.',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });
                }

                onFilterSearch('crop_search', cropSearch);
                onFilterSearch('pest_search', pestSearch);
                onFilterSearch('weed_search', weedSearch);
                onFilterSearch('disease_search', diseaseSearch);
                onFilterSearch('toxicity_search', toxicitySearch);
                onFilterSearch('pesticide_search', pesticideSearch);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [
        cropSearch,
        pestSearch,
        weedSearch,
        diseaseSearch,
        toxicitySearch,
        pesticideSearch,
        onFilterSearch,
        filters?.crop_search,
        filters?.pest_search,
        filters?.weed_search,
        filters?.disease_search,
        filters?.toxicity_search,
        filters?.pesticide_search,
    ]);

    // Close Swal when results are ready (any dataset update)
    useEffect(() => {
        if (Swal.isVisible()) {
            Swal.close();
        }
    }, [pesticides]);

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
            setPesticideSearch(filters.pesticide_search || '');
        }
    }, [filters]);

    // Debounced search handlers
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onSearch && search !== searchValue) {
                onSearch(search);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [search, onSearch, searchValue]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && cropSearch !== (filters?.crop_search || '')) {
                onFilterSearch('crop_search', cropSearch);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [cropSearch, onFilterSearch, filters?.crop_search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && pestSearch !== (filters?.pest_search || '')) {
                onFilterSearch('pest_search', pestSearch);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [pestSearch, onFilterSearch, filters?.pest_search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && weedSearch !== (filters?.weed_search || '')) {
                onFilterSearch('weed_search', weedSearch);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [weedSearch, onFilterSearch, filters?.weed_search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && diseaseSearch !== (filters?.disease_search || '')) {
                onFilterSearch('disease_search', diseaseSearch);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [diseaseSearch, onFilterSearch, filters?.disease_search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && toxicitySearch !== (filters?.toxicity_search || '')) {
                onFilterSearch('toxicity_search', toxicitySearch);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [toxicitySearch, onFilterSearch, filters?.toxicity_search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterSearch && pesticideSearch !== (filters?.pesticide_search || '')) {
                onFilterSearch('pesticide_search', pesticideSearch);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [pesticideSearch, onFilterSearch, filters?.pesticide_search]);

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

    const hasActiveFilters = () => {
        return search || cropSearch || pestSearch || weedSearch || diseaseSearch || toxicitySearch;
    };

    const formulationType = (formulation: string) => {
        const formulationLower = formulation?.toLowerCase() || '';
        switch (formulationLower) {
            case 'ec':
            case 'emulsifiable concentrate':
                return 'Emulsifiable Concentrate (EC)';
            case 'sc':
            case 'suspension concentrate':
                return 'Suspension Concentrate (SC)';
            case 'wp':
            case 'wettable powder':
                return 'Wettable Powder (WP)';
            case 'granules':
            case 'gr':
                return 'Granules (GR)';
            case 'dusts':
            case 'dust':
                return 'Dusts (D)';
            default:
                return formulation || 'N/A';
        }
    };

    const type_of_pesticide_options = [
        'HERBICIDE',
        'INSECTICIDE',
        'MOLLUSCICIDE',
        'FUNGICIDE',
        'RODENTICIDE',
        'FUMIGANT',
        'MITICIDE',
        'NEMATICIDE',
        'PGR',
        'IGR',
        'DISINFECTANT',
    ];

    const toxicity_options = [
        { label: '1 - Highly Toxic', value: '1' },
        { label: '2 - Moderately Toxic', value: '2' },
        { label: '3 - Slightly Toxic', value: '3' },
        { label: '4 - Practically Non-Toxic', value: '4' },
    ];



    const onDownload = (pesticide: Pesticide) => {
        toast.promise(
            new Promise((resolve) => {
                window.open(route('recommendation.downloadPesticide', pesticide.id), '_blank');
                setTimeout(() => {
                    resolve('Download successful');
                }, 2000);
            }),
            {
                loading: 'Downloading...',
                success: 'Download successful',
                error: 'Download failed',
            },
        );
    };

    const handleClear = () => {
        setSearch('');
        setCropSearch('');
        setPestSearch('');
        setWeedSearch('');
        setDiseaseSearch('');
        setToxicitySearch('');
        setPesticideSearch('');

        // Call parent reset
        if (onSearch) onSearch('');
        if (onFilterSearch) {
            onFilterSearch('crop_search', '');
            onFilterSearch('pest_search', '');
            onFilterSearch('weed_search', '');
            onFilterSearch('disease_search', '');
            onFilterSearch('toxicity_search', '');
            onFilterSearch('pesticide_search', '');
        }

        // Close any SweetAlert still open
        Swal.close();
    };

    return (
        <TooltipProvider>
            <Card className="rounded-sm shadow-sm" role="region" aria-labelledby="pesticides-table-heading">
                <CardHeader className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:flex-1">
                                <div className="relative w-full sm:flex-1 sm:max-w-md">
                                    <Label htmlFor="pesticide-search" className="sr-only">
                                        Search pesticides
                                    </Label>
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                                    <Input
                                        id="pesticide-search"
                                        placeholder="Search pesticides..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="h-10 pl-10 text-sm focus:border-[#619154] focus:ring-[#619154]"
                                        aria-describedby="search-hint"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="w-full shrink-0 hover:border-[#619154] hover:bg-[#F8FAF8] sm:w-auto"
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                    {hasActiveFilters() && (
                                        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                                            {
                                                [search, cropSearch, pestSearch, weedSearch, diseaseSearch, toxicitySearch, pesticideSearch].filter(
                                                    Boolean,
                                                ).length
                                            }
                                        </Badge>
                                    )}
                                </Button>
                            </div>
                            {pagination && (
                                <div className="text-xs text-gray-500 sm:text-sm">
                                    Showing {pagination.from}-{pagination.to} of {pagination.total}
                                </div>
                            )}
                        </div>

                        {showFilters && (
                            <Card className="rounded-sm bg-[#F8FAF8] shadow-sm">
                                <CardHeader className="p-4 sm:p-6">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <CardTitle className="text-base sm:text-lg">Advanced Filters</CardTitle>
                                        {hasActiveFilters() && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleClear}
                                                className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                                            >
                                                <X className="mr-1 h-4 w-4" />
                                                Clear All
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="crop-search" className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                                                <Sprout className="h-3.5 w-3.5 text-[#619154] sm:h-4 sm:w-4" />
                                                Crops
                                            </Label>
                                            <SearchableSelect
                                                options={cropOptions.map((option) => ({ label: option, value: option }))}
                                                placeholder="Search by crop..."
                                                value={cropSearch}
                                                onValueChange={(value) => setCropSearch(value)}
                                                clearable
                                                className="focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                            <div className="text-xs text-gray-500">
                                                <p>Search for crops by name.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="toxicity-search" className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                                                <Biohazard className="h-3.5 w-3.5 text-yellow-600 sm:h-4 sm:w-4" />
                                                Type of Pesticide
                                            </Label>
                                            <SearchableSelect
                                                options={type_of_pesticide_options.map((option) => ({ label: option, value: option }))}
                                                placeholder="Search by type of pesticide..."
                                                value={pesticideSearch}
                                                onValueChange={(value) => setPesticideSearch(value)}
                                                clearable
                                                className="focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                            <div className="text-xs text-gray-500">
                                                <p>Search for pesticides by type.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="toxicity-search" className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                                                <Shield className="h-3.5 w-3.5 text-yellow-600 sm:h-4 sm:w-4" />
                                                Toxicity Category
                                            </Label>
                                            <SearchableSelect
                                                options={toxicity_options}
                                                placeholder="Search by toxicity category..."
                                                value={toxicitySearch}
                                                onValueChange={(value) => setToxicitySearch(value)}
                                                clearable
                                                searchable={false}
                                                className="focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                            <div className="text-xs text-gray-500">
                                                <p>WHO Toxicity Classification.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pest-search" className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                                                <Bug className="h-3.5 w-3.5 text-orange-600 sm:h-4 sm:w-4" />
                                                Pests
                                            </Label>
                                            <SearchableSelect
                                                options={(peste?.pests ?? []).map((pest) => ({ label: pest, value: pest }))}
                                                placeholder="Search by pest type..."
                                                value={pestSearch}
                                                onValueChange={(value) => setPestSearch(value)}
                                                clearable
                                                className="focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                            <div className="text-xs text-gray-500">
                                                <p>Search for pests by name.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="weed-search" className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                                                <Leaf className="h-3.5 w-3.5 text-green-600 sm:h-4 sm:w-4" />
                                                Weeds
                                            </Label>
                                            <SearchableSelect
                                                options={(peste?.weeds ?? []).map((weed) => ({ label: weed, value: weed }))}
                                                placeholder="Search by weed type..."
                                                value={weedSearch}
                                                onValueChange={(value) => setWeedSearch(value)}
                                                clearable
                                                className="focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                            <div className="text-xs text-gray-500">
                                                <p>Search for weeds by name.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="disease-search" className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                                                <AlertTriangle className="h-3.5 w-3.5 text-red-600 sm:h-4 sm:w-4" />
                                                Diseases
                                            </Label>
                                            <SearchableSelect
                                                options={(peste?.diseases ?? []).map((disease) => ({ label: disease, value: disease }))}
                                                placeholder="Search by disease type..."
                                                value={diseaseSearch}
                                                onValueChange={(value) => setDiseaseSearch(value)}
                                                clearable
                                                className="focus:border-[#619154] focus:ring-[#619154]"
                                            />
                                            <div className="text-xs text-gray-500">
                                                <p>Search for diseases by name.</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {pesticides.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center sm:h-64 sm:py-12">
                            <Bug className="mb-3 h-10 w-10 text-gray-300 sm:mb-4 sm:h-12 sm:w-12" />
                            <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">No pesticides found</h3>
                            <p className="max-w-md px-4 text-xs text-gray-500 sm:text-sm">
                                {hasActiveFilters()
                                    ? 'No pesticides match your search criteria. Try adjusting your filters.'
                                    : 'There are no pesticides registered in the system yet.'}
                            </p>
                            {hasActiveFilters() && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClear}
                                    className="mt-4 hover:border-[#619154] hover:bg-[#F8FAF8]"
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#619154]">
                                    <TableRow>
                                        <TableHead className="w-[200px] font-semibold text-white">Product Details</TableHead>
                                        <TableHead className="w-[200px] font-semibold text-white">Type of Pesticide</TableHead>
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
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex cursor-help items-center gap-2">
                                                            <span className="text-sm text-gray-700">{truncateText(pesticide.uses, 25)}</span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">{pesticide.uses}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex cursor-help items-center gap-2">
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
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${getFormulationColor(pesticide.formulation_type)}`}
                                                        >
                                                            {pesticide.formulation_type}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">Formulation Type</p>
                                                            <p className="text-xs">{formulationType(pesticide.formulation_type)}</p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
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
                                                            <span className="text-sm text-gray-700">{truncateText(pesticide.crops, 25)}</span>
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
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    {onView && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => onView(pesticide)}
                                                                    className="h-7 w-7 p-0 hover:border-[#619154] hover:bg-[#F8FAF8] sm:h-8 sm:w-8"
                                                                    aria-label={`View details for ${pesticide.product_name}`}
                                                                >
                                                                    <Eye className="h-3.5 w-3.5 text-[#619154] sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="text-xs">View details</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    {onDownload && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => onDownload(pesticide)}
                                                                    className="h-7 w-7 p-0 hover:border-[#619154] hover:bg-[#F8FAF8] sm:h-8 sm:w-8"
                                                                    aria-label={`Download details for ${pesticide.product_name}`}
                                                                >
                                                                    <Download className="h-3.5 w-3.5 text-[#619154] sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="text-xs">Download details</p>
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
                        <div className="border-t border-[#005a23] px-4 pt-4 sm:px-6 sm:pt-6">
                            <PaginationData currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={onPageChange} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
