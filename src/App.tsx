import React, { useState, useEffect, FC } from "react";
import View from "@vkontakte/vkui/dist/components/View/View";

import "@vkontakte/vkui/dist/vkui.css";

import {
  AdaptivityProvider,
  ModalRoot,
  Root,
  Tabbar,
  TabbarItem,
} from "@vkontakte/vkui";

import { Epic } from "@vkontakte/vkui/dist/components/Epic/Epic";
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
import { bridgeClient } from "./common/bridge/bridge";
import { ModalError, MODAL_ERROR_CARD } from "./modals/Error";
import { ModalGiveJob, MODAL_GIVE_JOB_CARD } from "./modals/GiveJob";

import {
  getActiveRouter,
  marketRouter,
  PAGE_MARKET_PANEL,
  PAGE_MARKET_USER,
  PAGE_MARKET_USER_PANEL,
  PAGE_MARKET_VIEW,
  PAGE_PROFILE_PANEL,
  PAGE_PROFILE_USER,
  PAGE_PROFILE_USER_PANEL,
  PAGE_PROFILE_VIEW,
  PAGE_RATING_PANEL,
  PAGE_RATING_USER,
  PAGE_RATING_USER_PANEL,
  PAGE_RATING_VIEW,
  ratingRouter,
  router,
} from "./common/routes";

import { Router } from "./common/custom-router";
import { MODAL_YOUSLAVE_CARD, ModalYouSlave } from "./modals/YouSlave";
import "./App.css";
import { openErrorModal } from "./modals/openers";

const useRouter = (router: Router) => {
  let [r, setRouterChanged] = useState<string>("");
  useEffect(() => {
    router.onUpdateHistory(() => {
      setRouterChanged(
        String(Date.now()) + "_" + Math.floor(Math.random() * 1000)
      );
    });
  }, []);
  return r;
};

