import React, { FC, useEffect, useState } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import {
  Caption,
  Card,
  CardGrid,
  CellButton,
  Div,
  Counter,
  Group,
  PanelSpinner,
  PullToRefresh,
  Tabs,
  TabsItem,
  FixedLayout,
  Search,
} from "@vkontakte/vkui";
import { simpleApi } from "../common/simple_api/simpleApi";
import { openErrorModal } from "../modals/openers";
import {
  IWithRating,
  withRatingState,
} from "../features/App/hocs/withAppState";
import { bridgeClient } from "../common/bridge/bridge";
import { ISlaveWithUserInfo } from "../common/types/ISlaveWithUserInfo";
import { ISlaveData } from "../common/types/ISlaveData";
import { SlavesList } from "../components/SlavesList/SlavesList";
import { Router } from "../common/custom-router";
import { PAGE_RATING_USER } from "../common/routes";
import { UserInfo } from "@vkontakte/vk-bridge";
import { searchFilter } from "../common/helpers";
import { IUserDataResponseDto } from "../common/simple_api/types";

interface IProps extends IWithRating {
  id?: string;
  router: Router;
}

const sortByKey = (a: ISlaveWithUserInfo, b: ISlaveWithUserInfo) => {
  if (a.slave_object.slaves_count < b.slave_object.slaves_count) {
    return 1;
  }
  if (a.slave_object.slaves_count > b.slave_object.slaves_count) {
    return -1;
  }
  return 0;
};

