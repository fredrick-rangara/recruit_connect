import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // 1. Added missing axios import

// Async thunk to fetch jobs from the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async (filters) => {
  // Use the variable here
  const response = await axios.get(`${API_BASE_URL}/jobs`, { params: filters });
  return response.data;
});

// Slice to handle job-related state
const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    list: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        // 2. SAFETY CHECK: If the API returns a 404 HTML page instead of an array,
        // this defaults to an empty list [] so .filter() won't crash later.
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.list = []; // Ensure list stays an array even on failure
      });
  },
});

export default jobsSlice.reducer;
