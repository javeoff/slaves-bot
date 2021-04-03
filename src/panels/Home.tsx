import React, { FC, ReactElement, useState } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import { Avatar, Button, Div, PullToRefresh, Snackbar } from "@vkontakte/vkui";

import {
  IWithCurrentUserInfo,
  withCurrentUserInfo,
} from "../features/App/hocs/withAppState";
import { UserHeader } from "../components/UserHeader/UserHeader";
import { SlavesList } from "../components/SlavesList/SlavesList";
import { ISlaveWithUserInfo } from "../common/types/ISlaveWithUserInfo";
import { AnyFunction } from "@vkontakte/vkjs";
import { simpleApi } from "../common/simple_api/simpleApi";
import { Icon16Done } from "@vkontakte/icons";
import { PageParams, useRouter } from "@happysanta/router";
import { MODAL_ERROR_CARD } from "../modals/Error";
import { getSubDate } from "../common/helpers";
import { InfoBlock } from "../components/InfoBlock/InfoBlock";
import { Icon32LinkCircleOutline } from "@vkontakte/icons";
import { bridgeClient } from "../common/bridge/bridge";

interface IProps extends IWithCurrentUserInfo {
  id?: string;
  onRefresh: AnyFunction;
  isFetching: boolean;
  params: PageParams;
}

const Home: FC<IProps> = ({
  id,
  userInfo,
  masterInfo,
  userSlave,
  userSlaves,
  userSlavesInfo,
  onRefresh,
  updateSlaves,
  isFetching,
}) => {
  let generatedSlavesList: ISlaveWithUserInfo[] = [];
  let router = useRouter();

  for (let slaveId in userSlaves) {
    generatedSlavesList.push({
      user_info: userSlavesInfo[slaveId],
      slave_object: userSlaves[slaveId],
    });
  }

  const [snack, setSnack] = useState<ReactElement | null>(null);

  const buySlave = () => {
    simpleApi
      .buySlave(userSlave.id)
      .then((res) => {
        updateSlaves([res.user, res.slave]);
      })
      .catch((e) => {
        router.pushModal(MODAL_ERROR_CARD, {
          message: e.message,
        });
      });
  };

  return (
    <Panel id={id}>
      <PanelHeader>Рабы</PanelHeader>
      <PullToRefresh isFetching={isFetching} onRefresh={onRefresh}>
        {snack}
        <UserHeader
          master={masterInfo}
          user={userInfo}
          slave={userSlave}
          isMe={true}
          onBuySelf={buySlave}
        ></UserHeader>
        <Div>
          <InfoBlock
            icon={<Icon32LinkCircleOutline fill="#fff" />}
            title="Первые рабы"
            subtitle="Поделитесь ссылкой с друзьями, чтобы они стали вашими рабами."
            action={
              <Button
                mode="overlay_secondary"
                onClick={(e) => {
                  let link = `https://vk.com/app7809644#r${userInfo.id}`;
                  bridgeClient.copyToClipboard(link).catch(console.error);
                  setSnack(
                    <Snackbar
                      onClose={() => setSnack(null)}
                      before={
                        <Avatar
                          size={24}
                          style={{
                            background: "var(--button_commerce_background)",
                          }}
                        >
                          <Icon16Done fill="#fff" width={14} height={14} />
                        </Avatar>
                      }
                      action="Поделиться"
                      onActionClick={() => {
                        bridgeClient.opanShareDialog(link);
                      }}
                    >
                      Ссылка скопирована
                    </Snackbar>
                  );
                }}
              >
                vk.com/app7809644#r{userInfo.id}
              </Button>
            }
          ></InfoBlock>
        </Div>
        {userSlave.fetter_to >= Date.now() / 1000 && (
          <Div
            style={{
              marginBottom: 8,
              width: "100%",
              opacity: 1,
              color: "red",
              textAlign: "center",
            }}
          >
            Вы будете в цепях еще{" "}
            {getSubDate(new Date(userSlave.fetter_to * 1000))}
          </Div>
        )}
        <div style={{ marginBottom: 56 }}>
          <SlavesList
            slavesCount={userSlave.slaves_count}
            slaves={generatedSlavesList}
            isMe={true}
          ></SlavesList>
        </div>
      </PullToRefresh>
    </Panel>
  );
};

export default withCurrentUserInfo(Home);
