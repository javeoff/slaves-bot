import React from 'react';

import { render } from 'react-dom';
import { ConfigProvider, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';

import { RouterContext } from '@happysanta/router';

import { router } from './common/routes/routes';

import App from './App';

router.start();
render(
  <RouterContext.Provider value={router}>
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <App />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  </RouterContext.Provider>,
  document.querySelector('#root'),
);
