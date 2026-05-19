import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkerDetail, approveWorker, rejectWorker, suspendWorker, activateWorker } from '../store/slices/adminSlice';
import Badge from '../components/Badge';
import { CheckIcon, XIcon, BanIcon, ActivateIcon, StarIcon } from '../components/Icons';

function Initials({ name, size = 64 }) {
  const text = (name || 'W').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const hue = ((name || '').charCodeAt(0) * 37) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `hsl(${hue},55%,55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
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

const Stat = ({ label, value, color = '#1e293b', sub }) => (
  <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 18px', flex: 1, minWidth: 100 }}>
    <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{sub}</div>}
    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{label}</div>
  </div>
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

export default function WorkerDetailPage({ id, onBack }) {
  const dispatch = useDispatch();
  const { workerDetail, detailLoading } = useSelector((s) => s.admin);

  useEffect(() => {
    if (id) dispatch(fetchWorkerDetail(id));
  }, [id]);

  if (detailLoading) {
    return (
      <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading worker details…</div>
      </div>
    );
  }

  if (!workerDetail) return null;

  const { worker, wallet, job_history = [] } = workerDetail;
  const fullName = `${worker.first_name} ${worker.last_name || ''}`.trim();
  const isPending = worker.approval_status === 'pending';
  const isApproved = worker.approval_status === 'approved';
  const isSuspended = worker.is_active === false;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960, margin: '0 auto' }}>

      {/* Back + Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#475569', cursor: 'pointer', fontWeight: 500 }}
        >
          ← Back to Workers
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>{fullName}</h1>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '3px 0 0' }}>Worker Profile · ID: {String(worker.id).slice(0, 8)}…</p>
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          {isPending && (
            <>
              <button
                onClick={() => dispatch(approveWorker(worker.id)).then(onBack)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#059669', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                <CheckIcon size={14} color="#fff" /> Approve
              </button>
              <button
                onClick={() => { const note = prompt('Rejection reason:'); if (note?.trim()) dispatch(rejectWorker({ id: worker.id, note })).then(onBack); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                <XIcon size={14} color="#fff" /> Reject
              </button>
            </>
          )}
          {!isPending && !isSuspended && (
            <button
              onClick={() => dispatch(suspendWorker(worker.id)).then(() => dispatch(fetchWorkerDetail(id)))}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#d97706', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <BanIcon size={14} color="#d97706" /> Suspend
            </button>
          )}
          {isSuspended && (
            <button
              onClick={() => dispatch(activateWorker(worker.id)).then(() => dispatch(fetchWorkerDetail(id)))}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#059669', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <ActivateIcon size={14} color="#059669" /> Activate
            </button>
          )}
        </div>
      </div>

      {/* Top two-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 20 }}>

        {/* Left: Profile card */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
            <Initials name={fullName} size={64} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>{fullName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <Badge status={isSuspended ? 'suspended' : worker.approval_status} />
                {worker.is_online && <span style={{ fontSize: 11, background: '#d1fae5', color: '#059669', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>● Online</span>}
              </div>
              {worker.bio && <p style={{ fontSize: 13, color: '#64748b', marginTop: 8, lineHeight: 1.5, maxWidth: 400 }}>{worker.bio}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <InfoRow label="Email" value={worker.email} />
            <InfoRow label="Phone" value={worker.phone} />
            <InfoRow label="Address" value={worker.address_line_1} />
            <InfoRow label="City" value={worker.city} />
            <InfoRow label="Hourly Rate" value={worker.hourly_rate ? `৳${worker.hourly_rate}/hr` : null} />
            <InfoRow label="Experience" value={worker.experience_years != null ? `${worker.experience_years} years` : null} />
            <InfoRow label="Approval" value={worker.approval_status} />
            <InfoRow label="Joined" value={worker.created_at ? new Date(worker.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null} />
            {worker.approval_note && <div style={{ gridColumn: '1/-1' }}><InfoRow label="Rejection Note" value={worker.approval_note} /></div>}
          </div>

          {/* Skills */}
          {Array.isArray(worker.skills) && worker.skills.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {worker.skills.map((sk) => (
                  <span key={sk} style={{ background: '#eff6ff', color: '#2563eb', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 99 }}>{sk}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Stats + Wallet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Stats */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Performance</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Stat label="Total Jobs" value={worker.total_jobs ?? 0} />
              <Stat label="Reviews" value={worker.review_count ?? 0} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', borderRadius: 10, padding: '14px 18px' }}>
              <StarIcon size={18} color="#f59e0b" />
              <span style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>{Number(worker.rating || 0).toFixed(1)}</span>
              <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 2 }}>/ 5.0 rating</span>
            </div>
          </div>

          {/* Wallet */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Wallet</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>Current Balance</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#059669' }}>৳{(wallet?.balance ?? 0).toLocaleString()}</div>
            </div>
            <div style={{ height: 1, background: '#f1f5f9', marginBottom: 10 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Total Earned</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>৳{(wallet?.total_earned ?? 0).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Total Withdrawn</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>৳{(wallet?.total_withdrawn ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job History */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Job History</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Last {job_history.length} jobs</div>
        </div>
        {job_history.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No jobs yet</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Job ID', 'Customer', 'Service', 'Amount', 'Status', 'Date'].map((h) => <TH key={h}>{h}</TH>)}
              </tr>
            </thead>
            <tbody>
              {job_history.map((job) => (
                <tr key={job.id} onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                  <TD><span style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: 12 }}>{String(job.id).slice(0, 8)}…</span></TD>
                  <TD>{job.customer?.first_name || '—'}</TD>
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
