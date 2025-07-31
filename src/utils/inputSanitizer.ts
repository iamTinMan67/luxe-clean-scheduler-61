// Input sanitization utilities to prevent XSS attacks

/**
 * Escapes HTML special characters to prevent XSS
 */
export const escapeHtml = (unsafe: string | null | undefined): string => {
  if (!unsafe) return '';
  
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format (UK format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitizes user input for safe display
 */
export const sanitizeUserInput = (input: string | null | undefined): string => {
  if (!input) return '';
  
  // Remove any potential script tags or dangerous content
  const cleaned = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  
  return escapeHtml(cleaned);
};

/**
 * Validates and sanitizes booking form data
 */
export interface BookingFormData {
  yourName: string;
  email: string;
  phone: string;
  postcode: string;
  jobDetails: string;
  notes?: string;
}

export const validateAndSanitizeBookingData = (data: BookingFormData): {
  isValid: boolean;
  sanitizedData: BookingFormData;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Validate required fields
  if (!data.yourName?.trim()) errors.push('Name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  if (!data.phone?.trim()) errors.push('Phone is required');
  if (!data.postcode?.trim()) errors.push('Postcode is required');
  if (!data.jobDetails?.trim()) errors.push('Job details are required');
  
  // Validate email format
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  // Validate phone format
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  // Sanitize all data
  const sanitizedData: BookingFormData = {
    yourName: sanitizeUserInput(data.yourName),
    email: sanitizeUserInput(data.email),
    phone: sanitizeUserInput(data.phone),
    postcode: sanitizeUserInput(data.postcode),
    jobDetails: sanitizeUserInput(data.jobDetails),
    notes: data.notes ? sanitizeUserInput(data.notes) : undefined
  };
  
  return {
    isValid: errors.length === 0,
    sanitizedData,
    errors
  };
};