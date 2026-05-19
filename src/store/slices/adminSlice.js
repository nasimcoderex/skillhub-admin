import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const err = (e) => e.response?.data?.message || 'Failed';

export const fetchDashboard = createAsyncThunk('admin/dashboard', async (_, { rejectWithValue }) => {
  try { return (await api.get('/admin/dashboard')).data.data; } catch (e) { return rejectWithValue(err(e)); }
});

export const fetchWorkers = createAsyncThunk('admin/workers', async (params, { rejectWithValue }) => {
  try { return (await api.get('/admin/workers', { params })).data.data; } catch (e) { return rejectWithValue(err(e)); }
});

export const approveWorker = createAsyncThunk('admin/approveWorker', async (id, { rejectWithValue }) => {
  try { await api.post(`/admin/workers/${id}/approve`); return id; } catch (e) { return rejectWithValue(err(e)); }
});

export const rejectWorker = createAsyncThunk('admin/rejectWorker', async ({ id, note }, { rejectWithValue }) => {
  try { await api.post(`/admin/workers/${id}/reject`, { reason: note }); return id; } catch (e) { return rejectWithValue(err(e)); }
});

export const suspendWorker = createAsyncThunk('admin/suspendWorker', async (id, { rejectWithValue }) => {
  try { await api.patch(`/admin/workers/${id}/suspend`); return id; } catch (e) { return rejectWithValue(err(e)); }
});

export const activateWorker = createAsyncThunk('admin/activateWorker', async (id, { rejectWithValue }) => {
  try { await api.patch(`/admin/workers/${id}/activate`); return id; } catch (e) { return rejectWithValue(err(e)); }
});

export const createWorker = createAsyncThunk('admin/createWorker', async (data, { rejectWithValue }) => {
  try {
    const payload = {
      type: 'worker',
      first_name: data.first_name,
      last_name: data.last_name || undefined,
      email: data.email,
      phone: data.phone,
      password: data.password,
      skills: data.skills?.length ? data.skills : undefined,
      hourly_rate: data.hourly_rate ? Number(data.hourly_rate) : undefined,
      experience_years: data.experience_years ? Number(data.experience_years) : undefined,
      address: data.address || undefined,
    };
    return (await api.post('/auth/register', payload)).data.data;
  } catch (e) { return rejectWithValue(err(e)); }
});

export const fetchCustomers = createAsyncThunk('admin/customers', async (params, { rejectWithValue }) => {
  try { return (await api.get('/admin/customers', { params })).data.data; } catch (e) { return rejectWithValue(err(e)); }
});

export const suspendCustomer = createAsyncThunk('admin/suspendCustomer', async (id, { rejectWithValue }) => {
  try { await api.patch(`/admin/customers/${id}/suspend`); return id; } catch (e) { return rejectWithValue(err(e)); }
});

export const activateCustomer = createAsyncThunk('admin/activateCustomer', async (id, { rejectWithValue }) => {
  try { await api.patch(`/admin/customers/${id}/activate`); return id; } catch (e) { return rejectWithValue(err(e)); }
});

export const createCustomer = createAsyncThunk('admin/createCustomer', async (data, { rejectWithValue }) => {
  try {
    const payload = {
      type: 'customer',
      first_name: data.first_name,
      last_name: data.last_name || undefined,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };
    return (await api.post('/auth/register', payload)).data.data;
  } catch (e) { return rejectWithValue(err(e)); }
});

export const fetchWorkerDetail = createAsyncThunk('admin/workerDetail', async (id, { rejectWithValue }) => {
  try { return (await api.get(`/admin/workers/${id}`)).data.data; } catch (e) { return rejectWithValue(err(e)); }
});

export const fetchCustomerDetail = createAsyncThunk('admin/customerDetail', async (id, { rejectWithValue }) => {
  try { return (await api.get(`/admin/customers/${id}`)).data.data; } catch (e) { return rejectWithValue(err(e)); }
});

export const fetchJobs = createAsyncThunk('admin/jobs', async (params, { rejectWithValue }) => {
  try { return (await api.get('/admin/jobs', { params })).data.data; } catch (e) { return rejectWithValue(err(e)); }
});

export const forceCancelJob = createAsyncThunk('admin/forceCancelJob', async ({ id, reason }, { rejectWithValue }) => {
  try { await api.post(`/admin/jobs/${id}/force-cancel`, { reason }); return id; } catch (e) { return rejectWithValue(err(e)); }
});

export const refundJob = createAsyncThunk('admin/refundJob', async (id, { rejectWithValue }) => {
  try { await api.post(`/admin/jobs/${id}/refund`); return id; } catch (e) { return rejectWithValue(err(e)); }
});

export const fetchRevenueAnalytics = createAsyncThunk('admin/revenue', async (params, { rejectWithValue }) => {
  try { return (await api.get('/admin/analytics/revenue', { params })).data.data; } catch (e) { return rejectWithValue(err(e)); }
});

export const fetchJobsAnalytics = createAsyncThunk('admin/jobsAnalytics', async (params, { rejectWithValue }) => {
  try { return (await api.get('/admin/analytics/jobs', { params })).data.data; } catch (e) { return rejectWithValue(err(e)); }
});

