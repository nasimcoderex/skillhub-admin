const COLORS = {
  pending: { bg: '#fef9c3', color: '#854d0e' },
  approved: { bg: '#dcfce7', color: '#166534' },
  rejected: { bg: '#fee2e2', color: '#991b1b' },
  suspended: { bg: '#f1f5f9', color: '#475569' },
  active: { bg: '#dcfce7', color: '#166534' },
  completed: { bg: '#dbeafe', color: '#1d4ed8' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
  in_progress: { bg: '#fef3c7', color: '#92400e' },
  accepted: { bg: '#e0f2fe', color: '#0369a1' },
};

export default function Badge({ status }) {
  const s = COLORS[status] || { bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 10px', borderRadius: 99,
      fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
    }}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}
