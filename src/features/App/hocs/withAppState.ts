
import { UserInfo } from "@vkontakte/vk-bridge";
import { connect, InferableComponentEnhancer } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../../common/redux/store";
import { ISlaveData } from "../../../common/types/ISlaveData";
import { IUserData } from "../../../common/types/IUserData";
import { appSelector } from "../duck/selectors";
import { appSlice} from "../duck/slice";

const mapStateToProps = (state: IRootState) => ({
  app: appSelector(state),
});

const mapStateToCurrentUserProps = (state:IRootState) => {
  let userSlaves:Record<number, ISlaveData> = {};
  for (let slaveId in state.app.slaves) {
    if (state.app.slaves[slaveId].master_id == state.app.currentUserId) {
      userSlaves[slaveId] = {...state.app.slaves[slaveId]};
    }
  }
  let userSlavesInfo:Record<number, UserInfo> = {};
  for (let slaveId in state.app.slaves) {
    if (state.app.slaves[slaveId].master_id == state.app.currentUserId) {
      userSlavesInfo[slaveId] = {...state.app.usersInfo[slaveId]};
    }
  }
  console.log("In map state to props", state.app.slaves);
  return {
    userInfo: state.app.usersInfo[state.app.currentUserId],
    userSlaves,
    userSlavesInfo,
    userSlave: state.app.slaves[state.app.currentUserId],
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateUserInfo: (user: UserInfo) => dispatch(appSlice.actions.updateUserInfo(user)),
  updateSlave: (slave: ISlaveData) => dispatch(appSlice.actions.updateSlave(slave)),
  updateUserData: (userData: IUserData) => dispatch(appSlice.actions.updateUserData(userData)),
  setCurrentUserId: (userId: number) => dispatch(appSlice.actions.setCurrentUserId(userId)),
  updateUserAccessToken: (token: string) => dispatch(appSlice.actions.updateUserAccessToken(token)),
});



export type IWithAppState = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export type IWithCurrentUserInfo = ReturnType<typeof mapStateToCurrentUserProps> &
  ReturnType<typeof mapDispatchToProps>;

export const withAppState: InferableComponentEnhancer<IWithAppState> = (
  component,
) => connect(mapStateToProps, mapDispatchToProps)(component);

export const withCurrentUserInfo:InferableComponentEnhancer<IWithCurrentUserInfo> = (component,) => (
  connect(mapStateToCurrentUserProps, mapDispatchToProps)(component)
)