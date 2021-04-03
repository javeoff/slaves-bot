import React, { FC, useEffect, useState } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import { UserInfo } from "@vkontakte/vk-bridge";
import {
  withMarketState,
  IWithFriends,
} from "../features/App/hocs/withAppState";
import { bridgeClient } from "../common/bridge/bridge";
import { ISlaveWithUserInfo } from "../common/types/ISlaveWithUserInfo";
import { simpleApi } from "../common/simple_api/simpleApi";
import { openErrorModal } from "../modals/openers";
import { ISlaveData } from "../common/types/ISlaveData";
import {
  Avatar,
  Caption,
  Div,
  PanelSpinner,
  PullToRefresh,
} from "@vkontakte/vkui";
import { SlavesList } from "../components/SlavesList/SlavesList";

interface IProps extends IWithFriends {
  id?: string;
}

const Market: FC<IProps> = ({
  id,
  friends,
  userInfo,
  usersInfo,
  slaves,
  updateFriends,
  updateUsersInfo,
  updateSlaves,
}) => {
  let [marketList, setMarketList] = useState<ISlaveWithUserInfo[]>([]);
  let [loadedFirendsInfo, setLoadedFriendsInfo] = useState<boolean>(false);
  let [loadedFirendsSlaves, setLoadedFriendsSlaves] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>(true);

  let [isFetching, setFetching] = useState<boolean>(false);

  const getFriends = async () => {
    if (!Object.keys(friends).length) {
      let newFriends = await bridgeClient.getUserFriends(userInfo.id);
      console.log("got friends", newFriends);
      updateFriends(newFriends.slice(0, 250).map((f) => f.id));
      updateUsersInfo(newFriends);
      setLoadedFriendsInfo(true);
    }
  };

  const loadSlaves = async () => {
    await simpleApi
      .getSlaves(friends)
      .then((res) => {
        updateSlaves(res);
        setLoadedFriendsSlaves(true);
      })
      .catch(openErrorModal);
  };

  const loadMarket = async () => {
    if (!friends?.length) {
      await getFriends();
    }
    await loadSlaves();
  };

  useEffect(() => {
    async function initMarket() {
      await loadMarket();
    }
    initMarket();
  }, []);

  useEffect(() => {
    const updateMarket = async () => {
      if (loadedFirendsInfo && loadedFirendsSlaves) {
        if (!marketList?.length) {
          const slavesInfo: ISlaveWithUserInfo[] = friends.map((fId) => {
            return {
              user_info: usersInfo[fId],
              slave_object: slaves[fId],
            };
          });
          setMarketList(slavesInfo);
        }
      }
    };

    updateMarket();
  }, [loadedFirendsInfo, loadedFirendsSlaves]);

  useEffect(() => {
    if (marketList?.length) {
      setLoading(false);
    }
  }, [marketList]);

  const refreshRatingUsers = async () => {
    setFetching(true);
    setLoadedFriendsInfo(false);
    setLoadedFriendsSlaves(false);
    await loadMarket();
  };

  return (
    <Panel id={id}>
      {loading ? (
        <PanelSpinner size="large" />
      ) : (
        <PullToRefresh onRefresh={refreshRatingUsers} isFetching={isFetching}>
          <PanelHeader>Маркет</PanelHeader>
          {marketList?.length ? (
            <SlavesList
              slaves={marketList}
              slavesCount={0}
              showHeader={false}
              isMe={false}
            />
          ) : (
            <Div>
              <Caption
                level="1"
                weight="regular"
                style={{ textAlign: "center" }}
              >
                Список друзей пуст
              </Caption>
            </Div>
          )}
        </PullToRefresh>
      )}
    </Panel>
  );
};

export default withMarketState(Market);
