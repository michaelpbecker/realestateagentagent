import '@testing-library/jest-dom/vitest';
import { expect, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeAll(() => {
  // Add ResizeObserver mock
  global.ResizeObserver = ResizeObserverMock;
  // Add match media mock
  global.matchMedia = global.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
    };
  };
  // Use the environment variable if available, otherwise use a default test key
  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-api-key';
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});