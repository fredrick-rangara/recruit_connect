import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // 1. Added missing axios import

// Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Defined fetchTalent (It was being used in extraReducers but wasn't defined)
export const fetchTalent = createAsyncThunk('users/fetchTalent', async (query) => {
  const response = await axios.get(`${API_BASE_URL}/api/users`, { 
    params: { q: query } 
  });
  return response.data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    talentList: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTalent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTalent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // 3. SAFETY CHECK: Ensure the payload is an array. 
        // If the backend returns a 404 or an object, it defaults to []
        state.talentList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTalent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.talentList = []; // Ensure list stays an array even on failure
      });
  },
});

export default usersSlice.reducer;