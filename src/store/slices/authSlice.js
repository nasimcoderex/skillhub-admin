import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const registerAdmin = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', { ...data, type: 'admin' });
    const { token, ...user } = res.data.data;
    localStorage.setItem('admin_token', token.access);
    localStorage.setItem('admin_refresh_token', token.refresh);
    return user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const loginAdmin = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', credentials);
    const { token, ...user } = res.data.data;
    if (user.type !== 'admin') return rejectWithValue('Not an admin account');
    localStorage.setItem('admin_token', token.access);
    localStorage.setItem('admin_refresh_token', token.refresh);
    return user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const restoreAdmin = createAsyncThunk('auth/restore', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('admin_token');
    if (!token) return rejectWithValue('No token');
    const res = await api.get('/users/me');
    const user = res.data.data;
    if (user.type !== 'admin') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      return rejectWithValue('Not admin');
    }
    return user;
  } catch {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    return rejectWithValue('Session expired');
  }
});

export const logoutAdmin = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout').catch(() => {});
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_refresh_token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, restoring: true, error: null, isAuthenticated: false },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAdmin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerAdmin.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(registerAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(loginAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.restoring = false;
      })

      .addCase(restoreAdmin.pending, (state) => { state.restoring = true; })
      .addCase(restoreAdmin.fulfilled, (state, action) => { state.restoring = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(restoreAdmin.rejected, (state) => { state.restoring = false; state.isAuthenticated = false; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
