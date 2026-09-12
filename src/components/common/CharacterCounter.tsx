import React from 'react';
import { ValidationResult } from '../../types/post';

interface CharacterCounterProps {
  validation: ValidationResult;
  showCircular?: boolean;
  compact?: boolean;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  validation,
  showCircular = true,
  compact = false,
}) => {
  const { charCount, maxCount, remaining, percentage, errors, warnings } = validation;

  const isOverLimit = charCount > maxCount;
  const isWarning = remaining <= 30 && !isOverLimit;

  // Determine progress color
  let strokeColor = 'stroke-indigo-500';
  let textColor = 'text-slate-400';
  let badgeBg = 'bg-slate-800 text-slate-300 border-slate-700';

  if (isOverLimit) {
    strokeColor = 'stroke-rose-500';
    textColor = 'text-rose-400 font-semibold';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (isWarning) {
    strokeColor = 'stroke-amber-400';
    textColor = 'text-amber-400 font-medium';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (percentage > 70) {
    strokeColor = 'stroke-sky-400';
    textColor = 'text-sky-300';
  }

  // Circular SVG params
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full border ${badgeBg}`}>
        <span className={textColor}>
          {remaining < 0 ? `${remaining}` : `${charCount}/${maxCount}`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {showCircular && (
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 transform -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  className={`transition-all duration-300 ease-out ${strokeColor}`}
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className={`absolute text-[10px] font-medium ${textColor}`}>
                {percentage}%
              </span>
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-mono text-sm ${textColor}`}>
                {charCount.toLocaleString()}
              </span>
              <span className="text-slate-500">/ {maxCount.toLocaleString()} chars</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isOverLimit
                ? `${Math.abs(remaining).toLocaleString()} characters over limit`
                : `${remaining.toLocaleString()} characters remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* Errors & Warnings */}
      {errors.length > 0 && (
        <div className="mt-1 flex flex-col gap-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-rose-400 flex items-center gap-1 font-medium bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              {err}
            </p>
          ))}
        </div>
      )}

      {warnings.length > 0 && errors.length === 0 && (
        <div className="mt-1 flex flex-col gap-1">
          {warnings.map((warn, i) => (
            <p key={i} className="text-xs text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              {warn}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
