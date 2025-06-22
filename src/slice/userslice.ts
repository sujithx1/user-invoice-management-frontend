import { createSlice } from "@reduxjs/toolkit";
import type { InitialState_types, User_Tyeps } from "../types";
import { getStoredUser, getStoredUsers } from "../config/getuserlocal";

const initialState:InitialState_types={
    user:getStoredUser()||null,
    users:getStoredUsers()||[],
    loading:false,
    isAuthenticated: !!getStoredUser(),
    error:null
}

const userslice=createSlice({
    name:'auth',
    initialState,
    reducers:{

        setusers:(state,action)=>{
            
            const newuser:User_Tyeps=action.payload
            state.users=[...state.users,newuser]
            // state.users.push(action.payload)
        },
         loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload));
          },
          logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user'); 
            localStorage.removeItem("token")
          },

    },

    


})



export const {setusers,loginSuccess,logout}=userslice.actions

export default userslice.reducer