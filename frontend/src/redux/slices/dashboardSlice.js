import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../config/api';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/analytics/dashboard');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { stats: null, recentReports: [], upcomingAppointments: [], recentPredictions: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboard.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.stats = payload.stats;
        state.recentReports = payload.recentReports;
        state.upcomingAppointments = payload.upcomingAppointments;
        state.recentPredictions = payload.recentPredictions;
      })
      .addCase(fetchDashboard.rejected, (state) => { state.loading = false; });
  }
});

export default dashboardSlice.reducer;