export const fetchUsersAnalytics = createAsyncThunk('admin/usersAnalytics', async (params, { rejectWithValue }) => {
  try { return (await api.get('/admin/analytics/users', { params })).data.data; } catch (e) { return rejectWithValue(err(e)); }
});

export const fetchFinancialReport = createAsyncThunk('admin/financial', async (params, { rejectWithValue }) => {
  try { return (await api.get('/admin/reports/financial', { params })).data.data; } catch (e) { return rejectWithValue(err(e)); }
});

const pending = (state) => { state.loading = true; state.error = null; };
const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboard: null,
    workers: [], workersMeta: {},
    workerDetail: null,
    customers: [], customersMeta: {},
    customerDetail: null,
    jobs: [], jobsMeta: {},
    financial: null,
    revenueAnalytics: null,
    jobsAnalytics: null,
    usersAnalytics: null,
    loading: false, detailLoading: false, error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDashboard.pending, pending)
      .addCase(fetchDashboard.fulfilled, (state, { payload }) => { state.loading = false; state.dashboard = payload; })
      .addCase(fetchDashboard.rejected, rejected)

      // Workers list
      .addCase(fetchWorkers.pending, pending)
      .addCase(fetchWorkers.fulfilled, (state, { payload }) => { state.loading = false; state.workers = payload.workers || payload; state.workersMeta = payload.meta || {}; })
      .addCase(fetchWorkers.rejected, rejected)

      // Worker actions — optimistic updates
      .addCase(approveWorker.fulfilled, (state, { payload: id }) => {
        const w = state.workers.find((x) => x.id === id);
        if (w) { w.is_verified = true; w.approval_status = 'approved'; }
      })
      .addCase(rejectWorker.fulfilled, (state, { payload: id }) => {
        const w = state.workers.find((x) => x.id === id);
        if (w) { w.is_verified = false; w.approval_status = 'rejected'; }
      })
      .addCase(suspendWorker.fulfilled, (state, { payload: id }) => {
        const w = state.workers.find((x) => x.id === id);
        if (w) w.is_active = false;
      })
      .addCase(activateWorker.fulfilled, (state, { payload: id }) => {
        const w = state.workers.find((x) => x.id === id);
        if (w) w.is_active = true;
      })

      // Customers
      .addCase(fetchCustomers.pending, pending)
      .addCase(fetchCustomers.fulfilled, (state, { payload }) => { state.loading = false; state.customers = payload.customers || payload; state.customersMeta = payload.meta || {}; })
      .addCase(fetchCustomers.rejected, rejected)
      .addCase(suspendCustomer.fulfilled, (state, { payload: id }) => {
        const c = state.customers.find((x) => x.id === id);
        if (c) c.is_active = false;
      })
      .addCase(activateCustomer.fulfilled, (state, { payload: id }) => {
        const c = state.customers.find((x) => x.id === id);
        if (c) c.is_active = true;
      })

      // Detail views
      .addCase(fetchWorkerDetail.pending, (state) => { state.detailLoading = true; state.workerDetail = null; })
      .addCase(fetchWorkerDetail.fulfilled, (state, { payload }) => { state.detailLoading = false; state.workerDetail = payload; })
      .addCase(fetchWorkerDetail.rejected, (state) => { state.detailLoading = false; })
      .addCase(fetchCustomerDetail.pending, (state) => { state.detailLoading = true; state.customerDetail = null; })
      .addCase(fetchCustomerDetail.fulfilled, (state, { payload }) => { state.detailLoading = false; state.customerDetail = payload; })
      .addCase(fetchCustomerDetail.rejected, (state) => { state.detailLoading = false; })

      // Jobs
      .addCase(fetchJobs.pending, pending)
      .addCase(fetchJobs.fulfilled, (state, { payload }) => { state.loading = false; state.jobs = payload.jobs || payload; state.jobsMeta = payload.meta || {}; })
      .addCase(fetchJobs.rejected, rejected)
      .addCase(forceCancelJob.fulfilled, (state, { payload: id }) => {
        const j = state.jobs.find((x) => x.id === id);
        if (j) j.status = 'cancelled';
      })

      // Analytics
      .addCase(fetchRevenueAnalytics.pending, pending)
      .addCase(fetchRevenueAnalytics.fulfilled, (state, { payload }) => { state.loading = false; state.revenueAnalytics = payload; })
      .addCase(fetchRevenueAnalytics.rejected, rejected)
      .addCase(fetchJobsAnalytics.pending, pending)
      .addCase(fetchJobsAnalytics.fulfilled, (state, { payload }) => { state.loading = false; state.jobsAnalytics = payload; })
      .addCase(fetchJobsAnalytics.rejected, rejected)
      .addCase(fetchUsersAnalytics.pending, pending)
      .addCase(fetchUsersAnalytics.fulfilled, (state, { payload }) => { state.loading = false; state.usersAnalytics = payload; })
      .addCase(fetchUsersAnalytics.rejected, rejected)
      .addCase(fetchFinancialReport.pending, pending)
      .addCase(fetchFinancialReport.fulfilled, (state, { payload }) => { state.loading = false; state.financial = payload; })
      .addCase(fetchFinancialReport.rejected, rejected);
  },
});

export default adminSlice.reducer;
