import {
  configureStore,
  EnhancedStore,
  getDefaultMiddleware,
  StateFromReducersMapObject,
} from '@reduxjs/toolkit';

import { Feature } from '../enums/Feature';
import { counterSlice } from '../../features/Counter/duck/slice';
import { appSlice } from '../../features/App/duck/slice';

const reducer = {
  [Feature.COUNTER]: counterSlice.reducer,
  [Feature.APP]: appSlice.reducer,
};

export type IRootState = StateFromReducersMapObject<typeof reducer>;

const middleware = getDefaultMiddleware({ thunk: true });

export const initializeStore = (
  preloadedState?: IRootState,
): EnhancedStore<IRootState> =>
  configureStore({
    reducer,
    middleware,
    preloadedState,
  });
