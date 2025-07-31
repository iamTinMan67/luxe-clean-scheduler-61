// Authentication rate limiting to prevent brute force attacks

interface AttemptRecord {
  count: number;
  lastAttempt: number;
  lockoutUntil?: number;
}

const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = 'auth_attempts';

export class AuthRateLimit {
  private static getAttempts(): Record<string, AttemptRecord> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private static saveAttempts(attempts: Record<string, AttemptRecord>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
    } catch {
      // If localStorage fails, continue without rate limiting
    }
  }

  private static cleanupExpiredAttempts(attempts: Record<string, AttemptRecord>): void {
    const now = Date.now();
    Object.keys(attempts).forEach(ip => {
      const record = attempts[ip];
      if (record.lockoutUntil && now > record.lockoutUntil) {
        delete attempts[ip];
      } else if (now - record.lastAttempt > ATTEMPT_WINDOW) {
        delete attempts[ip];
      }
    });
  }

  static isBlocked(identifier: string = 'default'): { blocked: boolean; remainingTime?: number } {
    const attempts = this.getAttempts();
    this.cleanupExpiredAttempts(attempts);
    
    const record = attempts[identifier];
    if (!record) return { blocked: false };

    const now = Date.now();
    
    if (record.lockoutUntil && now < record.lockoutUntil) {
      return { 
        blocked: true, 
        remainingTime: Math.ceil((record.lockoutUntil - now) / (60 * 1000)) 
      };
    }

    return { blocked: false };
  }

  static recordAttempt(identifier: string = 'default', success: boolean): void {
    const attempts = this.getAttempts();
    this.cleanupExpiredAttempts(attempts);
    
    const now = Date.now();
    const record = attempts[identifier] || { count: 0, lastAttempt: 0 };

    if (success) {
      // Reset on successful auth
      delete attempts[identifier];
    } else {
      // Increment failed attempts
      if (now - record.lastAttempt > ATTEMPT_WINDOW) {
        // Reset count if outside window
        record.count = 1;
      } else {
        record.count++;
      }
      
      record.lastAttempt = now;
      
      // Apply lockout if threshold exceeded
      if (record.count >= MAX_ATTEMPTS) {
        record.lockoutUntil = now + LOCKOUT_DURATION;
      }
      
      attempts[identifier] = record;
    }

    this.saveAttempts(attempts);
  }

  static getRemainingAttempts(identifier: string = 'default'): number {
    const attempts = this.getAttempts();
    const record = attempts[identifier];
    
    if (!record) return MAX_ATTEMPTS;
    
    const now = Date.now();
    if (now - record.lastAttempt > ATTEMPT_WINDOW) {
      return MAX_ATTEMPTS;
    }
    
    return Math.max(0, MAX_ATTEMPTS - record.count);
  }
}