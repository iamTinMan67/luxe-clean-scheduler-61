
export const parseBookingDate = (dateInput: any): Date | null => {
  console.log("Parsing date input:", dateInput, "Type:", typeof dateInput);
  
  try {
    // Handle null/undefined
    if (!dateInput) {
      console.log("Date input is null/undefined");
      return null;
    }

    // Handle Date object
    if (dateInput instanceof Date) {
      console.log("Date is already a Date object:", dateInput);
      return dateInput;
    }

    // Handle ISO string
    if (typeof dateInput === 'string') {
      console.log("Date is string, parsing:", dateInput);
      const parsed = new Date(dateInput);
      console.log("Parsed string date:", parsed);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Handle complex nested object structure
    if (typeof dateInput === 'object') {
      console.log("Date is object, checking nested structure");
      
      // Check for nested value.iso structure
      if (dateInput.value && dateInput.value.iso) {
        console.log("Found nested value.iso:", dateInput.value.iso);
        const parsed = new Date(dateInput.value.iso);
        console.log("Parsed nested iso date:", parsed);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      
      // Check for direct iso property
      if (dateInput.iso) {
        console.log("Found direct iso:", dateInput.iso);
        const parsed = new Date(dateInput.iso);
        console.log("Parsed direct iso date:", parsed);
        return isNaN(parsed.getTime()) ? null : parsed;
      }

      // Check for value property with timestamp
      if (dateInput.value && typeof dateInput.value === 'number') {
        console.log("Found timestamp value:", dateInput.value);
        const parsed = new Date(dateInput.value);
        console.log("Parsed timestamp date:", parsed);
        return isNaN(parsed.getTime()) ? null : parsed;
      }

      // Try to convert object to string and parse
      const dateStr = dateInput.toString();
      if (dateStr !== '[object Object]') {
        console.log("Converting object to string:", dateStr);
        const parsed = new Date(dateStr);
        console.log("Parsed object string date:", parsed);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
    }

    console.log("Could not parse date:", dateInput);
    return null;
  } catch (error) {
    console.error("Error parsing date:", error, dateInput);
    return null;
  }
};

export const isSameDay = (bookingDate: any, targetDate: Date): boolean => {
  const parsedDate = parseBookingDate(bookingDate);
  if (!parsedDate) {
    console.log("Could not parse booking date for comparison");
    return false;
  }
  
  const isSame = parsedDate.toDateString() === targetDate.toDateString();
  console.log("Date comparison:", {
    bookingDate: parsedDate.toDateString(),
    targetDate: targetDate.toDateString(),
    isSame
  });
  
  return isSame;
};

export const getTodayString = (): string => {
  const today = new Date();
  return today.toDateString();
};
