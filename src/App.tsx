import React, { useState, useEffect, ReactElement } from "react";
import bridge, { UserInfo } from "@vkontakte/vk-bridge";
import View from "@vkontakte/vkui/dist/components/View/View";

import "@vkontakte/vkui/dist/vkui.css";

import { AdaptivityProvider, Tabbar, TabbarItem } from "@vkontakte/vkui";
import { useLocation } from "@happysanta/router";
import { Epic } from "@vkontakte/vkui/dist/components/Epic/Epic";

import {
  PAGE_MAIN,
  PAGE_MARKET,
  PAGE_RATING,
  PANEL_MAIN,
  PANEL_MARKET,
  PANEL_RATING,
  router,
  VIEW_MAIN,
  VIEW_MARKET,
  VIEW_RATING,
} from "./common/routes/routes";

import {
  Icon28FavoriteOutline,
  Icon28MarketOutline,
  Icon28UserCircleOutline,
} from "@vkontakte/icons";

import Home from "./panels/Home";
import Market from "./panels/Market";

const App = () => {
  const location = useLocation();
  const [fetchedUser, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user: UserInfo = await bridge.send("VKWebAppGetUserInfo");
      setUser(user);
    };
    void fetchData();
  }, []);

  return (
    <AdaptivityProvider>
      <Epic
        activeStory={location.getViewId()}
        tabbar={
          <Tabbar>
            <TabbarItem
              onClick={() => {
                router.replacePage(PAGE_MAIN);
              }}
              selected={location.getPageId() === PAGE_MAIN}
              text="Профиль"
            >
              <Icon28UserCircleOutline />
            </TabbarItem>
            <TabbarItem
              onClick={() => {
                router.replacePage(PAGE_MARKET);
              }}
              selected={location.getPageId() === PAGE_MARKET}
              text="Маркет"
            >
              <Icon28MarketOutline />
            </TabbarItem>
            <TabbarItem
              onClick={() => {
                router.replacePage(PAGE_RATING);
              }}
              selected={location.getPageId() === PAGE_RATING}
              text="Рейтинг"
            >
              <Icon28FavoriteOutline />
            </TabbarItem>
          </Tabbar>
        }
      >
        <View
          id={VIEW_MAIN}
          activePanel={String(location.getViewActivePanel(VIEW_MAIN))}
        >
          <Home id={PANEL_MAIN} fetchedUser={fetchedUser} />
        </View>
        <View
          id={VIEW_MARKET}
          activePanel={String(location.getViewActivePanel(VIEW_MARKET))}
        >
          <Market id={PANEL_MARKET} />
        </View>
        <View
          id={VIEW_RATING}
          activePanel={String(location.getViewActivePanel(VIEW_RATING))}
        >
          <Market id={PANEL_RATING} />
        </View>
      </Epic>
    </AdaptivityProvider>
  );
};

export { App as default };
