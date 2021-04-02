import React, { useState, useEffect, ReactElement, FC } from "react";
import bridge, { UserInfo } from "@vkontakte/vk-bridge";
import View from "@vkontakte/vkui/dist/components/View/View";

import "@vkontakte/vkui/dist/vkui.css";

import {
  AdaptivityProvider,
  Button,
  ModalCard,
  ModalRoot,
  Panel,
  Tabbar,
  TabbarItem,
} from "@vkontakte/vkui";
import {
  getInfinityPanelId,
  isInfinityPanel,
  useLocation,
  useParams,
  useRouter,
} from "@happysanta/router";
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
  Icon56ErrorOutline,
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

const App: FC<IWithAppState> = ({
  updateUserInfo,
  updateSlave,
  setCurrentUserId,
  updateUserAccessToken,
  updateSlaves,
  updateUsersInfo,
}) => {
  const location = useLocation();
  const router = useRouter();

  const [appLoaded, setAppLoaded] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const LOADING_PANEL = "loading";

  const reloadUserInformation = async (fetch: boolean = false) => {
    const user = await bridgeClient.getUserInfo();
    let refId = +document.location.href.split("#")[1].replace("r", "");
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
        if (fetch) setIsFetching(false);
      })
      .catch((e) => {
        console.error(e);
        if (fetch) setIsFetching(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
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

  const modal = (
    <ModalRoot activeModal={location.getModalId()}>
      <ModalError onClose={() => router.popPage()} id={MODAL_ERROR_CARD} />
      <ModalGiveJob onClose={() => router.popPage()} id={MODAL_GIVE_JOB_CARD} />
    </ModalRoot>
  );

  console.log(router, location.getViewActivePanel(VIEW_MAIN));

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
        <View
          id={LOADING_PANEL}
          modal={modal}
          activePanel={String(LOADING_PANEL)}
        >
          <Loading id={LOADING_PANEL} />
        </View>
        <View
          id={VIEW_MAIN}
          modal={modal}
          activePanel={String(location.getViewActivePanel(VIEW_MAIN))}
        >
          <Home
            id={PANEL_MAIN}
            onRefresh={(e) => reloadUserInformation(true)}
            isFetching={isFetching}
            params={useParams()}
          />
          {[...router.getInfinityPanelList(VIEW_MAIN)].map((panelId) => {
            if (isInfinityPanel(panelId)) {
              const type = getInfinityPanelId(panelId);
              if (type === PANEL_MAIN_USER) {
                return <User key={panelId} id={panelId}></User>;
              }
            }
            return null;
          })}
        </View>
        <View
          id={VIEW_MARKET}
          modal={modal}
          activePanel={String(location.getViewActivePanel(VIEW_MARKET))}
        >
          <Market id={PANEL_MARKET} />
        </View>
        <View
          id={VIEW_RATING}
          modal={modal}
          activePanel={String(location.getViewActivePanel(VIEW_RATING))}
        >
          <Rating id={PANEL_RATING} />
        </View>
      </Epic>
    </AdaptivityProvider>
  );
};

export default withAppState(App);
