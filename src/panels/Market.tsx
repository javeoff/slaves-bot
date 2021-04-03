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

interface IProps extends IWithFriends {
  id?: string;
}

const Market: FC<IProps> = ({
  id,
  friends,
  userInfo,
  updateFriends,
  updateUsersInfo,
  updateSlaves,
  slaves,
}) => {
  let [marketList, setMarketList] = useState<ISlaveWithUserInfo[]>([]);
  let [loadedFirendsInfo, setLoadedFriendsInfo] = useState<boolean>(false);
  let [loadedFirendsSlaves, setLoadedFriendsSlaves] = useState<boolean>(false);

  useEffect(() => {
    async function getFriends() {
      if (!Object.keys(friends).length) {
        let newFriends = await bridgeClient.getUserFriends(userInfo.id);
        updateFriends(newFriends);
        updateUsersInfo(newFriends);
        setLoadedFriendsInfo(true);
      }
    }
    getFriends();
  }, []);

  useEffect(() => {
    const loadSlaves = async () => {
      let ids = Object.keys(friends).map((f) => +f);
      if (ids.length) {
        await simpleApi
          .getSlaves(ids)
          .then((res) => {
            updateSlaves(res);
          })
          .catch(openErrorModal);
      }
    };
    if (Object.keys(friends).length) {
      // Если мы загрузили список друзей, то ищием их объекты рабов и устанавливаем
      loadSlaves();
    }
  }, [friends]);

  return (
    <Panel id={id}>
      <PanelHeader>Маркет</PanelHeader>
      {JSON.stringify(friends)}
    </Panel>
  );
};

export default withMarketState(Market);
