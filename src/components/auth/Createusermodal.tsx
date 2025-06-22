"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import type { CreateUserRequest, User_Tyeps, UserRole } from "../../types"

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateUser: (userData: CreateUserRequest) => void
  creator:User_Tyeps
}

export default function CreateUserModal({ isOpen, onClose, onCreateUser ,creator}: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: "",
    email: "",
    role: "USER",
    password: "",
    TimeZone: "",
    groupId: "",
  })

  const [errors, setErrors] = useState<Partial<CreateUserRequest>>({})

  const validateForm = () => {
    const newErrors: Partial<CreateUserRequest> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onCreateUser(formData)
      setFormData({
        name: "",
        email: "",
        role: "USER",
        password: "",
        TimeZone: "",
        groupId: "",
      })
      setErrors({})
      onClose()
    }
  }

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Create New User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter full name"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                errors.name ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                errors.email ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
               {creator?.role === "SUPER_ADMIN" && (
    <>
      <option value="SUPER_ADMIN">Super Admin</option>
      <option value="ADMIN">Admin</option>
      <option value="UNIT_MANAGER">Unit Manager</option>
      <option value="USER">User</option>
    </>
  )}

  {creator?.role === "ADMIN" && (
    <>
      <option value="ADMIN">Admin</option>
      <option value="UNIT_MANAGER">Unit Manager</option>
      <option value="USER">User</option>
    </>
  )}

  {creator?.role === "UNIT_MANAGER" && (
    <>
      <option value="ADMIN">Admin</option>
      <option value="USER">User</option>
    </>
  )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter password"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                errors.password ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
            <select
              value={formData.TimeZone}
              onChange={(e) => handleInputChange("TimeZone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">Select time zone</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Asia/Kolkata">India</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group ID</label>
            <input
              type="text"
              value={formData.groupId}
              onChange={(e) => handleInputChange("groupId", e.target.value)}
              placeholder="Enter group ID (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
