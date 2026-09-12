import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PLATFORMS, PlatformConfig, PlatformId } from '../../types/platform';

interface PlatformsState {
  platforms: Record<PlatformId, PlatformConfig>;
  activePlatforms: PlatformId[];
}

const initialState: PlatformsState = {
  platforms: PLATFORMS,
  activePlatforms: ['twitter', 'linkedin', 'facebook', 'instagram', 'threads'],
};

export const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    togglePlatformActive: (state, action: PayloadAction<PlatformId>) => {
      const pId = action.payload;
      if (state.activePlatforms.includes(pId)) {
        state.activePlatforms = state.activePlatforms.filter((id) => id !== pId);
      } else {
        state.activePlatforms.push(pId);
      }
    },
  },
});

export const { togglePlatformActive } = platformsSlice.actions;
export default platformsSlice.reducer;
