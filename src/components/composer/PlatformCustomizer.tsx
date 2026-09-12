import React from 'react';
import { PLATFORMS, PlatformId } from '../../types/platform';
import { PlatformIcon } from '../common/PlatformIcon';
import { ValidationResult } from '../../types/post';
import { CharacterCounter } from '../common/CharacterCounter';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface PlatformCustomizerProps {
  baseContent: string;
  onBaseContentChange: (content: string) => void;
  platformOverrides: Record<string, string>;
  onOverrideChange: (platformId: string, content: string) => void;
  selectedPlatforms: PlatformId[];
  activeCustomTab: 'base' | PlatformId;
  onSelectTab: (tab: 'base' | PlatformId) => void;
  validations: Record<PlatformId, ValidationResult>;
}

export const PlatformCustomizer: React.FC<PlatformCustomizerProps> = ({
  baseContent,
  onBaseContentChange,
  platformOverrides,
  onOverrideChange,
  selectedPlatforms,
  activeCustomTab,
  onSelectTab,
  validations,
}) => {
  const isOverrideActive =
    activeCustomTab !== 'base' &&
    platformOverrides[activeCustomTab] !== undefined &&
    platformOverrides[activeCustomTab] !== '';

  const activeContent =
    activeCustomTab === 'base'
      ? baseContent
      : platformOverrides[activeCustomTab] !== undefined && platformOverrides[activeCustomTab] !== ''
      ? platformOverrides[activeCustomTab]
      : baseContent;

  const currentValidation =
    activeCustomTab !== 'base' && validations[activeCustomTab]
      ? validations[activeCustomTab]
      : {
          isValid: true,
          charCount: activeContent.length,
          maxCount: 5000,
          remaining: 5000 - activeContent.length,
          percentage: 0,
          errors: [],
          warnings: [],
        };

  return (
    <div className="flex flex-col gap-3">
      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => onSelectTab('base')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCustomTab === 'base'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>Base Content</span>
          </button>

          {selectedPlatforms.map((pId) => {
            const platform = PLATFORMS[pId];
            const hasOverride =
              platformOverrides[pId] !== undefined && platformOverrides[pId] !== '';
            const isActive = activeCustomTab === pId;
            const validation = validations[pId];
            const isError = validation && !validation.isValid;

            return (
              <button
                key={pId}
                type="button"
                onClick={() => onSelectTab(pId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white border border-indigo-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                } ${isError ? 'border-rose-500/50' : ''}`}
              >
                <PlatformIcon platformId={pId} size={14} />
                <span>{platform.name}</span>
                {hasOverride && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                    title="Custom content override applied"
                  />
                )}
                {isError && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Validation error" />
                )}
              </button>
            );
          })}
        </div>

        {activeCustomTab !== 'base' && (
          <div className="flex items-center gap-2">
            {isOverrideActive ? (
              <button
                type="button"
                onClick={() => onOverrideChange(activeCustomTab, '')}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-md border border-rose-500/20 transition-colors"
                title="Reset to base content"
              >
                <RotateCcw size={12} />
                <span>Reset to Base</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <SlidersHorizontal size={12} />
                Using base content
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Textarea */}
      <div className="relative flex flex-col">
        <textarea
          rows={6}
          placeholder={
            activeCustomTab === 'base'
              ? 'What would you like to share across platforms?...'
              : `Customize your message specifically for ${PLATFORMS[activeCustomTab]?.name}...`
          }
          value={activeContent}
          onChange={(e) => {
            if (activeCustomTab === 'base') {
              onBaseContentChange(e.target.value);
            } else {
              onOverrideChange(activeCustomTab, e.target.value);
            }
          }}
          className={`w-full p-4 bg-slate-900 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-sans leading-relaxed ${
            currentValidation.errors.length > 0
              ? 'border-rose-500/60 focus:border-rose-500'
              : 'border-slate-800 focus:border-indigo-500'
          }`}
        />
      </div>

      {/* Character Counter & Status Bar */}
      {activeCustomTab !== 'base' && (
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
          <CharacterCounter validation={currentValidation} />
        </div>
      )}
    </div>
  );
};
