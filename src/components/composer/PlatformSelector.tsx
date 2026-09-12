import React from 'react';
import { PLATFORMS, PlatformId } from '../../types/platform';
import { PlatformIcon } from '../common/PlatformIcon';
import { Check } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: PlatformId[];
  onTogglePlatform: (platformId: PlatformId) => void;
  error?: string;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onTogglePlatform,
  error,
}) => {
  const platformList = Object.values(PLATFORMS);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Target Platforms <span className="text-rose-400">*</span>
        </label>
        <span className="text-[11px] text-slate-400">
          {selectedPlatforms.length} of {platformList.length} selected
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {platformList.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);

          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => onTogglePlatform(platform.id)}
              className={`relative flex flex-col justify-between p-3 rounded-xl border text-left transition-all group ${
                isSelected
                  ? `${platform.bgColor} ${platform.borderColor} ring-1 ring-offset-0 ring-indigo-500/50 shadow-md`
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <PlatformIcon platformId={platform.id} size={18} />
                  </div>
                  <span className="text-xs font-semibold text-white truncate">{platform.name}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-transparent border border-slate-700'
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Limit</span>
                <span className="font-mono font-medium text-slate-300">
                  {platform.maxCharacters.toLocaleString()}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
    </div>
  );
};
