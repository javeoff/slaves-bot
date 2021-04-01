import React, { FC } from 'react';
import { Gradient } from '@vkontakte/vkui';
import styled from 'styled-components';

import { UserInfo } from '@vkontakte/vk-bridge';

// import { UserCard } from '../UserCard/UserCard';
import { Menu } from '../Menu/Menu';

interface IProps {
  fetchedUser: UserInfo | null;
}

export const Header: FC<IProps> = () => (
  <SHeaderContainer>
    <Gradient
      style={{
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Menu />
    </Gradient>
  </SHeaderContainer>
);

const SHeaderContainer = styled.div``;
