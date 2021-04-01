import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiUserData } from '../../../common/api/services/UserData/ApiUserData';

interface IState {
  count: number;
}

// const { userFio, userPhone } = (await apiUserData.getData()).payload;

export const asyncActions = {
  getUserInfo: createAsyncThunk(`/user`, async (dto) => {
    // const response = await apiUserData.getData(dto);

    // return response.payload;
    return null
  }),
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    count: 0,
  } as IState,
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
