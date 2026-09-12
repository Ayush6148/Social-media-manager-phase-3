import React from 'react';
import { PLATFORMS, PlatformId } from '../../types/platform';
import { PlatformIcon } from '../common/PlatformIcon';
import { getPlatformContent } from '../../utils/validation';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Send,
  Globe,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface PostPreviewProps {
  baseContent: string;
  platformOverrides: Record<string, string>;
  selectedPlatforms: PlatformId[];
  activePreviewPlatform: PlatformId;
  onSelectPreviewPlatform: (platformId: PlatformId) => void;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  baseContent,
  platformOverrides,
  selectedPlatforms,
  activePreviewPlatform,
  onSelectPreviewPlatform,
}) => {
  if (selectedPlatforms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-slate-800 rounded-2xl text-center h-full min-h-[320px]">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <Sparkles size={22} />
        </div>
        <h4 className="text-sm font-semibold text-slate-200">No Platform Selected</h4>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Select one or more target platforms above to see real-time post previews.
        </p>
      </div>
    );
  }

  // Ensure active preview is one of selected, else default to first selected
  const activePlatform = selectedPlatforms.includes(activePreviewPlatform)
    ? activePreviewPlatform
    : selectedPlatforms[0];

  const content = getPlatformContent(baseContent, platformOverrides, activePlatform);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={14} className="text-indigo-400" /> Live Preview
        </label>
        <span className="text-[11px] text-slate-400">Renders live content</span>
      </div>

      {/* Platform Switcher Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {selectedPlatforms.map((pId) => {
          const isSelected = activePlatform === pId;
          return (
            <button
              key={pId}
              type="button"
              onClick={() => onSelectPreviewPlatform(pId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <PlatformIcon platformId={pId} size={14} />
              <span>{PLATFORMS[pId]?.name}</span>
            </button>
          );
        })}
      </div>

      {/* Preview Container */}
      <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-y-auto max-h-[550px]">
        {activePlatform === 'twitter' && <TwitterPreview content={content} />}
        {activePlatform === 'linkedin' && <LinkedInPreview content={content} />}
        {activePlatform === 'instagram' && <InstagramPreview content={content} />}
        {activePlatform === 'facebook' && <FacebookPreview content={content} />}
        {activePlatform === 'threads' && <ThreadsPreview content={content} />}
      </div>
    </div>
  );
};

// Custom Tweet Preview Component
const TwitterPreview: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="bg-black border border-slate-800 rounded-2xl p-4 text-white font-sans shadow-xl">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          AY
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-sm text-white truncate">Ayush Yadav</span>
              <CheckCircle2 size={14} className="text-sky-400 fill-sky-400 shrink-0" />
              <span className="text-slate-500 text-xs truncate">@ayush_yadav</span>
              <span className="text-slate-500 text-xs">· 1m</span>
            </div>
            <MoreHorizontal size={16} className="text-slate-500 cursor-pointer" />
          </div>

          <div className="mt-2 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
            {content || <span className="text-slate-600 italic">Tweet content preview...</span>}
          </div>

          {/* Tweet Stats / Bar */}
          <div className="flex items-center justify-between text-slate-500 text-xs mt-4 pt-3 border-t border-slate-900 max-w-md">
            <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
              <MessageCircle size={16} /> <span>12</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <Repeat2 size={16} /> <span>4</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
              <Heart size={16} /> <span>48</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
              <Bookmark size={16} />
            </button>
            <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom LinkedIn Preview Component
const LinkedInPreview: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-sans shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            AY
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-bold text-sm text-slate-100">Ayush Yadav</h4>
              <span className="text-slate-500 text-xs">· 1st</span>
            </div>
            <p className="text-[11px] text-slate-400">Software Engineer & Tech Creator</p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
              <span>1m ·</span>
              <Globe size={11} />
            </div>
          </div>
        </div>
        <MoreHorizontal size={18} className="text-slate-400" />
      </div>

      <div className="mt-3 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
        {content || <span className="text-slate-600 italic">LinkedIn post preview...</span>}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
        <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
          <ThumbsUp size={16} /> <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
          <MessageCircle size={16} /> <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
          <Repeat2 size={16} /> <span>Repost</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
          <Send size={16} /> <span>Send</span>
        </button>
      </div>
    </div>
  );
};

// Custom Instagram Preview Component
const InstagramPreview: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto">
      <div className="flex items-center justify-between p-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-[10px] text-white">
              AY
            </div>
          </div>
          <span className="text-xs font-semibold text-white">ayush.yadav</span>
        </div>
        <MoreHorizontal size={18} className="text-slate-400" />
      </div>

      {/* Image Mock Container */}
      <div className="w-full h-56 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center text-slate-400 relative">
        <div className="text-center p-4">
          <PlatformIcon platformId="instagram" size={36} className="mx-auto mb-2 opacity-60" />
          <span className="text-xs font-medium text-slate-300">Media Attachment Placeholder</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2 text-white">
          <div className="flex items-center gap-3">
            <Heart size={20} className="hover:text-rose-500 transition-colors cursor-pointer" />
            <MessageCircle size={20} className="hover:text-slate-400 transition-colors cursor-pointer" />
            <Send size={20} className="hover:text-slate-400 transition-colors cursor-pointer" />
          </div>
          <Bookmark size={20} className="hover:text-slate-400 transition-colors cursor-pointer" />
        </div>
        <p className="text-xs font-semibold text-slate-200 mb-1">128 likes</p>

        <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
          <span className="font-semibold text-white mr-1.5">ayush.yadav</span>
          {content || <span className="text-slate-600 italic">Caption preview...</span>}
        </div>
        <span className="text-[10px] text-slate-500 uppercase mt-2 block">1 MINUTE AGO</span>
      </div>
    </div>
  );
};

// Custom Facebook Preview Component
const FacebookPreview: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-sans shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-bold text-white text-xs">
            AY
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">Ayush Yadav</h4>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span>1 min ·</span>
              <Globe size={10} />
            </div>
          </div>
        </div>
        <MoreHorizontal size={18} className="text-slate-400" />
      </div>

      <div className="text-xs text-slate-100 whitespace-pre-wrap leading-relaxed">
        {content || <span className="text-slate-600 italic">Facebook post preview...</span>}
      </div>

      <div className="flex items-center justify-between text-slate-400 text-xs mt-4 pt-2.5 border-t border-slate-800">
        <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <ThumbsUp size={16} /> <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <MessageCircle size={16} /> <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <Share2 size={16} /> <span>Share</span>
        </button>
      </div>
    </div>
  );
};

// Custom Threads Preview Component
const ThreadsPreview: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-sans shadow-xl">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs">
            AY
          </div>
          <div className="w-0.5 flex-1 bg-slate-800 rounded-full min-h-[40px]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-white">ayush.yadav</span>
            <span className="text-slate-500 text-[11px]">1m</span>
          </div>

          <div className="mt-1 text-xs text-slate-100 whitespace-pre-wrap leading-relaxed">
            {content || <span className="text-slate-600 italic">Threads post preview...</span>}
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs mt-3">
            <Heart size={16} className="hover:text-rose-500 transition-colors cursor-pointer" />
            <MessageCircle size={16} className="hover:text-white transition-colors cursor-pointer" />
            <Repeat2 size={16} className="hover:text-emerald-400 transition-colors cursor-pointer" />
            <Send size={16} className="hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};
