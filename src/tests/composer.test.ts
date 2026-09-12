import { validatePlatformContent, validateAllSelectedPlatforms } from '../utils/validation';

export const runComposerTests = (): { passed: number; failed: number } => {
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

  console.log('\n✍️ Running Post Composer & Character Validation Tests...');

  // Test 1: Twitter 280 character limit valid text
  const validTweet = 'This is a valid tweet within character limits. #ProductLaunch';
  const twitterResult = validatePlatformContent(validTweet, 'twitter');
  assert(twitterResult.isValid === true && twitterResult.charCount === validTweet.length, 'Tweet within 280 chars should validate successfully');

  // Test 2: Twitter exceeding 280 chars
  const longText = 'A'.repeat(300);
  const overageResult = validatePlatformContent(longText, 'twitter');
  assert(overageResult.isValid === false && overageResult.errors.length > 0, 'Tweet over 280 chars must return validation error');

  // Test 3: Instagram 30 Hashtags limit validation
  const tooManyHashtags = 'Cool photo! ' + Array.from({ length: 32 }, (_, i) => `#tag${i}`).join(' ');
  const igResult = validatePlatformContent(tooManyHashtags, 'instagram');
  assert(igResult.isValid === false && igResult.errors.some((e) => e.includes('hashtags')), 'Instagram post with over 30 hashtags must trigger validation error');

  // Test 4: Multi-platform validation with override
  const baseContent = 'Base post copy.';
  const overrides = { twitter: 'Short tweet copy #tech' };
  const multiResult = validateAllSelectedPlatforms(baseContent, overrides, ['twitter', 'linkedin']);
  assert(multiResult.isAllValid === true && multiResult.platformResults.twitter.charCount === overrides.twitter.length, 'Multi-platform validation should calculate override text length correctly');

  return { passed, failed };
};
