import React, { useState, useEffect, ReactElement } from 'react';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
// import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';

import { AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import { useLocation } from '@happysanta/router';

import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';

import { PANEL_MAIN, VIEW_MAIN } from './common/routes/routes';

const App = () => {
  const location = useLocation();
  const [fetchedUser, setUser] = useState<UserInfo | null>(null);
  const [popout, setPopout] = useState<ReactElement | null>();

  useEffect(() => {
    const fetchData = async () => {
      const user: UserInfo = await bridge.send('VKWebAppGetUserInfo');

      setUser(user);
      setPopout(null);
    };
    void fetchData();
  }, []);

  // const go = (e: Event) => {
  //   // const target = e.currentTarget as HTMLElement;
  //   // setActivePanel(target.dataset.to);
  // };

  return (
    <AdaptivityProvider>
      <AppRoot>
        <View
          id={VIEW_MAIN}
          activePanel={String(location.getViewActivePanel(VIEW_MAIN))}
          popout={popout}
        >
          <Home id={PANEL_MAIN} fetchedUser={fetchedUser} />
        </View>
      </AppRoot>
    </AdaptivityProvider>
  );
};

export { App as default };
