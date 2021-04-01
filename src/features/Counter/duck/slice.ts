import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  count: number;
}

const initialState = {
  count: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState: initialState,
  reducers: {
    increment: (draft) => {
      draft.count += 1;
    },
    decrement: (draft) => {
      draft.count -= 1;
    },
    mult: (draft, action: PayloadAction<number>) => {
      draft.count *= action.payload;
    },
  },
});
