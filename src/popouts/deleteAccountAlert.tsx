import { Alert } from "@vkontakte/vkui";
import React, { FC } from "react";
import { getActiveRouter } from "../common/routes";
import { simpleApi } from "../common/simple_api/simpleApi";

interface IProps {}

export const DeleteAccountAlert: FC<IProps> = () => {
  let activeRouter = getActiveRouter();
  return (
    <Alert
      actions={[
        {
          title: "Удалить аккаунт",
          mode: "destructive",
          autoclose: true,
          action: () => {
            console.log("Accept delete");
            simpleApi
              .deleteMyAccount()
              .then((r) => {
                console.log(r);
                window.location.reload();
              })
              .catch(console.error);
          },
        },
        {
          title: "Отмена",
          autoclose: true,
          mode: "cancel",
        },
      ]}
      actionsLayout="horizontal"
      onClose={() => {
        console.log("Close popout");
        activeRouter.popPage();
      }}
      header="Удаление аккаунта"
      text="Удаление преведет к обнулению прогресса вашего персонажа. Плюс к этому, его не смогут купить другие игроки, а вы не сможете зайти в приложение."
    />
  );
};
