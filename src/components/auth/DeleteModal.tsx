"use client"

import { Trash2 } from "lucide-react"
import type {  User_Tyeps } from "../../types"

interface DeleteUserModalProps {
  isOpen: boolean
  user: User_Tyeps | null
  onClose: () => void
  onConfirmDelete: () => void
}

export default function DeleteUserModal({ isOpen, user, onClose, onConfirmDelete }: DeleteUserModalProps) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete <strong>{user.name}</strong>? This will permanently remove their account and
          all associated data.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> This user has ID <code className="bg-yellow-100 px-1 rounded">{user.id}</code> and
            role <strong>{user.role}</strong>. Deleting this user may affect system functionality.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  )
}
