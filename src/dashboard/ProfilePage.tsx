import React, { useEffect, useState, useRef } from 'react';
import { fetchUserProfile, updateUserProfile } from '../api';
import { showError, showSuccess } from '../toast';
import { Edit2, Camera } from 'lucide-react';

const ProfilePage = () => {
  const token = localStorage.getItem('token');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    // First, try to populate from localStorage vendor_profile
    const savedVendor = localStorage.getItem('vendor_profile');
    if (savedVendor) {
      try {
        const vendor = JSON.parse(savedVendor);
        setFullName(vendor.business_name || '');
        setNickName(vendor.user?.first_name || '');
        setEmail(vendor.user?.email || '');
        setProfilePicture(vendor.logo || null);
        // Optionally set other fields if available
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

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
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
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111', maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 8 }}>Profile Settings</h2>
      <div style={{ color: '#888', fontSize: 17, marginBottom: 32 }}>Manage your Bestie Account and preferences</div>
      {loading ? (
        <div style={{ color: '#888', fontSize: 18 }}>Loading profile...</div>
      ) : error ? (
        <div style={{ color: '#ef4444', fontSize: 18 }}>{error}</div>
      ) : profile ? (
        <form onSubmit={handleSave}>
          {/* Profile Card */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              {previewPicture ? (
                <img src={previewPicture} alt="Profile Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
              ) : profilePicture ? (
                <img src={profilePicture} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#10b981' }}>{(nickName || fullName || 'U')[0]}</div>
              )}
              {editMode && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#10b981',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  aria-label="Change profile picture"
                >
                  <Camera size={18} color="#fff" />
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handlePictureChange}
                disabled={!editMode}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 22 }}>{nickName || fullName || 'User'}</div>
              <div style={{ color: '#888', fontSize: 16 }}>{email}</div>
        </div>
            <button type="button" onClick={() => setEditMode(!editMode)} style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Edit2 size={18} /> Edit
            </button>
      </div>
      {/* Profile Form */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div>
              <label style={{ fontWeight: 600, fontSize: 15 }}>Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} disabled={!editMode} />
        </div>
        <div>
              <label style={{ fontWeight: 600, fontSize: 15 }}>Nick Name</label>
              <input type="text" value={nickName} onChange={e => setNickName(e.target.value)} placeholder="Nick Name" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} disabled={!editMode} />
        </div>
        <div>
              <label style={{ fontWeight: 600, fontSize: 15 }}>Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} disabled={!editMode}>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
          </select>
        </div>
        <div>
              <label style={{ fontWeight: 600, fontSize: 15 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} disabled={!editMode} />
            </div>
        </div>
          {/* Notifications Section */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span role="img" aria-label="bell">🔔</span> Notifications
        </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Email Notifications</div>
                <div style={{ color: '#888', fontSize: 15 }}>Receive updates about your Order/Bookings via email</div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} disabled={!editMode} />
                <span className="slider round"></span>
              </label>
        </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Push Notification</div>
                <div style={{ color: '#888', fontSize: 15 }}>Get notified when order is Sent</div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={pushNotifications} onChange={e => setPushNotifications(e.target.checked)} disabled={!editMode} />
                <span className="slider round"></span>
              </label>
        </div>
      </div>
          {/* Privacy & Security Section */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span role="img" aria-label="lock">🛡️</span> Privacy & Security
        </div>
            <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 16, background: '#f8fafc', borderRadius: 8, padding: '12px 18px' }}>Change Password</div>
            <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 16, background: '#f8fafc', borderRadius: 8, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              Two-Factor Authentication <span style={{ background: '#facc15', color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 6, padding: '2px 10px', marginLeft: 8 }}>Recommended</span>
        </div>
            <div style={{ fontWeight: 600, fontSize: 16, background: '#f8fafc', borderRadius: 8, padding: '12px 18px' }}>Download my Data</div>
      </div>
      {/* Save Changes Button */}
          {editMode && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 32px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src="/save.png" alt="Save" style={{ width: 22, height: 22 }} /> Save Changes
        </button>
      </div>
          )}
        </form>
      ) : (
        <div style={{ color: '#888', fontSize: 18 }}>No profile data found.</div>
      )}
    </div>
  );
};

export default ProfilePage; 