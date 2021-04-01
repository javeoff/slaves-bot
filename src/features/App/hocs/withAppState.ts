
import { connect, InferableComponentEnhancer } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../../common/redux/store";
import { appSelector } from "../duck/selectors";
import { appSlice, IUserState } from "../duck/slice";

const mapStateToProps = (state: IRootState) => ({
  app: appSelector(state),
});


const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateUserInfo: (user: IUserState) => dispatch(appSlice.actions.updateUserInfo(user)),
});

export type IWithAppState = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const withAppState: InferableComponentEnhancer<IWithAppState> = (
  component,
) => connect(mapStateToProps, mapDispatchToProps)(component);