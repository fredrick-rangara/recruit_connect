import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user_id: null,
    username: null,
    token: localStorage.getItem('token') || null,
    role: null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    // This is the function the error is complaining about!
    setCredentials: (state, action) => {
      const { user_id, username, token, role } = action.payload;
      state.user_id = user_id;
      state.username = username;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user_id = null;
      state.username = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

// YOU MUST HAVE THIS LINE FOR LOGIN.JSX TO WORK:
export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;