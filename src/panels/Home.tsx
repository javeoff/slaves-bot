import React, { FC } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import { Div, FixedLayout, Group, PullToRefresh } from "@vkontakte/vkui";

import {
  IWithCurrentUserInfo,
  withCurrentUserInfo,
} from "../features/App/hocs/withAppState";
import { UserHeader } from "../components/UserHeader/UserHeader";
import { SlavesList } from "../components/SlavesList/SlavesList";
import { ISlaveWithUserInfo } from "../common/types/ISlaveWithUserInfo";
import { AnyFunction } from "@vkontakte/vkjs";
import { simpleApi } from "../common/simple_api/simpleApi";
import { Icon56UserCircleOutline } from "@vkontakte/icons";
import { PageParams, useRouter } from "@happysanta/router";
import { MODAL_ERROR_CARD } from "../modals/Error";
import { getSubDate } from "../common/helpers";
import { InfoBlock } from "../components/InfoBlock/InfoBlock";

interface IProps extends IWithCurrentUserInfo {
  id?: string;
  onRefresh: AnyFunction;
  isFetching: boolean;
  params: PageParams;
}

const Home: FC<IProps> = ({
  id,
  userInfo,
  masterInfo,
  userSlave,
  userSlaves,
  userSlavesInfo,
  onRefresh,
  updateSlaves,
  isFetching,
}) => {
  let generatedSlavesList: ISlaveWithUserInfo[] = [];
  let router = useRouter();

  for (let slaveId in userSlaves) {
    generatedSlavesList.push({
      user_info: userSlavesInfo[slaveId],
      slave_object: userSlaves[slaveId],
    });
  }

  const buySlave = () => {
    simpleApi
      .buySlave(userSlave.id)
      .then((res) => {
        updateSlaves([res.user, res.slave]);
      })
      .catch((e) => {
        router.pushModal(MODAL_ERROR_CARD, {
          message: e.message,
        });
      });
  };

  return (
    <Panel id={id}>
      <PanelHeader>Рабы</PanelHeader>
      <PullToRefresh isFetching={isFetching} onRefresh={onRefresh}>
        <UserHeader
          master={masterInfo}
          user={userInfo}
          slave={userSlave}
          isMe={true}
          onBuySelf={buySlave}
        ></UserHeader>
        <Div>
          <InfoBlock title="Саси писю" subtitle="Ага ага"></InfoBlock>
        </Div>
        {userSlave.fetter_to >= Date.now() / 1000 && (
          <Div
            style={{
              marginBottom: 8,
              width: "100%",
              opacity: 1,
              color: "red",
              textAlign: "center",
            }}
          >
            Вы будете в цепях еще{" "}
            {getSubDate(new Date(userSlave.fetter_to * 1000))}
          </Div>
        )}
        <div style={{ marginBottom: 56 }}>
          <SlavesList
            slavesCount={userSlave.slaves_count}
            slaves={generatedSlavesList}
            isMe={true}
          ></SlavesList>
        </div>
      </PullToRefresh>
    </Panel>
  );
};

export default withCurrentUserInfo(Home);
