import { useState, useEffect, useRef } from 'react';

export default function ActionMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const visible = items.filter((i) => i.show !== false);
  if (visible.length === 0) return null;

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        style={{
          width: 30, height: 30, border: '1px solid #e2e8f0',
          borderRadius: 7, background: open ? '#f1f5f9' : '#fff',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#64748b', fontSize: 16,
          fontWeight: 700, lineHeight: 1, padding: 0,
        }}
      >
        ⋮
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 4px)',
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: 160, zIndex: 100, overflow: 'hidden',
        }}>
          {visible.map(({ label, icon: Icon, color = '#374151', onClick, divider }) => (
            divider ? (
              <div key={label} style={{ height: 1, background: '#f1f5f9', margin: '3px 0' }} />
            ) : (
              <button
                key={label}
                onClick={(e) => { e.stopPropagation(); setOpen(false); onClick(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '9px 14px',
                  background: 'none', border: 'none',
                  color, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                {Icon && <Icon size={14} color={color} />}
                {label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
