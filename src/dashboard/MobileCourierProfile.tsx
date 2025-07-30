import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, BarChart3, CreditCard, Menu, X, HelpCircle, Settings, Camera, Eye, EyeOff } from 'lucide-react';
import { fetchUserProfile, updateUserProfile } from '../api';
import { showSuccess, showError } from '../toast';

const MobileCourierProfile: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Editable fields
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [language, setLanguage] = useState('en');
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [previewPicture, setPreviewPicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    // First, try to populate from localStorage courier_profile
    const savedCourier = localStorage.getItem('courier_profile');
    if (savedCourier) {
      try {
        const courier = JSON.parse(savedCourier);
        setFullName(courier.first_name + ' ' + courier.last_name || '');
        setNickName(courier.first_name || '');
        setEmail(courier.email || '');
        setProfilePicture(courier.profile_picture || null);
      } catch (e) {
        // Ignore parse errors and proceed to fetch from backend
      }
    }
    
    async function getProfile() {
      setLoading(true);
      setError(null);
      try {
        if (token) {
          const data = await fetchUserProfile(token);
          setProfile(data || null);
          setFullName(data?.full_name || '');
          setNickName(data?.nick_name || '');
          setLanguage(data?.language || 'en');
          setEmail(data?.email || '');
          setEmailNotifications(!!data?.email_notifications);
          setPushNotifications(!!data?.push_notifications);
          setProfilePicture(data?.profile_picture || null);
          setPreviewPicture(null);
        }
      } catch (err: any) {
        setError(err.message || 'Could not fetch profile');
        showError(err.message || 'Could not fetch profile');
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, [token]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewPicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError('No authentication token found');
      return;
    }
    try {
      const profileData = {
        full_name: fullName,
        nick_name: nickName,
        language: language,
        email: email,
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        profile_picture: previewPicture !== null ? previewPicture : profilePicture,
      };
      await updateUserProfile(token, profileData);
      setProfile((prev: any) => ({ ...prev, ...profileData }));
      setProfilePicture(profileData.profile_picture);
      setPreviewPicture(null);
      showSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (error: any) {
      showError(error.message || 'Failed to update profile');
    }
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          margin: 0,
          color: '#1f2937'
        }}>
          Profile Settings
        </h1>
        <div 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease'
          }}
        >
          <Menu size={24} color="#6b7280" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setShowDropdown(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40
            }}
          />
          
          {/* Dropdown Content */}
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '16px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            zIndex: 50,
            minWidth: '200px',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937'
              }}>
                Menu
              </span>
              <X 
                size={20} 
                color="#6b7280" 
                style={{ cursor: 'pointer' }}
                onClick={() => setShowDropdown(false)}
              />
            </div>

            {/* Menu Items */}
            <div style={{ padding: '8px 0' }}>
              {[
                { icon: <HelpCircle size={20} />, label: 'Help/Support', onClick: () => navigate('/courier/support') },
                { icon: <Settings size={20} />, label: 'Profile', onClick: () => {}, active: true }
              ].map((item, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setShowDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    background: item.active ? '#f0fdf4' : 'transparent',
                    color: item.active ? '#10b981' : '#374151',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => {
                    if (!item.active) {
                      e.currentTarget.style.background = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.active) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Profile Content */}
      <div style={{ padding: '24px 16px' }}>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280' 
          }}>
            Loading profile...
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#ef4444' 
          }}>
            {error}
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Profile Picture Section */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px 20px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#f3f4f6'
              }}>
                {previewPicture || profilePicture ? (
                  <img 
                    src={previewPicture || profilePicture || ''} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#e5e7eb',
                    color: '#6b7280',
                    fontSize: '24px',
                    fontWeight: 600
                  }}>
                    {nickName ? nickName[0].toUpperCase() : 'C'}
                  </div>
                )}
                
                {editMode && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Camera size={12} color="#fff" />
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              
              <div style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {fullName || 'Courier Name'}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {email || 'courier@example.com'}
              </div>
            </div>

            {/* Profile Information */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px 20px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Personal Information
                </h3>
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  style={{
                    background: editMode ? '#ef4444' : '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!editMode}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: editMode ? '#fff' : '#f9fafb',
                      color: editMode ? '#1f2937' : '#6b7280'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!editMode}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: editMode ? '#fff' : '#f9fafb',
                      color: editMode ? '#1f2937' : '#6b7280'
                    }}
                  />
                </div>
              </div>

              {editMode && (
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        zIndex: 50
      }}>
        {[
          { 
            icon: <Home size={20} />, 
            label: 'Dashboard', 
            active: false,
            onClick: () => navigate('/courier/dashboard')
          },
          { 
            icon: <List size={20} />, 
            label: 'Delivery List', 
            active: false,
            onClick: () => navigate('/courier/delivery-list')
          },
          { 
            icon: <BarChart3 size={20} />, 
            label: 'Analytics', 
            active: false,
            onClick: () => navigate('/courier/analytics')
          },
          { 
            icon: <CreditCard size={20} />, 
            label: 'Payout', 
            active: false,
            onClick: () => navigate('/courier/payouts')
          }
        ].map((item, index) => (
          <div 
            key={index} 
            onClick={item.onClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: item.active ? '#10b981' : '#6b7280',
              cursor: 'pointer'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCourierProfile;
