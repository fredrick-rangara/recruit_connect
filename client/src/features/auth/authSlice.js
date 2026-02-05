import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the authentication slice.
 * We track the user object, the JWT token, the user's role, 
 * and a boolean to quickly check if they are logged in.
 */
const initialState = {
  user: null,
  token: null,
  role: null, // Expected values: 'job_seeker' or 'employer'
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets the user's credentials after a successful login or signup.
     * action.payload should contain { user, token, role }.
     */
    setCredentials: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;
    },
    /**
     * Clears the authentication state when the user logs out.
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions for use in components
export const { setCredentials, logout } = authSlice.actions;

// Export the reducer to be included in the store
export default authSlice.reducer;

// Selectors: Helper functions to easily grab pieces of state from components
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
