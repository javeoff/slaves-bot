import React, { FC } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
interface IProps {
  id?: string;
}

const Rating: FC<IProps> = ({ id }) => (
  <Panel id={id}>
    <PanelHeader>Рейтинг</PanelHeader>
  </Panel>
);

export default Rating;
