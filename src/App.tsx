import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import EditMenuItemPage from './dashboard/EditMenuItemPage';
import AddMenuItemPage from './dashboard/AddMenuItemPage';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login/user" replace />;
  }
  return <>{children}</>;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  useEffect(() => {
    // Remove automatic dark mode detection. Only set dark mode if user toggles it.
    document.documentElement.classList.remove('dark-mode');
    setDarkMode(false);
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={
          <>
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <HeroSection />
            <HowItWorks />
            <Testimonials />
            <FAQ />
            <Footer />
          </>
        } />
        
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/signup/user" element={<SignUp />} />
        <Route path="/signup/vendor" element={<VendorSignUp />} />
        <Route path="/signup/courier" element={<CourierSignUp />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/vendor/plan-selection" element={<PlanSelection />} />
        <Route path="/vendor/payment" element={<PaymentPage />} />
        <Route path="/vendor/success" element={<SuccessPage />} />
        <Route path="/login/user" element={<UserLogin />} />

        <Route path="/vendor/dashboard" element={
          <PrivateRoute>
            <VendorDashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="menu/edit/:id" element={<EditMenuItemPage />} />
          <Route path="menu/add" element={<AddMenuItemPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="payouts" element={<PayoutsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/courier/dashboard" element={
          <PrivateRoute>
            <CourierDashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<CourierDashboardHome />} />
          <Route path="deliveries" element={<DeliveryListPage />} />
        </Route>

        <Route path="/user/dashboard" element={
          <PrivateRoute>
            <UserDashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<UserDashboardHome />} />
          <Route path="addresses" element={<UserSavedAddresses />} />
          <Route path="favourites" element={<UserFavourites />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="payment-methods" element={<UserPaymentMethods />} />
          <Route path="payment-methods/add" element={<UserAddCard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
