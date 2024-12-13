import { createSlice } from '@reduxjs/toolkit';

const profilesSlice = createSlice({
  name: 'profiles',
  initialState: {
    list: [],
    activeProfile: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setProfiles: (state, action) => {
      state.list = action.payload;
      // If there's an active profile in the list, set it
      const active = state.list.find((profile) => profile.active);
      state.activeProfile = active || null;
    },
    setActiveProfile: (state, action) => {
      state.activeProfile = action.payload;
      state.list = state.list.map((profile) => ({
        ...profile,
        active: profile.id === (action.payload ? action.payload.id : null),
      }));
    },
    addProfile: (state, action) => {
      state.list.push(action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateProfileGameProgress: (state, action) => {
      const { profileId, game, difficulty, level, score } = action.payload;
      // Find the profile in the list
      const profileIndex = state.list.findIndex(
        (profile) => profile.id === profileId
      );

      if (profileIndex !== -1) {
        const profile = state.list[profileIndex];

        // Create new games object with updated values
        const newGames = {
          ...profile.games,
          [game]: {
            ...profile.games?.[game],
            [difficulty]: {
              ...(profile.games?.[game]?.[difficulty] || {}),
              level,
              score,
            },
          },
        };

        // Create a new profile
        const newProfile = {
          ...profile,
          games: newGames,
        };

        // Update the profile in the list
        state.list[profileIndex] = newProfile;

        // Update activeProfile if it's the same profile
        if (state.activeProfile && state.activeProfile.id === profileId) {
          state.activeProfile = newProfile;
        }
      }
    },
  },
});

export const {
  setProfiles,
  setActiveProfile,
  addProfile,
  setLoading,
  setError,
  updateProfileGameProgress,
} = profilesSlice.actions;

export const selectProfiles = (state) => state.profiles.list;
export const selectActiveProfile = (state) => state.profiles.activeProfile;
export const selectProfilesLoading = (state) => state.profiles.isLoading;
export const selectProfilesError = (state) => state.profiles.error;

export default profilesSlice.reducer;
