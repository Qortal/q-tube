/* eslint-disable */
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './features/notificationsSlice';
import globalReducer from './features/globalSlice';
import videoReducer from './features/videoSlice';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistSettingsConfig = {
  key: 'persist',
  version: 1,
  storage,
};

const reducer = combineReducers({
  notifications: notificationsReducer,
  global: globalReducer,
  video: videoReducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  preloadedState: undefined, // optional, can be any valid state object
});

// Define the RootState type, which is the type of the entire Redux state tree.
// This is useful when you need to access the state in a component or elsewhere.
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch type, which is the type of the Redux store's dispatch function.
// This is useful when you need to dispatch an action in a component or elsewhere.
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
