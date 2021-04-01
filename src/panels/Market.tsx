import React, { FC } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import { UserInfo } from "@vkontakte/vk-bridge";
interface IProps {
  id?: string;
}

const Market: FC<IProps> = ({ id }) => (
  <Panel id={id}>
    <PanelHeader>Маркет</PanelHeader>
  </Panel>
);

export default Market;
