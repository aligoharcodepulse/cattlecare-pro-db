import React, { useState, useEffect } from 'react';

// ── MODAL ────────────────────────────────────────────────────
export function Modal({ open, title, icon, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{icon && <span>{icon}</span>}{title}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ── TOAST ────────────────────────────────────────────────────
let toastFn = null;
export function useToast() {
  return (msg, type = 'success') => toastFn && toastFn(msg, type);
}
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    toastFn = (msg, type) => {
      const id = Date.now();
      setToasts(t => [...t, { id, msg, type }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    };
  }, []);
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{icons[t.type]}</span> {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── CONFIRM DIALOG ───────────────────────────────────────────
export function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 420 }}>
        <div className="modal-body">
          <div className="confirm-box">
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <p>{message}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete</button>
              <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SEARCH BAR ───────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-bar">
      <span style={{ fontSize: 18 }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {value && <button onClick={() => onChange('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>}
    </div>
  );
}

// ── STATUS BADGE ─────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    Active:     { cls: 'badge-green', icon: '✅' },
    Sold:       { cls: 'badge-amber', icon: '💰' },
    Dead:       { cls: 'badge-grey',  icon: '🪦' },
    Lactating:  { cls: 'badge-green', icon: '🥛' },
    Dry:        { cls: 'badge-grey',  icon: '⏸️' },
    Pregnant:   { cls: 'badge-blue',  icon: '🤰' },
    Pending:    { cls: 'badge-amber', icon: '⏳' },
    Successful: { cls: 'badge-green', icon: '✅' },
    Failed:     { cls: 'badge-red',   icon: '❌' },
    Fertile:    { cls: 'badge-green', icon: '💚' },
    Infertile:  { cls: 'badge-red',   icon: '❌' },
    Unknown:    { cls: 'badge-grey',  icon: '❓' },
  };
  const s = map[status] || { cls: 'badge-grey', icon: '•' };
  return <span className={`badge ${s.cls}`}>{s.icon} {status}</span>;
}

// ── LOADING SPINNER ──────────────────────────────────────────
export function Loading({ text = 'Loading...' }) {
  return (
    <div className="loading">
      <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
      {text}
    </div>
  );
}

// ── EMPTY STATE ──────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, subtitle, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {subtitle && <p style={{ marginBottom: 20 }}>{subtitle}</p>}
      {action}
    </div>
  );
}

// ── FORM FIELD ───────────────────────────────────────────────
export function Field({ label, icon, required, children }) {
  return (
    <div className="form-group">
      <label>
        {icon && <span className="lbl-icon">{icon}</span>}
        {label} {required && <span style={{ color: 'var(--red)' }}>*</span>}
      </label>
      {children}
    </div>
  );
}