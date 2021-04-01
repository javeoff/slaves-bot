import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '@vkontakte/vk-bridge';
import { ISlaveData } from '../../../common/types/ISlaveData';

const initialState = {
  user: {}
};

export interface IUserState {
  user_info: UserInfo;
  slaves_list: ISlaveData[];
  slave_object: ISlaveData;
}

export interface IAppState {
  user: IUserState | null;
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    updateUserInfo: (draft, action: PayloadAction<IUserState>) => {
      draft.user = action.payload;
    },
  },
});
