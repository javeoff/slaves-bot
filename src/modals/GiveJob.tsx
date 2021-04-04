import {
  Button,
  Div,
  Group,
  Input,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
} from "@vkontakte/vkui";
import React, { FC } from "react";
import { getActiveRouter } from "../common/routes";
import { simpleApi } from "../common/simple_api/simpleApi";
import {
  IWithCurrentUserInfo,
  withCurrentUserInfo,
} from "../features/App/hocs/withAppState";
import { MODAL_ERROR_CARD } from "./Error";

interface IProps extends IWithCurrentUserInfo {
  onClose: VoidFunction;
  id: string;
}

export const MODAL_GIVE_JOB_CARD = "modal_give_job_card";
export const ModalGiveJobPage: FC<IProps> = ({ id, onClose, updateSlaves }) => {
  let activeRouter = getActiveRouter();
  let textInput: HTMLDivElement | null;
  let params = activeRouter.getParams();
  let slaveId = params.id;

  const giveJob = (slaveId: number, jobName: string) => {
    simpleApi
      .jobSlave(slaveId, jobName)
      .then((res) => {
        updateSlaves([res.user, res.slave]);
      })
      .catch((e) => {
        getActiveRouter().pushModal(MODAL_ERROR_CARD, {
          message: e.message,
        });
      });
  };

  return (
    <ModalPage
      id={id}
      onClose={onClose}
      header={
        <ModalPageHeader left={<PanelHeaderClose onClick={onClose} />}>
          Выдача работы
        </ModalPageHeader>
      }
    >
      <Group>
        <Div>
          <Input
            style={{ width: "100%", marginBottom: 12 }}
            placeholder="Учитель"
            getRootRef={(ref) => {
              textInput = ref;
            }}
          />
          <Button
            style={{ width: "100%" }}
            size="l"
            mode="primary"
            onClick={() => {
              if (textInput) {
                let val: string = String(
                  textInput.querySelector("input")?.value
                );
                giveJob(+slaveId, val);
              }
              onClose();
            }}
          >
            Дать работу
          </Button>
        </Div>
      </Group>
    </ModalPage>
  );
};

export const ModalGiveJob = withCurrentUserInfo(ModalGiveJobPage);
