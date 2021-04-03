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
import { Avatar, Caption, Div } from "@vkontakte/vkui";

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
            setLoadedFriendsSlaves(true);
          })
          .catch(openErrorModal);
      }
    };
    loadSlaves();
  }, [friends]);

  useEffect(() => {
    const updateMarket = async () => {
      const slaves_list = Object.values(slaves);
      const users_list = Object.values(friends);

      if (loadedFirendsInfo && loadedFirendsSlaves) {
        if (!marketList?.length) {
          const slavesInfo: ISlaveWithUserInfo[] = new Array(slaves_list.length)
            .fill(null)
            .map((_, idx) => ({
              slave_object: slaves_list[idx],
              user_info: users_list[idx],
            }));

          console.log(slavesInfo);

          setMarketList(slavesInfo);
        }
      }
    };

    updateMarket();
  }, [loadedFirendsInfo, loadedFirendsSlaves]);

  return (
    <Panel id={id}>
      <PanelHeader>Маркет</PanelHeader>
      {marketList?.length ? (
        marketList.map((marketItem: ISlaveWithUserInfo) => (
          <>
            <div>{marketItem.slave_object.id}</div>
            <div>{marketItem.user_info?.first_name}</div>
            <div>
              <Avatar src={marketItem.user_info?.photo_100} />
            </div>
          </>
        ))
      ) : (
        <Div>
          <Caption level="1" weight="regular" style={{ textAlign: "center" }}>
            Список друзей пуст
          </Caption>
        </Div>
      )}
    </Panel>
  );
};

export default withMarketState(Market);
