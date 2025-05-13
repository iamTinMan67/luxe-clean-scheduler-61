
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format time string (HH:MM) to AM/PM format
 */
export function formatTimeToAmPm(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format duration in minutes to hours and minutes
 */
export function formatDuration(minutes: number): string {
  if (!minutes) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Calculate end time from start time and duration in hours/minutes
 */
export function calculateEndTime(startTime: string, durationHours: number, durationMinutes: number = 0): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes + (durationHours * 60) + durationMinutes;
  
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}
