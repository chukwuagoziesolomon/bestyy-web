/*
  PREMIUM LOADING ANIMATION USAGE GUIDE
  
  This beautiful loading animation has been created with your project's colors (green, cyan, purple).
  It features:
  - Animated ring with gradient
  - Floating particles
  - Pulsing center dot
  - Animated background orbs
  - Bouncing dots with fade text
  - Fully responsive design
  
  HOW TO USE IT:
  
  1. In your page or component, import it:
     import PremiumLoadingAnimation from '../components/PremiumLoadingAnimation';
  
  2. Use it while loading:
     
     const MyComponent = () => {
       const [isLoading, setIsLoading] = useState(true);
       
       useEffect(() => {
         // Simulate loading
         setTimeout(() => setIsLoading(false), 2000);
       }, []);
       
       if (isLoading) {
         return <PremiumLoadingAnimation message="Fetching your orders..." />;
       }
       
       return <div>Your content here</div>;
     };
  
  3. For full-screen loading (like login pages):
     <PremiumLoadingAnimation 
       message="Signing in..." 
       fullScreen={true} 
     />
  
  EXAMPLES IN YOUR PROJECT:
  
  - In UnifiedSignUp.tsx while creating account
  - In ProtectedRoute.tsx instead of just a spinner
  - In SuccessPage.tsx during redirect
  - In UserDashboard.tsx while fetching orders
  - In Checkout.tsx while processing payment
  
  Custom messages:
  - "Loading your dashboard..."
  - "Processing your order..."
  - "Verifying your details..."
  - "Setting up your profile..."
  - "Fetching restaurants..."
  - "Updating your cart..."
*/

// Example implementation in a component:
/*
import { useState, useEffect } from 'react';
import PremiumLoadingAnimation from '../components/PremiumLoadingAnimation';

export const MyDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Your API call
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return <PremiumLoadingAnimation message="Loading your dashboard..." />;
  }

  return (
    <div>
      {/* Your dashboard content */}
    </div>
  );
};
*/
