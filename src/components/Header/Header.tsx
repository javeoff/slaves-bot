import React, { FC } from 'react';
import { Div, Gradient } from '@vkontakte/vkui';
import styled from 'styled-components';

import { UserInfo } from '@vkontakte/vk-bridge';

import { UserCard } from '../UserCard/UserCard';
import { Menu } from '../Menu/Menu';

interface IProps {
  fetchedUser: UserInfo | null;
}

export const Header: FC<IProps> = ({ fetchedUser }) => (
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
      <SHeader>
        <div>
          <Div>
            <SSpan>23 ₽</SSpan>
            <SSpanLabel>баланс</SSpanLabel>
          </Div>
          <SBalanceRight>
            <SSpan>
              25 ₽ <SPoint>/мин</SPoint>
            </SSpan>
            <SSpanLabel>доход</SSpanLabel>
          </SBalanceRight>
        </div>
        <UserCard fetchedUser={fetchedUser} />
      </SHeader>
      <Menu />
    </Gradient>
  </SHeaderContainer>
);

const SHeaderContainer = styled.div``;

const SHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
`;

const SPoint = styled.div`
  width: 50%;
  position: absolute;
  bottom: 0;
  display: inline;
  font-size: 0.4em;
  color: rgba(0, 0, 0, 0.4);
`;

const SSpan = styled.span`
  position: relative;
  font-size: 2em;
`;

const SSpanLabel = styled.small`
  display: block;
  font-size: 0.8em;
  opacity: 0.7;
`;

const SBalanceRight = styled(Div)``;
