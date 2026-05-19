import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerDetail, suspendCustomer, activateCustomer } from '../store/slices/adminSlice';
import Badge from '../components/Badge';
import { BanIcon, ActivateIcon } from '../components/Icons';

function Initials({ name, size = 64 }) {
  const text = (name || 'C').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const hue = ((name || '').charCodeAt(0) * 53) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `hsl(${hue},50%,60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
      {text}
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  value ? (
    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 13, color: '#94a3b8', minWidth: 120 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{value}</span>
    </div>
  ) : null
);

const TH = ({ children }) => (
  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
    {children}
  </th>
);
const TD = ({ children }) => (
  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', fontSize: 13, color: '#475569', verticalAlign: 'middle' }}>
    {children}
  </td>
);

const jobStatusColor = { completed: '#059669', in_progress: '#2563eb', on_way: '#7c3aed', cancelled: '#dc2626', accepted: '#d97706', pending: '#94a3b8' };

export default function CustomerDetailPage({ id, onBack }) {
  const dispatch = useDispatch();
  const { customerDetail, detailLoading } = useSelector((s) => s.admin);

  useEffect(() => {
    if (id) dispatch(fetchCustomerDetail(id));
  }, [id]);

  if (detailLoading) {
    return (
      <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading customer details…</div>
      </div>
    );
  }

  if (!customerDetail) return null;

  const { customer, job_history = [] } = customerDetail;
  const fullName = `${customer.first_name} ${customer.last_name || ''}`.trim();
  const isSuspended = customer.is_active === false;

  const completedJobs = job_history.filter((j) => j.status === 'completed').length;
  const totalSpent = job_history.filter((j) => j.status === 'completed').reduce((s, j) => s + (j.total_amount || j.amount || 0), 0);

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960, margin: '0 auto' }}>

      {/* Back + Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#475569', cursor: 'pointer', fontWeight: 500 }}
        >
          ← Back to Customers
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>{fullName}</h1>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '3px 0 0' }}>Customer Profile · ID: {String(customer.id).slice(0, 8)}…</p>
        </div>
        {!isSuspended && (
          <button
            onClick={() => dispatch(suspendCustomer(customer.id)).then(() => dispatch(fetchCustomerDetail(id)))}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#d97706', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            <BanIcon size={14} color="#d97706" /> Suspend
          </button>
        )}
        {isSuspended && (
          <button
            onClick={() => dispatch(activateCustomer(customer.id)).then(() => dispatch(fetchCustomerDetail(id)))}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#059669', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            <ActivateIcon size={14} color="#059669" /> Activate
          </button>
        )}
      </div>

      {/* Profile + Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 20 }}>

        {/* Profile card */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
            <Initials name={fullName} size={64} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>{fullName}</div>
              <div style={{ marginTop: 6 }}>
                <Badge status={isSuspended ? 'suspended' : 'active'} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <InfoRow label="Email" value={customer.email} />
            <InfoRow label="Phone" value={customer.phone} />
            <InfoRow label="Address" value={customer.address_line_1} />
            <InfoRow label="City" value={customer.city} />
            <InfoRow label="Joined" value={customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null} />
            <InfoRow label="Last Active" value={customer.updated_at ? new Date(customer.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Total Bookings', value: job_history.length, color: '#2563eb' },
            { label: 'Completed Jobs', value: completedJobs, color: '#059669' },
            { label: 'Total Spent', value: `৳${totalSpent.toLocaleString()}`, color: '#7c3aed' },
          ].map((s) => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '16px 20px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Job History */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Booking History</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Last {job_history.length} bookings</div>
        </div>
        {job_history.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No bookings yet</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Job ID', 'Worker', 'Service', 'Amount', 'Status', 'Date'].map((h) => <TH key={h}>{h}</TH>)}
              </tr>
            </thead>
            <tbody>
              {job_history.map((job) => (
                <tr key={job.id} onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                  <TD><span style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: 12 }}>{String(job.id).slice(0, 8)}…</span></TD>
                  <TD>{job.worker?.first_name || '—'}</TD>
                  <TD>{job.service_type || job.category || '—'}</TD>
                  <TD><span style={{ fontWeight: 600, color: '#1e293b' }}>৳{(job.total_amount || job.amount || 0).toLocaleString()}</span></TD>
                  <TD>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: `${jobStatusColor[job.status] || '#94a3b8'}18`, color: jobStatusColor[job.status] || '#94a3b8' }}>
                      {job.status}
                    </span>
                  </TD>
                  <TD style={{ color: '#94a3b8' }}>{job.created_at ? new Date(job.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
