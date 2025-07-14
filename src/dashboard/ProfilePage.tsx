import React, { useState } from 'react';
import { Bell, Shield, Download, BadgeCheck, ToggleRight, ToggleLeft } from 'lucide-react';

const ProfilePage = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [nickName, setNickName] = useState('');
  const [language, setLanguage] = useState('English');

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', background: '#fff', minHeight: '100vh', padding: '0 0 2rem 0' }}>
      <h2 style={{ fontWeight: 900, fontSize: 32, marginBottom: 0, letterSpacing: 0.5, marginTop: 32 }}>Profile Settings</h2>
      <div style={{ color: '#888', fontSize: 16, marginBottom: 32 }}>Manage your Bestie Account and preferences</div>
      {/* User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" style={{ width: 72, height: 72, borderRadius: '50%' }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>Silver Snow</div>
          <div style={{ color: '#888', fontSize: 16 }}>alexarwales@gmail.com</div>
        </div>
        <button style={{ marginLeft: 'auto', background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer' }}>Edit</button>
      </div>
      {/* Profile Form */}
      <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
        <div>
          <label style={{ fontWeight: 700, fontSize: 15 }}>Business Name</label>
          <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your First Name" style={{ width: '100%', padding: '12px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 8, marginBottom: 16 }} />
        </div>
        <div>
          <label style={{ fontWeight: 700, fontSize: 15 }}>Nick Name</label>
          <input type="text" value={nickName} onChange={e => setNickName(e.target.value)} placeholder="Your First Name" style={{ width: '100%', padding: '12px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 8, marginBottom: 16 }} />
        </div>
        <div>
          <label style={{ fontWeight: 700, fontSize: 15 }}>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: '100%', padding: '12px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 8, marginBottom: 16, color: '#222' }}>
            <option>English</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 700, fontSize: 15 }}>Email</label>
          <input type="email" value="alexarwales@gmail.com" style={{ width: '100%', padding: '12px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 8, marginBottom: 16 }} readOnly />
        </div>
      </form>
      {/* Notifications Card */}
      <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 16, padding: 32, marginBottom: 32, maxWidth: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <Bell size={24} style={{ color: '#222' }} />
          <span style={{ fontWeight: 800, fontSize: 22 }}>Notifications</span>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Email Notifications</div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>Receive updates about your Order/Bookings via email</div>
          <span style={{ float: 'right', marginTop: -36 }}>
            <button type="button" onClick={() => setEmailNotif(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              {emailNotif ? <ToggleRight size={32} color="#10b981" /> : <ToggleLeft size={32} color="#e5e7eb" />}
            </button>
          </span>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Push Notification</div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>Get notified when order is Sent</div>
          <span style={{ float: 'right', marginTop: -36 }}>
            <button type="button" onClick={() => setPushNotif(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              {pushNotif ? <ToggleRight size={32} color="#10b981" /> : <ToggleLeft size={32} color="#e5e7eb" />}
            </button>
          </span>
        </div>
      </div>
      {/* Privacy & Security Card */}
      <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 16, padding: 32, marginBottom: 32, maxWidth: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <Shield size={24} style={{ color: '#222' }} />
          <span style={{ fontWeight: 800, fontSize: 22 }}>Privacy & Security</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button type="button" style={{ display: 'flex', alignItems: 'center', width: '100%', background: '#fff', border: 'none', borderRadius: 8, padding: '16px 18px', fontWeight: 700, fontSize: 16, textAlign: 'left', cursor: 'pointer', boxShadow: 'none' }}>Change Password</button>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <button type="button" style={{ flex: 1, background: '#fff', border: 'none', borderRadius: 8, padding: '16px 18px', fontWeight: 700, fontSize: 16, textAlign: 'left', cursor: 'pointer', boxShadow: 'none' }}>Two-Factor Authentication</button>
            <span style={{ background: '#f3f4f6', color: '#10b981', fontWeight: 700, fontSize: 13, borderRadius: 6, padding: '4px 12px', marginLeft: 12 }}>Recommended</span>
          </div>
          <button type="button" style={{ display: 'flex', alignItems: 'center', width: '100%', background: '#fff', border: 'none', borderRadius: 8, padding: '16px 18px', fontWeight: 700, fontSize: 16, textAlign: 'left', cursor: 'pointer', boxShadow: 'none' }}><Download size={18} style={{ marginRight: 10 }} />Download my Data</button>
        </div>
      </div>
      {/* Save Changes Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 900 }}>
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '14px 32px', cursor: 'pointer', boxShadow: '0 2px 8px #e5e7eb' }}>
          <BadgeCheck size={20} /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage; 