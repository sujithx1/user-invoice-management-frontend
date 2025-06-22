import { configureStore } from "@reduxjs/toolkit";
import userslice from "../slice/userslice"
import Invoiceslice from "../slice/invoiceSlice"

export const store=configureStore({
    reducer:{
        user:userslice,
        invoice:Invoiceslice
    }
})


export  type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch