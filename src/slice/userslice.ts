import { createSlice } from "@reduxjs/toolkit";
import type { InitialState_types } from "../types";

const initialState:InitialState_types={
    user:null,
    users:[],
    loading:false,
    error:null
}

const userslice=createSlice({
    name:'auth',
    initialState,
    reducers:{

    },


})



// export const {}=userslice.actions

export default userslice.reducer