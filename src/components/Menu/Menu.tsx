import { Banner, Group, Header, HorizontalScroll, Link } from '@vkontakte/vkui';
import {
  Icon24CupOutline,
  Icon28MoneyCircleOutline,
  Icon28ShoppingCartOutline,
} from '@vkontakte/icons';
import { FC } from 'react';
import styled from 'styled-components';

const menuData = [
  {
    icon: (
      <Icon28ShoppingCartOutline
        width={40}
        height={40}
        style={{ margin: 'auto' }}
      />
    ),
    header: 'Магазин',
    subheader: 'Магазин',
    color: '#F05C44',
    img: '',
  },
  {
    icon: (
      <Icon28MoneyCircleOutline
        width={40}
        height={40}
        style={{ margin: 'auto' }}
      />
    ),
    header: 'Топ игроков',
    subheader: 'По балансу',
    color: '#FF724C',
  },
  {
    icon: (
      <Icon24CupOutline width={40} height={40} style={{ margin: 'auto' }} />
    ),
    header: 'Топ игроков',
    subheader: 'По рабам',
    color: '#FFA000',
  },
];

export const Menu: FC = () => (
  <Group
    header={
      <Header aside={<Link href='/'>Всего рабов: 523</Link>}>
        Вы в рабстве
      </Header>
    }
    style={{ width: '100%' }}
  >
    <HorizontalScroll>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
        }}
      >
        {menuData.map((card) => (
          <SBanner
            mode='image'
            header={card.header}
            subheader={card.subheader}
            before={card.icon}
            style={{ minWidth: 192, padding: '0 5px', height: 60 }}
            background={
              <div
                style={{
                  backgroundColor: card.color,
                  backgroundImage: card.img ? `url(${card.img})` : 'none',
                  backgroundPosition: 'right bottom',
                  backgroundSize: 320,
                  backgroundRepeat: 'no-repeat',
                  height: '100%',
                }}
              />
            }
          />
        ))}
      </div>
    </HorizontalScroll>
  </Group>
);

const SBanner = styled(Banner)`
  & > * {
    height: 40px;
  }

  ${(p) =>
    p.before &&
    `
    text-align: left;
  `}
`;
