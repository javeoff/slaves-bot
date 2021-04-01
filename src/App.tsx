import React, { useState, useEffect, ReactElement } from 'react';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import { AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';

const App = () => {
  const [activePanel] = useState('home');
  const [fetchedUser, setUser] = useState<UserInfo | null>(null);
  const [popout, setPopout] = useState<ReactElement | null>(<ScreenSpinner />);

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
        <View activePanel={activePanel} popout={popout}>
          <Home id='home' fetchedUser={fetchedUser} />
        </View>
      </AppRoot>
    </AdaptivityProvider>
  );
};

export { App as default };
