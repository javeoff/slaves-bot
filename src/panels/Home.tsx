import React, { FC } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import { UserInfo } from '@vkontakte/vk-bridge';

import { Header } from '../components/Header/Header';
import { SlavesList } from '../components/SlavesList/SlavesList';

interface IProps {
  id?: string;
  fetchedUser: UserInfo | null;
}

const Home: FC<IProps> = ({ id, fetchedUser }) => (
  <Panel id={id}>
    <PanelHeader style={{ color: '#F05C44' }}>Slaves App</PanelHeader>
    <Header fetchedUser={fetchedUser} />
    <SlavesList />
  </Panel>
);

export default Home;
