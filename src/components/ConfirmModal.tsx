import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title = 'Confirm', message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 2px 24px #d1fae5', fontFamily: 'Nunito Sans, sans-serif', position: 'relative', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#ef4444' }}>{title}</h2>
        <div style={{ color: '#222', fontSize: 17, marginBottom: 28 }}>{message}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
          <button onClick={onCancel} style={{ background: '#f3f4f6', color: '#222', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 