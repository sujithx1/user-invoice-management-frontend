"use client"

import type React from "react"

import { useState } from "react"
import { X, Calendar, DollarSign, FileText, User, Mail, AlertCircle } from "lucide-react"
import type { CreateInvoiceRequest, Invoice, ValidationError } from "../../types"
import { getFinancialYear, validateInvoiceDate } from "../../config/invoiceconfig"

interface CreateInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateInvoice: (invoiceData: CreateInvoiceRequest) => void
  existingInvoices: Invoice[]
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  onCreateInvoice,
  existingInvoices,
}: CreateInvoiceModalProps) {
  const [formData, setFormData] = useState<CreateInvoiceRequest>({
    invoiceNumber: "",
    invoiceDate: new Date(),
    invoiceAmount: 0,
    customerName: "",
    customerEmail: "",
    description: "",
    dueDate: undefined,
  })

  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = []

    // Basic validations
    if (!formData.invoiceNumber.trim()) {
      newErrors.push({ field: "invoiceNumber", message: "Invoice number is required" })
    } else if (!/^\d+$/.test(formData.invoiceNumber)) {
      newErrors.push({ field: "invoiceNumber", message: "Invoice number must contain only digits" })
    }

    if (!formData.invoiceDate) {
      newErrors.push({ field: "invoiceDate", message: "Invoice date is required" })
    }

    if (formData.invoiceAmount <= 0) {
      newErrors.push({ field: "invoiceAmount", message: "Invoice amount must be greater than 0" })
    }

    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.push({ field: "customerEmail", message: "Please enter a valid email address" })
    }

    if (formData.dueDate && formData.dueDate < formData.invoiceDate) {
      newErrors.push({ field: "dueDate", message: "Due date cannot be before invoice date" })
    }

    // Invoice-specific validations
    if (formData.invoiceNumber && formData.invoiceDate) {
      const validation = validateInvoiceDate(formData.invoiceNumber, formData.invoiceDate, existingInvoices)
      if (!validation.isValid) {
        newErrors.push({ field: "invoiceDate", message: validation.message || "Invalid invoice date" })
      }
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onCreateInvoice(formData)
      handleClose()
    } catch (error) {
      console.error("Error creating invoice:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      invoiceNumber: "",
      invoiceDate: new Date(),
      invoiceAmount: 0,
      customerName: "",
      customerEmail: "",
      description: "",
      dueDate: undefined,
    })
    setErrors([])
    setIsSubmitting(false)
    onClose()
  }

 const handleInputChange = <K extends keyof CreateInvoiceRequest>(
  field: K,
  value: CreateInvoiceRequest[K]
) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }))

  // Clear error related to this specific field
  setErrors((prev) => prev.filter((error) => error.field !== field))
}


  const getFieldError = (field: string): string | undefined => {
    return errors.find((error) => error.field === field)?.message
  }

  const financialYear = formData.invoiceDate ? getFinancialYear(formData.invoiceDate) : ""

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Create New Invoice</h3>
              {financialYear && <p className="text-sm text-gray-500 mt-1">Financial Year: {financialYear}</p>}
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Details Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Invoice Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                  placeholder="e.g., 001, 002, 003"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                    getFieldError("invoiceNumber")
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />
                {getFieldError("invoiceNumber") && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getFieldError("invoiceNumber")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.invoiceDate.toISOString().split("T")[0]}
                    onChange={(e) => handleInputChange("invoiceDate", new Date(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                      getFieldError("invoiceDate")
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {getFieldError("invoiceDate") && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getFieldError("invoiceDate")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.invoiceAmount}
                    onChange={(e) => handleInputChange("invoiceAmount", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                      getFieldError("invoiceAmount")
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {getFieldError("invoiceAmount") && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getFieldError("invoiceAmount")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dueDate?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value ? new Date(e.target.value) : undefined)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                      getFieldError("dueDate")
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {getFieldError("dueDate") && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getFieldError("dueDate")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Details Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Customer Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                    placeholder="customer@example.com"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                      getFieldError("customerEmail")
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {getFieldError("customerEmail") && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getFieldError("customerEmail")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter invoice description or notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
