"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Filter, ChevronDown } from "lucide-react"
import type { UserRole, UserFilters } from "../types"

interface UserFiltersProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
}



export default function UserFiltersComponent({ filters, onFiltersChange }: UserFiltersProps) {

  
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false)
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false)
  const roleFilterRef = useRef<HTMLDivElement>(null)
  const statusFilterRef = useRef<HTMLDivElement>(null)



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleFilterRef.current && !roleFilterRef.current.contains(event.target as Node)) {
        setIsRoleFilterOpen(false)
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

  const handleRoleChange = (role: UserRole | "ALL") => {
    onFiltersChange({ ...filters, role })
    setIsRoleFilterOpen(false)
  }

  const handleStatusChange = (status: "ALL" | "ACTIVE" | "INACTIVE") => {
    onFiltersChange({ ...filters, status })
    setIsStatusFilterOpen(false)
  }

  const getRoleDisplayName = (role: UserRole | "ALL") => {
    switch (role) {
      case "ALL":
        return "All Roles"
      case "SUPER_ADMIN":
        return "Super Admin"
      case "ADMIN":
        return "Admin"
      case "UNIT_MANAGER":
        return "Unit Manager"
      case "USER":
        return "User"
      default:
        return role
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search users by name, email, or ID..."
          value={filters.searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      {/* Role Filter Dropdown */}
      <div className="relative" ref={roleFilterRef}>
        <button
          onClick={() => setIsRoleFilterOpen(!isRoleFilterOpen)}
          className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-700">{getRoleDisplayName(filters.role)}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isRoleFilterOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-40">
            {(["ALL", "SUPER_ADMIN", "ADMIN", "UNIT_MANAGER", "USER"] as const).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {getRoleDisplayName(role)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Filter Dropdown */}
      <div className="relative" ref={statusFilterRef}>
        <button
          onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
          className="w-full sm:w-40 px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-700">
            {filters.status === "ALL" ? "All Status" : filters.status === "ACTIVE" ? "Active" : "Inactive"}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isStatusFilterOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-40">
            {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {status === "ALL" ? "All Status" : status === "ACTIVE" ? "Active" : "Inactive"}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
