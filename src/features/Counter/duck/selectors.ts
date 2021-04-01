import { createSelector } from '@reduxjs/toolkit';
import { IRootState } from '../../../common/redux/store';

export const counterSelector = (state: IRootState) => state.counter;

export const countSelector = createSelector(
  counterSelector,
  (counter) => counter.count,
);
