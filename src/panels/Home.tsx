import React, { FC } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import { Group } from "@vkontakte/vkui";

import {
  IWithCurrentUserInfo,
  withCurrentUserInfo,
} from "../features/App/hocs/withAppState";
import { UserHeader } from "../components/UserHeader/UserHeader";
import { SlavesList } from "../components/SlavesList/SlavesList";
import { ISlaveWithUserInfo } from "../common/types/ISlaveWithUserInfo";

interface IProps extends IWithCurrentUserInfo {
  id?: string;
}

const Home: FC<IProps> = ({
  id,
  userInfo,
  userSlave,
  userSlaves,
  userSlavesInfo,
}) => {
  let generatedSlavesList: ISlaveWithUserInfo[] = [];
  for (let slaveId in userSlaves) {
    generatedSlavesList.push({
      user_info: userSlavesInfo[slaveId],
      slave_object: userSlaves[slaveId],
    });
  }
  console.log("Generated", generatedSlavesList, userSlaves);
  return (
    <Panel id={id}>
      <PanelHeader>Рабы</PanelHeader>
      <UserHeader user={userInfo} slave={userSlave} isMe={true}></UserHeader>
      <SlavesList
        slavesCount={userSlave.slaves_count}
        slaves={generatedSlavesList}
      ></SlavesList>
    </Panel>
  );
};

export default withCurrentUserInfo(Home);
