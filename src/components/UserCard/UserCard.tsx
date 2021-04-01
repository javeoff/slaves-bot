import { FC } from 'react';
import { Avatar, Title, Text, Button } from '@vkontakte/vkui';
import { UserInfo } from '@vkontakte/vk-bridge';
import styled from 'styled-components';

interface IProps {
  fetchedUser: UserInfo | null;
  className?: string;
}

export const UserCard: FC<IProps> = ({ fetchedUser }) => (
  <SUserCardContainer>
    <div style={{ marginRight: 30 }}>
      <Title
        style={{ marginBottom: 8, marginTop: 0 }}
        level='2'
        weight='medium'
      >
        {fetchedUser?.first_name} {fetchedUser?.last_name}
      </Title>
      <Text
        weight='regular'
        style={{ marginBottom: 10, color: 'var(--text_secondary)' }}
      >
        В рабстве у <b>Кирилл Новак</b>
        <br />
        Работа: <b>Дворником</b>
      </Text>
      <Button stretched={true} mode='secondary' size='m'>
        Выкупить себя за 500 000 ₽
      </Button>
    </div>
    <SAvatar size={120} src={fetchedUser?.photo_200} />
  </SUserCardContainer>
);

const SUserCardContainer = styled.div`
  display: flex;
  background: rgba(0, 28, 61, 0.05);
  padding: 10px;
  border: 1px solid rgba(0, 28, 61, 0.1);
  border-radius: 5px;
  margin: 0 15px;
  text-align: left;
`;

const SAvatar = styled(Avatar)`
  position: relative;
  right: 20px;
`;
