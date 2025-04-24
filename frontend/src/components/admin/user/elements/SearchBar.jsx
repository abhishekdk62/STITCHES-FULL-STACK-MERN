import React from "react";
import { X, Search, RefreshCw } from "lucide-react";

const SearchBar = ({ searchInput, setSearchInput, getUsers }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by customer name or email"
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  getUsers("", 1);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            )}
          </div>
      
     
        </div>
      </div>
    </div>
  );
};

export default SearchBar;