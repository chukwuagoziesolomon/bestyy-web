import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, ShoppingBag, User, Bell, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './UserDashboard.css';

const UserDashboardLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="user-dashboard">
      <Sidebar />
      <main>
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <Link to="/user/dashboard" className={`nav-item ${isActive('/user/dashboard')}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link to="/user/orders" className={`nav-item ${isActive('/user/orders')}`}>
          <ShoppingBag size={20} />
          <span>Orders</span>
        </Link>
        <Link to="/user/notifications" className={`nav-item ${isActive('/user/notifications')}`}>
          <Bell size={20} />
          <span>Alerts</span>
        </Link>
        <Link to="/user/profile" className={`nav-item ${isActive('/user/profile')}`}>
          <User size={20} />
          <span>Account</span>
        </Link>
      </nav>
    </div>
  );
};

export default UserDashboardLayout;