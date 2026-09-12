import { DraftPost } from '../types/post';

const DRAFTS_STORAGE_KEY = 'postpulse_drafts_v1';

export const loadDraftsFromStorage = (): DraftPost[] => {
  try {
    const data = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load drafts from localStorage:', error);
    return [];
  }
};

export const saveDraftsToStorage = (drafts: DraftPost[]): void => {
  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Failed to save drafts to localStorage:', error);
  }
};

export const getInitialMockDrafts = (): DraftPost[] => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'draft-1',
      title: '🚀 Product Launch Announcement',
      content: 'We are super excited to launch PostPulse v1.0 today! Manage, schedule, and preview all your social content in one seamless dashboard. Try it out now!',
      selectedPlatforms: ['twitter', 'linkedin', 'threads'],
      platformOverrides: {
        twitter: 'We are super excited to launch PostPulse v1.0 today! Manage, schedule & preview all your posts in one place. #ProductLaunch #Tech #SaaS',
        linkedin: 'We are super excited to officially introduce PostPulse v1.0! 🚀\n\nManaging multiple social channels has always been tedious. PostPulse simplifies post creation with real-time character limit validation, multi-platform live preview, and automated draft management.\n\nKey Highlights:\n• Dynamic Multi-Platform Composer\n• Real-time constraint checking\n• Instant side-by-side previews\n\nWhat are your thoughts on modern social media workflows? Let us know below!'
      },
      tags: ['Product', 'Launch', 'Feature'],
      status: 'ready',
      createdAt: threeDaysAgo.toISOString(),
      updatedAt: yesterday.toISOString(),
    },
    {
      id: 'draft-2',
      title: '💡 Weekly Developer Tip: Redux Toolkit Slices',
      content: 'Pro tip for React developers: Keep your Redux state normalized and leverage RTK slices to simplify action creators and state mutations effortlessly.',
      selectedPlatforms: ['twitter', 'linkedin'],
      platformOverrides: {
        twitter: '💡 React Pro Tip: Use Redux Toolkit createSlice to handle reducer logic cleanly without boilerplate! #ReactJS #WebDev #TypeScript'
      },
      tags: ['Tech', 'Tips', 'Coding'],
      status: 'draft',
      createdAt: yesterday.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'draft-3',
      title: '📸 Visual Workflow Showcase',
      content: 'A sneak peek into our new Dark UI layout built with Tailwind CSS and React. Designed for speed and minimal distraction.',
      selectedPlatforms: ['instagram', 'facebook'],
      platformOverrides: {
        instagram: 'A sneak peek into our new Dark UI layout built with Tailwind CSS and React! 🎨✨ Designed for ultra speed and minimal distraction.\n.\n.\n#UIUX #WebDesign #ReactJS #TailwindCSS #FrontendDev'
      },
      tags: ['Design', 'SneakPeek'],
      status: 'draft',
      createdAt: threeDaysAgo.toISOString(),
      updatedAt: threeDaysAgo.toISOString(),
    }
  ];
};
