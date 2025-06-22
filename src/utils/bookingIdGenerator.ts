
export const generateBookingId = (clientType: "private" | "corporate", jobType: string): string => {
  // Get the client prefix
  const clientPrefix = clientType === "private" ? "P" : "C";
  
  // Get the job type prefix
  let jobPrefix = "";
  switch (jobType.toLowerCase()) {
    case "car":
      jobPrefix = "C";
      break;
    case "van":
      jobPrefix = "V";
      break;
    case "other":
    default:
      jobPrefix = "O";
      break;
  }
  
  // Generate short date format: YYMMDDHHMM
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month (01-12)
  const day = now.getDate().toString().padStart(2, '0'); // Day (01-31)
  const hour = now.getHours().toString().padStart(2, '0'); // Hour (00-23)
  const minute = now.getMinutes().toString().padStart(2, '0'); // Minute (00-59)
  
  const shortTimestamp = `${year}${month}${day}${hour}${minute}`;
  
  // Create the booking ID
  const bookingId = `${clientPrefix}${jobPrefix}${shortTimestamp}`;
  
  console.log(`Generated booking ID: ${bookingId} for ${clientType} ${jobType}`);
  console.log(`Short timestamp format: ${shortTimestamp} (YYMMDDHHMM)`);
  
  return bookingId;
};

// Helper function to parse booking ID components
export const parseBookingId = (bookingId: string) => {
  if (bookingId.length < 3) {
    return { clientType: "unknown", jobType: "unknown", timestamp: "" };
  }
  
  const clientPrefix = bookingId[0];
  const jobPrefix = bookingId[1];
  const timestamp = bookingId.substring(2);
  
  const clientType = clientPrefix === "P" ? "private" : clientPrefix === "C" ? "commercial" : "unknown";
  
  let jobType = "unknown";
  switch (jobPrefix) {
    case "C":
      jobType = "car";
      break;
    case "V":
      jobType = "van";
      break;
    case "O":
      jobType = "other";
      break;
  }
  
  // Parse the short timestamp format (YYMMDDHHMM) if it's 10 digits
  let parsedDate = null;
  if (timestamp.length === 10) {
    const year = 2000 + parseInt(timestamp.substring(0, 2));
    const month = parseInt(timestamp.substring(2, 4)) - 1; // Month is 0-indexed in Date
    const day = parseInt(timestamp.substring(4, 6));
    const hour = parseInt(timestamp.substring(6, 8));
    const minute = parseInt(timestamp.substring(8, 10));
    
    parsedDate = new Date(year, month, day, hour, minute);
  }
  
  return { 
    clientType, 
    jobType, 
    timestamp,
    parsedDate,
    readableDate: parsedDate ? parsedDate.toLocaleString() : "Unknown date"
  };
};
