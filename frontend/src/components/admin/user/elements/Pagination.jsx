import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  getUsers,
  searchInput,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-center items-center space-x-4 max-w-xs mx-auto">
        <button
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
              getUsers(searchInput.trim(), currentPage - 1);
            }
          }}
          disabled={currentPage <= 1}
          className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
          aria-label="Previous page"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => {
            if (currentPage < totalPages) {
              setCurrentPage(currentPage + 1);
              getUsers(searchInput.trim(), currentPage + 1);
            }
          }}
          disabled={currentPage >= totalPages}
          className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
          aria-label="Next page"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;