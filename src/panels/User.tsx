import React, { FC } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import {
  Avatar,
  Button,
  Caption,
  Card,
  CardGrid,
  Div,
  FixedLayout,
  Group,
  Header,
  MiniInfoCell,
  PanelHeaderClose,
  Title,
} from "@vkontakte/vkui";
import {
  Icon16Add,
  Icon20BugOutline,
  Icon20CommunityName,
  Icon20FreezeOutline,
  Icon20LockOutline,
  Icon20MoneyCircleOutline,
  Icon20PlayCircleFillSteelGray,
  Icon20StatisticCircleFillBlue,
  Icon20VotestTransferCircleFillTurquoise,
  Icon28LockOpenOutline,
  Icon28LockOutline,
  Icon28MarketOutline,
  Icon28MoneyCircleOutline,
  Icon28RoubleCircleFillBlue,
} from "@vkontakte/icons";
interface IProps {
  id?: string;
}

const kirill = {
  id: 2,
  first_name: "Кирилл",
  last_name: "Новак",
  photo_200:
    "https://sun9-53.userapi.com/s/v1/ig2/7TOOR_yziUBmT31673uENDtn-39pTbQt1b28QA1hai3aWfJYE499q3MxFHt2YQljJ_5Q2rLbCjwXpT9E6UoP9Tno.jpg?size=200x0&quality=96&crop=0,0,1024,1024&ava=1",
  slave_object: {
    id: 1,
    profit_per_min: 10,
    job: {
      name: "Блогер",
    },
    master_id: 0,
    fetter_to: 1617308426028,
    fetter_price: 0,
    sale_price: 0,
    price: 50,
    slaves_count: 10000,
    slaves_profit_per_min: 2 ** 32,
    balance: 2 ** 32,
    lst_time_update: 0,
  },
};

const user = {
  id: 1,
  first_name: "Даниил",
  last_name: "Джейв",
  photo_200:
    "https://sun9-57.userapi.com/s/v1/ig2/CEsb2eYW3D2-jZhBJ2GLXj484UYpSC50pCCgG4gqNZBR0WTOBQhlHq21-S-WxuFV7OH2lENOzWFAv3Tdo3-oLQ6b.jpg?size=50x0&quality=96&crop=126,124,748,748&ava=1",
  slave_object: {
    id: 1,
    profit_per_min: 1000,
    job: {
      name: "Уборщик",
    },
    master_id: 0,
    fetter_to: 0,
    fetter_price: 0,
    sale_price: 0,
    price: 50,
    slaves_count: 10000,
    slaves_profit_per_min: 2 ** 32,
    balance: 2 ** 32,
    lst_time_update: 0,
  },
  slaves_list: [kirill, kirill, kirill, kirill, kirill, kirill],
};

const User: FC<IProps> = ({ id }) => (
  <Panel id={id}>
    <PanelHeader left={<PanelHeaderClose />}></PanelHeader>
    <Div>
      <Avatar src={user.photo_200} size={72} />
      <div style={{ marginTop: 12 }}>
        <Title level="2" weight="medium">
          {user.first_name} {user.last_name}
        </Title>
      </div>
    </Div>
    <MiniInfoCell before={<Icon20VotestTransferCircleFillTurquoise />}>
      Зарабатывает {user.slave_object.profit_per_min} ₽ / мин.
    </MiniInfoCell>
    <MiniInfoCell before={<Icon20StatisticCircleFillBlue />}>
      Баланс: {user.slave_object.balance} ₽ [+{" "}
      {user.slave_object.slaves_profit_per_min} ₽ / мин.]
    </MiniInfoCell>
    {user.slave_object.job.name !== "" && (
      <MiniInfoCell before={<Icon20PlayCircleFillSteelGray />}>
        Работа: {user.slave_object.job.name}
      </MiniInfoCell>
    )}
    <Group>
      <Header mode="primary" indicator={user.slave_object.slaves_count}>
        Рабы
      </Header>
      <div style={{ marginBottom: 12 }}>
        {user.slaves_list.map((slave) => {
          return (
            <Div key={"slave_" + slave.id} style={{ paddingBottom: 0 }}>
              <Card mode="shadow">
                <Div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={slave.photo_200} size={48}></Avatar>
                  <div style={{ marginLeft: 12, flex: 2 }}>
                    <Title level="3" weight="medium">
                      {slave.first_name} {slave.last_name}
                    </Title>
                    {slave.slave_object.job.name !== "" && (
                      <Caption
                        level="1"
                        weight="regular"
                        style={{ color: "#707070" }}
                      >
                        {slave.slave_object.job.name}
                      </Caption>
                    )}
                  </div>
                  <div>
                    <Title level="3" weight="bold" style={{ color: "#44CC50" }}>
                      + {slave.slave_object.profit_per_min} ₽ / мин.
                    </Title>
                  </div>
                  {slave.slave_object.fetter_to &&
                    Date.now() / 1000 < slave.slave_object.fetter_to && (
                      <div style={{ marginLeft: 12 }}>
                        <Icon20LockOutline fill="#E64646" />
                      </div>
                    )}
                </Div>
              </Card>
            </Div>
          );
        })}
      </div>
    </Group>
    <FixedLayout vertical="bottom">
      <Div style={{ paddingBottom: 0 }}>
        <Button
          style={{ marginBottom: 8, width: "100%" }}
          before={<Icon28MarketOutline />}
          size="l"
          mode="commerce"
        >
          Купить за {user.slave_object.price} ₽
        </Button>
        <Button
          style={{
            marginBottom: 8,
            width: "100%",
            opacity: 1,
          }}
          before={<Icon28MoneyCircleOutline width={28} height={28} />}
          size="l"
        >
          Продать за {user.slave_object.sale_price} ₽
        </Button>
        <Button
          style={{ marginBottom: 8, width: "100%" }}
          before={<Icon20FreezeOutline width={28} height={28} />}
          size="l"
        >
          Надеть наручники за {user.slave_object.fetter_price} ₽
        </Button>
      </Div>
    </FixedLayout>
  </Panel>
);

export default User;
