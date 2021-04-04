import React from "react";

import { render } from "react-dom";
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";

import { RouterContext } from "@happysanta/router";

import { router } from "./common/routes/routes";

import App from "./App";
import { Provider } from "react-redux";
import { initializeStore } from "./common/redux/store";

router.start();
render(
  <Provider store={initializeStore()}>
    <RouterContext.Provider value={router}>
      <ConfigProvider>
        <AdaptivityProvider>
          <AppRoot>
            <App />
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    </RouterContext.Provider>
  </Provider>,
  document.querySelector("#root")
);
