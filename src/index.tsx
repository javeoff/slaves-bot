import React from 'react';

import { render } from 'react-dom';
import { ConfigProvider, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';

import App from './App';

render(
  <ConfigProvider>
    <AdaptivityProvider>
      <AppRoot>
        <App />
      </AppRoot>
    </AdaptivityProvider>
  </ConfigProvider>,
  document.querySelector('#root'),
);
