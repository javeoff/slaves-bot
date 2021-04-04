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
import {
  Caption,
  Div,
  FixedLayout,
  PanelSpinner,
  PullToRefresh,
  Search,
} from "@vkontakte/vkui";
import { SlavesList } from "../components/SlavesList/SlavesList";
import { Router } from "../common/custom-router";
import { PAGE_MARKET_USER } from "../common/routes";

interface IProps extends IWithFriends {
  id?: string;
  router: Router;
}

const Market: FC<IProps> = ({
  id,
  friends,
  userInfo,
  usersInfo,
  slaves,
  router,
  updateFriends,
  updateUsersInfo,
  updateSlaves,
}) => {
  let alreadyGotMarketList: ISlaveWithUserInfo[] = [];
  if (friends.length) {
    friends.forEach((friend) => {
      if (
        slaves[friend] &&
        usersInfo[friend] &&
        slaves[friend].master_id !== userInfo.id
      ) {
        alreadyGotMarketList.push({
          user_info: usersInfo[friend],
          slave_object: slaves[friend],
        });
      }
    });
  }

  let [marketList, setMarketList] = useState<ISlaveWithUserInfo[]>(
    alreadyGotMarketList
  );
  let [loadedFriendsInfo, setLoadedFriendsInfo] = useState<boolean>(false);
  let [loadedFriendsSlaves, setLoadedFriendsSlaves] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>(
    alreadyGotMarketList.length ? false : true
  );

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
      if (Object.keys(friends).length && !marketList.length) {
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

  const refreshMarketUsers = () => {
    setFetching(true);
    setLoadedFriendsSlaves(false);
    setLoadedFriendsInfo(false);
    reloadFriends();
  };

  let timerSearch: NodeJS.Timeout;
  let query = searchValue.toLocaleLowerCase().split(" ");
  let firstName = query[0] || "";
  let lastName = query[1] || "";
  if (marketList) {
    marketList = marketList.filter((s) => {
      if (firstName || lastName) {
        let userFirstName = s.user_info.first_name.toLocaleLowerCase();
        let userLastName = s.user_info.last_name.toLocaleLowerCase();
        if (firstName && !lastName) {
          return (
            userFirstName.match(firstName) || userLastName.match(firstName)
          );
        } else if (firstName && lastName) {
          return (
            (userFirstName.match(firstName) && userLastName.match(lastName)) ||
            (userFirstName.match(lastName) && userLastName.match(firstName))
          );
        } else if (!firstName && lastName) {
          return userFirstName.match(lastName) || userLastName.match(lastName);
        }
      } else {
        return true;
      }
    });
  }
  console.log("Market list", marketList.length, loading);
  return (
    <Panel id={id}>
      <PanelHeader>Маркет</PanelHeader>
      {loading ? (
        <PanelSpinner size="large" />
      ) : (
        <>
          <FixedLayout vertical="top">
            <Search
              defaultValue=""
              onChange={(e) => {
                let val = e.target.value;
                clearTimeout(timerSearch);
                timerSearch = setTimeout(() => {
                  setSearchValue(val);
                }, 100);
              }}
              after={null}
            />
          </FixedLayout>
          <div style={{ marginTop: 60 }}>
            <PullToRefresh
              onRefresh={refreshMarketUsers}
              isFetching={isFetching}
            >
              {marketList?.length ? (
                <SlavesList
                  slaves={marketList}
                  slavesCount={0}
                  showHeader={false}
                  isMe={false}
                  showPrice={true}
                  showProfitPerMin={false}
                  router={router}
                  pageOpened={PAGE_MARKET_USER}
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
          </div>
        </>
      )}
    </Panel>
  );
};

export default withMarketState(Market);
