import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import HamburgerMenu from '../components/HamburgerMenu';
import { useResponsive } from '../hooks/useResponsive';

// Sample booking data
const bookings = [
  {
    id: 1,
    hotel: 'Eko Hotel',
    checkIn: 'Jun 29-30, 2025',
    checkOut: 'Jun 29-30, 2025',
    price: '₦ 100,999',
    status: 'Confirmed',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    hotel: 'Five Hotel',
    checkIn: 'Jul 15-16, 2025',
    checkOut: 'Jul 15-16, 2025',
    price: '₦ 85,000',
    status: 'Confirmed',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop'
  }
];

const MobileBookingsPage = () => {
  const navigate = useNavigate();
  const { isTablet } = useResponsive();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: isTablet ? '768px' : '414px', // Tablet: 768px, Mobile: 414px
      margin: '0 auto',
      position: 'relative',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e9ecef',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          margin: 0,
          color: '#212529'
        }}>
          My Bookings
        </h1>
        <HamburgerMenu size={24} color="#6c757d" />
      </div>

      {/* Description */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        marginBottom: '16px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#6c757d',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp
        </p>
      </div>

      {/* Bookings List */}
      <div style={{ padding: '0 20px' }}>
        {bookings.map((booking) => (
          <div key={booking.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            marginBottom: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Hotel Image with Navigation */}
            <div style={{
              position: 'relative',
              height: '200px',
              overflow: 'hidden'
            }}>
              <img 
                src={booking.image} 
                alt={booking.hotel}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <button style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <ChevronLeft size={20} color="#6c757d" />
              </button>
              <button style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <ChevronRight size={20} color="#6c757d" />
              </button>
            </div>

            {/* Booking Details */}
            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                    color: '#212529'
                  }}>
                    {booking.hotel}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6c757d',
                    margin: '0 0 4px 0'
                  }}>
                    {booking.checkIn}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#6c757d',
                    margin: 0
                  }}>
                    {booking.checkOut}
                  </p>
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#20c997'
                }}>
                  {booking.price}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px'
              }}>
                <span style={{
                  backgroundColor: '#20c997',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {booking.status}
                </span>
                <button style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#6c757d',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0
                }}>
                  View Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default MobileBookingsPage;
