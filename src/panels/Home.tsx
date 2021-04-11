import React, { FC, ReactElement, useEffect, useState } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import {
  Avatar,
  Button,
  Div,
  PanelHeaderButton,
  PullToRefresh,
  Snackbar,
} from "@vkontakte/vkui";

import {
  IWithCurrentUserInfo,
  withCurrentUserInfo,
} from "../features/App/hocs/withAppState";
import { UserHeader } from "../components/UserHeader/UserHeader";
import { SlavesList } from "../components/SlavesList/SlavesList";
import { ISlaveWithUserInfo } from "../common/types/ISlaveWithUserInfo";
import { AnyFunction } from "@vkontakte/vkjs";
import { simpleApi } from "../common/simple_api/simpleApi";
import { Icon16Done, Icon28DeleteOutline } from "@vkontakte/icons";
import { getSubDate } from "../common/helpers";
import { InfoBlock } from "../components/InfoBlock/InfoBlock";
import { Icon32LinkCircleOutline } from "@vkontakte/icons";
import { bridgeClient } from "../common/bridge/bridge";
import { getActiveRouter, PAGE_PROFILE_USER } from "../common/routes";
import { Router } from "../common/custom-router";
import { openErrorModal } from "../modals/openers";
import { MODAL_YOUSLAVE_CARD } from "../modals/YouSlave";
import { DeleteAccountAlert } from "../popouts/deleteAccountAlert";

interface IProps extends IWithCurrentUserInfo {
  id?: string;
  onRefresh: AnyFunction;
  isFetching: boolean;
  router: Router;
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
  router,
}) => {
  useEffect(() => {
    if (masterInfo?.id) {
      let refId = +document.location.href.split("#")[1]?.replace("r", "");
      if (isNaN(refId)) refId = 0;
      if (
        refId == userSlave.master_id &&
        !localStorage.getItem("got_ref_info")
      ) {
        localStorage.setItem("got_ref_info", "true");
        openYouSlaveModal(
          `${userInfo.first_name}, теперь ты ${
            userInfo.sex === 1 ? "рабыня" : "раб"
          }`,
          `${masterInfo.first_name} ${masterInfo.last_name} ${
            masterInfo.sex === 1 ? "взяла" : "взял"
          } тебя в рабство`,
          masterInfo.photo_200
        );
      }
    }
  }, []);

  let generatedSlavesList: ISlaveWithUserInfo[] = [];

  for (let slaveId in userSlaves) {
    generatedSlavesList.push({
      user_info: userSlavesInfo[slaveId],
      slave_object: userSlaves[slaveId],
    });
  }

  const [snack, setSnack] = useState<ReactElement | null>(null);

  const openYouSlaveModal = (
    title: string,
    message: string,
    photo_200: string
  ) => {
    getActiveRouter().pushModal(MODAL_YOUSLAVE_CARD, {
      title,
      message,
      photo_200,
    });
  };

  const buySlave = () => {
    simpleApi
      .buySlave(userSlave.id)
      .then((res) => {
        updateSlaves([res.user, res.slave]);
      })
      .catch(openErrorModal);
  };

  const copyRefLink = () => {
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
  };

  console.log("Complete render user page", Date.now());
  return (
    <Panel id={id}>
      <PanelHeader
        left={
          <PanelHeaderButton
            onClick={() => {
              router.pushPopout(<DeleteAccountAlert />, {});
            }}
            primary={false}
          >
            <Icon28DeleteOutline />
          </PanelHeaderButton>
        }
      >
        Профиль
      </PanelHeader>
      <PullToRefresh isFetching={isFetching} onRefresh={onRefresh}>
        {snack}
        <UserHeader
          master={masterInfo}
          user={userInfo}
          slave={userSlave}
          isMe={true}
          onBuySelf={buySlave}
          pageOpened={PAGE_PROFILE_USER}
          router={router}
          currentUserId={userInfo.id}
        ></UserHeader>
        {userSlave.slaves_count <= 10 && (
          <Div>
            <InfoBlock
              icon={<Icon32LinkCircleOutline fill="#fff" />}
              title="Первые рабы"
              subtitle="Поделитесь ссылкой с друзьями, чтобы они стали вашими рабами."
              action={
                <Button mode="overlay_secondary" onClick={copyRefLink}>
                  vk.com/app7809644#r{userInfo.id}
                </Button>
              }
            ></InfoBlock>
          </Div>
        )}
        {userSlave.fetter_to >= Date.now() / 1000 && (
          <Div className="fettered-message">
            Вы будете в цепях еще{" "}
            {getSubDate(new Date(userSlave.fetter_to * 1000))}
          </Div>
        )}
        <SlavesList
          slavesCount={userSlave.slaves_count}
          slaves={generatedSlavesList}
          isMe={true}
          pageOpened={PAGE_PROFILE_USER}
          router={router}
        ></SlavesList>
      </PullToRefresh>
    </Panel>
  );
};

export default withCurrentUserInfo(Home);
