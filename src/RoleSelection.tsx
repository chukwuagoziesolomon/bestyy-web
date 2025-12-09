import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const roles = [
  {
    label: 'User',
    img: ['/user1.png', '/user2.png'], // phone, human
    desc: 'Sign up as a user',
  },
  {
    label: 'Vendor',
    img: ['/vendor.png'],
    desc: 'Sign up as a vendor',
  },
  {
    label: 'Rider',
    img: ['/courier1.png', '/courier2.png'], // phone, bike man
    bg: '/courier3.png', // shadowlike background
    desc: 'Sign up as a rider',
    comingSoon: true,
  },
];

const RoleSelection = () => {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    // Navigate to unified signup with pre-selected role
    const roleMap = ['user', 'vendor', 'courier'];
    const selectedRole = roles[selected];
    
    // Prevent navigation if coming soon
    if (selectedRole.comingSoon) {
      return;
    }
    
    navigate('/signup', { state: { preSelectedRole: roleMap[selected] } });
  };

  return (
    <div className="role-selection__container">
      <h2 className="role-selection__heading">Who are You Signing Up As ?</h2>
      <p className="role-selection__subheading">Choose the role that fits how you want to use bestie. Each one unlocks a different experience</p>
      <div className="role-selection__cards">
        {roles.map((role, idx) => (
          <div
            key={role.label}
            className={`role-selection__card${selected === idx ? ' role-selection__card--active' : ''}${role.comingSoon ? ' role-selection__card--disabled' : ''}`}
            onClick={() => !role.comingSoon && setSelected(idx)}
            style={{ cursor: role.comingSoon ? 'not-allowed' : 'pointer' }}
          >
            {role.bg && (
              <img src={role.bg} alt="Courier Background" className="role-selection__bg" />
            )}
            {role.img.length === 2 ? (
              <div className="role-selection__user-imgs">
                <img src={role.img[0]} alt={`${role.label} Phone`} className="role-selection__img role-selection__img--phone" />
                <img src={role.img[1]} alt={`${role.label} Person`} className="role-selection__img role-selection__img--human" />
              </div>
            ) : (
              <img src={role.img[0]} alt={role.label} className="role-selection__img" />
            )}
            <div className="role-selection__label">{role.label}</div>
            {role.comingSoon && (
              <div className="role-selection__coming-soon">
                <span>Coming Soon</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="role-selection__dots">
        {roles.map((_, idx) => (
          <span key={idx} className={`role-selection__dot${selected === idx ? ' role-selection__dot--active' : ''}`}></span>
        ))}
      </div>
      <button 
        className={`role-selection__next${roles[selected]?.comingSoon ? ' role-selection__next--disabled' : ''}`} 
        onClick={handleNext}
        disabled={roles[selected]?.comingSoon}
      >
        {roles[selected]?.comingSoon ? 'Coming Soon' : 'Next'}
      </button>
    </div>
  );
};

export default RoleSelection; 