import React, { FC, useEffect, useState } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import { Caption, Div, PanelSpinner, PullToRefresh } from "@vkontakte/vkui";
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

interface IProps extends IWithRating {
  id?: string;
  router: Router;
}

const Rating: FC<IProps> = ({
  id,
  updateSlaves,
  usersInfo,
  rating,
  slaves,
  router,
  updateRating,
  updateUsersInfo,
}) => {
  let defaultLoading = true;
  let defaultRatingList: ISlaveWithUserInfo[] = [];

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

  let [loading, setLoading] = useState<boolean>(defaultLoading);
  let [loadedTopUsers, setLoadedTopUsers] = useState<boolean>(false);
  let [loadedTopUsersInfo, setLoadedTopUsersInfo] = useState<boolean>(false);
  let [ratingList, setRatingList] = useState<ISlaveWithUserInfo[]>(
    defaultRatingList
  );
  let [isFetching, setFetching] = useState<boolean>(false);

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
    void loadTopUsers();
  }, []); // 1 раз, при открытии топа, грузим инфу о топе

  useEffect(() => {
    if (loadedTopUsers && loadedTopUsersInfo && ratingList) {
      if (isFetching) {
        setFetching(false);
      }
      setLoading(false);
    }
  }, [loadedTopUsers, loadedTopUsersInfo, ratingList]); // Когда меняется информация о прогрессе загрузки

  const refreshRatingUsers = () => {
    setFetching(true);
    setLoadedTopUsers(false);
    setLoadedTopUsersInfo(false);
    reloadRating();
  };

  return (
    <Panel id={id}>
      <PanelHeader>Рейтинг</PanelHeader>
      {loading && <PanelSpinner size="large"></PanelSpinner>}
      {!loading && (
        <PullToRefresh onRefresh={refreshRatingUsers} isFetching={isFetching}>
          {ratingList.length >= 0 && (
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
            ></SlavesList>
          )}
          {!ratingList.length && (
            <Div>
              <Caption
                level="1"
                weight="regular"
                style={{ textAlign: "center" }}
              >
                Рейтинг пока что не выстроен
              </Caption>
            </Div>
          )}
        </PullToRefresh>
      )}
    </Panel>
  );
};

export default withRatingState(Rating);
