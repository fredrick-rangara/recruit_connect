import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

export const fetchTalent = createAsyncThunk('users/fetchTalent', async (query) => {
  const response = await API.get('/users/talent', { params: { search: query } });
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
        state.talentList = action.payload;
      })
      .addCase(fetchTalent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
