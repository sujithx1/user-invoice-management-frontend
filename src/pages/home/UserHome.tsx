"use client"

import { useState, useEffect, useCallback } from "react"
import { FileText, Plus, TrendingUp, DollarSign, Clock } from "lucide-react"
import type {
  Invoice,
  InvoiceFilters,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceStats,
} from "../../types"
import { getFinancialYear, formatCurrency } from "../../config/invoiceconfig"
import CreateInvoiceModal from "../../components/invoice/CreateInvoiceModal.tsx"
import InvoiceList from "../../components/invoice/InvoiceTable.tsx"
import EditInvoiceModal from "../../components/invoice/InvoiceEditmodal.tsx"
import InvoiceFiltersComponent from "../../components/invoice/InvoiceFilter.tsx"
import type { AppDispatch, RootState } from "../../store/store.ts"
import { useDispatch } from "react-redux"
import { createInvoice, deleteInvoice, getInvoices, updateInvoice } from "../../slice/invoiceSlice.ts"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import Header from "../../components/header/Header.tsx"

// Mock data - replace with actual API calls

export default function InvoiceManagement() {
    const dispatch:AppDispatch=useDispatch()
    const {invoices}=useSelector((state:RootState)=>state.invoice)
    const {user}=useSelector((state:RootState)=>state.user)
  const [tempinvoices, setInvoices] = useState<Invoice[]>(invoices)
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices)
  const [filters, setFilters] = useState<InvoiceFilters>({
    financialYear: "ALL",
    status: "ALL",
    searchTerm: "",
    dateRange: { startDate: "", endDate: "" },
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)




const fetchUserInvoices=useCallback(()=>{
    dispatch(getInvoices(user?.userId||"")).unwrap()
    .then((res)=>{
        console.log(res)
        
        setInvoices(res)
        setFilteredInvoices(res)
    })

},[user?.userId,dispatch])


useEffect(()=>{
    fetchUserInvoices()
},[fetchUserInvoices,dispatch])



  // Calculate statistics
  const stats: InvoiceStats = {
    totalInvoices: tempinvoices.length,
    totalAmount: tempinvoices.reduce((sum, inv) => sum + inv.invoiceAmount, 0),
    paidAmount: tempinvoices.filter((inv) => inv.status === "PAID").reduce((sum, inv) => sum + inv.invoiceAmount, 0),
    pendingAmount: tempinvoices.filter((inv) => inv.status === "SENT").reduce((sum, inv) => sum + inv.invoiceAmount, 0),
    overdueCount: tempinvoices.filter((inv) => inv.status === "OVERDUE").length,
    draftCount: tempinvoices.filter((inv) => inv.status === "DRAFT").length,
  }

  // Get available financial years
  const availableFinancialYears = Array.from(new Set(tempinvoices.map((inv) => inv.financialYear))).sort()

  // Filter tempinvoices based on current filters
  useEffect(() => {
    let filtered = tempinvoices

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (invoice) =>
   invoice.invoiceNumber.toString().includes(searchLower)|| 
             invoice.customerName?.toLowerCase().includes(searchLower) ||
          invoice.description?.toLowerCase().includes(searchLower),
      )
    }

    // Financial year filter
    if (filters.financialYear !== "ALL") {
      filtered = filtered.filter((invoice) => invoice.financialYear === filters.financialYear)
    }

    // Status filter
    if (filters.status !== "ALL") {
      filtered = filtered.filter((invoice) => invoice.status === filters.status)
    }
if (filters.dateRange.startDate) {
  filtered = filtered.filter(
    (invoice) => new Date(invoice.invoiceDate) >= new Date(filters.dateRange.startDate)
  );
}
if (filters.dateRange.endDate) {
  filtered = filtered.filter(
    (invoice) => new Date(invoice.invoiceDate) <= new Date(filters.dateRange.endDate)
  );
}

    setFilteredInvoices(filtered)
  }, [tempinvoices, filters])

  const handleCreateInvoice = async (invoiceData: CreateInvoiceRequest) => {
    const newInvoice: Invoice = {
      invoiceId: `inv_${Date.now()}`,
      invoiceNumber: invoiceData.invoiceNumber,
      invoiceDate: invoiceData.invoiceDate,
      invoiceAmount: invoiceData.invoiceAmount,
      financialYear: getFinancialYear(invoiceData.invoiceDate),
      createdBy:user?.userId||"", // Replace with actual user ID
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "DRAFT",
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail,
      description: invoiceData.description,
      dueDate: invoiceData.dueDate,
    }

    setInvoices([...tempinvoices, newInvoice])
dispatch(createInvoice(newInvoice)).unwrap()
.then(()=>{toast.success("success")

    fetchUserInvoices()
})
.catch((err)=>toast.error(err.message))
    // TODO: Call API nto create invoice

  }

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsEditModalOpen(true)
  }

  const handleUpdateInvoice = async (invoiceId: string, invoiceData: UpdateInvoiceRequest) => {
      const updatedInvoice = {
  
      ...invoiceData,
      invoiceId,
      financialYear: invoiceData.invoiceDate ? getFinancialYear(new Date(invoiceData.invoiceDate)) : "", // fallback if needed
    }
      dispatch(updateInvoice({invoice:updatedInvoice,userId:user?.userId||""})).unwrap()
.then(()=>toast.success("success"))
.catch(()=>toast.error("Something Problem"))

    const updatedInvoices = tempinvoices.map((invoice) =>
      invoice.invoiceId === invoiceId
        ? {
            ...invoice,
            ...invoiceData,
            financialYear: invoiceData.invoiceDate ? getFinancialYear(invoiceData.invoiceDate) : invoice.financialYear,
            updatedAt: new Date(),
          }
        : invoice,
    )
    setInvoices(updatedInvoices)

    // TODO: Call API to update invoice
  }

  const handleDeleteInvoice = async (invoice: Invoice) => {

    dispatch(deleteInvoice({userId:user?.userId||"",id:invoice.id||""})).unwrap()
    .then(()=>{toast.success("success")
        fetchUserInvoices()
    })
    .catch((err)=>toast.error(err.message))
    // const updatedInvoices = tempinvoices.filter((inv) => inv.invoiceId !== invoice.invoiceId)
    // setInvoices(updatedInvoices)
    // TODO: Call API to delete invoice
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
          <Header
                    currentUser={{
                      name: user?.name||"User",
                      role: user?.role||"User",
                      initials: "U",
                      id:user?.id||""
                    }}
                  />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
              <p className="text-gray-600 mt-1">Create, manage, and track your invoices efficiently</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Amount</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.pendingAmount)}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <InvoiceFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            availableFinancialYears={availableFinancialYears}
          />
        </div>

        {/* Invoice List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Invoices ({filteredInvoices.length})</h2>
            {filteredInvoices.length !== invoices.length && (
              <button
                onClick={() =>
                  setFilters({
                    financialYear: "ALL",
                    status: "ALL",
                    searchTerm: "",
                    dateRange: { startDate: "", endDate: "" },
                  })
                }
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>

          <InvoiceList
            invoices={filteredInvoices}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateInvoice={handleCreateInvoice}
        existingInvoices={invoices}
      />

      <EditInvoiceModal
        isOpen={isEditModalOpen}
        invoice={selectedInvoice}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedInvoice(null)
        }}
        onUpdateInvoice={handleUpdateInvoice}
        existingInvoices={invoices}
      />
    </div>
  )
}
