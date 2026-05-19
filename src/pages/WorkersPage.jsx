import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWorkers, approveWorker, rejectWorker,
  suspendWorker, activateWorker, createWorker,
} from '../store/slices/adminSlice';
import Badge from '../components/Badge';
import Modal, { field } from '../components/Modal';
import ActionMenu from '../components/ActionMenu';
import { PlusIcon, CheckIcon, XIcon, BanIcon, ActivateIcon, SearchIcon, StarIcon, EyeIcon } from '../components/Icons';

const TABS = ['all', 'pending', 'approved', 'rejected', 'suspended'];
const SKILLS_LIST = ['Electrical', 'Plumbing', 'Cleaning', 'Handyman', 'Painting', 'Carpentry', 'AC Repair', 'Appliance Repair', 'Pest Control', 'Moving'];

function Initials({ name, size = 36 }) {
  const text = (name || 'W').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const hue = ((name || '').charCodeAt(0) * 37) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `hsl(${hue},55%,55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
      {text}
    </div>
  );
}

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


export default function WorkersPage({ onNavigate }) {
  const dispatch = useDispatch();
  const { workers, loading } = useSelector((s) => s.admin);
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', skills: [], hourly_rate: '', experience_years: '', address: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (tab === 'suspended') {
      dispatch(fetchWorkers({ is_active: false }));
    } else if (tab !== 'all') {
      dispatch(fetchWorkers({ approval_status: tab }));
    } else {
      dispatch(fetchWorkers({}));
    }
  }, [dispatch, tab]);

  const filtered = workers.filter((w) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (`${w.first_name} ${w.last_name}`).toLowerCase().includes(q) || (w.email || '').toLowerCase().includes(q) || (w.phone || '').includes(q);
  });

  const handleReject = () => {
    if (!rejectNote.trim()) return;
    dispatch(rejectWorker({ id: rejectModal, note: rejectNote }));
    setRejectModal(null);
    setRejectNote('');
  };

  const toggleSkill = (skill) => {
    setForm((f) => ({ ...f, skills: f.skills.includes(skill) ? f.skills.filter((s) => s !== skill) : [...f.skills, skill] }));
  };

  const handleCreate = async () => {
    setCreateError('');
    if (!form.first_name || !form.email || !form.phone || !form.password) {
      setCreateError('First name, email, phone and password are required.');
      return;
    }
    if (form.password.length < 6) { setCreateError('Password must be at least 6 characters.'); return; }
    setCreating(true);
    const result = await dispatch(createWorker(form));
    setCreating(false);
    if (result.error) { setCreateError(result.payload || 'Failed to create worker.'); return; }
    setCreateModal(false);
    setForm({ first_name: '', last_name: '', email: '', phone: '', password: '', skills: [], hourly_rate: '', experience_years: '', address: '' });
    dispatch(fetchWorkers(tab !== 'all' ? { approval_status: tab } : {}));
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 }}>Workers</h1>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Manage worker accounts and approvals</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#2563eb', border: 'none', borderRadius: 9, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
        >
          <PlusIcon size={16} color="#fff" />
          Add Worker
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4 }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#1e293b' : '#64748b', fontWeight: tab === t ? 600 : 400, fontSize: 13, cursor: 'pointer', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 9, padding: '7px 12px', minWidth: 240 }}>
          <SearchIcon size={15} color="#94a3b8" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, phone…" style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1e293b', width: '100%', background: 'transparent' }} />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>Loading workers…</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Worker', 'Contact', 'Skills', 'Rate / Exp', 'Rating', 'Status', 'Actions'].map((h) => <TH key={h}>{h}</TH>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>No workers found</td></tr>
              ) : filtered.map((w) => (
                <tr key={w.id} style={{ transition: 'background 0.1s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Initials name={`${w.first_name} ${w.last_name || ''}`} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{w.first_name} {w.last_name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>ID: {String(w.id).slice(0, 8)}…</div>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <div style={{ fontSize: 13, color: '#475569' }}>{w.email}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{w.phone}</div>
                  </TD>
                  <TD>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 180 }}>
                      {(Array.isArray(w.skills) ? w.skills : []).slice(0, 3).map((sk) => (
                        <span key={sk} style={{ background: '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 99 }}>{sk}</span>
                      ))}
                      {(w.skills?.length || 0) > 3 && <span style={{ fontSize: 11, color: '#94a3b8' }}>+{w.skills.length - 3}</span>}
                    </div>
                  </TD>
                  <TD>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>৳{w.hourly_rate || '—'}/hr</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{w.experience_years ?? '—'} yrs exp</div>
                  </TD>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <StarIcon size={13} color="#f59e0b" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{Number(w.rating || 0).toFixed(1)}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>({w.review_count || 0})</span>
                    </div>
                  </TD>
                  <TD><Badge status={w.is_active === false ? 'suspended' : w.approval_status} /></TD>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={() => onNavigate?.('worker-detail', w.id)}
                        title="View Details"
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, color: '#475569', cursor: 'pointer', fontWeight: 500 }}
                      >
                        <EyeIcon size={13} color="#475569" /> View
                      </button>
                      <ActionMenu items={[
                        { label: 'Approve',  icon: CheckIcon,   color: '#059669', show: w.approval_status === 'pending',   onClick: () => dispatch(approveWorker(w.id)) },
                        { label: 'Reject',   icon: XIcon,       color: '#dc2626', show: w.approval_status !== 'rejected',   onClick: () => setRejectModal(w.id) },
                        { label: 'divider',  divider: true },
                        { label: 'Suspend',  icon: BanIcon,     color: '#d97706', show: w.is_active !== false,              onClick: () => dispatch(suspendWorker(w.id)) },
                        { label: 'Activate', icon: ActivateIcon, color: '#059669', show: w.is_active === false,             onClick: () => dispatch(activateWorker(w.id)) },
                      ]} />
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', color: '#94a3b8', fontSize: 12 }}>
              Showing {filtered.length} worker{filtered.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      <Modal open={!!rejectModal} onClose={() => { setRejectModal(null); setRejectNote(''); }} title="Reject Worker" width={420}>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 0, marginBottom: 14 }}>Provide a reason so the worker understands why they were rejected.</p>
        <label style={field.label}>Reason</label>
        <textarea
          value={rejectNote}
          onChange={(e) => setRejectNote(e.target.value)}
          placeholder="e.g. Incomplete documentation, invalid certifications…"
          style={{ ...field.input, height: 100, resize: 'vertical' }}
        />
        <div style={field.actions}>
          <button onClick={() => { setRejectModal(null); setRejectNote(''); }} style={field.cancelBtn}>Cancel</button>
          <button onClick={handleReject} style={{ padding: '9px 22px', border: 'none', borderRadius: 8, background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Reject Worker</button>
        </div>
      </Modal>

      {/* Create Worker Modal */}
      <Modal open={createModal} onClose={() => { setCreateModal(false); setCreateError(''); }} title="Add New Worker" width={540}>
        {createError && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '9px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{createError}</div>}

        <div style={field.row}>
          <div style={field.col}><label style={field.label}>First Name *</label><input style={field.input} value={form.first_name} onChange={set('first_name')} placeholder="John" /></div>
          <div style={field.col}><label style={field.label}>Last Name</label><input style={field.input} value={form.last_name} onChange={set('last_name')} placeholder="Doe" /></div>
        </div>
        <div style={{ marginBottom: 14 }}><label style={field.label}>Email *</label><input style={field.input} type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" /></div>
        <div style={field.row}>
          <div style={field.col}><label style={field.label}>Phone *</label><input style={field.input} value={form.phone} onChange={set('phone')} placeholder="+880 1700 000000" /></div>
          <div style={field.col}><label style={field.label}>Password *</label><input style={field.input} type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" /></div>
        </div>
        <div style={field.row}>
          <div style={field.col}><label style={field.label}>Hourly Rate (৳)</label><input style={field.input} type="number" value={form.hourly_rate} onChange={set('hourly_rate')} placeholder="500" /></div>
          <div style={field.col}><label style={field.label}>Experience (years)</label><input style={field.input} type="number" value={form.experience_years} onChange={set('experience_years')} placeholder="3" /></div>
        </div>
        <div style={{ marginBottom: 14 }}><label style={field.label}>Address</label><input style={field.input} value={form.address} onChange={set('address')} placeholder="Dhaka, Bangladesh" /></div>

        <div style={{ marginBottom: 6 }}><label style={field.label}>Skills</label></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
          {SKILLS_LIST.map((sk) => {
            const sel = form.skills.includes(sk);
            return (
              <button key={sk} type="button" onClick={() => toggleSkill(sk)} style={{ padding: '5px 12px', borderRadius: 99, border: `1px solid ${sel ? '#2563eb' : '#e2e8f0'}`, background: sel ? '#eff6ff' : '#fff', color: sel ? '#2563eb' : '#475569', fontSize: 12, fontWeight: sel ? 600 : 400, cursor: 'pointer' }}>
                {sk}
              </button>
            );
          })}
        </div>

        <div style={field.actions}>
          <button onClick={() => { setCreateModal(false); setCreateError(''); }} style={field.cancelBtn}>Cancel</button>
          <button onClick={handleCreate} disabled={creating} style={field.submitBtn(creating)}>{creating ? 'Creating…' : 'Create Worker'}</button>
        </div>
      </Modal>
    </div>
  );
}
