import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ErrorPayload,
  InitialState_types,
  UserLogin_types,
} from "../types";
import { api } from "../api/api";
import { isAxiosError } from "axios";

export const authLogin = createAsyncThunk<
  InitialState_types,
  UserLogin_types,
  { rejectValue: ErrorPayload }
>("/api/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/login", userData);
    if (response.data) {
      return response.data;
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
