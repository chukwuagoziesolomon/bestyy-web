import React, { useState } from 'react';
import { 
  Menu, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  ChevronDown 
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

// Debug component
const DebugInfo = () => (
  <div style={{
    background: '#333', 
    color: '#fff', 
    padding: '4px 8px',
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 1000,
    borderRadius: '4px',
    fontSize: '12px'
  }}>
    MobileOrdersPage Rendered
  </div>
);

const orders = [
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
  },
  {
    id: 3,
    name: 'Pounded Yam & Egusi',
    restaurant: 'Naija Kitchen',
    date: '13, Jun 2025, 19:15',
    price: '₦3,800',
    status: 'Pending'
  }
];

const MobileOrdersPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  
  // Debug info
  console.log('MobileOrdersPage rendering...');

  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return { background: '#D1FAE5', color: '#065F46' };
      case 'in transit':
        return { background: '#DBEAFE', color: '#1E40AF' };
      case 'pending':
        return { background: '#FEF3C7', color: '#92400E' };
      default:
        return { background: '#F3F4F6', color: '#4B5563' };
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Nunito Sans, sans-serif', 
      color: '#111', 
      minHeight: '100vh',
      background: '#f8fafc',
      paddingBottom: '80px' // Space for bottom navigation
    }}>
      {/* Debug Info - Only shows in development */}
      {process.env.NODE_ENV === 'development' && <DebugInfo />}

      {/* Header */}
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '20px 16px 16px', 
        background: '#fff', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <img 
          src={localStorage.getItem('profile_image') || '/user1.png'} 
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
          My Orders
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ padding: '16px' }}>
        {/* Order List */}
        <div style={{ marginTop: '16px' }}>
          {orders.map((order) => (
            <div 
              key={order.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '16px',
                  fontWeight: 600
                }}>
                  {order.name}
                </h3>
                <span style={{ 
                  ...getStatusStyles(order.status),
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {order.status}
                </span>
              </div>
              
              <p style={{ 
                margin: '4px 0', 
                color: '#666',
                fontSize: '14px'
              }}>
                {order.restaurant}
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '12px',
                alignItems: 'center'
              }}>
                <span style={{ 
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  {order.date}
                </span>
                <span style={{ 
                  color: '#10b981',
                  fontSize: '16px',
                  fontWeight: 700
                }}>
                  {order.price}
                </span>
              </div>
              
              <button style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px',
                background: '#f0fdf4',
                color: '#10b981',
                border: '1px solid #10b981',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MobileOrdersPage; 