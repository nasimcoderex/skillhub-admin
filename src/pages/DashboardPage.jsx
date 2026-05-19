import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../store/slices/adminSlice';
import StatCard from '../components/StatCard';
import { UsersIcon, ClockIcon, WorkersIcon, AlertIcon, CurrencyIcon, TrendingUpIcon, BuildingIcon, CustomersIcon, JobsIcon } from '../components/Icons';

export default function DashboardPage({ onNavigate }) {
  const dispatch = useDispatch();
  const { dashboard: raw, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  // Map nested API response
  const d = raw ? {
    total_users:       (raw.users?.total_customers ?? 0) + (raw.users?.total_workers ?? 0),
    total_workers:     raw.users?.total_workers     ?? 0,
    total_customers:   raw.users?.total_customers   ?? 0,
    pending_approvals: raw.users?.pending_approvals ?? 0,
    active_jobs:       raw.jobs?.active             ?? 0,
    jobs_today:        raw.jobs?.today              ?? 0,
    jobs_this_week:    raw.jobs?.this_week          ?? 0,
    revenue_today:     raw.revenue?.today           ?? 0,
    revenue_week:      raw.revenue?.this_week       ?? 0,
    revenue_total:     raw.revenue?.total           ?? 0,
    open_disputes:     raw.disputes?.open           ?? 0,
  } : null;

  const fmt = (v) => `৳${Number(v || 0).toLocaleString()}`;

  return (
    <div style={{ padding: '28px 32px' }}>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 }}>Dashboard</h1>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Platform overview</p>
      </div>

      {loading && !d ? (
        <div style={{ color: '#94a3b8', fontSize: 14, padding: '40px 0' }}>Loading…</div>
      ) : d && (
        <>
          {d.pending_approvals > 0 && (
            <div
              onClick={() => onNavigate?.('workers')}
              style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: '13px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            >
              <AlertIcon size={17} color="#d97706" />
              <span style={{ color: '#92400e', fontWeight: 600, fontSize: 13 }}>
                {d.pending_approvals} worker{d.pending_approvals > 1 ? 's' : ''} waiting for approval
              </span>
              <span style={{ color: '#b45309', fontSize: 13 }}>— Click to review →</span>
            </div>
          )}

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
            <StatCard label="Total Users"       value={d.total_users}       color="#2563eb" icon={UsersIcon} />
            <StatCard label="Pending Approvals" value={d.pending_approvals} color="#f59e0b" icon={ClockIcon} />
            <StatCard label="Active Jobs"       value={d.active_jobs}       color="#10b981" icon={WorkersIcon} />
            <StatCard label="Open Disputes"     value={d.open_disputes}     color="#ef4444" icon={AlertIcon} />
          </div>

          {/* Revenue row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            <StatCard label="Revenue Today"     value={fmt(d.revenue_today)}  color="#7c3aed" icon={CurrencyIcon} />
            <StatCard label="Revenue This Week" value={fmt(d.revenue_week)}   color="#7c3aed" icon={TrendingUpIcon} />
            <StatCard label="Total Revenue"     value={fmt(d.revenue_total)}  color="#7c3aed" icon={BuildingIcon} />
          </div>

          {/* Detail cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Platform breakdown */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Platform Breakdown</div>
              {[
                { label: 'Total Workers',    value: d.total_workers,   icon: WorkersIcon,   color: '#2563eb' },
                { label: 'Total Customers',  value: d.total_customers, icon: CustomersIcon, color: '#0891b2' },
                { label: 'Jobs Today',       value: d.jobs_today,      icon: JobsIcon,      color: '#059669' },
                { label: 'Jobs This Week',   value: d.jobs_this_week,  icon: TrendingUpIcon,color: '#7c3aed' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={15} color={color} />
                    </div>
                    <span style={{ fontSize: 13, color: '#475569' }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Quick Actions</div>
              {[
                { label: 'Review pending workers', page: 'workers',   color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
                { label: 'View all active jobs',   page: 'jobs',      color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
                { label: 'Manage customers',       page: 'customers', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
                { label: 'Revenue analytics',      page: 'analytics', color: '#7c3aed', bg: '#faf5ff', border: '#ddd6fe' },
              ].map(({ label, page, color, bg, border }) => (
                <button key={label} onClick={() => onNavigate?.(page)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 14px', borderRadius: 9, marginBottom: 8, background: bg, border: `1px solid ${border}`, cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color, fontWeight: 600 }}>{label}</span>
                  <span style={{ marginLeft: 'auto', color, opacity: 0.6, fontSize: 16 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
