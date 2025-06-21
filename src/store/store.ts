import { configureStore } from "@reduxjs/toolkit";
import userslice from "../slice/userslice"

export const store=configureStore({
    reducer:{
        user:userslice
    }
})


export  type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch