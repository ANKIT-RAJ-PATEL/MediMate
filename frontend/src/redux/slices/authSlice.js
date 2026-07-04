import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../config/api';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/register', userData);
    localStorage.setItem('accessToken', data.accessToken);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/auth/me');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get user');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await API.post('/auth/logout');
  } catch {
    // Ignore API errors - clear local state anyway
  } finally {
    localStorage.removeItem('accessToken');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false, loading: false, error: null },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false; state.isAuthenticated = true; state.user = payload.user;
      })
      .addCase(login.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false; state.isAuthenticated = true; state.user = payload.user;
      })
      .addCase(register.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(getMe.fulfilled, (state, { payload }) => {
        state.loading = false; state.isAuthenticated = true; state.user = payload.user;
      })
      .addCase(getMe.rejected, (state) => { state.loading = false; state.isAuthenticated = false; })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.isAuthenticated = false; });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
