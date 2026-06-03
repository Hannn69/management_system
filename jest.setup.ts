// jest.setup.ts
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000'

// Mock jose module for tests
jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
  SignJWT: jest.fn().mockReturnValue({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-token'),
  }),
  errors: {
    JWTExpired: Error,
    JWTClaimsValidationFailed: Error,
  },
}))
