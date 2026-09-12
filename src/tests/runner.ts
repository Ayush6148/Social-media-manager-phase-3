import { runAuthTests } from './auth.test';
import { runRbacTests } from './rbac.test';
import { runComposerTests } from './composer.test';
import { runCalendarTests } from './calendar.test';

console.log('====================================================');
console.log('🚀 POSTPULSE AUTOMATED TEST SUITE RUNNER');
console.log('====================================================');

const authResults = runAuthTests();
const rbacResults = runRbacTests();
const composerResults = runComposerTests();
const calendarResults = runCalendarTests();

const totalPassed = authResults.passed + rbacResults.passed + composerResults.passed + calendarResults.passed;
const totalFailed = authResults.failed + rbacResults.failed + composerResults.failed + calendarResults.failed;

console.log('\n====================================================');
console.log(`📊 TEST SUMMARY: ${totalPassed} PASSED | ${totalFailed} FAILED`);
console.log('====================================================');

if (totalFailed > 0) {
  console.error('\n❌ TEST SUITE FAILED!');
  process.exit(1);
} else {
  console.log('\n✅ ALL TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
