import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "@vkontakte/vk-bridge";
import { ISlaveData } from "../../../common/types/ISlaveData";
import { IUserData } from "../../../common/types/IUserData";

const initialState: IAppState = {
  currentUserId: 0,
  slaves: {},
  usersInfo: {},
  usersData: {},
  friends: [],
  userAccessToken: "",
  rating: [],
  friendsRating: [],
  ratingTab: "global-rating",
  loadedUsers: [],
  friendsIds: [],
  userSubscribedOnGroup: null,
};

export interface IAppState {
  currentUserId: number;
  userAccessToken: string;
  friends: number[];
  friendsRating: number[];
  rating: number[];
  slaves: Record<number, ISlaveData>; // Объект с информацией о рабах с сервера
  usersInfo: Record<number, UserInfo>; // Объект из {1: UserInfo, 2: UserInfo}
  usersData: Record<number, IUserData>; // Объект с упрощенной информацией о каждом пользователе
  ratingTab: string;
  loadedUsers: number[];
  friendsIds: Record<number, number[]>;
  userSubscribedOnGroup: boolean|null;
}

export const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    updateSlave: (draft, action: PayloadAction<ISlaveData>) => {
      draft.slaves[action.payload.id] = action.payload;
    },
    updateSlaves: (draft, action: PayloadAction<ISlaveData[]>) => {
      action.payload.forEach((slave) => {
        draft.slaves[slave.id] = slave;
      });
    },
    updateUsersInfo: (draft, action: PayloadAction<UserInfo[]>) => {
      action.payload.forEach((user) => {
        draft.usersInfo[user.id] = user;
      });
    },
    updateFriends: (draft, action: PayloadAction<number[]>) => {
      draft.friends = action.payload;
    },
    updateRating: (draft, action: PayloadAction<number[]>) => {
      draft.rating = action.payload;
    },
    updateFriendsRating: (draft, action: PayloadAction<number[]>) => {
      draft.friendsRating = action.payload;
    },
    updateRatingTab: (draft, action: PayloadAction<string>) => {
      draft.ratingTab = action.payload;
    },
    updateUserInfo: (draft, action: PayloadAction<UserInfo>) => {
      console.log(action);
      draft.usersInfo[action.payload.id] = action.payload;
    },
    updateUserData: (draft, action: PayloadAction<IUserData>) => {
      draft.usersData[action.payload.id] = action.payload;
    },
    setCurrentUserId: (draft, action: PayloadAction<number>) => {
      draft.currentUserId = action.payload;
    },
    updateUserAccessToken: (draft, action: PayloadAction<string>) => {
      draft.userAccessToken = action.payload;
    },
    setUserLoaded: (draft, action: PayloadAction<number>) => {
      draft.loadedUsers.push(action.payload);
    },
    setUserSubscribedOnGroup: (draft, action: PayloadAction<boolean>) => {
      draft.userSubscribedOnGroup = action.payload;
    },
    updateFriendsIds: (
      draft,
      action: PayloadAction<Record<number, number[]>>
    ) => {
      draft.friendsIds = { ...draft.friendsIds, ...action.payload };
    },
  },
});
