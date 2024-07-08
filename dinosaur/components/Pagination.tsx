import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginate,
}) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;
    const halfMaxPageNumbers = Math.floor(maxPageNumbers / 2);

    let startPage = Math.max(currentPage - halfMaxPageNumbers, 1);
    let endPage = Math.min(currentPage + halfMaxPageNumbers, totalPages);

    if (currentPage <= halfMaxPageNumbers) {
      endPage = Math.min(maxPageNumbers, totalPages);
    }

    if (currentPage + halfMaxPageNumbers >= totalPages) {
      startPage = Math.max(totalPages - maxPageNumbers + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className="mx-1">
          <button
            onClick={() => paginate(i)}
            className={`px-3 py-1 rounded ${
              currentPage === i
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <nav className="py-4">
      <ul className="flex justify-center mt-4">
        {currentPage > 1 && (
          <li className="mx-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-1 rounded bg-white text-blue-500"
            >
              Previous
            </button>
          </li>
        )}
        {currentPage > 3 && (
          <li className="mx-1">
            <button
              onClick={() => paginate(1)}
              className="px-3 py-1 rounded bg-white text-blue-500"
            >
              1
            </button>
          </li>
        )}
        {currentPage > 4 && (
          <li className="mx-1">
            <span className="px-3 py-1">...</span>
          </li>
        )}
        {renderPageNumbers()}
        {currentPage < totalPages - 3 && (
          <li className="mx-1">
            <span className="px-3 py-1">...</span>
          </li>
        )}
        {currentPage < totalPages - 2 && (
          <li className="mx-1">
            <button
              onClick={() => paginate(totalPages)}
              className="px-3 py-1 rounded bg-white text-blue-500"
            >
              {totalPages}
            </button>
          </li>
        )}
        {currentPage < totalPages && (
          <li className="mx-1">
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-3 py-1 rounded bg-white text-blue-500"
            >
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
