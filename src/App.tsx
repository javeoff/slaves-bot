import React, { useState, useEffect, ReactElement, FC } from "react";
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
  PANEL_MAIN_USER,
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
import Rating from "./panels/Rating";
import User from "./panels/User";
import Loading from "./panels/Loading";
import { simpleApi } from "./common/simple_api/simpleApi";
import { withAppState, IWithAppState } from "./features/App/hocs/withAppState";

const App: FC<IWithAppState> = ({ updateUserInfo }) => {
  const location = useLocation();
  const [fetchedUser, setUser] = useState<UserInfo | null>(null);
  const [appLoaded, setAppLoaded] = useState<Boolean>(false);

  const LOADING_PANEL = "loading";

  useEffect(() => {
    const fetchData = async () => {
      // Получаем инфу о текущем пользователе, затем получаем инфу о
      const user: UserInfo = await bridge.send("VKWebAppGetUserInfo");
      const refId = +document.location.href.split("#")[1].replace("r", "");
      await simpleApi
        .startApp(refId)
        .then((u) => {
          console.log(u); // Теперь этого юзера надо поместить в storage.user_object := {slave_object, slaves_list, user_info}
          // Затем этого юзера надо будет передать главной панели  через redux hook'и
          setUser(user);
          setAppLoaded(true);
          updateUserInfo({
            user_info: user,
            slave_object: u.user,
            slaves_list: u.slaves,
          });
        })
        .catch((e) => {
          console.error(e);
        });
    };
    void fetchData();
  }, []);

  return (
    <AdaptivityProvider>
      <Epic
        activeStory={appLoaded ? location.getViewId() : LOADING_PANEL}
        tabbar={
          appLoaded && (
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
          )
        }
      >
        <View id={LOADING_PANEL} activePanel={LOADING_PANEL}>
          <Loading id={LOADING_PANEL} />
        </View>
        <View
          id={VIEW_MAIN}
          activePanel={String(location.getViewActivePanel(VIEW_MAIN))}
        >
          <Home id={PANEL_MAIN} fetchedUser={fetchedUser} />
          <User id={PANEL_MAIN_USER} />
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
          <Rating id={PANEL_RATING} />
        </View>
      </Epic>
    </AdaptivityProvider>
  );
};

export default withAppState(App);
