import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import Footer from './Footer';
import RoleSelection from './RoleSelection';
import UserLogin from './UserLogin';
import SignUp from './SignUp';
import VendorSignUp from './VendorSignUp';
import './App.css';
import VendorDashboardLayout from './dashboard/VendorDashboardLayout';
import DashboardHome from './dashboard/DashboardHome';
import OrdersPage from './dashboard/OrdersPage';
import MenuPage from './dashboard/MenuPage';
import StockPage from './dashboard/StockPage';
import AnalyticsPage from './dashboard/AnalyticsPage';
import PayoutsPage from './dashboard/PayoutsPage';
import ProfilePage from './dashboard/ProfilePage';
import PlanSelection from './PlanSelection';
import PaymentPage from './PaymentPage';
import SuccessPage from './SuccessPage';
import UserDashboardLayout from './user/UserDashboardLayout';
import UserDashboardHome from './user/UserDashboardHome';
import UserSavedAddresses from './user/UserSavedAddresses';
import UserFavourites from './user/UserFavourites';
import UserBookings from './user/UserBookings';
import UserPaymentMethods from './user/UserPaymentMethods';
import UserAddCard from './user/UserAddCard';
import CourierSignUp from './CourierSignUp';
import TermsAndConditions from './TermsAndConditions';
import CourierDashboardHome from './dashboard/CourierDashboardHome';
import DeliveryListPage from './dashboard/DeliveryListPage';
import CourierDashboardLayout from './dashboard/CourierDashboardLayout';

function AppContent({ darkMode, toggleDarkMode }: { darkMode: boolean, toggleDarkMode: () => void }) {
  const location = useLocation();
  // Show navbar only on home page for now, but can extend this array for other routes
  const showNavbar = location.pathname === '/';

  return (
    <>
      {showNavbar && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <HowItWorks />
            <Testimonials />
            <FAQ />
            <Footer />
          </>
        } />
        <Route path="/signup" element={<RoleSelection />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/signup/user" element={<SignUp />} />
        <Route path="/signup/vendor" element={<VendorSignUp />} />
        <Route path="/signup/courier" element={<CourierSignUp />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/vendor/plans" element={<PlanSelection />} />
        <Route path="/vendor/success" element={<SuccessPage />} />
        <Route path="/vendor/payment" element={<PaymentPage />} />
        <Route path="/dashboard/*" element={<VendorDashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="payouts" element={<PayoutsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="/courier/*" element={<CourierDashboardLayout />}>
          <Route path="dashboard" element={<CourierDashboardHome />} />
          <Route path="delivery-list" element={<DeliveryListPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="payouts" element={<PayoutsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        {/* User dashboard routes */}
        <Route path="/user/dashboard" element={<UserDashboardLayout />}>
          <Route index element={<UserDashboardHome />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="addresses" element={<UserSavedAddresses />} />
          <Route path="payments" element={<UserPaymentMethods />} />
          <Route path="payments/add" element={<UserAddCard />} />
          <Route path="favorite" element={<UserFavourites />} />
          <Route path="profile" element={<ProfilePage />} />
          {/* Add more user dashboard routes here as needed */}
        </Route>
      </Routes>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  return (
    <BrowserRouter>
      <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </BrowserRouter>
  );
}

export default App;
