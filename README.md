# PostPulse - Modern Social Media Post Manager & Scheduler (Phase 1)

PostPulse is a high-performance, modern web application designed for content creators, marketers, and social media managers to create, validate, and manage multi-platform posts seamlessly.

## 🚀 Key Features

### 1. Modern Responsive Dashboard UI
- Clean, dark-mode sleek layout with dynamic sidebar navigation.
- Comprehensive statistics overview: Total Drafts, Ready Posts, Active Platform Coverage, and Validation status.
- Recent Activity Feed & quick post creation CTA.

### 2. Dynamic Post Composer Interface
- **Multi-Platform Target Selection**: Choose one or multiple channels (X/Twitter, LinkedIn, Instagram, Facebook, Threads).
- **Platform-Specific Override Tabs**: Customize text copy, hashtags, or links specifically per platform or use base content.
- **Real-Time Constraint Validation**: Instant character count checking against network limits (e.g., 280 for Twitter, 3,000 for LinkedIn, 2,200 for Instagram with 30 hashtag limits).
- **Visual Progress Ring & Error Alerts**: Color-coded progress ring (Green, Amber, Rose) and instant warning/error alerts.
- **Live Realistic Social Previews**: Side-by-side or tabbed live feeds showcasing authentic Twitter cards, LinkedIn post boxes, Instagram image captions, Facebook feed posts, and Threads layout.

### 3. Comprehensive Draft Management
- **Persistence**: Automatic real-time synchronization with `localStorage` via custom Redux middleware.
- **Full CRUD & Cloning**: Create, edit, update, duplicate, and delete drafts with prompt confirmation modals.
- **Flexible Filters & Sorting**: Search by title/content/tags, filter by target platform or ready status, and sort by update/creation date.
- **Grid & List Views**: Toggle between high-density list rows and visual card grid layouts.

### 4. Robust State Architecture (Redux Toolkit)
- **Centralized Redux Store**: `@reduxjs/toolkit` managing `postsSlice`, `platformsSlice`, and `uiSlice`.
- **Typed Hooks**: `useAppDispatch` and `useAppSelector` enforcing full TypeScript safety.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Navigate to project directory
cd /Users/ayushyadav/.gemini/antigravity/scratch/social-media-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build Production Bundle
```bash
npm run build
```

---

## 📁 Architecture & File Directory

```
social-media-manager/
├── src/
│   ├── components/
│   │   ├── common/         # Header, Sidebar, Badge, CharacterCounter, Modal, ToastContainer, PlatformIcon
│   │   ├── composer/       # PostComposer, PlatformSelector, PlatformCustomizer, PostPreview
│   │   ├── dashboard/      # DashboardOverview, QuickStatsCard, RecentDraftsWidget
│   │   └── drafts/         # DraftList, DraftCard, DraftFilters, DeleteDraftModal
│   ├── store/
│   │   ├── slices/         # postsSlice, platformsSlice, uiSlice
│   │   ├── middleware/     # localStorageMiddleware
│   │   └── index.ts        # Store configuration & custom hooks
│   ├── types/              # platform.ts, post.ts, ui.ts
│   ├── utils/             # validation.ts, storage.ts, formatters.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
