import React, { FC } from "react";
import { Button, ModalCard } from "@vkontakte/vkui";
import { Icon28WarningTriangleOutline } from "@vkontakte/icons";
import { API_ENDPOINT } from "../common/simple_api/simpleApi";

interface IProps {
  onClose: VoidFunction;
  id?: string;
}

export const NEW_USER_CARD = "new-user-card";
export const ModalNewUser: FC<IProps> = ({ onClose }) => {
  const acceptNotice = async () => {
    // localStorage.setItem("accept-notice", "accepted");
    await fetch(API_ENDPOINT + "/acceptTerms");
    onClose();
  };

  return (
    <ModalCard
      id={NEW_USER_CARD}
      icon={<Icon28WarningTriangleOutline width={56} height={56} />}
      header="Внимание"
      subheader="Все персонажы вымышлены, любые совпадения с реальными людьми случайны. Приложение является игрой и не имеет цели кого-либо оскорбить."
      actions={
        <Button size="l" mode="primary" onClick={acceptNotice}>
          Окей
        </Button>
      }
    />
  );
};