const App: FC<IWithAppState> = ({
  updateUserInfo,
  updateSlave,
  setCurrentUserId,
  updateUserAccessToken,
  updateSlaves,
  updateUsersInfo,
}) => {
  useRouter(router);
  useRouter(marketRouter);
  useRouter(ratingRouter);

  const [appLoaded, setAppLoaded] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [activeStory, setActiveStory] = useState<
    "profile" | "market" | "loading" | "rating"
  >("loading");

  const LOADING_PANEL = "loading";

  const reloadUserInformation = async (fetch: boolean = false) => {
    console.log("Reload user info");
    const user = await bridgeClient.getUserInfo();
    let refId = +document.location.href.split("#")[1]?.replace("r", "");
    if (isNaN(refId)) refId = 0;
    if (fetch) setIsFetching(true);
    await simpleApi
      .startApp(refId)
      .then(async (u) => {
        setCurrentUserId(user.id);
        updateUserInfo(user);
        updateSlave(u.user);

        let slaveIds: number[] = [];
        u.slaves.forEach((slave) => slaveIds.push(slave.id));
        let users = await bridgeClient.getUsersByIds(slaveIds);
        if (u.user.master_id != 0) {
          let masterInfo = await bridgeClient.getUsersByIds([
            u.user.master_id,
            -1,
          ]);
          updateUsersInfo([masterInfo[0]]);
        }
        updateUsersInfo(users);
        updateSlaves(u.slaves);
        setAppLoaded(true);
        setActiveStory("profile");
        if (fetch) setIsFetching(false);
      })
      .catch((e) => {
        console.error(e);
        openErrorModal(e);
        if (fetch) setIsFetching(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data user");
      let userToken = "";
      while (true) {
        // Получаем токен, пока не получим
        let userTokenData = await bridgeClient.getUserToken().catch((e) => {
          return null;
        });
        if (userTokenData) {
          userToken = userTokenData.access_token;
        }
        if (userToken) break;
        updateUserAccessToken(userToken);
      }
      bridgeClient.setAccessToken(userToken);
      reloadUserInformation();
    };
    void fetchData();
  }, []);

  const isAlreadyOnTop = (): boolean => {
    return window.pageYOffset === 0;
  };

  const clickOnTabItem = (tabItem: "profile" | "market" | "rating") => {
    if (tabItem === activeStory) {
      if (!isAlreadyOnTop()) {
        window.scrollTo(0, 0);
        return;
      } else {
        if (tabItem === "profile") {
          if (router.getPanelId() !== PAGE_PROFILE_PANEL) {
            router.popPageTo(PAGE_PROFILE_VIEW, PAGE_PROFILE_PANEL);
            return;
          }
        } else if (tabItem === "market") {
          if (marketRouter.getPanelId() !== PAGE_MARKET_PANEL) {
            marketRouter.popPageTo(PAGE_MARKET_VIEW, PAGE_MARKET_PANEL);
            return;
          }
        } else if (tabItem === "rating") {
          if (ratingRouter.getPanelId() !== PAGE_RATING_PANEL) {
            ratingRouter.popPageTo(PAGE_RATING_VIEW, PAGE_RATING_PANEL);
            return;
          }
        }
      }
    }
    if (tabItem === "profile") {
      marketRouter.stopNativeListeners();
      ratingRouter.stopNativeListeners();
      router.startNativeListeners();
    } else if (tabItem == "market") {
      router.stopNativeListeners();
      ratingRouter.stopNativeListeners();
      marketRouter.startNativeListeners();
    } else if (tabItem == "rating") {
      router.stopNativeListeners();
      marketRouter.stopNativeListeners();
      ratingRouter.startNativeListeners();
    }
    setActiveStory(tabItem);
  };

  let activeRouter = getActiveRouter();

  const modal = (
    <ModalRoot activeModal={activeRouter.getModalId()}>
      <ModalError
        id={MODAL_ERROR_CARD}
        onClose={() => activeRouter.popPage()}
      />
      <ModalGiveJob
        id={MODAL_GIVE_JOB_CARD}
        onClose={() => activeRouter.popPage()}
      />
      <ModalYouSlave
        id={MODAL_YOUSLAVE_CARD}
        onClose={() => activeRouter.popPage()}
      />
    </ModalRoot>
  );

  console.log("Render app", Date.now());
  return (
    <AdaptivityProvider>
      <Epic
        activeStory={appLoaded ? activeStory : LOADING_PANEL}
        tabbar={
          appLoaded ? (
            <Tabbar>
              <TabbarItem
                onClick={() => {
                  clickOnTabItem("profile");
                }}
                selected={activeStory === "profile"}
                text="Профиль"
              >
                <Icon28UserCircleOutline />
              </TabbarItem>
              <TabbarItem
                onClick={() => {
                  clickOnTabItem("market");
                }}
                selected={activeStory === "market"}
                text="Маркет"
              >
                <Icon28MarketOutline />
              </TabbarItem>
              <TabbarItem
                onClick={() => {
                  clickOnTabItem("rating");
                }}
                selected={activeStory === "rating"}
                text="Рейтинг"
              >
                <Icon28FavoriteOutline />
              </TabbarItem>
            </Tabbar>
          ) : null
        }
      >
        <Root id="loading" activeView={LOADING_PANEL}>
          <View
            id={LOADING_PANEL}
            modal={modal}
            activePanel={String(LOADING_PANEL)}
          >
            <Loading id={LOADING_PANEL} />
          </View>
        </Root>
        <Root id="profile" activeView="profile">
          <View id="profile" modal={modal} activePanel={router.getPanelId()}>
            <Home
              id={PAGE_PROFILE_PANEL}
              onRefresh={() => reloadUserInformation(true)}
              isFetching={isFetching}
              router={router}
            />
            {router.getInfinityPanels(PAGE_PROFILE_VIEW).map((panelId) => {
              if (
                router.getInfinityPanelOriginal(PAGE_PROFILE_VIEW, panelId) ===
                PAGE_PROFILE_USER_PANEL
              ) {
                return (
                  <User
                    key={panelId}
                    id={panelId}
                    routerType={PAGE_PROFILE_VIEW}
                    pageOpened={PAGE_PROFILE_USER}
                    router={router}
                  ></User>
                );
              }
            })}
          </View>
        </Root>
        <Root id="market" activeView="market">
          <View
            id={PAGE_MARKET_VIEW}
            modal={modal}
            activePanel={marketRouter.getPanelId()}
          >
            <Market id={PAGE_MARKET_PANEL} router={marketRouter} />
            {marketRouter.getInfinityPanels(PAGE_MARKET_VIEW).map((panelId) => {
              if (
                marketRouter.getInfinityPanelOriginal(
                  PAGE_MARKET_VIEW,
                  panelId
                ) === PAGE_MARKET_USER_PANEL
              ) {
                return (
                  <User
                    key={panelId}
                    id={panelId}
                    routerType={PAGE_MARKET_VIEW}
                    pageOpened={PAGE_MARKET_USER}
                    router={marketRouter}
                  ></User>
                );
              }
            })}
          </View>
        </Root>
        <Root id="rating" activeView="rating">
          <View
            id={PAGE_RATING_VIEW}
            modal={modal}
            activePanel={ratingRouter.getPanelId()}
          >
            <Rating id={PAGE_RATING_PANEL} router={ratingRouter} />
            {ratingRouter.getInfinityPanels(PAGE_RATING_VIEW).map((panelId) => {
              if (
                ratingRouter.getInfinityPanelOriginal(
                  PAGE_RATING_VIEW,
                  panelId
                ) === PAGE_RATING_USER_PANEL
              ) {
                return (
                  <User
                    key={panelId}
                    id={panelId}
                    routerType={PAGE_RATING_VIEW}
                    pageOpened={PAGE_RATING_USER}
                    router={ratingRouter}
                  ></User>
                );
              }
            })}
          </View>
        </Root>
      </Epic>
    </AdaptivityProvider>
  );
};

export default withAppState(App);
