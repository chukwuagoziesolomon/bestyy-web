import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Clock, Bike, ChevronDown, Home, List, Utensils, Table } from 'lucide-react';
import { fetchDashboardAnalytics, fetchVendorOrders } from '../api';
import { showError } from '../toast';
import SalesLineChart from '../components/SalesLineChart';

interface Analytics {
  todays_order: number;
  total_sales: number;
  total_pending: number;
  delivery_time: string;
  sales_chart: Array<{ label: string; sales: number }>;
}

interface Order {
  id: string;
  customer_name: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const MobileVendorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('July');
  
  // Get business info from localStorage
  let businessName = 'Silver';
  let profileImage = '/user1.png';
  const savedVendor = localStorage.getItem('vendor_profile');
  if (savedVendor) {
    try {
      const vendor = JSON.parse(savedVendor);
      businessName = vendor.business_name || 'Silver';
      profileImage = vendor.logo || '/user1.png';
    } catch (e) {}
  }

  const token = localStorage.getItem('vendor_token');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (token) {
          const [analyticsData, ordersData] = await Promise.all([
            fetchDashboardAnalytics(token),
            fetchVendorOrders(token)
          ]);
          setAnalytics(analyticsData);
          setOrders(ordersData.orders || ordersData || []);
        }
      } catch (err: any) {
        showError(err.message || 'Could not fetch data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  const statsCards = [
    {
      title: "Today's Order",
      value: analytics?.todays_order || 50,
      icon: <Package size={24} color="#10b981" />,
      trend: "1.3% Up from past week",
      isPositive: true
    },
    {
      title: "Total Sales",
      value: analytics?.total_sales ? `₦${analytics.total_sales.toLocaleString()}` : "50,000",
      icon: <TrendingUp size={24} color="#10b981" />,
      trend: "1.3% Up from past week",
      isPositive: true
    },
    {
      title: "Total Pending",
      value: analytics?.total_pending || 50,
      icon: <Clock size={24} color="#10b981" />,
      trend: "1.3% Up from past week",
      isPositive: true
    },
    {
      title: "Delivery",
      value: 50,
      icon: <Bike size={24} color="#10b981" />,
      trend: "1.3% Up from past week",
      isPositive: true
    }
  ];

  // Prepare chart data for SalesLineChart
  const salesData = analytics?.sales_chart?.map((d: any) => ({ name: d.label, value: d.sales })) || [
    { name: '5k', value: 20 },
    { name: '10k', value: 45 },
    { name: '15k', value: 50 },
    { name: '20k', value: 64.3664 },
    { name: '25k', value: 45 },
    { name: '30k', value: 60 },
    { name: '35k', value: 20 },
    { name: '40k', value: 35 },
    { name: '45k', value: 75 },
    { name: '50k', value: 55 },
    { name: '55k', value: 55 },
    { name: '60k', value: 60 }
  ];

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
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          margin: 0,
          color: '#1f2937'
        }}>
          Welcome Back, {businessName} !
        </h1>
        <img 
          src={profileImage}
          alt="Profile"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Stats Cards */}
      <div style={{
        padding: '24px 16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        {statsCards.map((card, index) => (
          <div key={index} style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px 16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              {card.title}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#1f2937'
              }}>
                {card.value}
              </span>
              {card.icon}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: card.isPositive ? '#10b981' : '#ef4444'
            }}>
              <TrendingUp size={12} />
              {card.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Sales Details Chart */}
      <div style={{
        margin: '0 16px 24px'
      }}>
        <SalesLineChart
          data={salesData}
          label="Sales Details"
          height={200}
          defaultMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* New Orders */}
      <div style={{
        margin: '0 16px 24px',
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          margin: '0 0 16px 0',
          color: '#1f2937'
        }}>
          New Orders
        </h3>
        
        {/* Sample Order */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '4px'
            }}>
              #00001
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1f2937'
            }}>
              Name
            </div>
            <div style={{
              fontSize: '16px',
              color: '#1f2937',
              marginTop: '4px'
            }}>
              Christine Brooks
            </div>
          </div>
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600
          }}>
            Rejected
          </div>
        </div>
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
            active: true,
            onClick: () => {}
          },
          {
            icon: <List size={20} />,
            label: 'Order List',
            active: false,
            onClick: () => navigate('/vendor/dashboard/orders')
          },
          {
            icon: <Utensils size={20} />,
            label: 'Menu',
            active: false,
            onClick: () => navigate('/vendor/dashboard/menu')
          },
          {
            icon: <Table size={20} />,
            label: 'Item Stock',
            active: false,
            onClick: () => navigate('/vendor/dashboard/stock')
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

export default MobileVendorDashboard;
