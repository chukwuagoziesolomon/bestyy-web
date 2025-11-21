import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const WHATSAPP_LINK = "https://wa.me/2340000000000"; // Replace with actual WhatsApp number if needed

const ChatWithBestie: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const rotatingTexts = [
    'Chat with Bestyy',
    'Hi Bestyy 👋',
    'Need Help? 💬'
  ];

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      const interval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isExpanded, rotatingTexts.length]);

  return (
    <>
      {/* Chat Button */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'fixed',
          right: isMobile ? 16 : 24,
          bottom: isMobile ? 100 : 24, // Higher on mobile to avoid bottom nav
          zIndex: 2000,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 8 : 12,
        }}
      >
        {/* Animated Text Label - Now visible on all screens */}
        {!isExpanded && (
          <div
            style={{
              background: '#ffffff',
              padding: isMobile ? '8px 12px' : '10px 16px',
              borderRadius: 20,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              whiteSpace: 'nowrap',
              animation: 'slideInFromRight 0.5s ease-out',
            }}
          >
            <div
              key={currentTextIndex}
              style={{
                fontSize: isMobile ? 13 : 14,
                fontWeight: 600,
                color: '#059669',
                animation: 'fadeInOut 3s ease-in-out',
              }}
            >
              {rotatingTexts[currentTextIndex]}
            </div>
          </div>
        )}
        
        <div
          style={{
            background: '#25D366',
            color: '#fff',
            borderRadius: '50%',
            width: isMobile ? 56 : 60,
            height: isMobile ? 56 : 60,
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            transform: isExpanded ? 'scale(0.9)' : 'scale(1)',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            if (!isExpanded && !isMobile) {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(37, 211, 102, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isExpanded && !isMobile) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4)';
            }
          }}
        >
          {isExpanded ? (
            <X size={24} />
          ) : (
            <svg
              width={isMobile ? "28" : "32"}
              height={isMobile ? "28" : "32"}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27.3 4.6C24.3 1.6 20.3 0 16 0C7.2 0 0 7.2 0 16C0 18.8 0.8 21.5 2.2 23.8L0 32L8.4 29.8C10.6 31.1 13.3 31.8 16 31.8C24.8 31.8 32 24.6 32 15.8C32 11.5 30.3 7.5 27.3 4.6ZM16 29.1C13.6 29.1 11.3 28.5 9.3 27.3L8.8 27L3.8 28.3L5.1 23.4L4.7 22.9C3.4 20.8 2.7 18.4 2.7 16C2.7 8.7 8.7 2.7 16 2.7C19.5 2.7 22.8 4 25.3 6.5C27.8 9 29.1 12.3 29.1 15.8C29.3 23.3 23.3 29.1 16 29.1ZM23.3 19.3C22.9 19.1 21 18.2 20.6 18C20.3 17.9 20 17.8 19.8 18.2C19.5 18.6 18.8 19.5 18.6 19.7C18.4 20 18.1 20 17.7 19.8C17.3 19.6 16 19.1 14.5 17.8C13.3 16.8 12.5 15.5 12.3 15.1C12.1 14.7 12.3 14.5 12.5 14.3C12.7 14.1 12.9 13.8 13.1 13.6C13.3 13.4 13.4 13.3 13.5 13.1C13.6 12.8 13.6 12.6 13.5 12.4C13.4 12.2 12.5 10.3 12.2 9.5C11.9 8.7 11.6 8.8 11.4 8.8H10.7C10.5 8.8 10.1 8.9 9.8 9.3C9.4 9.7 8.5 10.6 8.5 12.5C8.5 14.4 9.9 16.2 10.1 16.5C10.3 16.8 12.5 20.1 15.8 21.8C16.6 22.2 17.2 22.4 17.7 22.6C18.5 22.9 19.2 22.8 19.8 22.7C20.5 22.6 22 21.8 22.3 20.9C22.7 20 22.7 19.2 22.6 19.1C22.5 19.1 23.7 19.5 23.3 19.3Z"
                fill="white"
              />
            </svg>
          )}
          
          {/* Pulse animation ring */}
          {!isExpanded && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                border: '2px solid #25D366',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          )}
        </div>
      </div>

      {/* Expanded Chat Card */}
      {isExpanded && (
        <div
          style={{
            position: 'fixed',
            right: isMobile ? 16 : 24,
            bottom: isMobile ? 145 : 100,
            zIndex: 1999,
            width: isMobile ? 'calc(100vw - 32px)' : 320,
            maxWidth: isMobile ? 'calc(100vw - 32px)' : 320,
            background: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '20px',
              color: 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <img
                  src="/logo.png"
                  alt="Bestyy"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>Bestyy Support</div>
                <div style={{ fontSize: 13, opacity: 0.9 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#4ade80',
                    marginRight: 6,
                  }} />
                  Online now
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div style={{ padding: '24px 20px' }}>
            <div
              style={{
                background: '#f3f4f6',
                padding: '16px',
                borderRadius: 12,
                marginBottom: 16,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -6,
                  left: 20,
                  width: 12,
                  height: 12,
                  background: '#f3f4f6',
                  transform: 'rotate(45deg)',
                }}
              />
              <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
                Hi there! 👋<br />
                <br />
                Need help with your order or have questions? We're here to assist you!
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>
                Quick Help
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: '📦', text: 'Track Order' },
                  { icon: '🍽️', text: 'Menu Issues' },
                  { icon: '💳', text: 'Payment Help' },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px 14px',
                      background: '#f9fafb',
                      borderRadius: 8,
                      fontSize: 14,
                      color: '#374151',
                      cursor: 'pointer',
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0fdf4';
                      e.currentTarget.style.borderColor = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    <span style={{ marginRight: 8 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Button */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: '#25D366',
                color: 'white',
                padding: '14px',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 15,
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
              }}
            >
              <Send size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Add animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0;
            transform: scale(1.5);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-5px);
          }
        }
      `}</style>
    </>
  );
};

export default ChatWithBestie;




