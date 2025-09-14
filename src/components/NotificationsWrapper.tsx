import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationsPage from '../pages/NotificationsPage';

const NotificationsWrapper: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<{ id: number; userType: string } | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/user/profile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userProfile = await response.json();
          setUserData({
            id: userProfile.id || userProfile.user_id,
            userType: userProfile.user_type || 'user'
          });
        }
      } catch (error) {
        console.error('Error loading user data for notifications:', error);
      }
    };

    loadUserData();
  }, []);

  if (!userData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280' }}>Loading notifications...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <NotificationsPage userId={userData.id} userType={userData.userType} />;
};

export default NotificationsWrapper;
