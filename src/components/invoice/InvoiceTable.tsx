"use client"

import { useState } from "react"
import {
  FileText,
  Calendar,
  DollarSign,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
 
} from "lucide-react"
import type { Invoice } from "../..//types"
import { formatCurrency, formatDate, getStatusColor } from "../../config/invoiceconfig"

interface InvoiceListProps {
  invoices: Invoice[]
  onEditInvoice: (invoice: Invoice) => void
  onDeleteInvoice: (invoice: Invoice) => void
  onViewInvoice?: (invoice: Invoice) => void
  loading?: boolean
}

export default function InvoiceList({
  invoices,
  onEditInvoice,
  onDeleteInvoice,
  onViewInvoice,
  loading = false,
}: InvoiceListProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleActionClick = (action: string, invoice: Invoice) => {
    setActiveDropdown(null)

    switch (action) {
      case "edit":
        onEditInvoice(invoice)
        break
      case "delete":
        onDeleteInvoice(invoice)
        break
      case "view":
        onViewInvoice?.(invoice)
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Invoices Found</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Get started by creating your first invoice. Track payments and manage your billing efficiently.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              {/* Left Section - Invoice Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">Invoice #{invoice.invoiceNumber}</h3>
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(invoice.invoiceDate)}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatCurrency(invoice.invoiceAmount)}
                    </div>
                    {invoice.customerName && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {invoice.customerName}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(invoice.invoiceAmount)}</div>
                  <div className="text-sm text-gray-500">FY {invoice.financialYear}</div>
                </div>

                {/* Action Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === invoice.invoiceId ? null : invoice.invoiceId)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>

                  {activeDropdown === invoice.invoiceId && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                      <button
                        onClick={() => handleActionClick("view", invoice)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </button>

                      <button
                        onClick={() => handleActionClick("edit", invoice)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Invoice
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => handleActionClick("delete", invoice)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Invoice
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {(invoice.description || invoice.dueDate) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                {invoice.description && <p className="text-sm text-gray-600 mb-2">{invoice.description}</p>}
                {invoice.dueDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {formatDate(invoice.dueDate)}
                    {invoice.dueDate < new Date() && invoice.status !== "PAID" && (
                      <span className="ml-2 text-red-600 font-medium">(Overdue)</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
