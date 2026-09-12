import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { saveDraft, clearEditingDraft } from '../../store/slices/postsSlice';
import { addToast, setPreviewPlatform } from '../../store/slices/uiSlice';
import { selectCurrentUser } from '../../store/selectors';
import { PlatformId } from '../../types/platform';
import { validateAllSelectedPlatforms } from '../../utils/validation';
import { PlatformSelector } from './PlatformSelector';
import { PlatformCustomizer } from './PlatformCustomizer';
import { PostPreview } from './PostPreview';
import { Save, Trash2, CheckCircle2, Sparkles, Tag, Eye } from 'lucide-react';

export const PostComposer: React.FC = () => {
  const dispatch = useAppDispatch();
  const editingDraft = useAppSelector((state) => state.posts.editingDraft);
  const previewPlatform = useAppSelector((state) => state.ui.previewPlatform);
  const currentUser = useAppSelector(selectCurrentUser);

  const [title, setTitle] = useState(editingDraft?.title || '');
  const [baseContent, setBaseContent] = useState(editingDraft?.content || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(
    editingDraft?.selectedPlatforms || ['twitter', 'linkedin']
  );
  const [platformOverrides, setPlatformOverrides] = useState<Record<string, string>>(
    editingDraft?.platformOverrides || {}
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(editingDraft?.tags || ['Social', 'Update']);
  const [activeCustomTab, setActiveCustomTab] = useState<'base' | PlatformId>('base');
  const [activeMobileView, setActiveMobileView] = useState<'editor' | 'preview'>('editor');
  const [formError, setFormError] = useState<string | null>(null);

  // Sync state if editing draft changes
  useEffect(() => {
    if (editingDraft) {
      setTitle(editingDraft.title || '');
      setBaseContent(editingDraft.content || '');
      setSelectedPlatforms(editingDraft.selectedPlatforms || ['twitter', 'linkedin']);
      setPlatformOverrides(editingDraft.platformOverrides || {});
      setTags(editingDraft.tags || []);
    }
  }, [editingDraft]);

  const togglePlatform = (pId: PlatformId) => {
    if (selectedPlatforms.includes(pId)) {
      if (selectedPlatforms.length === 1) {
        setFormError('At least one target platform must be selected.');
        return;
      }
      setSelectedPlatforms((prev) => prev.filter((id) => id !== pId));
      if (activeCustomTab === pId) {
        setActiveCustomTab('base');
      }
    } else {
      setSelectedPlatforms((prev) => [...prev, pId]);
      setFormError(null);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Perform multi-platform validation
  const validationState = validateAllSelectedPlatforms(
    baseContent,
    platformOverrides,
    selectedPlatforms
  );

  const handleSaveDraft = (status: 'draft' | 'ready' = 'draft') => {
    if (selectedPlatforms.length === 0) {
      setFormError('Please select at least one platform.');
      return;
    }
    if (!baseContent.trim() && Object.keys(platformOverrides).length === 0) {
      setFormError('Post content cannot be completely empty.');
      return;
    }
    if (!validationState.isAllValid) {
      dispatch(
        addToast({
          type: 'warning',
          title: 'Validation Warning',
          message: 'Post saved, but please fix character limit errors before publishing.',
        })
      );
    }

    dispatch(
      saveDraft({
        id: editingDraft?.id,
        authorId: currentUser?.id,
        authorName: currentUser?.name,
        title: title.trim() || 'Untitled Post',
        content: baseContent,
        selectedPlatforms,
        platformOverrides,
        tags,
        status,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: editingDraft ? 'Draft Updated' : 'Draft Saved',
        message: `"${title.trim() || 'Post'}" saved to drafts successfully!`,
      })
    );
  };

  const handleClear = () => {
    dispatch(clearEditingDraft());
    setTitle('');
    setBaseContent('');
    setSelectedPlatforms(['twitter', 'linkedin']);
    setPlatformOverrides({});
    setTags(['Social', 'Update']);
    setActiveCustomTab('base');
    setFormError(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Mobile View Toggle (Editor / Preview) */}
      <div className="flex md:hidden bg-slate-900 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveMobileView('editor')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeMobileView === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Sparkles size={14} /> Composer Editor
        </button>
        <button
          onClick={() => setActiveMobileView('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeMobileView === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Eye size={14} /> Live Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Column */}
        <div
          className={`lg:col-span-7 space-y-5 ${
            activeMobileView === 'preview' ? 'hidden md:block' : 'block'
          }`}
        >
          {/* Post Title */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Post Title / Topic
              </label>
              {editingDraft && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
                  Editing Draft: {editingDraft.id}
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. Q3 Product Release & Feature Highlights"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Tag size={14} className="text-slate-400" />
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                >
                  #{t}
                  <button
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-400 text-slate-400"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="+ Add tag (Press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="bg-transparent text-xs text-slate-300 placeholder-slate-500 focus:outline-none py-0.5 px-2 border-b border-transparent focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Platform Selector */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onTogglePlatform={togglePlatform}
              error={formError || undefined}
            />
          </div>

          {/* Main Content & Overrides Editor */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <PlatformCustomizer
              baseContent={baseContent}
              onBaseContentChange={setBaseContent}
              platformOverrides={platformOverrides}
              onOverrideChange={(pId, val) =>
                setPlatformOverrides((prev) => ({ ...prev, [pId]: val }))
              }
              selectedPlatforms={selectedPlatforms}
              activeCustomTab={activeCustomTab}
              onSelectTab={setActiveCustomTab}
              validations={validationState.platformResults}
            />
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Trash2 size={16} /> Clear Editor
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSaveDraft('draft')}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
              >
                <Save size={16} />
                <span>{editingDraft ? 'Update Draft' : 'Save as Draft'}</span>
              </button>

              <button
                onClick={() => handleSaveDraft('ready')}
                disabled={!validationState.isAllValid}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md ${
                  validationState.isAllValid
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/25 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <CheckCircle2 size={16} />
                <span>Mark Ready to Publish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div
          className={`lg:col-span-5 ${
            activeMobileView === 'editor' ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="sticky top-20">
            <PostPreview
              baseContent={baseContent}
              platformOverrides={platformOverrides}
              selectedPlatforms={selectedPlatforms}
              activePreviewPlatform={previewPlatform}
              onSelectPreviewPlatform={(pId) => dispatch(setPreviewPlatform(pId))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
