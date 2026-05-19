import { useEffect } from 'react';
import { XIcon } from './Icons';

export default function Modal({ open, onClose, title, children, width = 480 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, width: '100%', maxWidth: width,
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 0' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <XIcon size={16} color="#64748b" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 24px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* Shared form field styles exported for reuse */
export const field = {
  label: {
    display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 5,
  },
  input: {
    width: '100%', padding: '9px 12px',
    border: '1px solid #e2e8f0', borderRadius: 8,
    fontSize: 14, color: '#1e293b', outline: 'none',
    boxSizing: 'border-box', background: '#fff',
  },
  row: {
    display: 'flex', gap: 12, marginBottom: 14,
  },
  col: { flex: 1 },
  actions: {
    display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20,
  },
  cancelBtn: {
    padding: '9px 18px', border: '1px solid #e2e8f0', borderRadius: 8,
    background: '#fff', color: '#64748b', fontSize: 14, fontWeight: 500, cursor: 'pointer',
  },
  submitBtn: (loading) => ({
    padding: '9px 22px', border: 'none', borderRadius: 8,
    background: loading ? '#93c5fd' : '#2563eb', color: '#fff',
    fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
  }),
};
