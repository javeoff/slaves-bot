import { Avatar, Button, ModalCard } from "@vkontakte/vkui";
import React, { FC } from "react";
import { getActiveRouter } from "../common/routes";

interface IProps {
  onClose?: VoidFunction;
  id?: string;
}

export const MODAL_YOUSLAVE_CARD = "modal_youslave_card";
export const ModalYouSlave: FC<IProps> = ({ id, onClose }) => {
  let activeRouter = getActiveRouter();
  let params = activeRouter.getParams();
  let title = params.title;
  let message = params.message;
  return (
    <ModalCard
      id={id}
      onClose={onClose}
      icon={<Avatar size={48} src={params.photo_200} />}
      header={title}
      subheader={message}
      actions={
        <Button size="l" mode="primary" onClick={onClose}>
          Понятно
        </Button>
      }
    />
  );
};
