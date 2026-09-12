import { generateMockJWT, decodeJWT, isJWTValid } from '../utils/jwt';
import { User } from '../types/auth';

export const runAuthTests = (): { passed: number; failed: number } => {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, description: string) => {
    if (condition) {
      passed++;
      console.log(`  ✓ PASSED: ${description}`);
    } else {
      failed++;
      console.error(`  ✗ FAILED: ${description}`);
    }
  };

  console.log('\n🔐 Running JWT Authentication & Session Tests...');

  const mockUser: User = {
    id: 'user-test-1',
    name: 'Test Creator',
    email: 'test@postpulse.io',
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  // Test 1: JWT Token Generation
  const token = generateMockJWT(mockUser);
  assert(typeof token === 'string' && token.split('.').length === 3, 'JWT token should be generated with 3 parts (header.payload.signature)');

  // Test 2: JWT Token Decoding
  const decoded = decodeJWT(token);
  assert(decoded?.userId === mockUser.id && decoded?.email === mockUser.email, 'Decoded JWT payload should match generated user credentials');

  // Test 3: JWT Token Expiration Validity
  const isValid = isJWTValid(token);
  assert(isValid === true, 'Freshly generated JWT token should be valid and active');

  // Test 4: Invalid Token Check
  const isInvalid = isJWTValid('invalid.dummy.token');
  assert(isInvalid === false, 'Malformed or invalid JWT token string should fail validation');

  return { passed, failed };
};
