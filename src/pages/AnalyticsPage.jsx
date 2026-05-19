import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFinancialReport, fetchRevenueAnalytics, fetchJobsAnalytics, fetchUsersAnalytics } from '../store/slices/adminSlice';
import { CurrencyIcon, TrendingUpIcon, WorkersIcon, JobsIcon, UsersIcon, CustomersIcon } from '../components/Icons';

const RANGES = [
  { label: 'Last 7 days',  days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

function SummaryCard({ label, value, sub, color = '#2563eb', icon: Icon }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', flex: 1, minWidth: 160 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</span>
        {Icon && <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={15} color={color} /></div>}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#1e293b' }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 20, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{title}</div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  );
}

const fmt = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const { financial, revenueAnalytics, jobsAnalytics, usersAnalytics, loading } = useSelector((s) => s.admin);
  const [range, setRange] = useState(30);

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - range);
    const params = { start_date: start.toISOString().split('T')[0], end_date: end.toISOString().split('T')[0] };
    dispatch(fetchFinancialReport(params));
    dispatch(fetchRevenueAnalytics(params));
    dispatch(fetchJobsAnalytics(params));
    dispatch(fetchUsersAnalytics(params));
  }, [dispatch, range]);

  const fin = financial;
  const rev = revenueAnalytics;
  const jobs = jobsAnalytics;
  const users = usersAnalytics;

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 }}>Analytics & Reports</h1>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Financial and operational insights</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4 }}>
          {RANGES.map(({ label, days }) => (
            <button key={days} onClick={() => setRange(days)} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: range === days ? '#fff' : 'transparent', color: range === days ? '#1e293b' : '#64748b', fontWeight: range === days ? 600 : 400, fontSize: 13, cursor: 'pointer', boxShadow: range === days ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && !fin ? (
        <div style={{ color: '#94a3b8', fontSize: 14, padding: '40px 0' }}>Loading analytics…</div>
      ) : (
        <>
          {/* Financial summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            <SummaryCard label="Platform Revenue"  value={fmt(fin?.platform_revenue)}          color="#7c3aed" icon={CurrencyIcon}  sub="Net earnings" />
            <SummaryCard label="Gross Value"        value={fmt(fin?.gross_transaction_value)}   color="#2563eb" icon={TrendingUpIcon} sub="Total job value" />
            <SummaryCard label="Worker Payouts"     value={fmt(fin?.worker_payouts)}            color="#059669" icon={WorkersIcon}   sub="Paid to workers" />
            <SummaryCard label="Withdrawals"        value={fmt(fin?.total_withdrawals)}         color="#0891b2" icon={CurrencyIcon}  sub="bKash withdrawals" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            <SummaryCard label="Completed Jobs"  value={fin?.completed_jobs  ?? '—'} color="#059669" icon={JobsIcon} />
            <SummaryCard label="Cancelled Jobs"  value={fin?.cancelled_jobs  ?? '—'} color="#ef4444" icon={JobsIcon} />
            <SummaryCard label="Refunded Jobs"   value={fin?.refunded_jobs   ?? '—'} color="#f59e0b" icon={JobsIcon} />
            <SummaryCard label="Avg Job Value"   value={fmt(fin?.avg_job_value)}     color="#7c3aed" icon={CurrencyIcon} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Jobs by status */}
            <Section title="Jobs by Status">
              {jobs?.by_status?.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Status', 'Count'].map((h) => (
                        <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.by_status.map((row) => (
                      <tr key={row.status}>
                        <td style={{ padding: '9px 0', fontSize: 13, color: '#475569', textTransform: 'capitalize', borderBottom: '1px solid #f8fafc' }}>{row.status?.replace('_', ' ')}</td>
                        <td style={{ padding: '9px 0', fontSize: 14, fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #f8fafc' }}>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <span style={{ fontSize: 13, color: '#94a3b8' }}>No data for this period</span>}
            </Section>

            {/* Jobs by service */}
            <Section title="Jobs by Service Type">
              {jobs?.by_service?.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Service', 'Jobs', 'Avg Value'].map((h) => (
                        <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.by_service.map((row) => (
                      <tr key={row.service_type}>
                        <td style={{ padding: '9px 0', fontSize: 13, color: '#475569', borderBottom: '1px solid #f8fafc' }}>{row.service_type || '—'}</td>
                        <td style={{ padding: '9px 0', fontSize: 14, fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #f8fafc' }}>{row.count}</td>
                        <td style={{ padding: '9px 0', fontSize: 13, color: '#475569', borderBottom: '1px solid #f8fafc' }}>{fmt(row.avg_value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <span style={{ fontSize: 13, color: '#94a3b8' }}>No data for this period</span>}
            </Section>

            {/* Revenue daily */}
            <Section title="Daily Revenue">
              {rev?.daily?.length > 0 ? (
                <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Date', 'Jobs', 'Revenue'].map((h) => (
                          <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: 10, borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: '#fff' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...rev.daily].reverse().map((row) => (
                        <tr key={row.date}>
                          <td style={{ padding: '8px 0', fontSize: 13, color: '#475569', borderBottom: '1px solid #f8fafc' }}>{row.date}</td>
                          <td style={{ padding: '8px 0', fontSize: 13, fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f8fafc' }}>{row.job_count}</td>
                          <td style={{ padding: '8px 0', fontSize: 13, fontWeight: 600, color: '#7c3aed', borderBottom: '1px solid #f8fafc' }}>{fmt(row.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <span style={{ fontSize: 13, color: '#94a3b8' }}>No revenue data for this period</span>}
            </Section>

            {/* Top workers */}
            <Section title="Top Rated Workers">
              {users?.top_workers?.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Worker', 'Rating', 'Jobs', 'Completion'].map((h) => (
                        <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.top_workers.map((w) => (
                      <tr key={w.id}>
                        <td style={{ padding: '9px 0', fontSize: 13, fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f8fafc' }}>{w.first_name} {w.last_name || ''}</td>
                        <td style={{ padding: '9px 0', fontSize: 13, color: '#f59e0b', fontWeight: 700, borderBottom: '1px solid #f8fafc' }}>★ {Number(w.rating || 0).toFixed(1)}</td>
                        <td style={{ padding: '9px 0', fontSize: 13, color: '#475569', borderBottom: '1px solid #f8fafc' }}>{w.total_jobs}</td>
                        <td style={{ padding: '9px 0', fontSize: 13, color: '#059669', fontWeight: 600, borderBottom: '1px solid #f8fafc' }}>{w.completion_rate ? `${Math.round(w.completion_rate)}%` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <span style={{ fontSize: 13, color: '#94a3b8' }}>No worker data yet</span>}
            </Section>

          </div>
        </>
      )}
    </div>
  );
}
