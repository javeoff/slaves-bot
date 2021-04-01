import React, { FC } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import { UserInfo } from "@vkontakte/vk-bridge";
interface IProps {
  id?: string;
  fetchedUser: UserInfo | null;
}

const Rating: FC<IProps> = ({ id, fetchedUser }) => (
  <Panel id={id}>
    <PanelHeader>Рейтинг</PanelHeader>
  </Panel>
);

export default Rating;
