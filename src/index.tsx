import React from "react";

import { render } from "react-dom";
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";

import App from "./App";
import { Provider } from "react-redux";
import { initializeStore } from "./common/redux/store";

render(
  <Provider store={initializeStore()}>
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <App />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  </Provider>,
  document.querySelector("#root")
);
