export type PlatformId = 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'threads';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  maxCharacters: number;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  supportsMedia: boolean;
  maxMediaCount: number;
  hashtagLimit?: number;
  description: string;
}

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    maxCharacters: 280,
    color: '#1DA1F2',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-400',
    supportsMedia: true,
    maxMediaCount: 4,
    description: 'Fast-paced, concise posts up to 280 characters',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    maxCharacters: 3000,
    color: '#0A66C2',
    bgColor: 'bg-blue-600/10',
    borderColor: 'border-blue-600/30',
    badgeBg: 'bg-blue-600/20',
    badgeText: 'text-blue-400',
    supportsMedia: true,
    maxMediaCount: 9,
    description: 'Professional updates & long-form articles up to 3,000 characters',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    maxCharacters: 2200,
    color: '#E4405F',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    badgeBg: 'bg-pink-500/20',
    badgeText: 'text-pink-400',
    supportsMedia: true,
    maxMediaCount: 10,
    hashtagLimit: 30,
    description: 'Visual stories & captions up to 2,200 characters',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    maxCharacters: 63206,
    color: '#1877F2',
    bgColor: 'bg-indigo-600/10',
    borderColor: 'border-indigo-600/30',
    badgeBg: 'bg-indigo-600/20',
    badgeText: 'text-indigo-400',
    supportsMedia: true,
    maxMediaCount: 10,
    description: 'Community posts & news feed updates up to 63,206 characters',
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    maxCharacters: 500,
    color: '#000000',
    bgColor: 'bg-slate-700/20',
    borderColor: 'border-slate-600/40',
    badgeBg: 'bg-slate-700/40',
    badgeText: 'text-slate-200',
    supportsMedia: true,
    maxMediaCount: 10,
    description: 'Text-first conversations up to 500 characters',
  },
};
