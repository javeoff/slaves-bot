import {
  Icon20PlayCircleFillSteelGray,
  Icon20StatisticCircleFillBlue,
  Icon20VotestTransferCircleFillTurquoise,
} from "@vkontakte/icons";
import { UserInfo } from "@vkontakte/vk-bridge";
import {
  Avatar,
  Button,
  Card,
  Div,
  MiniInfoCell,
  Title,
} from "@vkontakte/vkui";
import React, { FC } from "react";
import { Router } from "../../common/custom-router";
import { beautyNumber } from "../../common/helpers";
import { ISlaveData } from "../../common/types/ISlaveData";

interface IProps {
  user: UserInfo;
  slave: ISlaveData;
  isMe: boolean;
  master: UserInfo;
  onBuySelf: VoidFunction;
  router: Router;
  pageOpened: string;
}

export const UserHeader: FC<IProps> = ({
  user,
  slave,
  isMe = false,
  master,
  router,
  pageOpened,
  onBuySelf,
}) => {
  return (
    <>
      <Div style={{ display: "flex" }}>
        <div style={{ flex: 3 }}>
          <Avatar src={user.photo_100} size={72} />
          <div style={{ marginTop: 12 }}>
            <Title level="2" weight="medium">
              {user.first_name} {user.last_name}
            </Title>
          </div>
        </div>
      </Div>
      <MiniInfoCell before={<Icon20StatisticCircleFillBlue />}>
        {isMe ? "Вы зарабатываете" : "Зарабатывает"}{" "}
        {beautyNumber(slave.profit_per_min)} ₽ / мин.
      </MiniInfoCell>
      <MiniInfoCell before={<Icon20VotestTransferCircleFillTurquoise />}>
        Баланс: {beautyNumber(slave.balance)} ₽ [+{" "}
        {beautyNumber(slave.slaves_profit_per_min)} ₽ / мин.]
      </MiniInfoCell>
      {slave.job.name !== "" && (
        <MiniInfoCell before={<Icon20PlayCircleFillSteelGray />}>
          Работа: {slave.job.name}
        </MiniInfoCell>
      )}
      {master && master.id ? (
        <Div>
          <Card mode="outline">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                router.pushPageRoute(pageOpened, {
                  id: String(master.id),
                });
              }}
            >
              <Div style={{ paddingRight: 0 }}>
                <Avatar src={master.photo_100} size={56} />
              </Div>
              <Div>
                <Title level="3" weight="medium">
                  {master.first_name} {master.last_name}
                </Title>
                <span style={{ fontSize: 14 }}>
                  {isMe ? "Держит вас в рабстве" : "Владеет этим рабом"}
                </span>
              </Div>
            </div>
            {isMe && (
              <Div style={{ paddingTop: 2 }}>
                <Button
                  size="l"
                  mode="tertiary"
                  style={{ width: "100%" }}
                  onClick={() => onBuySelf()}
                >
                  Освободиться за {beautyNumber(slave.price)} ₽
                </Button>
              </Div>
            )}
          </Card>
        </Div>
      ) : null}
    </>
  );
};
