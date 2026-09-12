import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setSearchQuery,
  setPlatformFilter,
  setStatusFilter,
  setSortOption,
  resetFilters,
} from '../../store/slices/postsSlice';
import { PLATFORMS, PlatformId } from '../../types/platform';
import { DraftStatus } from '../../types/post';
import { Search, LayoutGrid, List, RotateCcw } from 'lucide-react';

interface DraftFiltersProps {
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
}

export const DraftFilters: React.FC<DraftFiltersProps> = ({ viewMode, onToggleViewMode }) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.posts.filter);

  const platformList = Object.values(PLATFORMS);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search drafts by title, content, or tag..."
          value={filter.searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Platform Dropdown */}
        <select
          value={filter.platform}
          onChange={(e) => dispatch(setPlatformFilter(e.target.value as PlatformId | 'all'))}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">All Platforms</option>
          {platformList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={filter.status}
          onChange={(e) => dispatch(setStatusFilter(e.target.value as DraftStatus | 'all'))}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="ready">Ready to Publish</option>
        </select>

        {/* Sort Select */}
        <select
          value={filter.sortBy}
          onChange={(e) =>
            dispatch(setSortOption({ sortBy: e.target.value as 'updatedAt' | 'createdAt' | 'title' }))
          }
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="updatedAt">Last Updated</option>
          <option value="createdAt">Date Created</option>
          <option value="title">Title (A-Z)</option>
        </select>

        {/* Reset Filter Button */}
        {(filter.searchQuery || filter.platform !== 'all' || filter.status !== 'all') && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:bg-slate-800 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw size={16} />
          </button>
        )}

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => onToggleViewMode('grid')}
            className={`p-1.5 rounded-lg text-slate-400 transition-colors ${
              viewMode === 'grid' ? 'bg-slate-800 text-indigo-400' : 'hover:text-white'
            }`}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onToggleViewMode('list')}
            className={`p-1.5 rounded-lg text-slate-400 transition-colors ${
              viewMode === 'list' ? 'bg-slate-800 text-indigo-400' : 'hover:text-white'
            }`}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
