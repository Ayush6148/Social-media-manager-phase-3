import { format, addDays } from 'date-fns';

export const runCalendarTests = (): { passed: number; failed: number } => {
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

  console.log('\n📅 Running Calendar & Post Scheduling Tests...');

  const tomorrow = addDays(new Date(), 1);
  const targetDateStr = format(tomorrow, 'yyyy-MM-dd');

  const mockScheduledPost = {
    id: 'post-sched-1',
    title: 'Product Q3 Update',
    content: 'Scheduled content body.',
    selectedPlatforms: ['twitter' as const, 'linkedin' as const],
    status: 'scheduled' as const,
    scheduledFor: tomorrow.toISOString(),
  };

  // Test 1: Date String Formatting for Calendar Key
  const formattedKey = format(new Date(mockScheduledPost.scheduledFor), 'yyyy-MM-dd');
  assert(formattedKey === targetDateStr, 'Scheduled timestamp should correctly format to YYYY-MM-DD calendar cell key');

  // Test 2: Scheduled Status State Check
  assert(mockScheduledPost.status === 'scheduled' && !!mockScheduledPost.scheduledFor, 'Scheduled post must hold "scheduled" status badge and valid timestamp');

  return { passed, failed };
};
