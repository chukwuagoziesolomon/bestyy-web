import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { ChevronRight, Clock, Calendar } from 'lucide-react';

// Types
interface Order {
  id: number;
  name: string;
  restaurant: string;
  date: string;
  price: string;
  status: string;
}

interface Booking {
  id: number;
  hotel: string;
  date: string;
  status: string;
  image: string;
}

// Sample data
const recentOrders: Order[] = [
  {
    id: 1,
    name: 'Fried Rice and Turkey',
    restaurant: 'Korede Spagetti',
    date: '15, Jun 2025, 12:00',
    price: '₦5,000',
    status: 'Delivered'
  },
  {
    id: 2,
    name: 'Jollof Rice and Chicken',
    restaurant: 'Tasty Bites',
    date: '14, Jun 2025, 14:30',
    price: '₦4,500',
    status: 'In Transit'
  }
];

const upcomingBookings: Booking[] = [
  {
    id: 1,
    hotel: 'Luxury Hotel',
    date: '20, Jun 2025',
    status: 'Confirmed',
    image: '/hotel-placeholder.jpg'
  }
];

const MobileDashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const firstName = localStorage.getItem('first_name') || 'there';
  const profileImage = localStorage.getItem('profile_image') || '/user1.png';
  
  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'delivered':
      case 'confirmed':
        return { background: '#D1FAE5', color: '#065F46' };
      case 'in transit':
        return { background: '#DBEAFE', color: '#1E40AF' };
      default:
        return { background: '#F3F4F6', color: '#4B5563' };
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Nunito Sans, sans-serif', 
      color: '#111', 
      minHeight: '100vh',
      paddingBottom: '80px',
      background: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        padding: '20px 16px 16px', 
        background: '#fff', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <img 
          src={profileImage} 
          alt="Profile" 
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%',
            objectFit: 'cover'
          }} 
        />
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: 700, 
          margin: 0,
          flex: 1,
          textAlign: 'center',
          paddingRight: '40px'
        }}>
          Dashboard
        </h1>
      </div>

      {/* Welcome Section */}
      <div style={{ 
        padding: '24px 16px 16px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        marginBottom: '24px'
      }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px',
          fontWeight: 700
        }}>
          Welcome back, {firstName}!
        </h2>
        <p style={{ 
          margin: 0, 
          fontSize: '14px',
          opacity: 0.9
        }}>
          Track your orders and bookings in one place
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '0 16px 24px',
        marginBottom: '16px'
      }}>
        <button 
          onClick={() => navigate('/user/dashboard/orders')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: '#D1FAE5',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3 style={{ 
            margin: '0 0 4px 0', 
            fontSize: '16px',
            fontWeight: 600
          }}>
            My Orders
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '12px',
            color: '#6B7280'
          }}>
            Track and manage
          </p>
        </button>

        <button 
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: '#E0F2FE',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <h3 style={{ 
            margin: '0 0 4px 0', 
            fontSize: '16px',
            fontWeight: 600
          }}>
            Contact Support
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '12px',
            color: '#6B7280'
          }}>
            We're here to help
          </p>
        </button>
      </div>

      {/* Recent Orders */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        margin: '0 16px 24px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px 16px 12px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px',
            fontWeight: 600
          }}>
            Recent Orders
          </h3>
          <button 
            onClick={() => navigate('/user/dashboard/orders')}
            style={{
              background: 'none',
              border: 'none',
              color: '#10B981',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            View all <ChevronRight size={16} />
          </button>
        </div>
        
        {recentOrders.length === 0 ? (
          <div style={{ 
            padding: '32px 16px', 
            textAlign: 'center',
            color: '#6B7280',
            fontSize: '14px'
          }}>
            No recent orders
          </div>
        ) : (
          <div>
            {recentOrders.map((order) => (
              <div 
                key={order.id}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onClick={() => navigate(`/user/dashboard/orders/${order.id}`)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: '15px',
                    fontWeight: 600,
                    maxWidth: '70%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {order.name}
                  </h4>
                  <span style={{ 
                    ...getStatusStyles(order.status),
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {order.status}
                  </span>
                </div>
                
                <p style={{ 
                  margin: '4px 0', 
                  color: '#6B7280',
                  fontSize: '13px'
                }}>
                  {order.restaurant}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    color: '#374151',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={14} />
                    {order.date}
                  </span>
                  <span style={{ 
                    color: '#10B981',
                    fontSize: '15px',
                    fontWeight: 700
                  }}>
                    {order.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Bookings */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        margin: '0 16px 24px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px 16px 12px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px',
            fontWeight: 600
          }}>
            Upcoming Bookings
          </h3>
          <button 
            style={{
              background: 'none',
              border: 'none',
              color: '#10B981',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            View all <ChevronRight size={16} />
          </button>
        </div>
        
        {upcomingBookings.length === 0 ? (
          <div style={{ 
            padding: '32px 16px', 
            textAlign: 'center',
            color: '#6B7280',
            fontSize: '14px'
          }}>
            No upcoming bookings
          </div>
        ) : (
          <div>
            {upcomingBookings.map((booking) => (
              <div 
                key={booking.id}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: '15px',
                    fontWeight: 600
                  }}>
                    {booking.hotel}
                  </h4>
                  <span style={{ 
                    ...getStatusStyles(booking.status),
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {booking.status}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}>
                  <Calendar size={16} color="#6B7280" />
                  <span style={{ 
                    color: '#6B7280',
                    fontSize: '13px'
                  }}>
                    {booking.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MobileDashboardHome;

const MobileDashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const firstName = localStorage.getItem('first_name') || 'there';
  const profileImage = localStorage.getItem('profile_image') || '/user1.png';
  
  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'delivered':
      case 'confirmed':
        return { background: '#D1FAE5', color: '#065F46' };
      case 'in transit':
        return { background: '#DBEAFE', color: '#1E40AF' };
      default:
        return { background: '#F3F4F6', color: '#4B5563' };
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Nunito Sans, sans-serif', 
      color: '#111', 
      minHeight: '100vh',
      paddingBottom: '80px',
      background: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        padding: '20px 16px 16px', 
        background: '#fff', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <img 
          src={profileImage} 
          alt="Profile" 
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%',
            objectFit: 'cover'
          }} 
        />
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: 700, 
          margin: 0,
          flex: 1,
          textAlign: 'center',
          paddingRight: '40px'
        }}>
          Dashboard
        </h1>
      </div>

      {/* Rest of the component... */}
    </div>
  );
};

export default MobileDashboardHome;
    switch(status.toLowerCase()) {
      case 'delivered':
        return { background: '#D1FAE5', color: '#065F46' };
      case 'in transit':
        return { background: '#DBEAFE', color: '#1E40AF' };
      case 'confirmed':
        return { background: '#D1FAE5', color: '#065F46' };
      default:
        return { background: '#F3F4F6', color: '#4B5563' };
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Nunito Sans, sans-serif', 
      color: '#111', 
      minHeight: '100vh',
      paddingBottom: '80px', // Space for bottom nav
      background: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        padding: '20px 16px 16px', 
        background: '#fff', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <img 
          src={profileImage} 
          alt="Profile" 
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%',
            objectFit: 'cover'
          }} 
        />
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: 700, 
          margin: 0,
          flex: 1,
          textAlign: 'center',
          paddingRight: '40px' // Balance the flex layout
        }}>
          Dashboard
        </h1>
      </div>

      {/* Welcome Section */}
      <div style={{ 
        padding: '24px 16px 16px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        marginBottom: '24px'
      }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px',
          fontWeight: 700
        }}>
          Welcome back, {firstName}!
        </h2>
        <p style={{ 
          margin: 0, 
          fontSize: '14px',
          opacity: 0.9
        }}>
          Track your orders and bookings in one place
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '0 16px 24px',
        marginBottom: '16px'
      }}>
        <button 
          onClick={() => navigate('/user/dashboard/orders')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: '#D1FAE5',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
                <button style={{ background: '#f3fefb', color: '#10b981', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, padding: '8px 18px', marginTop: 8, cursor: 'pointer' }}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Bookings */}
      <div style={{ padding: '24px 18px 0 18px' }}>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Bookings</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp</div>
        {bookings.map((booking, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', overflow: 'hidden', marginBottom: 18, position: 'relative' }}>
            {/* Carousel Image with Arrows */}
            <div style={{ width: '100%', height: 160, background: `url(${booking.image}) center/cover`, position: 'relative' }}>
              <button style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
                <ChevronLeft size={22} color="#222" />
              </button>
              <button style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
                <ChevronRight size={22} color="#222" />
              </button>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{booking.hotel}</div>
              <div style={{ color: '#888', fontSize: 15 }}>{booking.date}</div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ background: '#e6f9f2', color: '#10b981', borderRadius: 6, padding: '4px 12px', fontWeight: 600, fontSize: 12 }}>{booking.status}</span>
                <button style={{ background: '#f3fefb', color: '#10b981', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer' }}>View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MobileDashboardHome; 