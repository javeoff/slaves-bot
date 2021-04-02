import React, { FC, useEffect } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import { UserInfo } from "@vkontakte/vk-bridge";
import {
  withMarketState,
  IWithFriends,
} from "../features/App/hocs/withAppState";
import { bridgeClient } from "../common/bridge/bridge";

interface IProps extends IWithFriends {
  id?: string;
}

const Market: FC<IProps> = ({ id, friends, userInfo, updateFriends }) => {
  useEffect(() => {
    async function getFriends() {
      updateFriends(await bridgeClient.getUserFriends(userInfo.id));
    }
    getFriends();
  }, []);

  return (
    <Panel id={id}>
      <PanelHeader>Маркет</PanelHeader>
      {JSON.stringify(friends)}
    </Panel>
  );
};

export default withMarketState(Market);
