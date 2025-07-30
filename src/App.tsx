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
import ResponsiveVendorDashboard from './dashboard/ResponsiveVendorDashboard';
import ResponsiveOrders from './dashboard/ResponsiveOrders';
import ResponsiveMenu from './dashboard/ResponsiveMenu';
import ResponsiveStock from './dashboard/ResponsiveStock';
import ResponsiveAddMenu from './dashboard/ResponsiveAddMenu';
import ResponsiveAnalytics from './dashboard/ResponsiveAnalytics';
import ResponsivePayout from './dashboard/ResponsivePayout';
import CourierDashboard from './dashboard/CourierDashboard';
import CourierDeliveryList from './dashboard/CourierDeliveryList';
import CourierAnalytics from './dashboard/CourierAnalytics';
import CourierPayout from './dashboard/CourierPayout';
import CourierProfile from './dashboard/CourierProfile';
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
import VendorSuccessPage from './VendorSuccessPage';
import UserDashboardLayout from './user/UserDashboardLayout';
import ResponsiveDashboardHome from './user/ResponsiveDashboardHome';
import ResponsiveSavedAddresses from './user/ResponsiveSavedAddresses';
import ResponsiveFavorites from './user/ResponsiveFavorites';
import ResponsiveBookings from './user/ResponsiveBookings';
import ResponsivePaymentMethods from './user/ResponsivePaymentMethods';
import ResponsiveAddCard from './user/ResponsiveAddCard';
import ResponsiveProfileSettings from './user/ResponsiveProfileSettings';
import CourierSignUp from './CourierSignUp';
import TermsAndConditions from './TermsAndConditions';
import CourierDashboardHome from './dashboard/CourierDashboardHome';
import DeliveryListPage from './dashboard/DeliveryListPage';
import CourierDashboardLayout from './dashboard/CourierDashboardLayout';
import MobileOrdersPage from './user/MobileOrdersPage';
import MobileAddAddressPage from './user/MobileAddAddressPage';
import ResponsiveOrderDetails from './components/ResponsiveOrderDetails';
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
        <Route path="/vendor/signup-success" element={<VendorSuccessPage />} />
        <Route path="/login/user" element={<UserLogin />} />

        <Route path="/vendor/dashboard" element={
          <PrivateRoute>
            <VendorDashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<ResponsiveVendorDashboard />} />
          <Route path="orders" element={<ResponsiveOrders />} />
          <Route path="menu" element={<ResponsiveMenu />} />
          <Route path="menu/edit/:id" element={<EditMenuItemPage />} />
          <Route path="menu/add" element={<ResponsiveAddMenu />} />
          <Route path="stock" element={<ResponsiveStock />} />
          <Route path="analytics" element={<ResponsiveAnalytics />} />
          <Route path="payout" element={<ResponsivePayout />} />
          <Route path="profile" element={<ResponsiveProfileSettings />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="payouts" element={<PayoutsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/courier" element={
          <PrivateRoute>
            <CourierDashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/courier/dashboard" replace />} />
          <Route path="dashboard" element={<CourierDashboard />} />
          <Route path="delivery-list" element={<CourierDeliveryList />} />
          <Route path="analytics" element={<CourierAnalytics />} />
          <Route path="payouts" element={<CourierPayout />} />
          <Route path="profile" element={<CourierProfile />} />
        </Route>

        <Route path="/user/dashboard" element={
          <PrivateRoute>
            <UserDashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<ResponsiveDashboardHome />} />
          <Route path="orders" element={<MobileOrdersPage />} />
          <Route path="orders/:orderId" element={<ResponsiveOrderDetails />} />
          <Route path="addresses" element={<ResponsiveSavedAddresses />} />
          <Route path="addresses/add" element={<MobileAddAddressPage />} />
          <Route path="favorite" element={<ResponsiveFavorites />} />
          <Route path="bookings" element={<ResponsiveBookings />} />
          <Route path="payment-methods" element={<ResponsivePaymentMethods />} />
          <Route path="payment-methods/add" element={<ResponsiveAddCard />} />
          <Route path="profile" element={<ResponsiveProfileSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
