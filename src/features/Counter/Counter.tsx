import { FC, useState } from 'react';
import { IWithCounterState, withCounterState } from './hocs/withCounterState';
// import { useTranslation } from 'next-i18next';

const CounterComponent: FC<IWithCounterState> = ({
  count,
  decrement,
  increment,
  mult,
}) => {
  const [by, setBy] = useState(0);

  return (
    <div>
      <button type='button' onClick={decrement}>
        decrement
      </button>
      {count}
      <button type='button' onClick={increment}>
        increment
      </button>
      <input
        defaultValue={by}
        onChange={(e) => setBy(Number.parseInt(e.target.value, 10))}
      />
      <button type='button' onClick={() => mult(by)}>
        Multi
      </button>
    </div>
  );
};

export const Counter = withCounterState(CounterComponent);
