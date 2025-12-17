import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  // message can be a string or JSX children for flexibility
  message?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirming?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirm',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirming = false
}) => {
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 2px 24px rgba(0,0,0,0.12)', fontFamily: 'Nunito Sans, sans-serif', position: 'relative', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#111827' }}>{title}</h2>
        {message && <div style={{ color: '#374151', fontSize: 16, marginBottom: 20 }}>{message}</div>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button
            onClick={onCancel}
            disabled={confirming}
            style={{ background: '#f3f4f6', color: '#111827', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 22px', cursor: confirming ? 'not-allowed' : 'pointer' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            style={{ background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 22px', cursor: confirming ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            {confirming ? 'Working...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;