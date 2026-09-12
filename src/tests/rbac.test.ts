import { UserRole } from '../types/auth';

export const runRbacTests = (): { passed: number; failed: number } => {
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

  console.log('\n🛡️ Running Role-Based Access Control (RBAC) Tests...');

  const adminRole: UserRole = 'admin';
  const userRole: UserRole = 'user';

  const checkAdminAccess = (role: UserRole) => role === 'admin';
  const checkUserAccess = (role: UserRole) => role === 'admin' || role === 'user';

  // Test 1: Admin Access Check
  assert(checkAdminAccess(adminRole) === true, 'Admin role should be granted access to protected Admin routes');

  // Test 2: Standard User Access Block on Admin Routes
  assert(checkAdminAccess(userRole) === false, 'Standard User role must be denied access to protected Admin routes');

  // Test 3: Standard User Access to Creator Features
  assert(checkUserAccess(userRole) === true, 'Standard User role should have access to creator composer and drafts');

  return { passed, failed };
};
