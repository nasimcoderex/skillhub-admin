import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, forceCancelJob, refundJob } from '../store/slices/adminSlice';
import Badge from '../components/Badge';
import Modal, { field } from '../components/Modal';
import ActionMenu from '../components/ActionMenu';
import { SearchIcon, CancelIcon, RefundIcon } from '../components/Icons';

const STATUS_TABS = ['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'];

const TH = ({ children }) => (
  <th style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
    {children}
  </th>
);

const TD = ({ children, style }) => (
  <td style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle', ...style }}>
    {children}
  </td>
);


export default function JobsPage() {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((s) => s.admin);
  const [statusTab, setStatusTab] = useState('all');
  const [search, setSearch] = useState('');
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [refundModal, setRefundModal] = useState(null);

  useEffect(() => {
    dispatch(fetchJobs(statusTab !== 'all' ? { status: statusTab } : {}));
  }, [dispatch, statusTab]);

  const filtered = jobs.filter((j) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const customer = `${j.customer?.first_name || ''} ${j.customer?.last_name || ''}`.toLowerCase();
    const worker = `${j.worker?.first_name || ''} ${j.worker?.last_name || ''}`.toLowerCase();
    return customer.includes(q) || worker.includes(q) || (j.service_type || '').toLowerCase().includes(q) || String(j.id).includes(q);
  });

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    dispatch(forceCancelJob({ id: cancelModal, reason: cancelReason }));
    setCancelModal(null);
    setCancelReason('');
  };

  const handleRefund = () => {
    dispatch(refundJob(refundModal));
    setRefundModal(null);
  };

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 }}>Jobs</h1>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Monitor and manage all platform jobs</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4, flexWrap: 'wrap' }}>
          {STATUS_TABS.map((t) => (
            <button key={t} onClick={() => setStatusTab(t)} style={{ padding: '6px 12px', borderRadius: 7, border: 'none', background: statusTab === t ? '#fff' : 'transparent', color: statusTab === t ? '#1e293b' : '#64748b', fontWeight: statusTab === t ? 600 : 400, fontSize: 12, cursor: 'pointer', boxShadow: statusTab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', textTransform: 'capitalize' }}>
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 9, padding: '7px 12px', minWidth: 220 }}>
          <SearchIcon size={15} color="#94a3b8" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs…" style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1e293b', width: '100%', background: 'transparent' }} />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>Loading jobs…</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Job ID', 'Customer', 'Worker', 'Service', 'Price', 'Status', 'Date', 'Actions'].map((h) => <TH key={h}>{h}</TH>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>No jobs found</td></tr>
              ) : filtered.map((j) => (
                <tr key={j.id} onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                  <TD>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', background: '#f8fafc', padding: '2px 6px', borderRadius: 5 }}>
                      #{String(j.id).slice(0, 8)}
                    </span>
                  </TD>
                  <TD>
                    <div style={{ fontWeight: 500, color: '#1e293b', fontSize: 13 }}>{j.customer?.first_name || '—'} {j.customer?.last_name || ''}</div>
                    {j.customer?.phone && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{j.customer.phone}</div>}
                  </TD>
                  <TD>
                    {j.worker ? (
                      <>
                        <div style={{ fontWeight: 500, color: '#1e293b', fontSize: 13 }}>{j.worker.first_name} {j.worker.last_name || ''}</div>
                        {j.worker.phone && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{j.worker.phone}</div>}
                      </>
                    ) : (
                      <span style={{ fontSize: 12, color: '#cbd5e1', fontStyle: 'italic' }}>Unassigned</span>
                    )}
                  </TD>
                  <TD>
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: 12, fontWeight: 500, padding: '3px 8px', borderRadius: 6 }}>{j.service_type || '—'}</span>
                  </TD>
                  <TD>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>৳{Number(j.total_price || 0).toLocaleString()}</span>
                  </TD>
                  <TD><Badge status={j.status} /></TD>
                  <TD style={{ fontSize: 12, color: '#64748b' }}>
                    {j.created_at ? new Date(j.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </TD>
                  <TD>
                    <ActionMenu items={[
                      { label: 'Force Cancel', icon: CancelIcon, color: '#dc2626', show: !['completed','cancelled'].includes(j.status), onClick: () => setCancelModal(j.id) },
                      { label: 'Refund',       icon: RefundIcon, color: '#0369a1', show: j.status === 'completed',                       onClick: () => setRefundModal(j.id) },
                    ]} />
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', color: '#94a3b8', fontSize: 12 }}>
              Showing {filtered.length} job{filtered.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Force Cancel Modal */}
      <Modal open={!!cancelModal} onClose={() => { setCancelModal(null); setCancelReason(''); }} title="Force Cancel Job" width={420}>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 0, marginBottom: 14 }}>This will cancel the job and notify both parties. Please provide a reason.</p>
        <label style={field.label}>Reason *</label>
        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="e.g. Fraudulent activity, policy violation…"
          style={{ ...field.input, height: 90, resize: 'vertical' }}
        />
        <div style={field.actions}>
          <button onClick={() => { setCancelModal(null); setCancelReason(''); }} style={field.cancelBtn}>Cancel</button>
          <button onClick={handleCancel} style={{ padding: '9px 22px', border: 'none', borderRadius: 8, background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Confirm Cancel</button>
        </div>
      </Modal>

      {/* Refund Modal */}
      <Modal open={!!refundModal} onClose={() => setRefundModal(null)} title="Process Refund" width={400}>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 0, marginBottom: 20 }}>Are you sure you want to process a full refund for this job? The amount will be returned to the customer's account.</p>
        <div style={field.actions}>
          <button onClick={() => setRefundModal(null)} style={field.cancelBtn}>Cancel</button>
          <button onClick={handleRefund} style={{ padding: '9px 22px', border: 'none', borderRadius: 8, background: '#0369a1', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Process Refund</button>
        </div>
      </Modal>
    </div>
  );
}
