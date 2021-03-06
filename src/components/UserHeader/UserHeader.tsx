import {
  Icon20PlayCircleFillSteelGray,
  Icon20StatisticCircleFillBlue,
  Icon20VotestTransferCircleFillTurquoise,
  Icon24UserAddOutline,
  Icon24WriteOutline,
  Icon28ChevronRightCircleOutline,
} from "@vkontakte/icons";
import { UserInfo } from "@vkontakte/vk-bridge";
import {
  Avatar,
  Button,
  Card,
  Div,
  IconButton,
  MiniInfoCell,
  PullToRefresh,
  SimpleCell,
  Title,
} from "@vkontakte/vkui";
import React, { FC, useCallback, useEffect, useState } from "react";
import { Router } from "../../common/custom-router";
import { beautyNumber } from "../../common/helpers";
import { ISlaveData } from "../../common/types/ISlaveData";
import { MODAL_GIVE_JOB_CARD } from "../../modals/GiveJob";
import { InfoBlock } from "../InfoBlock/InfoBlock";
import { bridgeClient } from "../../common/bridge/bridge";

interface IProps {
  user: UserInfo;
  slave: ISlaveData;
  isMe: boolean;
  master: UserInfo;
  onBuySelf: VoidFunction;
  onSubscribeOnGroup?: VoidFunction;
  router: Router;
  pageOpened: string;
  currentUserId: number;
  showGroup?: boolean;
}

export const UserHeader: FC<IProps> = ({
  user,
  slave,
  isMe = false,
  master,
  router,
  pageOpened,
  currentUserId,
  showGroup = false,
  onBuySelf,
  onSubscribeOnGroup,
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
          <Avatar src={user.photo_100} size={72} />
          <div style={titleStyles}>
            <Title level="2" weight="medium">
              {user.first_name} {user.last_name}
            </Title>{" "}
          </div>
        </div>
      </Div>
      <div style={{ userSelect: "none" }}>
        <MiniInfoCell before={<Icon20StatisticCircleFillBlue />}>
          {isMe ? "???? ??????????????????????????" : "????????????????????????"}{" "}
          {beautyNumber(slave.profit_per_min)} ??? / ??????.
        </MiniInfoCell>
        <MiniInfoCell before={<Icon20VotestTransferCircleFillTurquoise />}>
          ????????????: {beautyNumber(slave.balance)} ??? [+{" "}
          {beautyNumber(slave.slaves_profit_per_min)} ??? / ??????.]
        </MiniInfoCell>
        {slave.job.name !== "" && (
          <MiniInfoCell before={<Icon20PlayCircleFillSteelGray />}>
            ????????????: {slave.job.name}
          </MiniInfoCell>
        )}
        {slave.job.name == "" && isMine ? (
          <Div style={giveJobInfoStyles}>
            <InfoBlock
              title="?????? ?????? ?????? ????????????"
              variant="gray"
              clickable={true}
              subtitle="???????? ?????? ???????????? ???? ???????????????? ??????????"
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
      {showGroup ? (
        <div style={{ marginTop: 6 }}>
          <SimpleCell
            before={
              <Avatar
                size={48}
                src={
                  "https://sun9-64.userapi.com/impg/Fi53nFGDUTwe_gyo_-eUPjUbG1N2SK6-Ie_BlA/1PjyJVLoUns.jpg?size=278x278&quality=96&sign=ccfcfe8f8733082765d9fc62b856499d&type=album"
                }
              />
            }
            description="???????????????????????????? ?? ?????????????? ??????????"
            onClick={() => (onSubscribeOnGroup ? onSubscribeOnGroup() : null)}
          >
            ???????? ???????????? ??????????????????
          </SimpleCell>
        </div>
      ) : null}

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
                  {isMe ? "???????????? ?????? ?? ??????????????" : "?????????????? ???????? ??????????"}
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
                  ???????????????????????? ???? {beautyNumber(slave.price)} ???
                </Button>
              </Div>
            )}
          </Card>
        </Div>
      ) : null}
    </>
  );
};
