import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Home, ShoppingBag, Heart, Clock, CreditCard, User, MapPin } from 'lucide-react';

interface UserDashboardLayoutProps {
  children?: ReactNode;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout;
