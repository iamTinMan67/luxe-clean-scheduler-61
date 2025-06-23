
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useTrackingNavigation = (
  sessionExpired: boolean,
  isLoading: boolean,
  booking: any,
  error: string | null
) => {
  const navigate = useNavigate();

  // Redirect handlers
  useEffect(() => {
    if (sessionExpired) {
      navigate("/track");
    }
  }, [sessionExpired, navigate]);

  useEffect(() => {
    if (!isLoading && !booking && !error) {
      navigate("/track");
    }
  }, [isLoading, booking, error, navigate]);
};
