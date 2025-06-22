"use client"

import { useState, useRef, useEffect } from "react"
import { Crown, Shield, UserIcon, MoreHorizontal, Edit, Trash2, Users } from "lucide-react"
import type {  User_Tyeps, UserRole } from "../types"

interface UserTableProps {
  users: User_Tyeps[]
  onEditUser: (user: User_Tyeps) => void
  onDeleteUser: (user: User_Tyeps) => void
}

const roleColors = {
  SUPER_ADMIN: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  ADMIN: "bg-purple-100 text-purple-800 border border-purple-200",
  UNIT_MANAGER: "bg-blue-100 text-blue-800 border border-blue-200",
  USER: "bg-green-100 text-green-800 border border-green-200",
}

const roleIcons = {
  SUPER_ADMIN: Crown,
  ADMIN: Crown,
  UNIT_MANAGER: Shield,
  USER: UserIcon,
}

export default function UserTable({ users, onEditUser, onDeleteUser }: UserTableProps) {

const [currentPage, setCurrentPage] = useState(1);
const usersPerPage = 5;

const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = [...users] 
  .reverse() 
  .slice(indexOfFirstUser, indexOfLastUser);

const totalPages = Math.ceil(users.length / usersPerPage);


  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getRoleIcon = (role: UserRole) => {
    const IconComponent = roleIcons[role]
    return <IconComponent className="h-4 w-4" />
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
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

  const formatDate = (date?: Date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString()
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria, or create a new user.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Time Zone</th>
            <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.userId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">ID: {user.userId}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}
                >
                  {getRoleIcon(user.role)}
                  <span>{getRoleDisplayName(user.role)}</span>
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
              <td className="py-4 px-4 text-sm text-gray-500">{user.TimeZone || "Not set"}</td>
              <td className="py-4 px-4 text-right">
                <div className="relative" ref={activeDropdown === user.userId ? dropdownRef : null}>
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === user.userId ? null : user.userId)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {activeDropdown === user.userId && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                      <button
                        onClick={() => {
                          onEditUser(user)
                          setActiveDropdown(null)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDeleteUser(user)
                          setActiveDropdown(null)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="flex justify-end mt-4 space-x-2 px-4">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
  >
    Previous
  </button>
  <span className="px-3 py-1 text-sm text-gray-600">
    Page {currentPage} of {totalPages}
  </span>
  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
  >
    Next
  </button>
</div>

    </div>
  )
}
