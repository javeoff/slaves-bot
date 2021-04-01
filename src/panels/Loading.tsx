import React, { FC } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import { PanelSpinner } from "@vkontakte/vkui";
interface IProps {
  id?: string;
}

const Loading: FC<IProps> = ({ id }) => (
  <Panel id={id}>
    <PanelSpinner size="large" style={{ marginTop: 128 }} />
  </Panel>
);

export default Loading;
