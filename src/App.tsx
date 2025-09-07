import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css'; // Custom toast styling

// Layout Components
import Navbar from './Navbar';
import Footer from './Footer';

// Auth Components
import UserLogin from './UserLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import VendorSignUp from './VendorSignUp';
import CourierSignUp from './CourierSignUp';

// Public Pages
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import RoleSelection from './RoleSelection';
import TermsAndConditions from './TermsAndConditions';
import PlanSelection from './PlanSelection';
import PaymentPage from './PaymentPage';
import SuccessPage from './SuccessPage';
import VendorSuccessPage from './VendorSuccessPage';
import Profile from './pages/Profile';
import UserSignup from './pages/UserSignup';

// Vendor Components
import VendorDashboardLayout from './dashboard/VendorDashboardLayout';
import ResponsiveVendorDashboard from './dashboard/ResponsiveVendorDashboard';
import ResponsiveVendorOrders from './dashboard/ResponsiveVendorOrders';
import MenuPage from './dashboard/MenuPage';
import AddMenuItemPage from './dashboard/AddMenuItemPage';
import ResponsiveEditMenu from './dashboard/ResponsiveEditMenu';
import StockPage from './dashboard/StockPage';
import AnalyticsPage from './dashboard/AnalyticsPage';
import PayoutsPage from './dashboard/PayoutsPage';
import ResponsiveProfilePage from './dashboard/ResponsiveProfilePage';

// Courier Components
import CourierDashboardLayout from './dashboard/CourierDashboardLayout';
import ResponsiveCourierDashboard from './dashboard/ResponsiveCourierDashboard';
import ResponsiveCourierDeliveryList from './dashboard/ResponsiveCourierDeliveryList';
import MobileCourierAnalytics from './dashboard/MobileCourierAnalytics';
import CourierPayout from './dashboard/CourierPayout';
import ResponsiveCourierProfile from './dashboard/ResponsiveCourierProfile';

// User Components
import UserDashboardLayout from './dashboard/UserDashboardLayout';
import ResponsiveDashboardHome from './user/ResponsiveDashboardHome';
import ResponsiveOrders from './user/ResponsiveOrders';
import MobileOrdersPage from './user/MobileOrdersPage';
import ResponsiveOrderDetails from './components/ResponsiveOrderDetails';
import ResponsiveSavedAddresses from './user/ResponsiveSavedAddresses';
import MobileAddAddressPage from './user/MobileAddAddressPage';
import ResponsiveFavorites from './user/ResponsiveFavorites';

import ResponsivePaymentMethods from './user/ResponsivePaymentMethods';
import ResponsiveAddCard from './user/ResponsiveAddCard';
import ResponsiveProfileSettings from './user/ResponsiveProfileSettings';
import RoleBasedRedirect from './components/RoleBasedRedirect';

// Role-based route components
const VendorRoute: React.FC = () => {
  return (
    <ProtectedRoute roles={['vendor', 'admin']}>
      <VendorDashboardLayout />
    </ProtectedRoute>
  );
};

const CourierRoute: React.FC = () => {
  return (
    <ProtectedRoute roles={['courier', 'admin']}>
      <CourierDashboardLayout />
    </ProtectedRoute>
  );
};

const UserRoute: React.FC = () => {
  return (
    <ProtectedRoute roles={['user', 'admin']}>
      <UserDashboardLayout />
    </ProtectedRoute>
  );
};

// Public route component that redirects authenticated users
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    // Redirect based on user role
    const redirectPath = user.role === 'vendor' ? '/vendor/dashboard' : 
                        user.role === 'courier' ? '/courier/deliveries' : 
                        '/user/dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

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
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        limit={3}
        closeButton={false}
      />
      <AuthProvider>
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <PublicRoute>
                <>
                  <main className="main-content">
                    <Outlet />
                  </main>
                  <Footer />
                </>
        
              </PublicRoute>
            }>
                          <Route index element={
              <PublicRoute>
                <>
                  <HeroSection />
                  <HowItWorks />
                  <Testimonials />
                  <FAQ />
                </>
              </PublicRoute>
            } />
            <Route path="role-selection" element={<RoleSelection />} />
            <Route path="plans" element={<PlanSelection />} />
            <Route path="terms" element={<TermsAndConditions />} />
          </Route>
          
          {/* Signup routes without navbar and footer */}
          <Route path="/signup/user" element={
            <PublicRoute>
              <main>
                <UserSignup />
              </main>
            </PublicRoute>
          } />
          <Route path="/signup/vendor" element={
            <PublicRoute>
              <main>
                <VendorSignUp />
              </main>
            </PublicRoute>
          } />
          <Route path="/signup/courier" element={
            <PublicRoute>
              <main>
                <CourierSignUp />
              </main>
            </PublicRoute>
          } />
          
          {/* Login route without navbar */}
          <Route path="/login" element={
            <PublicRoute>
              <main>
                <UserLogin />
              </main>
            </PublicRoute>
          } />
          
          {/* Role-based redirect route */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
          
          {/* Profile route */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Vendor routes */}
          <Route path="/vendor" element={<VendorRoute />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ResponsiveVendorDashboard />} />
            <Route path="orders" element={<ResponsiveVendorOrders />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="menu/add" element={<AddMenuItemPage />} />
            <Route path="menu/edit/:id" element={<ResponsiveEditMenu />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="payouts" element={<PayoutsPage />} />
            <Route path="profile" element={<ResponsiveProfilePage />} />
          </Route>

          {/* Courier routes */}
          <Route path="/courier" element={<CourierRoute />}>
            <Route index element={<Navigate to="deliveries" replace />} />
            <Route path="dashboard" element={<ResponsiveCourierDashboard />} />
            <Route path="deliveries" element={<ResponsiveCourierDeliveryList />} />
            <Route path="analytics" element={<MobileCourierAnalytics />} />
            <Route path="payouts" element={<CourierPayout />} />
            <Route path="profile" element={<ResponsiveCourierProfile />} />
          </Route>

          {/* User routes */}
          <Route path="/user" element={<UserRoute />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ResponsiveDashboardHome />} />
            <Route path="orders" element={<ResponsiveOrders />} />
            <Route path="orders/:id" element={<ResponsiveOrderDetails />} />
            <Route path="addresses" element={<ResponsiveSavedAddresses />} />
            <Route path="addresses/add" element={<MobileAddAddressPage />} />
            <Route path="addresses/edit/:id" element={<MobileAddAddressPage />} />
            <Route path="favorites" element={<ResponsiveFavorites />} />
    
            <Route path="payments" element={<ResponsivePaymentMethods />} />
            <Route path="payments/add" element={<ResponsiveAddCard />} />
            <Route path="settings" element={<ResponsiveProfileSettings />} />
          </Route>

          {/* Other routes */}
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/vendor/success" element={<VendorSuccessPage />} />
          <Route path="/payment" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

