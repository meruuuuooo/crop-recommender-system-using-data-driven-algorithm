import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationDataProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showPrevNext?: boolean;
    maxVisiblePages?: number;
    maxVisiblePagesMobile?: number;
}

export function PaginationData({
    currentPage,
    totalPages,
    onPageChange,
    showPrevNext = true,
    maxVisiblePages = 5,
    maxVisiblePagesMobile = 3
}: PaginationDataProps) {
    const getVisiblePages = (isMobile: boolean = false) => {
        const maxPages = isMobile ? maxVisiblePagesMobile : maxVisiblePages;
        const pages: (number | 'ellipsis')[] = [];

        if (totalPages <= maxPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // For mobile, show more condensed pagination
            if (isMobile) {
                if (currentPage <= 2) {
                    // Show first 3 pages + ellipsis + last page
                    pages.push(1, 2, 3);
                    if (totalPages > 4) {
                        pages.push('ellipsis');
                    }
                    if (totalPages > 3) {
                        pages.push(totalPages);
                    }
                } else if (currentPage >= totalPages - 1) {
                    // Show first page + ellipsis + last 3 pages
                    pages.push(1);
                    if (totalPages > 4) {
                        pages.push('ellipsis');
                    }
                    pages.push(totalPages - 2, totalPages - 1, totalPages);
                } else {
                    // Show first + ellipsis + current-1, current, current+1 + ellipsis + last
                    pages.push(1);
                    if (currentPage > 3) {
                        pages.push('ellipsis');
                    }
                    pages.push(currentPage - 1, currentPage, currentPage + 1);
                    if (currentPage < totalPages - 2) {
                        pages.push('ellipsis');
                    }
                    pages.push(totalPages);
                }
            } else {
                // Desktop pagination logic (existing)
                pages.push(1);

                const startPage = Math.max(2, currentPage - Math.floor(maxPages / 2));
                const endPage = Math.min(totalPages - 1, startPage + maxPages - 3);

                if (startPage > 2) {
                    pages.push('ellipsis');
                }

                for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                }

                if (endPage < totalPages - 1) {
                    pages.push('ellipsis');
                }

                if (totalPages > 1) {
                    pages.push(totalPages);
                }
            }
        }

        return pages;
    };

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = getVisiblePages();
    const visiblePagesMobile = getVisiblePages(true);

    return (
        <Pagination className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="order-2 text-sm text-[#619154] sm:order-1">
                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </div>

            {/* Desktop Pagination */}
            <PaginationContent className='order-1 hidden sm:flex items-center space-x-2 sm:order-2'>
                {showPrevNext && (
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={handlePrevious}
                            className={`border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2 disabled:opacity-50 ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                        />
                    </PaginationItem>
                )}

                {visiblePages.map((page, index) => (
                    <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                onClick={() => handlePageClick(page as number)}
                                isActive={page === currentPage}
                                className={
                                    (page === currentPage
                                        ? 'bg-[#619154] text-white hover:bg-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2'
                                        : 'border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2') +
                                    ' cursor-pointer'
                                }
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {showPrevNext && (
                    <PaginationItem>
                        <PaginationNext
                            onClick={handleNext}
                            className={`border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2 disabled:opacity-50 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>

            {/* Mobile Pagination */}
            <PaginationContent className='order-1 flex sm:hidden items-center space-x-1 sm:order-2'>
                {showPrevNext && (
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={handlePrevious}
                            className={`h-8 w-8 p-0 border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2 disabled:opacity-50 ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                        >
                            <span className="sr-only">Previous</span>
                        </PaginationPrevious>
                    </PaginationItem>
                )}

                {visiblePagesMobile.map((page, index) => (
                    <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                            <PaginationEllipsis className="h-8 w-8" />
                        ) : (
                            <PaginationLink
                                onClick={() => handlePageClick(page as number)}
                                isActive={page === currentPage}
                                className={
                                    (page === currentPage
                                        ? 'bg-[#619154] text-white hover:bg-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2'
                                        : 'border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2') +
                                    ' cursor-pointer h-8 w-8 text-sm'
                                }
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {showPrevNext && (
                    <PaginationItem>
                        <PaginationNext
                            onClick={handleNext}
                            className={`h-8 w-8 p-0 border-[#D6E3D4] text-[#619154] hover:bg-[#F0F7ED] hover:text-[#4F7A43] focus:ring-2 focus:ring-[#619154] focus:ring-offset-2 disabled:opacity-50 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                        >
                            <span className="sr-only">Next</span>
                        </PaginationNext>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
