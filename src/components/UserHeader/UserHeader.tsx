import {
  Icon20PlayCircleFillSteelGray,
  Icon20StatisticCircleFillBlue,
  Icon20VotestTransferCircleFillTurquoise,
  Icon24WriteOutline,
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
import React, { FC, useCallback } from "react";
import { Router } from "../../common/custom-router";
import { beautyNumber } from "../../common/helpers";
import { ISlaveData } from "../../common/types/ISlaveData";
import { MODAL_GIVE_JOB_CARD } from "../../modals/GiveJob";
import { InfoBlock } from "../InfoBlock/InfoBlock";

interface IProps {
  user: UserInfo;
  slave: ISlaveData;
  isMe: boolean;
  master: UserInfo;
  onBuySelf: VoidFunction;
  router: Router;
  pageOpened: string;
  currentUserId: number;
}

export const UserHeader: FC<IProps> = ({
  user,
  slave,
  isMe = false,
  master,
  router,
  pageOpened,
  currentUserId,
  onBuySelf,
}) => {
  console.log("Updated user header", slave);
  const isMine = slave.master_id == currentUserId;
  const giveJobInfoStyles = { paddingBottom: 0 };
  const titleStyles = { marginTop: 12 };
  const masterAvatarStyles = { paddingRight: 0 };
  const freeButtonStyles = { paddingTop: 2 };
  const masterTakenStyles = { fontSize: 14 };
  const buySelfCallback = useCallback(() => {
    onBuySelf();
  }, []);
  const openMaster = useCallback(() => {
    router.pushPageRoute(pageOpened, {
      id: String(master.id),
    });
  }, [master]);
  const openGiveJobModal = useCallback(() => {
    router.pushModal(MODAL_GIVE_JOB_CARD, {
      id: String(slave.id),
    });
  }, [slave]);
  return (
    <>
      <Div style={{ userSelect: "none" }}>
        <div style={{ flex: 3 }}>
          <a href={`https://vk.com/id${user.id}`} target="_blank">
            <Avatar src={user.photo_100} size={72} />
          </a>
          <div style={titleStyles}>
            <Title level="2" weight="medium">
              {user.first_name} {user.last_name}
            </Title>{" "}
          </div>
        </div>
      </Div>
      <div style={{ userSelect: "none" }}>
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
        {slave.job.name == "" && isMine ? (
          <Div style={giveJobInfoStyles}>
            <InfoBlock
              title="Ваш раб без работы"
              variant="gray"
              clickable={true}
              subtitle="Рабы без работы не приносят доход"
              after={
                <Button mode="overlay_primary">
                  <Icon24WriteOutline />
                </Button>
              }
              onClick={openGiveJobModal}
            />
          </Div>
        ) : null}
      </div>
      {master && master.id ? (
        <Div style={{ userSelect: "none" }}>
          <Card mode="outline">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={openMaster}
            >
              <Div style={masterAvatarStyles}>
                <Avatar src={master.photo_100} size={56} />
              </Div>
              <Div>
                <Title level="3" weight="medium">
                  {master.first_name} {master.last_name}
                </Title>
                <span style={masterTakenStyles}>
                  {isMe ? "Держит вас в рабстве" : "Владеет этим рабом"}
                </span>
              </Div>
            </div>
            {isMe && (
              <Div style={freeButtonStyles}>
                <Button
                  size="l"
                  mode="tertiary"
                  style={{ width: "100%" }}
                  onClick={buySelfCallback}
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
