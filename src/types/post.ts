import { PlatformId } from './platform';

export type DraftStatus = 'draft' | 'ready' | 'scheduled';

export interface DraftPost {
  id: string;
  authorId?: string; // RBAC ownership tracking
  authorName?: string;
  title: string;
  content: string; // default content across platforms
  selectedPlatforms: PlatformId[];
  platformOverrides: Record<string, string>; // platformId -> customized content
  tags: string[];
  status: DraftStatus;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  scheduledFor?: string;
  mediaUrls?: string[];
}

export interface DraftFilterState {
  searchQuery: string;
  platform: PlatformId | 'all';
  status: DraftStatus | 'all';
  sortBy: 'updatedAt' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface ValidationResult {
  isValid: boolean;
  charCount: number;
  maxCount: number;
  remaining: number;
  percentage: number;
  errors: string[];
  warnings: string[];
}

export interface MultiPlatformValidation {
  isAllValid: boolean;
  platformResults: Record<PlatformId, ValidationResult>;
}
