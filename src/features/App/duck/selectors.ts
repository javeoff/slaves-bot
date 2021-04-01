import { createSelector } from '@reduxjs/toolkit';
import { IRootState } from '../../../common/redux/store';

export const appSelector = (state: IRootState) => state.app;

export const userSelector = createSelector(
  appSelector,
  (counter) => counter.user,
);
