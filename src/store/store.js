import { configureStore, combineReducers } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import profilesReducer from './profilesSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 


const rootReducer = combineReducers({
  users: usersReducer,
  profiles: profilesReducer,
});

// Configure Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['users', 'profiles'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
export const persistor = persistStore(store);
