import { Dispatch } from 'redux';
import { connect, InferableComponentEnhancer } from 'react-redux';
import { counterSlice } from '../duck/slice';
import { countSelector } from '../duck/selectors';
import { IRootState } from '../../../common/redux/store';

const mapStateToProps = (state: IRootState) => ({
  count: countSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  increment: () => dispatch(counterSlice.actions.increment()),
  decrement: () => dispatch(counterSlice.actions.decrement()),
  mult: (by: number) => dispatch(counterSlice.actions.mult(by)),
});

export type IWithCounterState = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export const withCounterState: InferableComponentEnhancer<IWithCounterState> = (
  component,
) => connect(mapStateToProps, mapDispatchToProps)(component);
