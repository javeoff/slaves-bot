import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '@vkontakte/vk-bridge';
import { ISlaveData } from '../../../common/types/ISlaveData';
import { IUserData } from '../../../common/types/IUserData';

const initialState = {
  currentUserId: 0,
  slaves: new Map<number, ISlaveData>(),
  usersInfo: new Map<number, UserInfo>(),
  usersData: new Map<number, IUserData>(),
};

export interface IAppState {
  currentUserId: number,
  
  slaves: Map<number, ISlaveData>, // Объект с информацией о рабах с сервера
  usersInfo: Map<number, UserInfo>, // Объект из {1: UserInfo, 2: UserInfo}
  usersData: Map<number, IUserData>, // Объект с упрощенной информацией о каждом пользователе
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    updateSlave: (draft, action:PayloadAction<ISlaveData>) => {
      draft.slaves.set(action.payload.id, action.payload);
    },
    updateUserInfo: (draft, action:PayloadAction<UserInfo>) => {
      draft.usersInfo.set(action.payload.id, action.payload);
    },
    updateUserData: (draft, action:PayloadAction<IUserData>) => {
      draft.usersData.set(action.payload.id, action.payload);
    },
    setCurrentUserId: (draft, action:PayloadAction<number>) => {
      draft.currentUserId = action.payload;
    },
  },
});
