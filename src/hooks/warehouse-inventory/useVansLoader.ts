
import { useState, useEffect } from "react";
import { Van } from "@/types/vanInventory";

export default function useVansLoader() {
  const [vans, setVans] = useState<Van[]>([]);

  useEffect(() => {
    // Load vans from localStorage
    const savedVans = localStorage.getItem('vans');
    if (savedVans) {
      try {
        const parsedVans = JSON.parse(savedVans);
        setVans(parsedVans);
      } catch (error) {
        console.error('Error parsing vans:', error);
        // Set default vans if error
        const defaultVans = getDefaultVans();
        setVans(defaultVans);
        localStorage.setItem('vans', JSON.stringify(defaultVans));
      }
    } else {
      // Set default vans if none exists
      const defaultVans = getDefaultVans();
      setVans(defaultVans);
      localStorage.setItem('vans', JSON.stringify(defaultVans));
    }
  }, []);

  const getDefaultVans = (): Van[] => {
    return [
      { id: "1", registration: "AB12 CDE", name: "Van 1" },
      { id: "2", registration: "FG34 HIJ", name: "Van 2" },
    ];
  };

  return { vans };
}
