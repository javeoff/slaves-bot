import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '@vkontakte/vk-bridge';
import { ISlaveData } from '../../../common/types/ISlaveData';
import { IUserData } from '../../../common/types/IUserData';

const initialState:IAppState = {
  currentUserId: 0,
  slaves: {},
  usersInfo: {},
  usersData: {},
  userAccessToken: "",
};

export interface IAppState {
  currentUserId: number,
  userAccessToken: string,
  slaves: Record<number, ISlaveData>, // Объект с информацией о рабах с сервера
  usersInfo: Record<number, UserInfo>, // Объект из {1: UserInfo, 2: UserInfo}
  usersData: Record<number, IUserData>, // Объект с упрощенной информацией о каждом пользователе
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    updateSlave: (draft, action:PayloadAction<ISlaveData>) => {
      draft.slaves[action.payload.id] = action.payload;
    },
    updateSlaves: (draft, action:PayloadAction<ISlaveData[]>) => {
      action.payload.forEach(slave => {
        draft.slaves[slave.id] = slave;
      })
    },
    updateUsersInfo: (draft, action:PayloadAction<UserInfo[]>) => {
      action.payload.forEach(user => {
        draft.usersInfo[user.id] = user;
      })
    },
    updateUserInfo: (draft, action:PayloadAction<UserInfo>) => {
      console.log(action);
      draft.usersInfo[action.payload.id] =  action.payload;
    },
    updateUserData: (draft, action:PayloadAction<IUserData>) => {
      draft.usersData[action.payload.id] = action.payload;
    },
    setCurrentUserId: (draft, action:PayloadAction<number>) => {
      draft.currentUserId = action.payload;
    },
    updateUserAccessToken: (draft, action:PayloadAction<string>) => {
      draft.userAccessToken = action.payload;
    },
  },
});
