import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// Async thunk to fetch jobs from the backend
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (filters) => {
  const response = await axios.get('http://localhost:5000/api/jobs', { params: filters }); // Or fetch()
  return response.data;
});

// Slice to handle job-related state
const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default jobsSlice.reducer;
