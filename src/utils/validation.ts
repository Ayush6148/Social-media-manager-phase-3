import { PLATFORMS, PlatformId } from '../types/platform';
import { MultiPlatformValidation, ValidationResult } from '../types/post';

/**
 * Extract content for a given platform, using override if present, otherwise base content
 */
export const getPlatformContent = (
  baseContent: string,
  platformOverrides: Record<string, string>,
  platformId: PlatformId
): string => {
  if (platformOverrides[platformId] !== undefined && platformOverrides[platformId].trim() !== '') {
    return platformOverrides[platformId];
  }
  return baseContent;
};

/**
 * Validate post content against platform limits and rules
 */
export const validatePlatformContent = (
  content: string,
  platformId: PlatformId
): ValidationResult => {
  const config = PLATFORMS[platformId];
  if (!config) {
    return {
      isValid: false,
      charCount: content.length,
      maxCount: 0,
      remaining: 0,
      percentage: 100,
      errors: ['Unknown platform'],
      warnings: [],
    };
  }

  const charCount = content.length;
  const maxCount = config.maxCharacters;
  const remaining = maxCount - charCount;
  const percentage = Math.min(Math.round((charCount / maxCount) * 100), 100);

  const errors: string[] = [];
  const warnings: string[] = [];

  // Character limit validation
  if (charCount > maxCount) {
    errors.push(`Exceeds maximum character limit by ${charCount - maxCount} characters`);
  } else if (remaining < 20 && remaining >= 0 && maxCount < 1000) {
    warnings.push(`Only ${remaining} character${remaining === 1 ? '' : 's'} remaining`);
  }

  // Instagram hashtag check
  if (platformId === 'instagram' && config.hashtagLimit) {
    const hashtags = (content.match(/#[a-zA-Z0-9_]+/g) || []).length;
    if (hashtags > config.hashtagLimit) {
      errors.push(`Exceeds maximum ${config.hashtagLimit} hashtags limit (found ${hashtags})`);
    } else if (hashtags > 25) {
      warnings.push(`Close to hashtag limit (${hashtags}/${config.hashtagLimit})`);
    }
  }

  // General empty check warning if selected
  if (charCount === 0) {
    warnings.push('Content is currently empty');
  }

  return {
    isValid: errors.length === 0 && charCount > 0,
    charCount,
    maxCount,
    remaining,
    percentage,
    errors,
    warnings,
  };
};

/**
 * Validate across all selected platforms
 */
export const validateAllSelectedPlatforms = (
  baseContent: string,
  platformOverrides: Record<string, string>,
  selectedPlatforms: PlatformId[]
): MultiPlatformValidation => {
  const platformResults: Record<string, ValidationResult> = {};
  let isAllValid = selectedPlatforms.length > 0;

  selectedPlatforms.forEach((pId) => {
    const content = getPlatformContent(baseContent, platformOverrides, pId);
    const result = validatePlatformContent(content, pId);
    platformResults[pId] = result;

    if (!result.isValid) {
      isAllValid = false;
    }
  });

  return {
    isAllValid,
    platformResults: platformResults as Record<PlatformId, ValidationResult>,
  };
};
