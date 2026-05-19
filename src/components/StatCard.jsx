export default function StatCard({ label, value, color = '#2563eb', icon: Icon, trend }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px 22px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 12,
      border: '1px solid #f1f5f9',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
        {Icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={18} color={color} />
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{value ?? '—'}</div>
        {trend != null && (
          <div style={{ fontSize: 12, color: trend >= 0 ? '#10b981' : '#ef4444', marginTop: 4, fontWeight: 500 }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last week
          </div>
        )}
      </div>
      <div style={{ height: 3, borderRadius: 99, background: `${color}22` }}>
        <div style={{ height: '100%', width: '60%', borderRadius: 99, background: color }} />
      </div>
    </div>
  );
}
