// vitest.setup.js
// Global mocks for external dependencies used in tests, adapted for Vitest.

// 1. Mock the Supabase client entirely.
// This prevents tests from making real network calls to your database.
// We only expose the functions we need to test: auth and functions.
const mockSupabase = {
  auth: {
    signInWithOtp: vi.fn(), // Use vi.fn()
  },
  functions: {
    invoke: vi.fn(), // Use vi.fn()
  },
  // Mock other services if needed (e.g., from: vi.fn().mockReturnThis(), select: vi.fn())
};

// Mock the entire supabaseClient module export using vi.mock
vi.mock('@db/supabaseClient', () => ({
  supabase: mockSupabase,
}));

// Set a default environment for testing the dev bypass logic
global.import = {
  meta: {
    env: {
      VITE_ENV: 'development', // Ensure dev bypass logic is active during tests
    },
  },
};

// Helper to easily reset all mocks before each test
export const resetAllMocks = () => {
  mockSupabase.auth.signInWithOtp.mockClear();
  mockSupabase.functions.invoke.mockClear();
};