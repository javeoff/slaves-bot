import React from "react";

import { render } from "react-dom";
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";

import App from "./App";
import { Provider } from "react-redux";
import { initializeStore } from "./common/redux/store";

window.onerror = function (errorMsg, url, lineNumber, columnNumber, error) {
  let textAoutput =
    "Отправьте информацию об ошибке в лс группы: vk.me/peostore <br/><pre>" +
    errorMsg +
    "\n" +
    url +
    ":" +
    lineNumber +
    ":" +
    columnNumber +
    "\n" +
    (error || {}).stack +
    "</pre><br/>" +
    window.navigator.userAgent;

  document.body.innerHTML = textAoutput;
  console.error(error);
  console.info(textAoutput);
  return false;
};

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
