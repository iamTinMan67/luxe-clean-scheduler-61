
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format duration from minutes to readable format (e.g., "2h 30m")
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : hours === 0 ? '0m' : ''}`;
}

