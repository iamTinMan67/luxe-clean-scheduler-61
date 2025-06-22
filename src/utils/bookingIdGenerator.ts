
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
  
  // Generate timestamp
  const timestamp = Date.now();
  
  // Create the booking ID
  const bookingId = `${clientPrefix}${jobPrefix}${timestamp}`;
  
  console.log(`Generated booking ID: ${bookingId} for ${clientType} ${jobType}`);
  
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
  
  return { clientType, jobType, timestamp };
};
