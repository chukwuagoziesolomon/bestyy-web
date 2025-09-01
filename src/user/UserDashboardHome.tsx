import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Moon, Bell, User, Loader2 } from 'lucide-react';
import { fetchUserOrders } from '../api';
import { showError, showSuccess } from '../toast';

const UserDashboardHome = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState<string | null>(null);

  // Get user data safely
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
      setUser({});
    }
  }, []);

  const firstName = user?.first_name || 'there';

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      const data = await fetchUserOrders(token);
      console.log('Fetched orders data:', data);
      
      if (!data) {
        throw new Error('No data received from server');
      }
      
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      
      if ((!data.orders || data.orders.length === 0) && (!data.bookings || data.bookings.length === 0)) {
        showSuccess('No orders or bookings found. Start ordering now!');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Could not fetch orders and bookings';
      console.error('Error fetching data:', err);
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove dependencies to prevent infinite loop

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []); // Only run once on mount

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        fontFamily: 'Nunito Sans, sans-serif',
      }}>
        <Loader2 className="animate-spin" size={40} />
        <p style={{ marginTop: '1rem' }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'Nunito Sans, sans-serif',
      }}>
        <h2 style={{ color: '#ef4444' }}>Error Loading Dashboard</h2>
        <p style={{ color: '#6b7280', margin: '1rem 0' }}>{error}</p>
        <button 
          onClick={fetchData}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0 }}>Welcome Back, {user?.first_name || 'User'}!</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Moon size={22} style={{ color: '#222', cursor: 'pointer' }} />
          <Bell size={22} style={{ color: '#222', cursor: 'pointer' }} />
          <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {user?.first_name?.[0]?.toUpperCase() || <User size={20} />}
          </div>
        </div>
      </div>

      {/* My Orders */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Orders</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp</div>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: 0, overflow: 'hidden', border: '1.5px solid #f3f4f6' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 17, fontFamily: 'inherit' }}>
            <thead>
              <tr style={{ color: '#888', fontWeight: 700, background: '#fff' }}>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>NAME</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>ADDRESS</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>DATE</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 32 }}>
                    <a
                      href="https://wa.me/234XXXXXXXXXX" // Replace with your WhatsApp number
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: '#10b981', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
                    >
                      <img src="/WhatsApp.png" alt="WhatsApp" width={48} height={48} style={{ display: 'block' }} />
                      <span style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>No orders yet</span>
                      <span style={{ color: '#888', fontSize: 16, marginTop: 4, marginBottom: 8 }}>Click here to place your first order on WhatsApp!</span>
                    </a>
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr key={order.id || i} style={{ background: '#fff', borderBottom: i !== orders.length - 1 ? '1.5px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14, fontWeight: 700, color: '#222' }}>
                      <img 
                        src={order.logo || 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Pizza_Hut_logo.svg'} 
                        alt={order.name || 'Order'} 
                        style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'contain', background: '#fff', border: '1.5px solid #f3f4f6' }} 
                        onError={(e) => {
                          e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Pizza_Hut_logo.svg';
                        }}
                      />
                      {order.name || order.restaurant || 'Order'}
                    </td>
                    <td style={{ padding: '20px 18px', color: '#222', fontWeight: 600 }}>{order.address || order.delivery_address || '-'}</td>
                    <td style={{ padding: '20px 18px', color: '#222', fontWeight: 600 }}>{order.date || order.created_at || '-'}</td>
                    <td style={{ padding: '20px 18px' }}>
                      <span style={{ background: order.statusColor || '#d1fae5', color: order.statusTextColor || '#10b981', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15 }}>{order.status || '-'}</span>
                    </td>
                    <td style={{ padding: '20px 18px' }}>
                      <button style={{ background: '#f8fafc', color: '#222', fontWeight: 700, fontSize: 15, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }}>{order.action || 'View Details'}</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Bookings */}
      <div>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Bookings</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>See your upcoming and past bookings. View details, get directions, or modify plans through Bestie</div>
        
        {bookings.length === 0 ? (
          <div style={{ color: '#888', fontSize: 18, padding: 32 }}>No bookings found.</div>
        ) : (
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Bookings Carousel */}
            <div style={{ 
              display: 'flex', 
              gap: 24, 
              overflowX: 'auto', 
              padding: '8px 0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {bookings.map((booking, i) => (
                <div key={booking.id || i} style={{ 
                  minWidth: 320, 
                  flex: '0 0 auto',
                  position: 'relative',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px #f3f4f6',
                  border: '1.5px solid #f3f4f6'
                }}>
                  {/* Booking Image */}
                  <div style={{ 
                    width: '100%', 
                    height: 200, 
                    background: `url(${booking.image || booking.hotel_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}) center/cover`,
                    position: 'relative'
                  }}>
                    {/* Navigation Arrows */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: 12, 
                      transform: 'translateY(-50%)',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <svg width="16" height="16" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <polyline points="15,18 9,12 15,6"></polyline>
                      </svg>
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      right: 12, 
                      transform: 'translateY(-50%)',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <svg width="16" height="16" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <polyline points="9,18 15,12 9,6"></polyline>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Booking Info Overlay */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    padding: '60px 20px 20px 20px',
                    color: '#fff'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                      {booking.name || booking.hotel || 'Hotel Booking'}
                    </div>
                    <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>
                      {booking.date || booking.created_at || 'Check-in date'}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginTop: 12
                    }}>
                      <span style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        color: '#fff', 
                        borderRadius: 6, 
                        padding: '4px 12px', 
                        fontWeight: 600, 
                        fontSize: 12 
                      }}>
                        {booking.status || 'Confirmed'}
                      </span>
                      <button style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        color: '#fff', 
                        fontWeight: 600, 
                        fontSize: 12, 
                        border: '1px solid rgba(255,255,255,0.3)', 
                        borderRadius: 6, 
                        padding: '6px 12px', 
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)'
                      }}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardHome;