import React, { FC } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import { UserInfo } from "@vkontakte/vk-bridge";
import { Group } from "@vkontakte/vkui";
interface IProps {
  id?: string;
  fetchedUser: UserInfo | null;
}

// type Slave = {
//   id: Number;
//   last_time
// };

// let slaves:Slave[] = [];

// const slaves Slave[] = [];

const Home: FC<IProps> = ({ id, fetchedUser }) => (
  <Panel id={id}>
    <PanelHeader>Рабы</PanelHeader>
    <Group title="Рабы"></Group>
  </Panel>
);

export default Home;
