import {
  Icon20PlayCircleFillSteelGray,
  Icon20StatisticCircleFillBlue,
  Icon20VotestTransferCircleFillTurquoise,
} from "@vkontakte/icons";
import { UserInfo } from "@vkontakte/vk-bridge";
import { Avatar, Div, MiniInfoCell, Title } from "@vkontakte/vkui";
import React, { FC } from "react";
import { ISlaveData } from "../../common/types/ISlaveData";

interface IProps {
  user: UserInfo;
  slave: ISlaveData;
  isMe: boolean;
}

export const UserHeader: FC<IProps> = ({ user, slave, isMe = false }) => {
  return (
    <>
      <Div>
        <Avatar src={user.photo_200} size={72} />
        <div style={{ marginTop: 12 }}>
          <Title level="2" weight="medium">
            {user.first_name} {user.last_name}
          </Title>
        </div>
      </Div>
      <MiniInfoCell before={<Icon20VotestTransferCircleFillTurquoise />}>
        {isMe ? "Вы зарабатываете" : "Зарабатывает"} {slave.profit_per_min} ₽ /
        мин.
      </MiniInfoCell>
      <MiniInfoCell before={<Icon20StatisticCircleFillBlue />}>
        Баланс: {slave.balance} ₽ [+ {slave.slaves_profit_per_min} ₽ / мин.]
      </MiniInfoCell>
      {slave.job.name !== "" && (
        <MiniInfoCell before={<Icon20PlayCircleFillSteelGray />}>
          Работа: {slave.job.name}
        </MiniInfoCell>
      )}
    </>
  );
};
