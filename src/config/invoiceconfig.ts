import type { Invoice } from "../types"

export const getFinancialYear = (input: Date | string): string => {
  const date = new Date(input) // Safely convert string or Date

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date passed to getFinancialYear")
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`
}

export const validateInvoiceDate = (
  invoiceNumber: string,
  invoiceDate: Date,
  existingInvoices: Invoice[],
  currentInvoiceId?: string,
): { isValid: boolean; message?: string } => {
  const fy = getFinancialYear(invoiceDate)

  // Get invoices from the same financial year, excluding current invoice if editing
  const fyInvoices = existingInvoices.filter((inv) => inv.financialYear === fy && inv.invoiceId !== currentInvoiceId)

  // Check for duplicate invoice number in the same FY
  const duplicateNumber = fyInvoices.find((inv) => inv.invoiceNumber === invoiceNumber)
  if (duplicateNumber) {
    return {
      isValid: false,
      message: `Invoice number ${invoiceNumber} already exists in financial year ${fy}`,
    }
  }

  // Sort invoices by number for date validation
  const sortedInvoices = fyInvoices
    .filter((inv) => inv.invoiceNumber !== invoiceNumber)
    .sort((a, b) => Number.parseInt(a.invoiceNumber) - Number.parseInt(b.invoiceNumber))

  const currentNumber = Number.parseInt(invoiceNumber)

  // Find previous and next invoice numbers
  const previousInvoice = sortedInvoices.filter((inv) => Number.parseInt(inv.invoiceNumber) < currentNumber).pop()

  const nextInvoice = sortedInvoices.find((inv) => Number.parseInt(inv.invoiceNumber) > currentNumber)

  // Validate date falls between previous and next invoice dates
  if (previousInvoice && invoiceDate < previousInvoice.invoiceDate) {
    return {
      isValid: false,
      message: `Invoice date must be after ${previousInvoice.invoiceDate.toLocaleDateString()} (Invoice #${previousInvoice.invoiceNumber})`,
    }
  }

  if (nextInvoice && invoiceDate > nextInvoice.invoiceDate) {
    return {
      isValid: false,
      message: `Invoice date must be before ${nextInvoice.invoiceDate.toLocaleDateString()} (Invoice #${nextInvoice.invoiceNumber})`,
    }
  }

  return { isValid: true }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "Invalid Date";

  const validDate = new Date(date);
  if (isNaN(validDate.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(validDate);
};


export const getStatusColor = (status: string): string => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "SENT":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "PAID":
      return "bg-green-100 text-green-800 border-green-200"
    case "OVERDUE":
      return "bg-red-100 text-red-800 border-red-200"
    case "CANCELLED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
