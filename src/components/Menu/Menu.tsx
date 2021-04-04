import { Banner, Div, Group, Header, HorizontalScroll } from '@vkontakte/vkui';
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
        width={32}
        height={32}
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
        width={32}
        height={32}
        style={{ margin: 'auto' }}
      />
    ),
    header: 'Топ игроков',
    subheader: 'По балансу',
    color: '#FF724C',
  },
  {
    icon: (
      <Icon24CupOutline width={32} height={32} style={{ margin: 'auto' }} />
    ),
    header: 'Топ игроков',
    subheader: 'По рабам',
    color: '#FFA000',
  },
];

export const Menu: FC = () => (
  <Group
    header={<Header aside={<span>Всего рабов: 523</span>}>Вы в рабстве</Header>}
    style={{ width: '100%' }}
  >
    <HorizontalScroll>
      <Div
        style={{
          display: 'flex',
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {menuData.map((card) => (
          <SBanner
            mode='image'
            header={card.header}
            subheader={card.subheader}
            before={card.icon}
            style={{ minWidth: 172, padding: '5px 5px', flex: 1, height: 60 }}
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
      </Div>
    </HorizontalScroll>
  </Group>
);

const SBanner = styled(Banner)`
  & > * {
  }

  ${(p) =>
    p.before &&
    `
    text-align: left;
  `}
`;
