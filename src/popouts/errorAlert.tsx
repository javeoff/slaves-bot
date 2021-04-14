import { Alert } from "@vkontakte/vkui";
import React, { FC } from "react";
import { getActiveRouter } from "../common/routes";

interface IProps {}

export const ErrorAlert: FC<IProps> = () => {
  let activeRouter = getActiveRouter();
  let params = activeRouter.getParams();

  return (
    <Alert
      actions={[
        {
          title: "ОК",
          autoclose: true,
          mode: "default",
        },
      ]}
      actionsLayout="horizontal"
      onClose={() => {
        console.log("Close popout");
        activeRouter.popPage();
      }}
      header="Ошибка"
      text={params?.message}
    />
  );
};
