import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useResponsive } from './hooks/useResponsive';
import { checkSubscriptionStatus } from './api';
import './UserLogin.css';

const PlanSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isTablet } = useResponsive();
  const [user, setUser] = useState<any>(null);

  // Check user authentication and subscription status
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      checkSubscriptionStatus(token).then(data => {
        if (data.success) {
          setUser({
            is_featured: data.subscription?.is_featured || false,
            subscription_status: data.subscription?.subscription_status || 'inactive',
            email: data.user?.email || ''
          });
        }
      }).catch(err => {
        console.error('Failed to check subscription status:', err);
      });
    }
  }, []);

  // Determine user type from location state or default to vendor
  const userType = location.state?.userType || 'vendor';

  // Handle subscription payment
  const handleSubscribe = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please log in to subscribe');
      navigate('/login');
      return;
    }

    // Redirect to Paystack payment link
    window.location.href = 'https://paystack.shop/pay/0smh6o1dzz';
  };


  // Hardcoded plans data
  const plans = [
    {
      id: 1,
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      currency: 'NGN',
      interval: 'month',
      plan_type: 'free',
      features: [
        'Basic visibility',
        'Limited badges',
        'Standard support'
      ]
    },
    {
      id: 2,
      name: 'Bestie Pro',
      description: 'Unlock premium features',
      price: 5000,
      currency: 'NGN',
      interval: 'month',
      plan_type: 'pro',
      features: [
        'Enhanced visibility',
        'Premium badges',
        'Advanced insights',
        'Priority support'
      ]
    }
  ];




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
            fontWeight: 400
          }}>
            "Unlock more visibility, badges, and insights with Bestie Pro or keep it simple with Free. You can change anytime from your dashboard."
          </p>

          {plans.map((plan) => (
              <div key={plan.id} style={{
                background: plan.plan_type === 'free' ? '#fff' : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
                boxShadow: plan.plan_type === 'free' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 16px rgba(0,0,0,0.2)',
                border: plan.plan_type === 'free' ? '1px solid #e9ecef' : 'none',
                color: plan.plan_type === 'free' ? '#212529' : '#fff'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: '8px',
                  color: plan.plan_type === 'free' ? '#212529' : '#fff'
                }}>
                  {plan.name}
                </h2>

                <p style={{
                  fontSize: '14px',
                  color: plan.plan_type === 'free' ? '#6c757d' : '#bdc3c7',
                  textAlign: 'center',
                  marginBottom: '20px',
                  fontWeight: 500
                }}>
                  {plan.description}
                </p>

                <div style={{
                  textAlign: 'center',
                  marginBottom: '24px'
                }}>
                  <span style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    color: plan.plan_type === 'free' ? '#212529' : '#fff'
                  }}>
                    {plan.currency === 'NGN' ? '₦' : '$'}{plan.price.toLocaleString()}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    color: plan.plan_type === 'free' ? '#6c757d' : '#bdc3c7',
                    marginLeft: '4px'
                  }}>
                    /{plan.interval}
                  </span>
                </div>

                {/* Features */}
                <div style={{ marginBottom: '24px' }}>
                  {plan.features.map((feature: string, index: number) => (
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
                        color: plan.plan_type === 'free' ? '#212529' : '#fff',
                        fontWeight: 500
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (plan.plan_type === 'free') {
                      // Navigate to dashboard based on user type
                      const dashboardPath = userType === 'courier' ? '/courier/dashboard' :
                                           userType === 'vendor' ? '/vendor/dashboard' :
                                           '/user/dashboard';
                      navigate(dashboardPath);
                    } else {
                      // For Pro plan, initiate subscription payment
                      handleSubscribe();
                    }
                  }}
                  disabled={false}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: plan.plan_type === 'free' ? '#f8f9fa' : 'linear-gradient(90deg, #34e7e4 0%, #10b981 100%)',
                    border: plan.plan_type === 'free' ? '1px solid #e9ecef' : 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: plan.plan_type === 'free' ? '#495057' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: plan.plan_type === 'free' ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                  onMouseEnter={(e) => {
                    if (plan.plan_type === 'free') {
                      e.currentTarget.style.background = '#e9ecef';
                    } else if (plan.plan_type !== 'free') {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.plan_type === 'free') {
                      e.currentTarget.style.background = '#f8f9fa';
                    } else if (plan.plan_type !== 'free') {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                    }
                  }}
                >
                  {plan.plan_type === 'free' ? 'Get Started For Free' : 'Subscribe Now'}
                </button>
              </div>
            ))
          }
        </div>
      </div>
    );
  }



  // Desktop Layout (existing)
  return (
    <>
      <div style={{ minHeight: '100vh', background: '#fafbfb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 0 2.5rem 0' }}>
        <h2 style={{ fontWeight: 900, fontSize: '2.5rem', textAlign: 'center', marginBottom: '1.1rem', letterSpacing: '-1px' }}>
          Choose the <span style={{ color: '#10b981' }}>Plan</span> That<br />Grows With You
        </h2>
        <h3 style={{ fontWeight: 500, color: '#444', marginBottom: '2.7rem', fontSize: '1.18rem', textAlign: 'center', maxWidth: 600 }}>
          Unlock more visibility, badges, and insights with Bestie Pro or keep it simple with Free. You can change anytime from your dashboard.
        </h3>

        <div className="plan-cards-row">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.plan_type === 'free' ? 'plan-card--free' : 'plan-card--pro'}`}>
              <div className="plan-card__title">{plan.name}</div>
              <div className="plan-card__desc">{plan.description}</div>
              <div className="plan-card__price">
                {plan.currency === 'NGN' ? '₦' : '$'}{plan.price.toLocaleString()} <span className="plan-card__per">/{plan.interval}</span>
              </div>
              <ul className="plan-card__features">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index}><span className="plan-card__check">✔</span> {feature}</li>
                ))}
              </ul>
              <button
                className={`plan-card__cta ${plan.plan_type === 'free' ? 'plan-card__cta--free' : 'plan-card__cta--pro'}`}
                onClick={() => {
                  if (plan.plan_type === 'free') {
                    // Navigate to dashboard based on user type
                    const dashboardPath = userType === 'courier' ? '/courier/dashboard' :
                                         userType === 'vendor' ? '/vendor/dashboard' :
                                         '/user/dashboard';
                    navigate(dashboardPath);
                  } else {
                    // For Pro plan, initiate subscription payment
                    handleSubscribe();
                  }
                }}
                disabled={false}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                {plan.plan_type === 'free' ? 'Get Started For Free' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default PlanSelection;