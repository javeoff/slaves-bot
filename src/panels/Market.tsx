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

  useEffect(() => {
    async function getFriends() {
      if (!Object.keys(friends).length) {
        let newFriends = await bridgeClient.getUserFriends(userInfo.id);
        console.log("got friends", newFriends);
        updateFriends(newFriends.slice(0, 250).map((f) => f.id));
        updateUsersInfo(newFriends);
        setLoadedFriendsInfo(true);
      }
    }
    getFriends();
  }, []);

  useEffect(() => {
    const loadSlaves = async () => {
      if (friends.length) {
        await simpleApi
          .getSlaves(friends)
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

  return (
    <Panel id={id}>
      <PanelHeader>Маркет</PanelHeader>
      {marketList?.length ? (
        <SlavesList
          slaves={marketList}
          slavesCount={0}
          showHeader={false}
          isMe={false}
        ></SlavesList>
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
