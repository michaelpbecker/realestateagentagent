import '@testing-library/jest-dom/vitest';
import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

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
  // Set up environment variables for testing
  process.env.OPENAI_API_KEY = 'test-api-key';
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});