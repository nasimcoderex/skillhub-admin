import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin } from '../store/slices/authSlice';
import { DashboardIcon, WorkersIcon, CustomersIcon, JobsIcon, LogoutIcon, TrendingUpIcon } from './Icons';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { key: 'workers',   label: 'Workers',   Icon: WorkersIcon },
  { key: 'customers', label: 'Customers', Icon: CustomersIcon },
  { key: 'jobs',      label: 'Jobs',      Icon: JobsIcon },
  { key: 'analytics', label: 'Analytics', Icon: TrendingUpIcon },
];

function Avatar({ name }) {
  const initials = name ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : 'A';
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%',
      background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function Layout({ children, page, onNavigate }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Admin';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f1f5f9', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: 248, background: '#0f172a', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '4px 0 16px rgba(0,0,0,0.15)' }}>

        {/* Logo */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1 }}>KajAche</div>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', marginTop: 2 }}>ADMIN PANEL</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, color: '#334155', fontWeight: 700, letterSpacing: '0.1em', padding: '4px 10px 10px' }}>NAVIGATION</div>
          {NAV.map(({ key, label, Icon }) => {
            const active = page === key;
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  width: '100%', padding: '10px 12px', marginBottom: 2,
                  background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                  border: 'none', borderRadius: 9,
                  borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
                  color: active ? '#93c5fd' : '#64748b',
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={18} color={active ? '#60a5fa' : '#475569'} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '14px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Avatar name={fullName} />
            <div style={{ minWidth: 0 }}>
              <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fullName}</div>
              <div style={{ color: '#475569', fontSize: 11, marginTop: 1 }}>Administrator</div>
            </div>
          </div>
          <button
            onClick={() => dispatch(logoutAdmin())}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              width: '100%', padding: '8px 12px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, color: '#f87171', fontSize: 13, fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <LogoutIcon size={15} color="#f87171" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 28px', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>KajAche</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            <span style={{ color: '#1e293b', fontWeight: 600, textTransform: 'capitalize' }}>{page}</span>
          </div>
        </div>

        {/* Scrollable page area */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
