import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RoleSelection.css';
import { showError } from './toast';

const roleCardData: Record<string, { label: string; img: string[]; bg?: string; desc: string }> = {
  user: {
    label: 'User',
    img: ['/user1.png', '/user2.png'],
    desc: 'Access as a regular user',
  },
  vendor: {
    label: 'Vendor',
    img: ['/vendor.png'],
    desc: 'Access as a vendor',
  },
  courier: {
    label: 'Courier',
    img: ['/courier1.png', '/courier2.png'],
    bg: '/courier3.png',
    desc: 'Access as a courier',
  },
};

const roleToDashboard: Record<string, string> = {
  user: '/user/dashboard',
  vendor: '/dashboard',
  courier: '/courier/dashboard',
};

interface RoleSelectorProps {
  roles: string[];
  onRoleSelect?: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ roles, onRoleSelect }) => {
  const navigate = useNavigate();

  const handleSelect = (role: string) => {
    const route = roleToDashboard[role];
    if (route) {
      if (onRoleSelect) {
        onRoleSelect(role);
      } else {
        navigate(route, { replace: true });
      }
    } else {
      showError('Unknown role selected.');
    }
  };

  return (
    <div className="role-selection__container">
      <h2 className="role-selection__heading">Select Your Role</h2>
      <p className="role-selection__subheading">Choose which dashboard you want to access</p>
      <div className="role-selection__cards">
        {roles.map((role) => {
          const card = roleCardData[role];
          if (!card) return null;
          return (
            <div
              key={role}
              className="role-selection__card"
              onClick={() => handleSelect(role)}
              style={{ cursor: 'pointer' }}
            >
              {card.bg && (
                <img src={card.bg} alt="Courier Background" className="role-selection__bg" />
              )}
              {card.img.length === 2 ? (
                <div className="role-selection__user-imgs">
                  <img src={card.img[0]} alt={`${card.label} Phone`} className="role-selection__img role-selection__img--phone" />
                  <img src={card.img[1]} alt={`${card.label} Person`} className="role-selection__img role-selection__img--human" />
                </div>
              ) : (
                <img src={card.img[0]} alt={card.label} className="role-selection__img" />
              )}
              <div className="role-selection__label">{card.label}</div>
              <div style={{ color: '#888', fontSize: '0.98rem', textAlign: 'center', marginTop: 8 }}>{card.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector; 