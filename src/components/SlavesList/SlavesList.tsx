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
      before={<Avatar size={48} />}
      caption={<div>На работе В монастыре</div>}
      after='+ 1 500 ₽ / час'
      actions={
        <>
          <Button mode='secondary'>Купить наручники за 200 ₽</Button>
        </>
      }
    >
      Кирилл Новак
    </RichCell>
  </Group>
);
