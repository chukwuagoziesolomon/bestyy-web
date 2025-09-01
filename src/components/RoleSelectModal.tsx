import React from 'react';
import './RoleSelectModal.css';

interface RoleSelectModalProps {
  roles: string[];
  onSelect: (role: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const RoleSelectModal: React.FC<RoleSelectModalProps> = ({ roles, onSelect, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="role-select-modal__overlay">
      <div className="role-select-modal__content">
        <h2 className="role-select-modal__title">Select Role</h2>
        <p className="role-select-modal__subtitle">Choose which account you'd like to access</p>
        
        <div className="role-select-modal__options">
          {roles.map(role => (
            <button
              key={role}
              className="role-select-modal__option"
              onClick={() => onSelect(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
        
        <button className="role-select-modal__close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RoleSelectModal;
