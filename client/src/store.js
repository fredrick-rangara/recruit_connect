import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';

/**
 * The Redux Store: The "Single Source of Truth" for your application's state.
 * We use `configureStore` to combine all our separate slices (reducers).
 */
export const store = configureStore({
  reducer: {
    // Adding the 'auth' reducer to the store
    auth: authReducer,
  },
  // Middleware configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents warnings if we accidentally store non-serializable data
    }),
});

export default store;
