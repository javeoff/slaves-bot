import { useParams } from "@happysanta/router";
import { Icon56ErrorOutline } from "@vkontakte/icons";
import { Button, ModalCard } from "@vkontakte/vkui";
import React, { FC } from "react";

interface IProps {
  onClose?: VoidFunction;
  id?: string;
}

export const MODAL_ERROR_CARD = "modal_error_card";
export const ModalError: FC<IProps> = ({ id, onClose }) => {
  let { message } = useParams();
  return (
    <ModalCard
      id={id}
      onClose={onClose}
      icon={<Icon56ErrorOutline fill="#E64646" />}
      header="Ошибка"
      subheader={message}
      actions={
        <Button size="l" mode="destructive" onClick={onClose}>
          Ладно
        </Button>
      }
    />
  );
};
