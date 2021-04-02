
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


const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateUserInfo: (user: UserInfo) => dispatch(appSlice.actions.updateUserInfo(user)),
  updateSlave: (slave: ISlaveData) => dispatch(appSlice.actions.updateSlave(slave)),
  updateUserData: (userData: IUserData) => dispatch(appSlice.actions.updateUserData(userData)),
  setCurrentUserId: (userId: number) => dispatch(appSlice.actions.setCurrentUserId(userId)),
});

export type IWithAppState = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const withAppState: InferableComponentEnhancer<IWithAppState> = (
  component,
) => connect(mapStateToProps, mapDispatchToProps)(component);