const Rating: FC<IProps> = ({
  id,
  updateSlaves,
  userInfo,
  usersInfo,
  rating,
  slaves,
  router,
  updateRating,
  updateUsersInfo,
  updateFriendsRating,
  updateMastersRating,
  mastersRating,
  friendsRating,
  tab,
  updateRatingTab,
}) => {
  let defaultLoading = true;
  let defaultRatingList: ISlaveWithUserInfo[] = [];
  let defaultFriendsRatingList: ISlaveWithUserInfo[] = [];
  let defaultMastersRatingList: ISlaveWithUserInfo[] = [];

  let timerSearch: NodeJS.Timeout;

  if (rating.length) {
    rating.forEach((userId) => {
      if (slaves[userId] && usersInfo[userId]) {
        defaultRatingList.push({
          user_info: usersInfo[userId],
          slave_object: slaves[userId],
        });
      }
    });
  }

  if (defaultRatingList.length) {
    defaultLoading = false;
  }

  type TTabs = "money-rating" | "global-rating" | "friends-rating";

  const [loading, setLoading] = useState<boolean>(defaultLoading);
  const [searchValue, setSearchValue] = useState("");

  const [loadedTopUsers, setLoadedTopUsers] = useState<boolean>(false);
  const [loadedTopMasters, setLoadedTopMasters] = useState<boolean>(false);
  const [loadedTopMastersInfo, setLoadedTopMastersInfo] = useState<boolean>(
    false
  );
  const [loadedTopUsersInfo, setLoadedTopUsersInfo] = useState<boolean>(false);
  const [loadedFriendsTopUsers, setLoadedFriendsTopUsers] = useState<boolean>(
    false
  );
  const [
    loadedFriendsTopUsersInfo,
    setLoadedFriendsTopUsersInfo,
  ] = useState<boolean>(false);

  const [ratingList, setRatingList] = useState<ISlaveWithUserInfo[]>(
    defaultRatingList
  );
  const [friendsRatingList, setFriendsRatingList] = useState<
    ISlaveWithUserInfo[]
  >(defaultFriendsRatingList);
  const [mastersRatingList, setMastersRatingList] = useState<
    ISlaveWithUserInfo[]
  >(defaultMastersRatingList);
  const [isFetching, setFetching] = useState<boolean>(false);

  const reloadFriendsRating = async () => {
    await bridgeClient.getAllFriends(userInfo.id).then(async (friendsList) => {
      const friendsInfo: Record<number, UserInfo> = {};

      const friensIds = friendsList.map((friend) => {
        friendsInfo[friend.id] = friend;
        return friend.id;
      });

      await simpleApi.getOnlyPlayingSlaves(friensIds).then((slaves) => {
        updateSlaves(slaves);
        const slaves_ids: number[] = [];

        setFriendsRatingList(
          slaves
            .map((slave_object) => {
              slaves_ids.push(slave_object.id);

              return {
                user_info: friendsInfo[slave_object.id],
                slave_object,
              };
            })
            .sort(sortByKey)
        );

        updateFriendsRating(slaves_ids);
      });

      await updateUsersInfo(friendsList);
      setLoadedFriendsTopUsers(true);
      setLoadedFriendsTopUsersInfo(true);
    });
  };

  const reloadTopMasters = async () => {
    await simpleApi
      .callApi<ISlaveData[]>("getTopMasters", {})
      .then(async (topMasters) => {
        let topUsersByKeys: Record<number, ISlaveData> = {};
        let ids = topMasters.map((user) => {
          topUsersByKeys[user.id] = user;
          return user.id;
        });

        updateMastersRating(ids);
        updateSlaves(topMasters);
        setLoadedTopMasters(true);

        let topUsersInfo = await bridgeClient.getUsersByIds(ids);
        updateUsersInfo(topUsersInfo); // Обновляем инфу о юзерах ВК
        setLoadedTopMastersInfo(true);
        let ratingList: ISlaveWithUserInfo[] = topUsersInfo.map((userInfo) => {
          return {
            user_info: userInfo,
            slave_object: topUsersByKeys[userInfo.id],
          };
        });

        setMastersRatingList(ratingList);
      });
  };

  const reloadRating = async () => {
    await simpleApi
      .getTopUsers()
      .then(async (topUsers) => {
        updateRating(topUsers.map((u) => +u.id));
        updateSlaves(topUsers);
        setLoadedTopUsers(true);
        let topUsersByKeys: Record<number, ISlaveData> = {};
        let ids = topUsers.map((user) => {
          topUsersByKeys[user.id] = user;
          return user.id;
        });
        let topUsersInfo = await bridgeClient.getUsersByIds(ids);
        updateUsersInfo(topUsersInfo); // Обновляем инфу о юзерах ВК
        setLoadedTopUsersInfo(true);
        let ratingList: ISlaveWithUserInfo[] = topUsersInfo.map((userInfo) => {
          return {
            user_info: userInfo,
            slave_object: topUsersByKeys[userInfo.id],
          };
        });
        setRatingList(ratingList);
      })
      .catch(openErrorModal);
  };

  useEffect(() => {
    const loadTopMasters = async () => {
      if (Object.keys(mastersRating).length) {
        // Переиспользуем рейтинг
        let ratingList: ISlaveWithUserInfo[] = mastersRating.map(
          (topUserSlaveId) => {
            return {
              slave_object: slaves[topUserSlaveId],
              user_info: usersInfo[topUserSlaveId],
            };
          }
        );
        setLoadedTopMasters(true);
        setLoadedTopMastersInfo(true);
        setMastersRatingList(ratingList);
      } else {
        await reloadTopMasters();
      }
    };

    const loadTopUsers = async () => {
      if (Object.keys(rating).length) {
        // Переиспользуем рейтинг
        let ratingList: ISlaveWithUserInfo[] = rating.map((topUserSlaveId) => {
          return {
            slave_object: slaves[topUserSlaveId],
            user_info: usersInfo[topUserSlaveId],
          };
        });
        setLoadedTopUsers(true);
        setLoadedTopUsersInfo(true);
        setRatingList(ratingList);
      } else {
        await reloadRating();
      }
    };

    const loadFriendsTopUsers = async () => {
      if (Object.keys(friendsRating).length) {
        // Переиспользуем рейтинг
        let friendsRatingList: ISlaveWithUserInfo[] = friendsRating
          .map((topUserSlaveId) => {
            return {
              slave_object: slaves[topUserSlaveId],
              user_info: usersInfo[topUserSlaveId],
            };
          })
          .sort(sortByKey);

        setLoadedFriendsTopUsers(true);
        setLoadedFriendsTopUsersInfo(true);
        setFriendsRatingList(friendsRatingList);
      } else {
        await reloadFriendsRating();
      }
    };

    if (tab === "global-rating") {
      void loadTopUsers();
    } else if (tab === "friends-rating") {
      void loadFriendsTopUsers();
    } else if (tab === "masters-rating") {
      void loadTopMasters();
    }
  }, [tab]); // 1 раз, при открытии топа, грузим инфу о топе

  useEffect(() => {
    if (
      (loadedTopUsers &&
        loadedTopUsersInfo &&
        ratingList &&
        tab === "global-rating") ||
      (loadedFriendsTopUsers &&
        loadedFriendsTopUsersInfo &&
        friendsRatingList &&
        tab === "friends-rating") ||
      (loadedTopMasters &&
        loadedTopMastersInfo &&
        mastersRatingList &&
        tab === "masters-rating")
    ) {
      if (isFetching) {
        setFetching(false);
      }
      setLoading(false);
    }
  }, [
    loadedTopMastersInfo,
    mastersRatingList,
    loadedTopUsers,
    loadedTopUsersInfo,
    loadedFriendsTopUsers,
    loadedFriendsTopUsersInfo,
    ratingList,
  ]); // Когда меняется информация о прогрессе загрузки

  const refreshRatingUsers = () => {
    setFetching(true);

    if (tab === "global-rating") {
      reloadRating();
      setLoadedTopUsers(false);
      setLoadedTopUsersInfo(false);
    } else if (tab === "friends-rating") {
      reloadFriendsRating();
      setLoadedFriendsTopUsers(false);
      setLoadedTopUsersInfo(false);
    } else if (tab === "masters-rating") {
      reloadTopMasters();
      setLoadedTopMasters(false);
      setLoadedTopMastersInfo(false);
    }
  };

  const globalRaiting = (
    <>
      {ratingList.length > 0 ? (
        <SlavesList
          slaves={ratingList}
          isMe={false}
          slavesCount={0}
          showHeader={false}
          showPosition={true}
          label="slaves_count"
          showProfitPerMin={false}
          pageOpened={PAGE_RATING_USER}
          router={router}
        />
      ) : (
        <Div>
          <Caption level="1" weight="regular" style={{ textAlign: "center" }}>
            Рейтинг пока что не выстроен
          </Caption>
        </Div>
      )}
    </>
  );

  const friendsItems = (
    <>
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
      {friendsRatingList.length > 0 ? (
        <SlavesList
          slaves={friendsRatingList}
          isMe={false}
          slavesCount={0}
          showHeader={false}
          showPosition={true}
          label="slaves_count"
          showProfitPerMin={false}
          pageOpened={PAGE_RATING_USER}
          router={router}
          slavesFilter={searchFilter(searchValue)}
          limit={100}
        />
      ) : (
        <Div>
          <Caption level="1" weight="regular" style={{ textAlign: "center" }}>
            Рейтинг пока что не выстроен
          </Caption>
        </Div>
      )}
    </>
  );

  const topMastersRating = (
    <>
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
      {mastersRatingList.length > 0 ? (
        <SlavesList
          slaves={mastersRatingList}
          isMe={false}
          slavesCount={0}
          showHeader={false}
          showPosition={true}
          label="slaves_count"
          showProfitPerMin={false}
          pageOpened={PAGE_RATING_USER}
          router={router}
          slavesFilter={searchFilter(searchValue)}
          limit={100}
        />
      ) : (
        <Div>
          <Caption level="1" weight="regular" style={{ textAlign: "center" }}>
            Рейтинг пока что не выстроен
          </Caption>
        </Div>
      )}
    </>
  );

  return (
    <Panel id={id}>
      <PanelHeader>Рейтинг</PanelHeader>
      {loading && <PanelSpinner size="large"></PanelSpinner>}
      {!loading && (
        <PullToRefresh onRefresh={refreshRatingUsers} isFetching={isFetching}>
          <Div style={{ paddingBottom: 0 }}>
            <Group>
              <Tabs mode="segmented">
                <TabsItem
                  onClick={() => updateRatingTab("masters-rating")}
                  selected={tab === "masters-rating"}
                >
                  Топ богатейших
                </TabsItem>
                <TabsItem
                  onClick={() => updateRatingTab("global-rating")}
                  selected={tab === "global-rating"}
                >
                  Глобальный топ
                </TabsItem>
                <TabsItem
                  onClick={() => updateRatingTab("friends-rating")}
                  selected={tab === "friends-rating"}
                >
                  Топ Друзей
                </TabsItem>
              </Tabs>
            </Group>
          </Div>
          {tab === "global-rating" && globalRaiting}
          {tab === "friends-rating" && friendsItems}
          {tab === "masters-rating" && topMastersRating}
        </PullToRefresh>
      )}
    </Panel>
  );
};

export default withRatingState(Rating);
