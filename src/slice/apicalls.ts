import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ErrorPayload,
  
  User_create_types,
  User_Tyeps,
  UserLogin_types,
  UserRole,
} from "../types";
import { api } from "../api/api";
import { isAxiosError } from "axios";






export const authLogin = createAsyncThunk<
  User_Tyeps,
  UserLogin_types,
  { rejectValue: ErrorPayload }
>("/api/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/login", userData);
    if(response.data.user){
          localStorage.setItem('token',response.data.accessToken)
          
          return response.data.user;
        }
        
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.error || "An error occurred",
        status: error.response?.status,
      });
    }

    return rejectWithValue({ message: "Something went wrong!" });
  }
});





export const getallUsers = createAsyncThunk<
  User_Tyeps[],
  void,
  { rejectValue: ErrorPayload }
>("/api/getusers", async ( _,{ rejectWithValue }) => {
  try {
    const response = await api.get("/users");
    if (response.data) {
      return response.data.users;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.error || "An error occurred",
        status: error.response?.status,
      });
    }

    return rejectWithValue({ message: "Something went wrong!" });
  }
});



  export const createuser = createAsyncThunk<
    User_Tyeps,
    User_create_types,
    { rejectValue: ErrorPayload }
  >("/api/createuser", async ( userData,{ rejectWithValue }) => {
    try {
      const response = await api.post(`/user`,userData);
        return response.data.user;
      
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.error || "An error occurred",
          status: error.response?.status,
        });
      }

      return rejectWithValue({ message: "Something went wrong!" });
    }
  });



  export const editUser = createAsyncThunk<
    User_Tyeps,
    {name:string,role:UserRole,TimeZone:string,id:string},
    { rejectValue: ErrorPayload }
  >("/api/updateuser", async ( userData,{ rejectWithValue }) => {
    try {
      const response = await api.put(`/user/${userData.id}`,userData);
        return response.data.user;
      
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.error || "An error occurred",
          status: error.response?.status,
        });
      }

      return rejectWithValue({ message: "Something went wrong!" });
    }
  });

  export const deleteuser = createAsyncThunk<void,string,{rejectValue:ErrorPayload}>("/api/deleteuser", async ( id,{ rejectWithValue }) => {
    try {
      const response = await api.delete(`/user/${id}`);
        return response.data.user;
      
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.error || "An error occurred",
          status: error.response?.status,
        });
      }

      return rejectWithValue({ message: "Something went wrong!" });
    }
  });


  
export const logoutUser = createAsyncThunk<void,string,{rejectValue:ErrorPayload}>(
    'user/logout',
    async (id, { rejectWithValue }) => {
      try {
        console.log(id);
        console.log("logout user",id);
        
        
        const response = await api.post(`/logout/${id}`); 
        // console.log(response.data);
        
        return response.data;
        
      } catch (error) {
        if (isAxiosError(error)) {
            return rejectWithValue({
              message:error.response?.data.error
              ,status:error.response?.status
            })
      
            
          }
          return rejectWithValue({
            message:"something wrong"
          })
      }
    }
  );
  