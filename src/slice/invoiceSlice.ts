import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Invoice, UpdateInvoiceRequest } from "../types"
import { api } from "../api/api"

interface InvoiceState {
  invoices: Invoice[]
  loading: boolean
  error: string | null
}

const initialState: InvoiceState = {
  invoices: [],
  loading: false,
  error: null,
}

export const getInvoices = createAsyncThunk("invoices/getAll", async (id:string) => {
  const response = await api.get(`/invoices/${id}`)
  return response.data.invoices
})

export const createInvoice = createAsyncThunk("invoices/create", async (invoice: Invoice) => {
  const response = await api.post(`/invoice/${invoice.createdBy}`, invoice)
  return response.data.invoice
})

export const updateInvoice = createAsyncThunk("invoices/update", async ({invoice,userId}:{invoice: UpdateInvoiceRequest,userId:string}) => {
  const response = await api.put(`/invoice/${invoice.id}/${userId}`, {invoice})
  return response.data.invoice
})

export const deleteInvoice = createAsyncThunk("invoices/delete", async ({userId,id}:{userId:string,id: string}) => {
  await api.delete(`/invoice/${id}/${userId}`)
  return id
})

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInvoices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = action.payload
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.loading = false
        
        state.error = action.error.message || "Failed to load invoices"
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.push(action.payload)
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(i => i.id === action.payload.id)
        if (index !== -1) state.invoices[index] = action.payload
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(i => i.id !== action.payload)
      })
  }
})

export default invoiceSlice.reducer