import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useResponsive } from './hooks/useResponsive';
import './UserLogin.css';

const PlanSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isTablet } = useResponsive();

  // Determine user type from location state or default to vendor
  const userType = location.state?.userType || 'vendor';

  // Mobile/Tablet Layout
  if (isMobile || isTablet) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: isTablet ? '768px' : '414px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 16px',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderBottom: '1px solid #e9ecef'
        }}>
          <ArrowLeft
            size={24}
            color="#333"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(-1)}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '24px 20px' }}>
          {/* Title */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            textAlign: 'left',
            marginBottom: '12px',
            color: '#212529',
            lineHeight: '1.2'
          }}>
            Choose the <span style={{ color: '#10b981' }}>Plan</span> That Grows With You
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '16px',
            color: '#6c757d',
            lineHeight: '1.5',
            marginBottom: '32px',
            fontWeight: '400'
          }}>
            "Unlock more visibility, badges, and insights with Bestie Pro or keep it simple with Free. You can change anytime from your dashboard."
          </p>

          {/* Free Plan Card */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '8px',
              color: '#212529'
            }}>
              Free Plan
            </h2>

            <p style={{
              fontSize: '14px',
              color: '#6c757d',
              textAlign: 'center',
              marginBottom: '20px',
              fontWeight: '500'
            }}>
              Best for testing the waters
            </p>

            <div style={{
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <span style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#212529'
              }}>
                $0
              </span>
              <span style={{
                fontSize: '16px',
                color: '#6c757d',
                marginLeft: '4px'
              }}>
                /month
              </span>
            </div>

            {/* Features */}
            <div style={{ marginBottom: '24px' }}>
              {[
                'Accept Unlimited Orders',
                'Receive Payout Via Bestie',
                'Basic Dashboard Access'
              ].map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    flexShrink: 0
                  }}>
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>✓</span>
                  </div>
                  <span style={{
                    fontSize: '16px',
                    color: '#212529',
                    fontWeight: '500'
                  }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/vendor/signup-success')}
              style={{
                width: '100%',
                padding: '16px',
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#495057',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e9ecef';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
              }}
            >
              Get Started For Free
            </button>
          </div>

          {/* Bestie Pro Card */}
          <div style={{
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '8px',
              color: '#fff'
            }}>
              Bestie Pro
            </h2>

            <p style={{
              fontSize: '14px',
              color: '#bdc3c7',
              textAlign: 'center',
              marginBottom: '20px',
              fontWeight: '500'
            }}>
              Best for testing the waters
            </p>

            <div style={{
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <span style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#fff'
              }}>
                $0
              </span>
              <span style={{
                fontSize: '16px',
                color: '#bdc3c7',
                marginLeft: '4px'
              }}>
                /month
              </span>
            </div>

            {/* Features */}
            <div style={{ marginBottom: '24px' }}>
              {[
                'Priority Listing',
                'Pro vendor Badge'
              ].map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    flexShrink: 0
                  }}>
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>✓</span>
                  </div>
                  <span style={{
                    fontSize: '16px',
                    color: '#fff',
                    fontWeight: '500'
                  }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/vendor/payment')}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(90deg, #34e7e4 0%, #10b981 100%)',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout (existing)
  return (
    <div style={{ minHeight: '100vh', background: '#fafbfb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 0 2.5rem 0' }}>
      <h2 style={{ fontWeight: 900, fontSize: '2.5rem', textAlign: 'center', marginBottom: '1.1rem', letterSpacing: '-1px' }}>
        Choose the <span style={{ color: '#10b981' }}>Plan</span> That<br />Grows With You
      </h2>
      <h3 style={{ fontWeight: 500, color: '#444', marginBottom: '2.7rem', fontSize: '1.18rem', textAlign: 'center', maxWidth: 600 }}>
        Unlock more visibility, badges, and insights with Bestie Pro or keep it simple with Free. You can change anytime from your dashboard.
      </h3>
      <div className="plan-cards-row">
        <div className="plan-card plan-card--free">
          <div className="plan-card__title">Free Plan</div>
          <div className="plan-card__desc">Best for testing the waters</div>
          <div className="plan-card__price">$0 <span className="plan-card__per">/month</span></div>
          <ul className="plan-card__features">
            <li><span className="plan-card__check">✔</span> Accept Unlimited Orders</li>
            <li><span className="plan-card__check">✔</span> Receive Payout Via Bestie</li>
            <li><span className="plan-card__check">✔</span> Basic Dashboard Access</li>
          </ul>
          <button className="plan-card__cta plan-card__cta--free" onClick={() => navigate('/vendor/signup-success')}>Get Started For Free</button>
        </div>
        <div className="plan-card plan-card--pro">
          <div className="plan-card__title">Bestie Pro</div>
          <div className="plan-card__desc">Best for testing the waters</div>
          <div className="plan-card__price">$0 <span className="plan-card__per">/month</span></div>
          <ul className="plan-card__features">
            <li><span className="plan-card__check">✔</span> Priority Listing</li>
            <li><span className="plan-card__check">✔</span> Pro vendor Badge</li>
            <li><span className="plan-card__check">✔</span> Weekly Sales Insight</li>
            <li><span className="plan-card__check">✔</span> Early Access to New Features</li>
            <li><span className="plan-card__check">✔</span> Premium Support line</li>
          </ul>
          <button className="plan-card__cta plan-card__cta--pro" onClick={() => navigate('/vendor/payment')}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection; 