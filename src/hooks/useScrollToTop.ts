
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook to scroll to top when navigating between pages
export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo(0, 0);
  }, [location.pathname]);
};

// Hook specifically for admin pages with enhanced behavior
export const useAdminScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top with smooth behavior for admin pages
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);
};
