import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, suspendCustomer, activateCustomer, createCustomer } from '../store/slices/adminSlice';
import Badge from '../components/Badge';
import Modal, { field } from '../components/Modal';
import ActionMenu from '../components/ActionMenu';
import { PlusIcon, BanIcon, ActivateIcon, SearchIcon, EyeIcon } from '../components/Icons';

function Initials({ name, size = 36 }) {
  const text = (name || 'C').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const hue = ((name || '').charCodeAt(0) * 53) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `hsl(${hue},50%,60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
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


export default function CustomersPage({ onNavigate }) {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((s) => s.admin);
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => { dispatch(fetchCustomers()); }, [dispatch]);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (`${c.first_name} ${c.last_name}`).toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').includes(q);
  });

  const handleCreate = async () => {
    setCreateError('');
    if (!form.first_name || !form.email || !form.phone || !form.password) {
      setCreateError('First name, email, phone and password are required.');
      return;
    }
    if (form.password.length < 6) { setCreateError('Password must be at least 6 characters.'); return; }
    setCreating(true);
    const result = await dispatch(createCustomer(form));
    setCreating(false);
    if (result.error) { setCreateError(result.payload || 'Failed to create customer.'); return; }
    setCreateModal(false);
    setForm({ first_name: '', last_name: '', email: '', phone: '', password: '' });
    dispatch(fetchCustomers());
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 }}>Customers</h1>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Manage customer accounts</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#2563eb', border: 'none', borderRadius: 9, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
        >
          <PlusIcon size={16} color="#fff" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 9, padding: '8px 12px', maxWidth: 300, marginBottom: 16 }}>
        <SearchIcon size={15} color="#94a3b8" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…" style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1e293b', width: '100%', background: 'transparent' }} />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>Loading customers…</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Customer', 'Contact', 'Jobs', 'Joined', 'Status', 'Actions'].map((h) => <TH key={h}>{h}</TH>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>No customers found</td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Initials name={`${c.first_name} ${c.last_name || ''}`} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{c.first_name} {c.last_name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>ID: {String(c.id).slice(0, 8)}…</div>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <div style={{ fontSize: 13, color: '#475569' }}>{c.email}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{c.phone}</div>
                  </TD>
                  <TD>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{c.total_jobs ?? 0}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 4 }}>total</span>
                  </TD>
                  <TD style={{ fontSize: 13, color: '#64748b' }}>
                    {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </TD>
                  <TD><Badge status={c.is_active !== false ? 'active' : 'suspended'} /></TD>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={() => onNavigate?.('customer-detail', c.id)}
                        title="View Details"
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, color: '#475569', cursor: 'pointer', fontWeight: 500 }}
                      >
                        <EyeIcon size={13} color="#475569" /> View
                      </button>
                      <ActionMenu items={[
                        { label: 'Suspend',  icon: BanIcon,      color: '#d97706', show: c.is_active !== false, onClick: () => dispatch(suspendCustomer(c.id)) },
                        { label: 'Activate', icon: ActivateIcon, color: '#059669', show: c.is_active === false, onClick: () => dispatch(activateCustomer(c.id)) },
                      ]} />
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', color: '#94a3b8', fontSize: 12 }}>
              Showing {filtered.length} customer{filtered.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Create Customer Modal */}
      <Modal open={createModal} onClose={() => { setCreateModal(false); setCreateError(''); }} title="Add New Customer" width={460}>
        {createError && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '9px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{createError}</div>}

        <div style={field.row}>
          <div style={field.col}><label style={field.label}>First Name *</label><input style={field.input} value={form.first_name} onChange={set('first_name')} placeholder="Jane" /></div>
          <div style={field.col}><label style={field.label}>Last Name</label><input style={field.input} value={form.last_name} onChange={set('last_name')} placeholder="Doe" /></div>
        </div>
        <div style={{ marginBottom: 14 }}><label style={field.label}>Email *</label><input style={field.input} type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" /></div>
        <div style={field.row}>
          <div style={field.col}><label style={field.label}>Phone *</label><input style={field.input} value={form.phone} onChange={set('phone')} placeholder="+880 1700 000000" /></div>
          <div style={field.col}><label style={field.label}>Password *</label><input style={field.input} type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" /></div>
        </div>

        <div style={field.actions}>
          <button onClick={() => { setCreateModal(false); setCreateError(''); }} style={field.cancelBtn}>Cancel</button>
          <button onClick={handleCreate} disabled={creating} style={field.submitBtn(creating)}>{creating ? 'Creating…' : 'Create Customer'}</button>
        </div>
      </Modal>
    </div>
  );
}
