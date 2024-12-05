import React from 'react';

const Pagination = ({ totalPages, currentPage, pageSize, setPageSize, onPageChange }) => {
    if (totalPages <= 1) return null;

    const visiblePages = 3; // Show 3 pages in the middle for visibility
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + visiblePages - 1);

    // Adjust startPage if we are too close to the end
    if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    return (
        <div className="mt-4 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                    Previous
                </button>

                {/* First Page */}
                <button
                    onClick={() => onPageChange(0)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 0 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    1
                </button>

                {/* Ellipsis if necessary */}
                {startPage > 1 && <span className="px-4 py-2">...</span>}

                {/* Middle Pages */}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                    const page = startPage + i;
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page
                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {page + 1}
                        </button>
                    );
                })}

                {/* Ellipsis if necessary */}
                {endPage < totalPages - 2 && <span className="px-4 py-2">...</span>}

                {/* Last Page */}
                {endPage < totalPages - 1 && (
                    <button
                        onClick={() => onPageChange(totalPages - 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages - 1
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        {totalPages}
                    </button>
                )}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                    Next
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
