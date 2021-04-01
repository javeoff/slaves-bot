import { FC } from 'react';
import { Avatar, Button, Group, Header, Link, RichCell } from '@vkontakte/vkui';

export const SlavesList: FC = () => (
  <Group
    header={
      <Header aside={<Link href='/'>Пригласить друзей</Link>}>Ваши рабы</Header>
    }
  >
    <RichCell
      style={{ marginTop: 20 }}
      disabled={true}
      multiline={true}
      before={<Avatar size={72} />}
      caption={
        <div>
          Работает: <b>В монастыре</b>
        </div>
      }
      after='+ 1 500 ₽ / час'
      actions={
        <>
          <Button>Информация</Button>
          <Button mode='secondary'>Сковать в наручники [200 ₽]</Button>
        </>
      }
    >
      Кирилл Новак
    </RichCell>
  </Group>
);
