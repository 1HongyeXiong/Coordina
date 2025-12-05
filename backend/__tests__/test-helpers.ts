/**
 * Test Helper Utilities
 * 
 * Provides reusable functions for creating test data, making API calls,
 * and performing common test operations.
 */

import axios, { AxiosResponse } from 'axios';
import TestConfig from './test-config';

export interface TestUser {
  name: string;
  userEmail: string;
  userName: string;
  microsoftId?: string;
}

export interface TestEventtime {
  startAt: string | Date;
  endAt: string | Date;
}

export interface TestEvent {
  name: string;
  eventLink?: string;
  eventtimeid: string;
  status: 'proposed' | 'scheduled' | 'ongoing' | 'past';
  organizerid: string;
  participantsid?: string[];
  description?: string;
  location?: string;
}

/**
 * Creates a unique test user object
 */
export const createTestUser = (overrides: Partial<TestUser> = {}): TestUser => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  
  return {
    name: `${TestConfig.TEST_DATA.USER_PREFIX} ${timestamp}`,
    userEmail: `${TestConfig.TEST_DATA.USER_PREFIX}-${timestamp}-${random}@example.com`,
    userName: `${TestConfig.TEST_DATA.USER_PREFIX}-${timestamp}-${random}`,
    ...overrides,
  };
};

/**
 * Creates a unique test eventtime object
 */
export const createTestEventtime = (overrides: Partial<TestEventtime> = {}): TestEventtime => {
  const now = Date.now();
  const defaultStart = new Date(now + 24 * 60 * 60 * 1000); // Tomorrow
  const defaultEnd = new Date(now + 25 * 60 * 60 * 1000); // Tomorrow + 1 hour
  
  return {
    startAt: defaultStart.toISOString(),
    endAt: defaultEnd.toISOString(),
    ...overrides,
  };
};

/**
 * Creates a unique test event object
 */
export const createTestEvent = (
  eventtimeId: string,
  organizerId: string,
  overrides: Partial<TestEvent> = {}
): TestEvent => {
  const timestamp = Date.now();
  
  return {
    name: `${TestConfig.TEST_DATA.EVENT_PREFIX} ${timestamp}`,
    eventLink: 'https://example.com/meeting',
    eventtimeid: eventtimeId,
    status: 'proposed',
    organizerid: organizerId,
    participantsid: [],
    ...overrides,
  };
};

/**
 * Checks if Azure endpoint is reachable
 */
export const isAzureReachable = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${TestConfig.AZURE_BACKEND_URL}/test`, {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Retries an async function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = TestConfig.RETRY_ATTEMPTS,
  delay: number = TestConfig.RETRY_DELAY
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError || new Error('Retry failed');
};

/**
 * Validates user data structure
 */
export const validateUserData = (user: any): boolean => {
  return (
    typeof user === 'object' &&
    user !== null &&
    typeof user.name === 'string' &&
    typeof user.userEmail === 'string' &&
    typeof user.userName === 'string' &&
    user.name.length >= TestConfig.VALIDATION.MIN_NAME_LENGTH &&
    user.name.length <= TestConfig.VALIDATION.MAX_NAME_LENGTH &&
    user.userEmail.includes('@') &&
    user.userEmail.length >= TestConfig.VALIDATION.MIN_EMAIL_LENGTH &&
    user.userEmail.length <= TestConfig.VALIDATION.MAX_EMAIL_LENGTH &&
    user.userName.length >= TestConfig.VALIDATION.MIN_USERNAME_LENGTH &&
    user.userName.length <= TestConfig.VALIDATION.MAX_USERNAME_LENGTH
  );
};

/**
 * Validates event data structure
 */
export const validateEventData = (event: any): boolean => {
  return (
    typeof event === 'object' &&
    event !== null &&
    typeof event.name === 'string' &&
    typeof event.eventtimeid === 'string' &&
    typeof event.organizerid === 'string' &&
    ['proposed', 'scheduled', 'ongoing', 'past'].includes(event.status)
  );
};

/**
 * Validates eventtime data structure
 */
export const validateEventtimeData = (eventtime: any): boolean => {
  return (
    typeof eventtime === 'object' &&
    eventtime !== null &&
    eventtime.startAt !== undefined &&
    eventtime.endAt !== undefined &&
    new Date(eventtime.startAt) < new Date(eventtime.endAt)
  );
};

/**
 * Cleans up test resources
 */
export const cleanupTestResources = async (
  userIds: string[],
  eventIds: string[],
  eventtimeIds: string[]
): Promise<void> => {
  const deletePromises: Promise<any>[] = [];
  
  // Delete events
  eventIds.forEach(id => {
    deletePromises.push(
      axios.delete(`${TestConfig.API_BASE_URL}/events/${id}`).catch(() => {})
    );
  });
  
  // Delete eventtimes
  eventtimeIds.forEach(id => {
    deletePromises.push(
      axios.delete(`${TestConfig.API_BASE_URL}/eventtimes/${id}`).catch(() => {})
    );
  });
  
  // Delete users
  userIds.forEach(id => {
    deletePromises.push(
      axios.delete(`${TestConfig.API_BASE_URL}/users/${id}`).catch(() => {})
    );
  });
  
  await Promise.all(deletePromises);
};

/**
 * Waits for a specified amount of time
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generates a random string of specified length
 */
export const generateRandomString = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates a valid email address
 */
export const generateEmail = (prefix: string = 'test'): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${random}@example.com`;
};
