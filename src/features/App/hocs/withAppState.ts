import { UserInfo } from "@vkontakte/vk-bridge";
import { connect, InferableComponentEnhancer } from "react-redux";
import { Dispatch } from "redux";
import { DefaultUserInfo } from "../../../common/defaults";
import { IRootState } from "../../../common/redux/store";
import { ISlaveData } from "../../../common/types/ISlaveData";
import { IUserData } from "../../../common/types/IUserData";
import { appSelector } from "../duck/selectors";
import { appSlice } from "../duck/slice";

const mapStateToProps = (state: IRootState) => ({
  app: appSelector(state),
});

const mapStateToCurrentUserProps = (state: IRootState) => {
  console.log("Send props with current user info", Date.now());
  let userSlaves: Record<number, ISlaveData> = {};
  for (let slaveId in state.app.slaves) {
    if (state.app.slaves[slaveId].master_id == state.app.currentUserId) {
      userSlaves[slaveId] = { ...state.app.slaves[slaveId] };
    }
  }
  let userSlavesInfo: Record<number, UserInfo> = {};
  for (let slaveId in state.app.slaves) {
    if (state.app.slaves[slaveId].master_id == state.app.currentUserId) {
      userSlavesInfo[slaveId] = { ...state.app.usersInfo[slaveId] };
    }
  }
  return {
    userInfo: state.app.usersInfo[state.app.currentUserId],
    userSlaves,
    userSlavesInfo,
    userSlave: state.app.slaves[state.app.currentUserId],
    masterInfo:
      state.app.slaves[state.app.currentUserId] &&
      state.app.slaves[state.app.currentUserId].master_id
        ? state.app.usersInfo[
            state.app.slaves[state.app.currentUserId].master_id
          ]
        : DefaultUserInfo,
  };
};

const mapStateToUserProps = (state: IRootState) => {
  return {
    currentUserInfo: state.app.usersInfo[state.app.currentUserId],
    usersInfo: state.app.usersInfo,
    slaves: state.app.slaves,
    loadedUsers: state.app.loadedUsers,
  };
};

const mapStateToMarketProps = (state: IRootState) => {
  return {
    userInfo: state.app.usersInfo[state.app.currentUserId],
    friends: state.app.friends,
    slaves: state.app.slaves,
    usersInfo: state.app.usersInfo,
  };
};

const mapStateToRatingProps = (state: IRootState) => {
  return {
    friendsRating: state.app.friendsRating,
    userInfo: state.app.usersInfo[state.app.currentUserId],
    rating: state.app.rating,
    usersInfo: state.app.usersInfo,
    slaves: state.app.slaves,
    tab: state.app.ratingTab,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateUserInfo: (user: UserInfo) =>
    dispatch(appSlice.actions.updateUserInfo(user)),
  updateUsersInfo: (users: UserInfo[]) =>
    dispatch(appSlice.actions.updateUsersInfo(users)),
  updateSlave: (slave: ISlaveData) =>
    dispatch(appSlice.actions.updateSlave(slave)),
  updateUserData: (userData: IUserData) =>
    dispatch(appSlice.actions.updateUserData(userData)),
  setCurrentUserId: (userId: number) =>
    dispatch(appSlice.actions.setCurrentUserId(userId)),
  updateUserAccessToken: (token: string) =>
    dispatch(appSlice.actions.updateUserAccessToken(token)),
  updateSlaves: (slaves: ISlaveData[]) =>
    dispatch(appSlice.actions.updateSlaves(slaves)),
  updateFriends: (friends: number[]) =>
    dispatch(appSlice.actions.updateFriends(friends)),
  updateRating: (rating: number[]) =>
    dispatch(appSlice.actions.updateRating(rating)),
  updateFriendsRating: (friendsRating: number[]) =>
    dispatch(appSlice.actions.updateFriendsRating(friendsRating)),
  updateRatingTab: (tab: string) =>
    dispatch(appSlice.actions.updateRatingTab(tab)),
  setUserLoaded: (userId: number) =>
    dispatch(appSlice.actions.setUserLoaded(userId)),
});

export type IWithAppState = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export type IWithCurrentUserInfo = ReturnType<
  typeof mapStateToCurrentUserProps
> &
  ReturnType<typeof mapDispatchToProps>;

export type IWithUserInfo = ReturnType<typeof mapStateToUserProps> &
  ReturnType<typeof mapDispatchToProps>;

export type IWithFriends = ReturnType<typeof mapStateToMarketProps> &
  ReturnType<typeof mapDispatchToProps>;

export type IWithRating = ReturnType<typeof mapStateToRatingProps> &
  ReturnType<typeof mapDispatchToProps>;

export const withAppState: InferableComponentEnhancer<IWithAppState> = (
  component
) => connect(mapStateToProps, mapDispatchToProps)(component);

export const withCurrentUserInfo: InferableComponentEnhancer<IWithCurrentUserInfo> = (
  component
) => connect(mapStateToCurrentUserProps, mapDispatchToProps)(component);

export const withUserInfo: InferableComponentEnhancer<IWithUserInfo> = (
  component
) => connect(mapStateToUserProps, mapDispatchToProps)(component);

export const withMarketState: InferableComponentEnhancer<IWithFriends> = (
  component
) => connect(mapStateToMarketProps, mapDispatchToProps)(component);

export const withRatingState: InferableComponentEnhancer<IWithRating> = (
  component
) => connect(mapStateToRatingProps, mapDispatchToProps)(component);
