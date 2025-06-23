
// Extended session timeout
export const startExtendedSession = (onSessionExpired: () => void): void => {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  
  const timeUntilEndOfDay = endOfDay.getTime() - now.getTime();
  
  setTimeout(() => {
    onSessionExpired();
  }, timeUntilEndOfDay);
};
