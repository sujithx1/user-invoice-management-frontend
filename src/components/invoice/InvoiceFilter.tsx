"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Filter, ChevronDown, Calendar } from "lucide-react"
import type { InvoiceFilters } from "../../types"

interface InvoiceFiltersProps {
  filters: InvoiceFilters
  onFiltersChange: (filters: InvoiceFilters) => void
  availableFinancialYears: string[]
}

export default function InvoiceFiltersComponent({
  filters,
  onFiltersChange,
  availableFinancialYears,
}: InvoiceFiltersProps) {
  const [isFYFilterOpen, setIsFYFilterOpen] = useState(false)
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false)
  const fyFilterRef = useRef<HTMLDivElement>(null)
  const statusFilterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fyFilterRef.current && !fyFilterRef.current.contains(event.target as Node)) {
        setIsFYFilterOpen(false)
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setIsStatusFilterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm })
  }

  const handleFYChange = (financialYear: string) => {
    onFiltersChange({ ...filters, financialYear })
    setIsFYFilterOpen(false)
  }

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status })
    setIsStatusFilterOpen(false)
  }

  const handleDateRangeChange = (field: "startDate" | "endDate", value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    })
  }

  const clearDateRange = () => {
    onFiltersChange({
      ...filters,
      dateRange: { startDate: "", endDate: "" },
    })
  }

  return (
    <div className="space-y-4">
      {/* Search and Primary Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by invoice number, customer name, or description..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Financial Year Filter */}
        <div className="relative" ref={fyFilterRef}>
          <button
            onClick={() => setIsFYFilterOpen(!isFYFilterOpen)}
            className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-gray-700">
                {filters.financialYear === "ALL" ? "All Years" : `FY ${filters.financialYear}`}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {isFYFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-40">
              <button
                onClick={() => handleFYChange("ALL")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                All Financial Years
              </button>
              {availableFinancialYears.map((fy) => (
                <button
                  key={fy}
                  onClick={() => handleFYChange(fy)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  FY {fy}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative" ref={statusFilterRef}>
          <button
            onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
            className="w-full sm:w-40 px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700">{filters.status === "ALL" ? "All Status" : filters.status}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {isStatusFilterOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-40">
              {["ALL", "DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {status === "ALL" ? "All Status" : status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={filters.dateRange.startDate}
            onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={filters.dateRange.endDate}
            onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />

          {(filters.dateRange.startDate || filters.dateRange.endDate) && (
            <button onClick={clearDateRange} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
