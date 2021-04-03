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
  Search,
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
  let [marketList, setMarketList] = useState<ISlaveWithUserInfo[]>();
  let [loadedFriendsInfo, setLoadedFriendsInfo] = useState<boolean>(false);
  let [loadedFriendsSlaves, setLoadedFriendsSlaves] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>(true);

  let [isFetching, setFetching] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");

  const updateMarketList = async (newFriends: UserInfo[]) => {
    newFriends = newFriends.slice(0, 250);
    let friendsByKeys: Record<number, UserInfo> = {};
    let friendsIds: number[] = newFriends.map((fr) => {
      friendsByKeys[fr.id] = fr;
      return fr.id;
    });
    await updateFriends(friendsIds);
    updateUsersInfo(newFriends);
    setLoadedFriendsInfo(true);
    let newFriendsSlaves = await simpleApi.getSlaves(friendsIds);
    updateSlaves(newFriendsSlaves);

    let marketList: ISlaveWithUserInfo[] = newFriendsSlaves.map(
      (friendSlave) => {
        return {
          user_info: friendsByKeys[friendSlave.id],
          slave_object: friendSlave,
        };
      }
    );
    marketList = deleteOwned(marketList);
    console.log("Set new market list", marketList);
    setLoadedFriendsSlaves(true);
    setMarketList(marketList);
  };

  const reloadFriends = async () => {
    await bridgeClient
      .getUserFriends(userInfo.id)
      .then(async (newFriends) => {
        await updateMarketList(newFriends);
      })
      .catch(openErrorModal);
  };

  const deleteOwned = (m: ISlaveWithUserInfo[]): ISlaveWithUserInfo[] => {
    return m.filter((m) => {
      return m.slave_object.master_id != userInfo.id;
    });
  };

  useEffect(() => {
    const loadMarket = async () => {
      if (Object.keys(friends).length) {
        // Переиспользуем рейтинг
        let marketList: ISlaveWithUserInfo[] = friends.map((marketSlaveId) => {
          return {
            slave_object: slaves[marketSlaveId],
            user_info: usersInfo[marketSlaveId],
          };
        });
        marketList = deleteOwned(marketList);
        setLoadedFriendsInfo(true);
        setLoadedFriendsSlaves(true);
        setMarketList(marketList);
      } else {
        await reloadFriends();
      }
    };
    void loadMarket();
  }, []); // 1 раз, при открытии топа, грузим инфу о топе

  useEffect(() => {
    if (loadedFriendsInfo && loadedFriendsSlaves && marketList) {
      if (isFetching) {
        setFetching(false);
      }
      setLoading(false);
    }
  }, [loadedFriendsInfo, loadedFriendsSlaves, marketList]); // Когда меняется информация о прогрессе загрузки

  useEffect(() => {
    const findFriends = async (value: string) => {
      await bridgeClient
        .searchUserFriends(value)
        .then(async (newFriends) => {
          await updateMarketList(newFriends);
        })
        .catch(openErrorModal);
    };

    if (searchValue.trim()) {
      void findFriends(searchValue);
    } else {
      void reloadFriends();
    }
  }, [searchValue]);

  const refreshMarketUsers = () => {
    setFetching(true);
    setLoadedFriendsSlaves(false);
    setLoadedFriendsInfo(false);
    reloadFriends();
  };

  return (
    <Panel id={id}>
      <PanelHeader>Маркет</PanelHeader>
      {loading ? (
        <PanelSpinner size="large" />
      ) : (
        <PullToRefresh onRefresh={refreshMarketUsers} isFetching={isFetching}>
          <Search
            style={{ marginTop: 20 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            after={null}
          />
          {marketList?.length ? (
            <SlavesList
              slaves={marketList}
              slavesCount={0}
              showHeader={false}
              isMe={false}
              showPrice={true}
              showProfitPerMin={false}
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
